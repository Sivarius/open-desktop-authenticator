# Microsoft Store listing

The canonical Partner Center working copy, kept here rather than only in the
dashboard. It records the submitted text and explicitly marks any clarification
prepared after the current submission.

A Store listing is re-entered on every submission and is invisible to CI, so it
is the one piece of user-facing copy nothing in this repository would catch
drifting. `README.md`, `site/pages/home.mjs` and this file all describe the same
product to the same people; when one changes the others are wrong until they do
too.

**Product**: Open Desktop Authenticator · **Store ID**: 9NMM2XJ6HZ1D
**Package identity**: `TheMaster.OpenDesktopAuthenticator`
**Live package**: `1.5.0.0` · **Architecture**: `x64`

> [!NOTE]
> **The public Store publication record remains 1.5.0/x64.** On September 26,
> the warning paragraph and What's New below were saved in Partner Center's
> version 1.5.1 submission draft. They are not public merely because the draft
> is saved or its AppX exists. Keep the website Store marker unchanged until
> the public catalog confirms publication. The remaining description and
> feature fields were left unchanged in Partner Center; this note verifies
> only the two updated text fields, not a new comparison of every historic field.

---

## Description

> Open Desktop Authenticator keeps your Steam Guard codes and your trade and
> market confirmations on your own machine. It is an open-source, maintained
> successor to Steam Desktop Authenticator.
>
> Open Desktop Authenticator is developed, owned and published by MASTERPANEL
> LLC. Its official product website is https://opendesktopauthenticator.com.
> MASTERPANEL LLC also operates Master Panel at https://masterspanel.com, its
> principal commercial product and company website. Open Desktop Authenticator
> and Master Panel are separate products within the same MASTERPANEL LLC
> portfolio.
>
> WHY THIS EXISTS
>
> The tool much of Steam trading depends on, Steam Desktop Authenticator, is no
> longer maintained. Search for it and the results are full of clone sites
> shipping modified builds that steal accounts. Our founder lost about $3,000 to
> exactly that. Those sites are still there, and they come back under new domains
> every time one is reported.
>
> Being open source is not by itself an answer, because an attacker can compile
> open source with malware added. What answers it is a chain you can walk without
> having to trust us: a company that says who it is, a public repository, a build
> produced by public CI from a specific commit, and a published hash for the file
> you downloaded. Installing from the Microsoft Store is the short version of
> that chain — Microsoft builds the trust link for you.
>
> WHAT IT DOES
>
> - An encrypted vault for as many accounts as you have, unlocked with a
>   passphrase you choose.
> - Imports the maFiles you already have from Steam Desktop Authenticator.
> - Steam Guard codes.
> - Trade and market confirmations: see what is pending, accept it or deny it.
> - An isolated signed-in Steam browser for each account, with tabs, an address
>   bar and a routing choice for every window.
> - Optional desktop notifications for pending confirmations, off by default and
>   with selectable detail.
> - Optional per-account network routing and a vault-wide Require proxies
>   setting.
> - Optional auto-confirm, configurable per account and per confirmation type,
>   and off until you turn it on.
>
> WHAT IT WILL NEVER DO
>
> No ODA backend. No ODA account. No cloud sync. No telemetry. No paid tiers.
> Steam operations go from your machine to Valve, using any route or proxy you
> configure, without passing through an ODA service.
>
> It also does not automate trading beyond confirming what you already started,
> and has no market or inventory tooling. Those are not features we have not got
> to yet. They are things we have decided not to build.
>
> BEFORE YOU INSTALL ANYTHING ELSE
>
> Use this Microsoft Store listing or our official GitHub Releases page as the primary sources for genuine builds. The official product website, https://opendesktopauthenticator.com, hosts no installer — its download buttons lead to those release channels. MASTERPANEL LLC's main site, https://masterspanel.com, identifies the same publisher and links to the product. If you obtain a Windows installer from a third-party software directory, verify its digital signature identifies MASTERPANEL LLC and compare its SHA-256 hash with the matching official GitHub release. Official direct-download Windows executables are signed and timestamped from version 1.5.1; signing does not guarantee that SmartScreen will never warn.
>
> Source, documented threat model and build instructions:
> https://github.com/opendesktopauthenticator/open-desktop-authenticator
>
> Open Desktop Authenticator is not affiliated with, endorsed by, or sponsored by
> Valve Corporation. Steam and Steam Guard are trademarks of Valve Corporation.

## Product features

Up to 20, 200 characters each. These render as a bulleted list above the
description.

- Encrypted multi-account vault, unlocked with a passphrase you choose
- Imports your existing Steam Desktop Authenticator maFiles
- Steam Guard codes
- Trade and market confirmations: view, accept, deny
- Optional auto-confirm, per account and per type, off by default
- Optional per-account network routing
- No ODA backend. No ODA account. No cloud sync. No telemetry.
- Open source, built in public CI, MIT licensed
- Separate signed-in Steam browser session for each account
- Optional desktop notifications for confirmations, off by default

## What's new in this version

Saved in the 1.5.1 draft; below the Store's 1,500-character limit.

> Version 1.5.1
>
> Clearer publisher information identifying MASTERPANEL LLC, with About text explaining that Master Panel is a separate product with no shared accounts or data. Includes development-tool security updates and release-check improvements.
>
> Your accounts, vault format and authenticator behavior are unchanged. All version 1.5 features remain, including the isolated account browser, optional confirmation notifications and safer handling of uncertain Steam changes.

## Short description

> Steam Guard codes and trade confirmations on your own machine. Open source.
> No ODA backend. No ODA account. No cloud sync. No telemetry.
> A maintained successor to Steam Desktop Authenticator.

## Search terms

Seven maximum, 30 characters each, not shown to users.

`steam authenticator`, `steam guard`, `sda`, `trade confirmations`,
`steam 2fa`, `desktop authenticator`, `maFile`

## Copyright and trademark info

> Copyright © 2026 MASTERPANEL LLC. Licensed MIT. Steam and Steam Guard are
> trademarks of Valve Corporation. Not affiliated with, endorsed by, or
> sponsored by Valve Corporation.

175 characters; Partner Center limits this field to 200.

## Website and support

- Website: `https://opendesktopauthenticator.com`
- Support contact: `support@opendesktopauthenticator.com`
- Privacy policy: `https://opendesktopauthenticator.com/privacy`

## Additional system requirements

> Windows 10 version 1809 (build 17763) or later.

Matches `minVersion` in `electron-builder.config.mjs`, which is Chromium's floor
for the Electron this ships. Stated here because the Store shows it to people
deciding whether to install.

## Developed by

> MASTERPANEL LLC

---

## Notes for whoever files the next submission

- **Screenshots must never show a real account.** Run the application against an
  empty data directory and screenshot that. A listing image is public
  permanently, and a SteamID or persona name in one is not retractable.
- The description repeats the "never download an authenticator from a website"
  warning on purpose. It is the single most useful sentence in the listing for
  the person most at risk, and the Store page is where they arrive.
- Do not describe the product as audited. It is tested, by the maintainer,
  against live accounts. `README.md` draws the same line and so should this.
