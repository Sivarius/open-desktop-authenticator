$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Read-Git([string[]]$Arguments) {
    $result = & git @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Git source verification failed: $Arguments" }
    return ($result -join "`n").Trim()
}

$head = Read-Git -Arguments @('rev-parse', 'HEAD')
if ($env:SIGNING_MODE -eq 'smoke') {
    if ($env:GITHUB_REF -ne 'refs/heads/main' -or $head -ne $env:GITHUB_SHA) {
        throw 'The signing smoke test must run from main and build that exact workflow commit.'
    }
} elseif ($env:SIGNING_MODE -eq 'release') {
    if ($env:GITHUB_REF -notmatch '^refs/tags/v[0-9]+\.[0-9]+\.[0-9]+$') {
        throw 'Signing a release requires the workflow to run from its exact version tag.'
    }
    $tagCommit = Read-Git -Arguments @('rev-parse', "$($env:GITHUB_REF)^{commit}")
    $version = (Get-Content -LiteralPath package.json -Raw | ConvertFrom-Json).version
    if ($head -ne $tagCommit -or $env:GITHUB_REF -cne "refs/tags/v$version") {
        throw 'The checked-out commit, workflow tag, and package version must agree.'
    }
} else {
    throw 'Unknown Windows signing mode.'
}

# An allowed v* tag alone does not prove its commit passed main's protections.
Read-Git -Arguments @('fetch', '--no-tags', 'origin', '+refs/heads/main:refs/remotes/origin/main') | Out-Null
& git merge-base --is-ancestor $head origin/main
if ($LASTEXITCODE -ne 0) { throw 'Refusing to sign a commit that is not in origin/main history.' }
Write-Host "Signing source verified: $head is in origin/main history."
