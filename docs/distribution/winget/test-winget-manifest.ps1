# Actual WinGet manifest install/uninstall in its own fresh disposable runner.
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_ENVIRONMENT -ne 'github-hosted' -or
    $env:RUNNER_OS -ne 'Windows' -or
    $env:GITHUB_REPOSITORY -ne 'opendesktopauthenticator/open-desktop-authenticator') {
    throw 'Refusing manifest installation outside the disposable validation runner.'
}
if (-not $env:ODA_TEST_WINGET -or -not (Test-Path -LiteralPath $env:ODA_TEST_WINGET -PathType Leaf)) {
    throw 'The official WinGet bootstrap step did not provide an executable.'
}
$winget = $env:ODA_TEST_WINGET
$manifest = Join-Path $PSScriptRoot 'manifests\m\MASTERPANEL\OpenDesktopAuthenticator\1.5.1'
$evidence = Join-Path $env:RUNNER_TEMP 'oda-winget-client-validation\evidence'
$dataRoot = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'open-desktop-authenticator'
$programsRoot = [IO.Path]::GetFullPath((Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Programs'))
$profileRoot = [IO.Path]::GetFullPath($env:USERPROFILE).TrimEnd('\') + '\'
if (-not $programsRoot.StartsWith($profileRoot, [StringComparison]::OrdinalIgnoreCase)) { throw 'Unexpected per-user Programs directory.' }
if (Test-Path -LiteralPath $evidence) { throw 'Refusing to overwrite client test evidence.' }
if (Test-Path -LiteralPath $dataRoot) { throw 'Pre-existing ODA data; refusing installation.' }
New-Item -ItemType Directory -Path $evidence -Force | Out-Null
Start-Transcript -Path (Join-Path $evidence 'transcript.txt') | Out-Null
$enabledLocalManifests = $false
$commands = [Collections.Generic.List[object]]::new()

function Invoke-WinGetChecked {
    param([string[]] $Arguments)
    Write-Host ('winget ' + ($Arguments -join ' '))
    $output = @(& $winget @Arguments 2>&1)
    $exitCode = $LASTEXITCODE
    $output | ForEach-Object { Write-Host $_ }
    $commands.Add([ordered]@{ arguments = $Arguments; exitCode = $exitCode; output = ($output -join "`n") })
    if ($exitCode -ne 0) { throw "WinGet command failed with exit code $exitCode." }
}
function Get-OdaEntries {
    param([ValidateSet('HKCU','HKLM')] [string] $Hive)
    $paths = @("${Hive}:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*")
    if ($Hive -eq 'HKLM') { $paths += 'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' }
    Get-ItemProperty -Path $paths -ErrorAction SilentlyContinue |
        Where-Object { $_.PSObject.Properties['DisplayName'] -and $_.DisplayName -like 'Open Desktop Authenticator*' }
}
function Assert-NoOdaProcess {
    if (@(Get-Process -ErrorAction SilentlyContinue | Where-Object {
        $_.ProcessName -match '^(Open Desktop Authenticator|open-desktop-authenticator)$'
    }).Count -ne 0) { throw 'ODA started unexpectedly.' }
}

try {
    if (@(Get-OdaEntries -Hive HKCU).Count -ne 0 -or @(Get-OdaEntries -Hive HKLM).Count -ne 0) {
        throw 'Pre-existing ODA installation; refusing test.'
    }
    Assert-NoOdaProcess
    Invoke-WinGetChecked -Arguments @('--version')
    Invoke-WinGetChecked -Arguments @('validate', '--manifest', $manifest, '--disable-interactivity')
    # This opt-in exists only in the fresh hosted VM and is disabled in finally.
    # No hash override, malware-scan override, source or package agreement bypass.
    Invoke-WinGetChecked -Arguments @('settings', '--enable', 'LocalManifestFiles', '--disable-interactivity')
    $enabledLocalManifests = $true
    Invoke-WinGetChecked -Arguments @('install', '--manifest', $manifest, '--silent', '--scope', 'user', '--source', 'winget', '--disable-interactivity')
    Start-Sleep -Seconds 2
    Assert-NoOdaProcess
    $entries = @(Get-OdaEntries -Hive HKCU)
    if ($entries.Count -ne 1 -or @(Get-OdaEntries -Hive HKLM).Count -ne 0) { throw 'Incorrect installation scope or duplicate registrations.' }
    $entry = $entries[0]
    if ($entry.DisplayName -ne 'Open Desktop Authenticator 1.5.1' -or
        $entry.DisplayVersion -ne '1.5.1' -or $entry.Publisher -ne 'MASTERPANEL LLC' -or
        $entry.PSChildName -ne 'fc7fbb1b-2c01-522b-b761-b3da9a611c1e') {
        throw 'Installed registration does not match the validated manifest.'
    }
    if ($entry.QuietUninstallString -notmatch '^"(?<exe>[^"]+)"\s+/currentuser\s+/S$') { throw 'Unexpected quiet uninstall command.' }
    $uninstaller = [IO.Path]::GetFullPath($Matches.exe)
    $installRoot = [IO.Path]::GetDirectoryName($uninstaller)
    if (-not $installRoot.StartsWith($programsRoot.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase) -or
        [IO.Path]::GetFileName($uninstaller) -ne 'Uninstall Open Desktop Authenticator.exe' -or
        -not (Test-Path -LiteralPath $uninstaller -PathType Leaf)) { throw 'Unsafe or unexpected uninstall target.' }
    if ((Get-Item -LiteralPath $installRoot).Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Unexpected installation reparse point.' }
    $app = Join-Path $installRoot 'Open Desktop Authenticator.exe'
    $signature = Get-AuthenticodeSignature -LiteralPath $app
    if ($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Subject -notmatch '(^|,\s*)CN=MASTERPANEL LLC(,|$)') {
        throw 'Installed application signature is not valid MASTERPANEL LLC.'
    }
    [ordered]@{
        displayName = $entry.DisplayName; displayVersion = $entry.DisplayVersion
        publisher = $entry.Publisher; productCode = $entry.PSChildName
        installRoot = $installRoot; quietUninstallString = $entry.QuietUninstallString
        signatureStatus = "$($signature.Status)"; signer = $signature.SignerCertificate.Subject
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'registration.json')
    if (Test-Path -LiteralPath $dataRoot) { throw 'Unexpected data directory after silent install.' }
    New-Item -ItemType Directory -Path $dataRoot | Out-Null
    $fixture = Join-Path $dataRoot 'vault.json'
    [IO.File]::WriteAllText($fixture, '{"syntheticInstallerTestOnly":true,"containsNoCredentials":true}')
    $fixtureHash = (Get-FileHash -LiteralPath $fixture -Algorithm SHA256).Hash
    Invoke-WinGetChecked -Arguments @('uninstall', '--product-code', 'fc7fbb1b-2c01-522b-b761-b3da9a611c1e', '--exact', '--scope', 'user', '--silent', '--source', 'winget', '--disable-interactivity')
    Start-Sleep -Seconds 2
    Assert-NoOdaProcess
    if (@(Get-OdaEntries -Hive HKCU).Count -ne 0 -or (Test-Path -LiteralPath $app)) { throw 'WinGet uninstall left ODA registration or application behind.' }
    if (-not (Test-Path -LiteralPath $fixture) -or (Get-FileHash -LiteralPath $fixture -Algorithm SHA256).Hash -ne $fixtureHash) {
        throw 'WinGet uninstall changed or removed the synthetic data fixture.'
    }
    [ordered]@{
        result = 'passed'; checkedAtUtc = [DateTime]::UtcNow.ToString('o')
        install = 'winget install --manifest: silent per-user, exit 0, correct registration and signed executable'
        uninstall = 'winget uninstall --product-code: exit 0, registration/application removed, synthetic file preserved'
        limitations = 'Hosted Windows Server 2025 administrator profile; no standard-user/non-admin, UI, real vault unlock or ARM64 test.'
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'result.json')
    Write-Host 'PASS: actual WinGet manifest installation and uninstallation.'
} catch {
    [ordered]@{ result = 'failed'; message = $_.Exception.Message; checkedAtUtc = [DateTime]::UtcNow.ToString('o') } |
        ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'result.json')
    throw
} finally {
    if ($enabledLocalManifests) {
        & $winget settings --disable LocalManifestFiles --disable-interactivity
        if ($LASTEXITCODE -ne 0) { Write-Warning 'Disposable-runner LocalManifestFiles cleanup failed.' }
    }
    $commands | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $evidence 'commands.json')
    Stop-Transcript | Out-Null
}
