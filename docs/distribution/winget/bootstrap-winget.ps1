# Bootstrap the official Microsoft client only in the disposable validation VM.
# Uses Windows PowerShell because AppX management is a Windows PowerShell module.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_ENVIRONMENT -ne 'github-hosted' -or
    $env:RUNNER_OS -ne 'Windows' -or
    $env:GITHUB_REPOSITORY -ne 'opendesktopauthenticator/open-desktop-authenticator') {
    throw 'Refusing to provision WinGet outside the disposable validation runner.'
}
$bootstrapRoot = Join-Path $env:RUNNER_TEMP 'oda-winget-bootstrap'
if (Test-Path -LiteralPath $bootstrapRoot) { throw 'Bootstrap directory already exists.' }
New-Item -ItemType Directory -Path $bootstrapRoot | Out-Null
$assets = @(
    @{ Name = 'Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle'; Hash = '65DEA9C01CE08EE7B763366B27C0E651F97DB857C11CA9B9C301826C10092F2E' },
    @{ Name = 'DesktopAppInstaller_Dependencies.zip'; Hash = 'BA875AFE9D190F61218985AC0292A99D1DB710BF93E13C68944CA9D89F0D82D1' }
)
$ProgressPreference = 'SilentlyContinue'
foreach ($asset in $assets) {
    $asset.Path = Join-Path $bootstrapRoot $asset.Name
    Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/microsoft/winget-cli/releases/download/v1.29.380/$($asset.Name)" -OutFile $asset.Path
    if ((Get-FileHash -LiteralPath $asset.Path -Algorithm SHA256).Hash -ne $asset.Hash) {
        throw "Microsoft release asset hash mismatch: $($asset.Name)"
    }
}
$dependenciesRoot = Join-Path $bootstrapRoot 'dependencies'
Expand-Archive -LiteralPath $assets[1].Path -DestinationPath $dependenciesRoot
$dependencyPaths = @(
    'x64\Microsoft.VCLibs.140.00_14.0.33519.0_x64.appx',
    'x64\Microsoft.VCLibs.140.00.UWPDesktop_14.0.33728.0_x64.appx',
    'x64\Microsoft.WindowsAppRuntime.1.8_8000.616.304.0_x64.appx'
) | ForEach-Object { Join-Path $dependenciesRoot $_ }
foreach ($path in $dependencyPaths) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Pinned dependency is absent: $path" }
}
# AppX deployment verifies Microsoft package signatures; no verification bypass.
Add-AppxPackage -Path $assets[0].Path -DependencyPath $dependencyPaths
$package = Get-AppxPackage -Name Microsoft.DesktopAppInstaller
if ($null -eq $package) { throw 'App Installer did not register for the test user.' }
$wingetPath = Join-Path $package.InstallLocation 'winget.exe'
if (-not (Test-Path -LiteralPath $wingetPath -PathType Leaf)) { throw 'Registered WinGet executable is missing.' }
$version = & $wingetPath --version
if ($LASTEXITCODE -ne 0) { throw 'WinGet failed to run after provisioning.' }
Write-Host "Official WinGet client provisioned: $version"
"ODA_TEST_WINGET=$wingetPath" | Out-File -LiteralPath $env:GITHUB_ENV -Encoding utf8 -Append
