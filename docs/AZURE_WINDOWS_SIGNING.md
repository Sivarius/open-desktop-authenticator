# Opt-in Windows release signing

This is release infrastructure, not a statement that an existing download is signed.
The existing v1.5.0 assets are unchanged. Keep the repository variable
`WINDOWS_SIGNING_READY` unset or `false` until the nonpublishing smoke test succeeds.
Ordinary local builds remain unsigned by default. Microsoft Store AppX packages
stay separately unsigned for Partner Center ingestion; their Store identity is unchanged.
Linux and macOS retain their existing packaging and signing policies.

## Access and configuration

Use GitHub OIDC with a dedicated Azure identity, not a stored client secret.
Grant **Artifact Signing Certificate Profile Signer** only on the
`masterpanel-oda-signing/oda-public-trust` certificate profile. A resource group,
subscription-wide Contributor role, or managed-identity login on the hosted runner
is not required for signing. Azure login uses the federated client ID, not
`auth-type: IDENTITY`.

Protect the GitHub environment `windows-signing` with a required maintainer review
and deployment restrictions for `main` and version tags. For a sole maintainer,
self-review must be possible. These restrictions do not alone prove tag ancestry:
the signed job also checks that the exact version tag matches `package.json` and
is in `origin/main` history **before Azure login**. The smoke test only accepts the
exact `main` workflow commit.

The repository's verified OIDC configuration uses immutable IDs. Its subject is:

```text
repo:opendesktopauthenticator@315189048/open-desktop-authenticator@1329351178:environment:windows-signing
```

Use issuer `https://token.actions.githubusercontent.com` and audience
`api://AzureADTokenExchange`. Recheck the repository OIDC configuration before
creating the federation; do not substitute a name-only subject copied from older
examples.

Configure these GitHub variables for the signed job:

| Variable                            | Value                                       |
| ----------------------------------- | ------------------------------------------- |
| `AZURE_CLIENT_ID`                   | Dedicated federated identity's client ID    |
| `AZURE_TENANT_ID`                   | Azure tenant ID                             |
| `AZURE_SUBSCRIPTION_ID`             | Subscription containing the signing account |
| `AZURE_SIGNING_ENDPOINT`            | `https://eus.codesigning.azure.net/`        |
| `AZURE_SIGNING_ACCOUNT`             | `masterpanel-oda-signing`                   |
| `AZURE_SIGNING_CERTIFICATE_PROFILE` | `oda-public-trust`                          |

The publisher must be `MASTERPANEL LLC`. Missing or different target values fail
closed. `WINDOWS_SIGNING_READY` is a **repository** variable, read before entering
the environment; only empty, `false`, and `true` are accepted. Turning it on cannot
fall back to unsigned Windows output on a signing or verification failure.

## Verification and rollout

1. Merge the reviewed infrastructure through normal branch protections. Configure
   the narrowly scoped identity and environment separately.
2. Run **Windows signing smoke test** from `main`, approve its environment, and
   inspect the verified artifacts. It shares the release packaging path but does
   not create a release or publish assets. It can run while global readiness is off.
3. Confirm Authenticode publisher, timestamp, installation, uninstall, and portable
   operation on clean Windows systems. Verify x64 and ARM64 on appropriate hardware.
4. Only after success, set `WINDOWS_SIGNING_READY=true`. Future version-tag releases
   use the signed path. No existing release assets are rewritten.
5. Check the draft's assets and signing copy before publication. Hashes, checksum
   signatures, and provenance are produced after Windows signatures are verified.
   Immutable published releases require a new version/tag for corrected binaries.

Signing identifies the publisher and detects modification. It does **not** guarantee
that Windows SmartScreen will immediately stop warning; reputation and other policy
checks still apply. Public download-page claims should change only with an actually
verified, published signed release.

## Toolchain and failure boundaries

Only the dedicated signed Windows job receives `id-token: write` and the signing
environment. Other packaging jobs remain read-only. The shared packaging action
uses Azure login through OIDC, then Microsoft's Azure CLI credential. All other
credential providers are explicitly excluded with typed PowerShell switches.

The supported electron-builder per-file signing hook signs the packaged executables,
NSIS uninstallers before embedding, and final installers/portable executable.
Calls are serialized because Microsoft's module shares a local metadata path.
After each file, Windows must report a valid Authenticode signature, the exact
publisher, and a timestamp. A fresh per-job receipt records its SHA256. The final
gate checks the x64, ARM64, and universal installers, portable executable, both
packaged application executables, and all embedded-uninstaller receipts. This runs
before the separate Store build can overwrite unpacked directories.

Pinned components:

- Azure/login v3.1.0 and actions/setup-dotnet v6.0.0 are pinned by commit SHA.
- .NET SDK 8.0.425. Review this pin before .NET 8 support ends on 2026-11-10.
- Microsoft PowerShell `TrustedSigning` 0.5.8 is installed **and imported** with
  `-RequiredVersion`. That module pins Windows SDK BuildTools 10.0.26100.4188,
  Microsoft.Trusted.Signing.Client 1.0.95, and sign 0.9.1-beta.24469.1 internally.
- Files and RFC3161 timestamps use SHA256; the timestamp URL is
  `http://timestamp.acs.microsoft.com`.

The hook intentionally does not use electron-builder 26.15.3's native
`azureSignOptions`: that integration installs a minimum module version rather than
an exact version, and serializes typed exclusion switches as strings. There is no
patch to electron-builder itself. Tool upgrades require review and a new smoke run.

References: [Azure login OIDC](https://github.com/Azure/login#login-with-openid-connect-oidc-recommended),
[Microsoft module source](https://www.powershellgallery.com/packages/TrustedSigning/0.5.8/Content/TrustedSigning.psm1),
[module dependency pins](https://www.powershellgallery.com/packages/TrustedSigning/0.5.8/Content/NugetInstall%5CNugetInstall.psm1),
[.NET 8 releases](https://dotnetcli.blob.core.windows.net/dotnet/release-metadata/8.0/releases.json).
