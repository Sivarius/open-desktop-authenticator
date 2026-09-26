Set-StrictMode -Version Latest

function Assert-OdaSignatureDetails {
    param(
        [Parameter(Mandatory)][string]$Status,
        [Parameter(Mandatory)][AllowEmptyString()][string]$Publisher,
        [Parameter(Mandatory)][bool]$HasTimestamp
    )
    if ($Status -ne 'Valid') { throw "Invalid Authenticode signature: $Status" }
    if ($Publisher -cne 'MASTERPANEL LLC') { throw "Unexpected signing publisher: $Publisher" }
    if (-not $HasTimestamp) { throw 'The Authenticode signature has no trusted timestamp.' }
}

function Assert-OdaAuthenticodeSignature {
    param([Parameter(Mandatory)][string]$FilePath)
    $resolved = (Resolve-Path -LiteralPath $FilePath -ErrorAction Stop).Path
    $signature = Get-AuthenticodeSignature -LiteralPath $resolved
    $publisher = if ($null -eq $signature.SignerCertificate) { '' } else {
        $signature.SignerCertificate.GetNameInfo(
            [System.Security.Cryptography.X509Certificates.X509NameType]::SimpleName, $false
        )
    }
    Assert-OdaSignatureDetails -Status $signature.Status.ToString() -Publisher $publisher `
        -HasTimestamp ($null -ne $signature.TimeStamperCertificate)
    [pscustomobject]@{
        path = $resolved
        sha256 = (Get-FileHash -LiteralPath $resolved -Algorithm SHA256).Hash.ToLowerInvariant()
        publisher = $publisher
        timestamp = $true
    }
}
