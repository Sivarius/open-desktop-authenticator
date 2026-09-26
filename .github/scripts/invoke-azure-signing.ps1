param([Parameter(Mandatory)][string]$FilePath)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if ($env:WINDOWS_SIGNING_READY -ne 'true') { throw 'Windows signing is not enabled.' }
if ([string]::IsNullOrWhiteSpace($env:WINDOWS_SIGNING_RECEIPTS)) { throw 'Missing receipt path.' }
node "$PSScriptRoot/windows-signing.mjs" --validate
if ($LASTEXITCODE -ne 0) { throw 'Azure signing configuration is invalid.' }

Import-Module TrustedSigning -RequiredVersion 0.5.8 -Force -ErrorAction Stop
. "$PSScriptRoot/windows-authenticode.ps1"
$parameters = @{
    Endpoint = $env:AZURE_SIGNING_ENDPOINT
    CodeSigningAccountName = $env:AZURE_SIGNING_ACCOUNT
    CertificateProfileName = $env:AZURE_SIGNING_CERTIFICATE_PROFILE
    Files = (Resolve-Path -LiteralPath $FilePath).Path
    FileDigest = 'SHA256'
    TimestampRfc3161 = 'http://timestamp.acs.microsoft.com'
    TimestampDigest = 'SHA256'
    ExcludeEnvironmentCredential = $true
    ExcludeWorkloadIdentityCredential = $true
    ExcludeManagedIdentityCredential = $true
    ExcludeSharedTokenCacheCredential = $true
    ExcludeVisualStudioCredential = $true
    ExcludeVisualStudioCodeCredential = $true
    ExcludeAzureCliCredential = $false
    ExcludeAzurePowerShellCredential = $true
    ExcludeAzureDeveloperCliCredential = $true
    ExcludeInteractiveBrowserCredential = $true
}
Invoke-TrustedSigning @parameters | Write-Host
# The module accepts SignTool warning exit code 2. Independently require a
# valid, timestamped signature from our publisher before builder can continue.
$receipt = Assert-OdaAuthenticodeSignature -FilePath $FilePath
$receipt | ConvertTo-Json -Compress | Add-Content -LiteralPath $env:WINDOWS_SIGNING_RECEIPTS -Encoding utf8
Write-Host "Verified Authenticode signature: $FilePath"
