# This installs/uninstalls RELEASED ODA binaries only in a fresh GitHub-hosted
# Windows runner. It never launches ODA or uses Steam accounts or real vaults.
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ($env:GITHUB_ACTIONS -ne 'true' -or
    $env:RUNNER_ENVIRONMENT -ne 'github-hosted' -or
    $env:RUNNER_OS -ne 'Windows' -or
    $env:GITHUB_REPOSITORY -ne 'opendesktopauthenticator/open-desktop-authenticator') {
    throw 'Refusing installation: this script requires the designated repository on a disposable GitHub-hosted Windows runner.'
}

$testRoot = Join-Path $env:RUNNER_TEMP 'oda-winget-validation'
$evidenceRoot = Join-Path $testRoot 'evidence'
$dataRoot = Join-Path ([Environment]::GetFolderPath('ApplicationData')) 'open-desktop-authenticator'
$programsRoot = [IO.Path]::GetFullPath((Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'Programs'))
$runnerProfile = [IO.Path]::GetFullPath($env:USERPROFILE)
if (-not $programsRoot.StartsWith($runnerProfile.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Per-user Programs directory is outside the disposable runner profile.'
}
if (Test-Path -LiteralPath $testRoot) { throw 'Test directory already exists; refusing to overwrite prior evidence.' }
if (Test-Path -LiteralPath $dataRoot) { throw 'ODA data already exists; refusing to touch a pre-existing vault.' }
New-Item -ItemType Directory -Path $evidenceRoot -Force | Out-Null
Start-Transcript -Path (Join-Path $evidenceRoot 'transcript.txt') | Out-Null

$observations = [Collections.Generic.List[object]]::new()
$fixtureHashes = @{}

function Get-OdaEntries {
    param([ValidateSet('HKCU', 'HKLM')] [string] $Hive)
    $roots = @("${Hive}:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*")
    if ($Hive -eq 'HKLM') { $roots += 'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*' }
    Get-ItemProperty -Path $roots -ErrorAction SilentlyContinue |
        Where-Object { $_.PSObject.Properties['DisplayName'] -and $_.DisplayName -like 'Open Desktop Authenticator*' }
}

function Assert-NoOdaProcess {
    $running = @(Get-Process -ErrorAction SilentlyContinue |
        Where-Object { $_.ProcessName -match '^(Open Desktop Authenticator|open-desktop-authenticator)$' })
    if ($running.Count -ne 0) { throw 'ODA launched unexpectedly; stopping the test without accessing its data.' }
}

function Assert-FileHash {
    param([string] $Path, [string] $Expected)
    $actual = (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash
    if ($actual -ne $Expected) { throw "SHA-256 mismatch: $Path" }
    return $actual
}

function Get-SafeInstallation {
    param([string] $Version)
    $entries = @(Get-OdaEntries -Hive HKCU)
    if ($entries.Count -ne 1) { throw "Expected one per-user ODA entry, observed $($entries.Count)." }
    if (@(Get-OdaEntries -Hive HKLM).Count -ne 0) { throw 'Unexpected machine-wide ODA registration.' }
    $entry = $entries[0]
    if ($entry.DisplayVersion -ne $Version) { throw "Expected version $Version, observed $($entry.DisplayVersion)." }
    if ($entry.Publisher -ne 'MASTERPANEL LLC') { throw "Unexpected installed publisher: $($entry.Publisher)" }
    if ($entry.QuietUninstallString -notmatch '^"(?<exe>[^"]+)"\s+/currentuser\s+/S$') {
        throw 'Unexpected quiet uninstall command; refusing to execute it.'
    }
    $uninstaller = [IO.Path]::GetFullPath($Matches.exe)
    $installRoot = [IO.Path]::GetDirectoryName($uninstaller)
    if (-not $installRoot.StartsWith($programsRoot.TrimEnd('\') + '\', [StringComparison]::OrdinalIgnoreCase)) {
        throw "Uninstall target is not inside disposable per-user Programs: $installRoot"
    }
    if ([IO.Path]::GetFileName($uninstaller) -ne 'Uninstall Open Desktop Authenticator.exe') {
        throw 'Unexpected uninstaller filename.'
    }
    if (-not (Test-Path -LiteralPath $uninstaller -PathType Leaf)) { throw 'Uninstaller is missing.' }
    if ((Get-Item -LiteralPath $installRoot).Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'Installation directory is a reparse point; refusing to uninstall.'
    }
    $app = Join-Path $installRoot 'Open Desktop Authenticator.exe'
    if (-not (Test-Path -LiteralPath $app -PathType Leaf)) { throw 'Installed ODA executable is missing.' }
    $metadata = [ordered]@{
        version = $Version
        registryKey = $entry.PSChildName
        displayName = $entry.DisplayName
        displayVersion = $entry.DisplayVersion
        publisher = $entry.Publisher
        installRoot = $installRoot
        quietUninstallString = $entry.QuietUninstallString
        applicationVersion = (Get-Item -LiteralPath $app).VersionInfo.ProductVersion
    }
    $observations.Add($metadata)
    $metadata | ConvertTo-Json | Write-Host
    return [pscustomobject]@{ Uninstaller = $uninstaller; InstallRoot = $installRoot; App = $app }
}

function Invoke-Installer {
    param([string] $Path, [string] $Version)
    Assert-NoOdaProcess
    $process = Start-Process -FilePath $Path -ArgumentList @('/S', '/currentuser') -WindowStyle Hidden -PassThru -Wait
    if ($process.ExitCode -ne 0) { throw "Installer $Version returned $($process.ExitCode)." }
    Start-Sleep -Seconds 2
    Assert-NoOdaProcess
    return Get-SafeInstallation -Version $Version
}

function Assert-Fixtures {
    foreach ($path in $fixtureHashes.Keys) {
        if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Synthetic fixture was removed: $path" }
        Assert-FileHash -Path $path -Expected $fixtureHashes[$path] | Out-Null
    }
}

function Invoke-SafeUninstall {
    param([string] $Version)
    Assert-NoOdaProcess
    $installation = Get-SafeInstallation -Version $Version
    # The command is not evaluated from the registry. Only the checked executable
    # path above is used, with fixed known per-user silent arguments.
    $process = Start-Process -FilePath $installation.Uninstaller -ArgumentList @('/currentuser', '/S') -WindowStyle Hidden -PassThru -Wait
    if ($process.ExitCode -ne 0) { throw "Uninstaller returned $($process.ExitCode)." }
    $deadline = [DateTime]::UtcNow.AddSeconds(30)
    do {
        $remaining = @(Get-OdaEntries -Hive HKCU).Count
        $appRemains = Test-Path -LiteralPath $installation.App
        if ($remaining -eq 0 -and -not $appRemains) { break }
        Start-Sleep -Seconds 1
    } while ([DateTime]::UtcNow -lt $deadline)
    if ($remaining -ne 0 -or $appRemains) { throw 'Uninstall left ODA registration or executable behind.' }
    Assert-NoOdaProcess
    Assert-Fixtures
}

try {
    if (@(Get-OdaEntries -Hive HKCU).Count -ne 0 -or @(Get-OdaEntries -Hive HKLM).Count -ne 0) {
        throw 'ODA is already installed; refusing to touch a pre-existing installation.'
    }
    Assert-NoOdaProcess
    $assets = @(
        @{ Version = '1.5.0'; Hash = 'B1601E3F05F11CB440E2354DA38136DD59A1DBDE36ACDE1D6FA49405A5C972B1' },
        @{ Version = '1.5.1'; Hash = 'FFEAE76596C0262A7392C1DCFD4429E6844C079A068568D773D339356A9C8315' }
    )
    foreach ($asset in $assets) {
        $filename = "open-desktop-authenticator-$($asset.Version)-x64-setup.exe"
        $asset.Path = Join-Path $testRoot $filename
        $url = "https://github.com/opendesktopauthenticator/open-desktop-authenticator/releases/download/v$($asset.Version)/$filename"
        Invoke-WebRequest -Uri $url -OutFile $asset.Path
        Assert-FileHash -Path $asset.Path -Expected $asset.Hash | Out-Null
        Write-Host "Verified published $($asset.Version) SHA-256: $($asset.Hash)"
    }
    $latest = $assets[1]
    $signature = Get-AuthenticodeSignature -LiteralPath $latest.Path
    if ($signature.Status -ne 'Valid') { throw "Installer Authenticode status: $($signature.Status)" }
    if ($signature.SignerCertificate.Subject -notmatch '(^|,\s*)CN=MASTERPANEL LLC(,|$)') {
        throw 'Installer signer does not match MASTERPANEL LLC.'
    }
    if ($null -eq $signature.TimeStamperCertificate) { throw 'Installer timestamp certificate is absent.' }
    [ordered]@{
        status = "$($signature.Status)"
        signerSubject = $signature.SignerCertificate.Subject
        signerThumbprint = $signature.SignerCertificate.Thumbprint
        timestampSubject = $signature.TimeStamperCertificate.Subject
        timestampThumbprint = $signature.TimeStamperCertificate.Thumbprint
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidenceRoot 'signature.json')

    Write-Host 'Fresh v1.5.1 silent per-user install.'
    $fresh = Invoke-Installer -Path $latest.Path -Version '1.5.1'
    $appSignature = Get-AuthenticodeSignature -LiteralPath $fresh.App
    if ($appSignature.Status -ne 'Valid' -or
        $appSignature.SignerCertificate.Subject -notmatch '(^|,\s*)CN=MASTERPANEL LLC(,|$)') {
        throw 'Installed v1.5.1 application signature did not validate as MASTERPANEL LLC.'
    }
    if (Test-Path -LiteralPath $dataRoot) { throw 'Data directory appeared during silent install; app may have launched.' }
    New-Item -ItemType Directory -Path (Join-Path $dataRoot 'recovery') -Force | Out-Null
    $fixtures = @{
        (Join-Path $dataRoot 'vault.json') = '{"syntheticInstallerTestOnly":true,"containsNoCredentials":true}'
        (Join-Path $dataRoot 'recovery\synthetic-test-marker.txt') = 'SYNTHETIC FILE-PRESERVATION FIXTURE; NOT A STEAM RECOVERY KEY.'
    }
    foreach ($path in $fixtures.Keys) {
        [IO.File]::WriteAllText($path, $fixtures[$path])
        $fixtureHashes[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
    }
    Write-Host 'Uninstall v1.5.1 and verify byte-for-byte synthetic data preservation.'
    Invoke-SafeUninstall -Version '1.5.1'
    Write-Host 'Install v1.5.0, then upgrade silently to v1.5.1.'
    Invoke-Installer -Path $assets[0].Path -Version '1.5.0' | Out-Null
    Assert-Fixtures
    Invoke-Installer -Path $latest.Path -Version '1.5.1' | Out-Null
    Assert-Fixtures
    Write-Host 'Final uninstall and synthetic data preservation check.'
    Invoke-SafeUninstall -Version '1.5.1'

    [ordered]@{
        result = 'passed'
        checkedAtUtc = [DateTime]::UtcNow.ToString('o')
        freshInstall = '1.5.1 per-user silent; exit 0; no application launch'
        upgrade = '1.5.0 to 1.5.1 per-user silent; exit 0; no application launch'
        uninstall = 'quiet uninstall; exit 0; registration and executable removed'
        preservation = 'synthetic vault.json and recovery marker bytes preserved across upgrade/uninstall'
        limitations = 'File-level preservation only; no real vault unlock, Steam login, UI, ARM64, or standard-user/non-admin test.'
    } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidenceRoot 'result.json')
    Write-Host 'PASS: released x64 installer lifecycle checks completed.'
} catch {
    [ordered]@{ result = 'failed'; message = $_.Exception.Message; checkedAtUtc = [DateTime]::UtcNow.ToString('o') } |
        ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidenceRoot 'result.json')
    throw
} finally {
    $observations | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $evidenceRoot 'registrations.json')
    Stop-Transcript | Out-Null
}
