param([string]$ReleaseDirectory = 'release')
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
. "$PSScriptRoot/windows-authenticode.ps1"

if ($env:WINDOWS_SIGNING_READY -ne 'true') { throw 'Signature verification requires signing enabled.' }
if (-not (Test-Path -LiteralPath $env:WINDOWS_SIGNING_RECEIPTS -PathType Leaf)) {
    throw 'The per-file signing hook produced no receipts.'
}
$receipts = @(Get-Content -LiteralPath $env:WINDOWS_SIGNING_RECEIPTS | ForEach-Object { $_ | ConvertFrom-Json })
$version = (Get-Content -LiteralPath package.json -Raw | ConvertFrom-Json).version
$expected = @(
    "open-desktop-authenticator-$version-x64-setup.exe",
    "open-desktop-authenticator-$version-arm64-setup.exe",
    "open-desktop-authenticator-$version-universal-setup.exe",
    "open-desktop-authenticator-$version-portable.exe"
)
$artifacts = @(Get-ChildItem -LiteralPath $ReleaseDirectory -File -Filter '*.exe')
if (@(Compare-Object ($artifacts.Name | Sort-Object) ($expected | Sort-Object)).Count -ne 0) {
    throw 'Windows release artifacts do not match the expected x64, arm64, universal, and portable builds.'
}
$inner = @(
    (Join-Path $ReleaseDirectory 'win-unpacked/Open Desktop Authenticator.exe'),
    (Join-Path $ReleaseDirectory 'win-arm64-unpacked/Open Desktop Authenticator.exe')
)
foreach ($file in @($artifacts.FullName) + $inner) {
    $verified = Assert-OdaAuthenticodeSignature -FilePath $file
    $matches = @($receipts | Where-Object { $_.path -eq $verified.path -and $_.sha256 -eq $verified.sha256 })
    if ($matches.Count -eq 0) { throw "Missing matching signing receipt: $file" }
}
# Builder deletes each signed uninstaller after embedding it. The hook's
# independently verified receipt is evidence for those temporary executables.
foreach ($installer in ($expected | Where-Object { $_.EndsWith('-setup.exe') })) {
    $uninstaller = $installer.Substring(0, $installer.Length - 3) + '__uninstaller.exe'
    $matches = @($receipts | Where-Object {
        [IO.Path]::GetFileName($_.path) -eq $uninstaller -and
        $_.publisher -ceq 'MASTERPANEL LLC' -and $_.timestamp -eq $true
    })
    if ($matches.Count -eq 0) { throw "No verified receipt for embedded uninstaller: $uninstaller" }
}
Write-Host 'Verified every Windows release artifact, both packaged main executables, and embedded uninstallers.'
