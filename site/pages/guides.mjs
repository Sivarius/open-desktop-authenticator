import { releaseGaps, reviewAsk } from '../markup.mjs';
import { publicationSummary } from '../publication.mjs';

/** Download status, migration, documentation hub, FAQ, support and 404. */

export const download = {
	slug: 'download',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	navTitle: 'Download',
	script: 'download.js',
	title: 'Open Desktop Authenticator download and release status',
	description:
		'Download Open Desktop Authenticator for Windows and Linux. Install from the Microsoft Store, or take a build from GitHub and verify it yourself.',
	body: (s) => `
		<article>
			<h1>Download</h1>
			<div class="callout" data-download>
				<h2>Two places, and nowhere else</h2>
				<p>
					${publicationSummary(s)} <strong>Those are our two official download
					channels.</strong> Follow those exact listings rather than a mirror or a
					lookalike domain. This site links to the downloads; it does not serve an
					installer itself.
					<a href="/official">The full list of addresses we publish from</a> is
					short, and anything outside it is not ours.
				</p>

				<div class="download-primary download-windows">
					<p>
						<a class="button" href="${s.store.url}" rel="noopener" data-got-it="the Store build">Get it from the Microsoft Store</a>
					</p>
					<p class="download-why">
						Microsoft signs ODA's Store AppX package and checks its integrity during
						installation. This avoids the SmartScreen download warning associated with
						direct downloads; it is not a guarantee that an application is safe.
						Check that the listing names <strong>MASTERPANEL LLC</strong> as publisher.
						Store updates can install automatically, subject to your Store settings.
						<a href="https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements" rel="noopener">Microsoft's package-signing requirements</a> and
						<a href="https://support.microsoft.com/en-us/windows/apps/turn-on-automatic-app-updates" rel="noopener">update settings</a> explain those checks.
					</p>
					<p class="download-why">
						<strong>The Store ${s.publication.store.latestVersion} package recorded in our
						<a href="${s.repo}/blob/main/site/publication.mjs" rel="noopener">publication record</a> is
						x64.</strong> Windows 11 on Arm supports
						<a href="https://support.microsoft.com/en-us/surface/drivers-firmware/using-software-and-peripherals-on-surface-arm-based-devices" rel="noopener">x64 emulation</a>.
						For a native ARM64 build, use the ARM64 installer on
						<a href="${s.repo}/releases/tag/v${s.publication.github.latestVersion}" rel="noopener">the GitHub ${s.publication.github.latestVersion} release</a>;
						the Store does not currently offer a native ARM64 ODA package.
					</p>
				</div>

				<div class="download-primary download-linux">
					<p>
						<a class="button" href="${s.repo}/releases/tag/v${s.publication.github.latestVersion}" rel="noopener" data-got-it="the Linux build">Download ${s.publication.github.latestVersion} for Linux</a>
					</p>
					<p class="download-why">
						An x64 AppImage and a Debian/Ubuntu <code>.deb</code>, published on the
						releases page. There is no native Linux ARM64 package in this release.
						<a href="/verify">Verify the downloaded file</a> using the checksums,
						checksum-list signature and build provenance attestation.
					</p>
				</div>

				<details class="download-alt">
					<summary>Can't use the Store, or want to check the bytes yourself?</summary>
					<p>
						Direct installation packages are on
						<a href="${s.repo}/releases/tag/v${s.publication.github.latestVersion}" rel="noopener" data-got-it="a build from the release page">the GitHub ${s.publication.github.latestVersion} release page</a>,
						including the portable build, which has no Store equivalent — its vault,
						settings and recovery data stay beside the executable, so it can run from
						a USB stick. The single-file launcher extracts Electron and Chromium runtime
						files to Windows Temp while it runs and normally removes them on exit. Use this route
						if the Store is unavailable or you need a portable build. An organisation's
						device policy may still block unsigned applications; a portable build does
						not bypass that policy.
					</p>
					<p>
						<strong>The direct Windows downloads have no publisher code signature,
						and none is currently planned.</strong> Windows may warn or block them.
						An unrecognised-app warning and a malware detection are different findings;
						do not dismiss a security alert because this page mentions unsigned builds.
						<a href="/verify">The verification steps</a> establish the published origin
						of a file, not whether its code is harmless.
					</p>
				</details>
			</div>

			<!--
				The most useful thing this page can do today.

				Somebody arrives here wanting a Steam authenticator, finds there is
				nothing to download, and goes back to a search result — which is the
				precise sequence that cost the person who runs this site their
				inventory. Sending them to the genuine original instead is worth more
				than keeping them on a page with no build on it.
			-->
			<h2>What to use today</h2>
			<p>
				Start with Valve's app. If you specifically need a desktop tool, compare the
				alternatives and their limitations before installing:
			</p>
			<ol class="signs">
				<li>
					<strong>Steam's official mobile authenticator.</strong> Maintained by the
					people who run the service, distributed through Apple's and Google's own
					stores. Valve provides account-recovery routes if the phone is lost.
					Use <a href="https://store.steampowered.com/mobile" rel="noopener">Valve's mobile-app page</a>
					to find the store links. If you are here
					because you searched for a desktop authenticator, this is still probably what
					you want.
				</li>
				<li>
					<strong>The original Steam Desktop Authenticator: a legacy option we do not
					recommend for a new setup.</strong> Its own README says it is
					${s.sda.notice}, and its authors' position is that
					${s.sda.authorsAdvice}. That is their assessment of their own software and it
					deserves more weight than ours. Unmaintained software that holds a Steam Guard
					secret does not get safer with time. If you use it anyway, take it from
					<a href="${s.sda.repo}" rel="noopener">github.com/${s.sda.author}/SteamDesktopAuthenticator</a>
					and nowhere else — not a mirror, not a lookalike domain, not a sponsored
					result.
				</li>
				<li>
					<strong>This project.</strong> There is a release to check now, and the
					links at the top of this page are it. We still put Valve's own app first,
					because for most people it is the better answer and saying otherwise to win
					an install would be the same mistake in the other direction.
				</li>
			</ol>
			<div class="origin-note">
				<p>
					We would rather lose you to Valve's app than have you install something
					abandoned on our recommendation. Sending people to unmaintained security
					software while leaving out its author's own warning is the behaviour this
					site exists to complain about.
				</p>
				<a class="button button-quiet" href="${s.sda.repo}" rel="noopener">Read SDA's own notice →</a>
			</div>

			<h2>Why this page still lists the alternatives</h2>
			<p>
				Because the reason this project exists is that somebody searching for a desktop
				authenticator lands on a page and installs whatever it offers. A download page
				that answers only "install ours" trains exactly that habit, which is the habit
				that costs people their inventories. Naming the alternatives, and the real home
				of each, is worth more than the installs it loses us.
			</p>

			<h2>What is finished</h2>
			<ul>
				<li>Implemented features: codes, confirmations, enrollment, import and export, encrypted vault and recovery files.</li>
				<li>The security posture described on the <a href="/security">security page</a>.</li>
				<li>An automated test suite configured to run on pushes to main and pull requests.</li>
				${
					/*
					 * **The checksum-list signature is listed here, under the flag, rather
					 * than as a fourth entry in "What is still missing" below.**
					 *
					 * It used to live down there in both directions: one `<li>` whose signed
					 * branch read "The checksum list <em>is</em> signed. Every release carries
					 * SHA256SUMS.txt.sig ...", sitting under a heading that says "What is
					 * still missing" and a lead-in promising the reader is being told what has
					 * not been done. A finished thing announced as an outstanding one is the
					 * same class of error the release flags exist to prevent, only aimed at
					 * the reader's comprehension instead of at the facts — and nothing catches
					 * it, because `CLAIMS` in site/verify.mjs skips the entry while the flag is
					 * true and `STALE_ABSENCE` only ever hunts for absence phrasings.
					 *
					 * An earlier draft bridged the position instead, ending the signed branch
					 * with "The two things still missing are below." That parses, but it makes
					 * the heading a lie the next sentence then apologises for, and it only
					 * reads correctly for as long as this item happens to sit above the
					 * remaining ones. The neighbouring reproducible-builds entry already
					 * survives the build only because "cannot yet" lands inside a
					 * 200-character qualifier window, so a second position-dependent sentence
					 * in the same list is a second thing that breaks silently when somebody
					 * reorders it. Moving the item leaves both headings literally true
					 * whichever way the flag points, which is the reading a careful editor
					 * arrives at without having to reconcile anything.
					 *
					 * The wording changes with the move as well: entries in this list are
					 * plain noun phrases and the ones below lead with a bold claim, so the
					 * sentence is rewritten to the grammar of the list it now belongs to
					 * rather than carried over intact from the one it left.
					 */
					s.release.signed
						? `<li>
					A signature over the checksum list: the current GitHub release carries
					<code>SHA256SUMS.txt.sig</code> and the certificate that goes with it, so
					you can check that the list itself came from our workflow rather than only
					that your download matches the list.
					<a href="/verify">Step 5 walks through it.</a>
				</li>`
						: ''
				}
				<li>
					Maintainer testing against live Steam accounts, documented in
					<a href="${s.repo}/blob/main/docs/PHASE0_FINDINGS.md" rel="noopener">the protocol findings</a> and
					<a href="${s.repo}/blob/main/docs/AUTHENTICATOR_TRANSFER.md" rel="noopener">the transfer record</a>.
					The transfer record covers sign-in, a real transfer, codes and fetching the
					confirmation list; it explicitly does not claim a live approval of a pending
					trade. These records and automated tests are not an independent audit.
				</li>
			</ul>

			<h2>What is still missing</h2>
			<p>Stated here rather than left for you to discover:</p>
			<ul>
				<li>
					<strong>A code-signing certificate for the direct downloads.</strong> The
					Store AppX package is signed by Microsoft; the direct Windows executables
					are not publisher-signed and may trigger Windows warnings. The checksums and the
					provenance attestation are how you check them.
					<br />
					<strong>No certificate is currently planned.</strong> The maintainer reports
					that an application to the SignPath Foundation was declined; this is
					documented in the project's release notes. Buying a certificate would not
					guarantee an immediate SmartScreen reputation either: Microsoft says Extended
					Validation certificates no longer receive an automatic reputation bypass.
					Signing still provides publisher identity and integrity checks; the separate
					checksum-list signature does not make these executables code-signed. See
					<a href="https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation" rel="noopener">Microsoft's explanation</a> and
					<a href="/code-signing-policy">our code signing policy</a>.
				</li>
				${
					/*
					 * Absent from this list entirely once the flag is true, because what it
					 * describes is then finished and is stated up under "What is finished" —
					 * the note there explains why it moved rather than being bridged in place.
					 *
					 * The conditional wraps the whole `<li>` instead of sitting inside one, so
					 * the signed rendering has three bullets rather than three bullets and an
					 * empty one.
					 */
					s.release.signed
						? ''
						: `<li>
					<strong>The checksum list is not signed yet.</strong> The release workflow
					signs it now, but it started doing so after the current release was
					published — so there is no <code>SHA256SUMS.txt.sig</code> to fetch for the
					build you can download today. <a href="/verify">Step 5 says so plainly</a>
					rather than printing a command that cannot succeed.
				</li>`
				}
				<li>
					<strong>Reproducible builds.</strong> You cannot yet rebuild the tag and
					compare bytes with ours. The provenance attestation identifies the build
					workflow and commit; it does not substitute for an independent rebuild.
				</li>
				<li>
					<strong>An independent audit.</strong> The project has maintainer test records
					and automated checks, but no published independent security audit.
				</li>
			</ul>

			<p>
				Free software under the MIT licence — no ODA account or subscription, and
				nothing to cancel. <a href="${s.repo}/blob/main/LICENSE" rel="noopener">Read the
				licence</a>, or <a href="/uninstall">read how to remove it and its data</a>
				before you install rather than after.
			</p>

			<h2>Building it yourself</h2>
			<p>
				The source is public and can be built and run by anyone comfortable with
				Node.js. You no longer have to — there are builds now — but the option is the
				point: the public source lets you inspect the implementation behind a
				release. That inspection still requires expertise; public code alone is not
				a security assessment.
			</p>
			<p><a class="button" href="${s.repo}" rel="noopener">View the source repository</a></p>

			<h2>Installing a verified Linux download</h2>
			<p>
				Choose one package. On Debian or Ubuntu, from the download directory, run
				<code>sudo apt install ./open-desktop-authenticator-${s.publication.github.latestVersion}-amd64.deb</code>.
				For the AppImage, enable its executable permission in your file manager, or run
				<code>chmod +x ./open-desktop-authenticator-${s.publication.github.latestVersion}-x86_64.AppImage</code>,
				then open it. Run ODA as your normal user. If it does not launch, report the
				error and your distribution/version through <a href="/support">support</a>.
			</p>

			<h2>Checking what you downloaded</h2>
			<p>
				Each application download is listed with a SHA-256 checksum in
				<code>SHA256SUMS.txt</code> on the release page, alongside a build provenance
				attestation that ties those exact bytes to the public workflow run that produced
				them. <a href="/verify">The verification steps walk through both</a> — worth
				reading once before you need them rather than in a hurry afterwards.
			</p>

${reviewAsk(s, { got: 'Did this page stop you downloading the wrong thing?' })}

			<!--
				Revealed once a download has actually started, which is the only moment
				on this page where the reader has received the thing the review would be
				about. Hidden to begin with and hidden again for anybody who says no,
				because an ask that ignores an answer is not an ask.
			-->
			<!--
				Shown when a download route is clicked, before the browser follows it.
				Never a gate: the link the reader asked for is the first control in the
				block and works whether or not they do anything else here, and if this
				script does not run the link is an ordinary link.

				It asks them to come back afterwards rather than to review now. The rule
				this site holds itself to is in markup.mjs: a review from somebody who
				has not used the thing is worth nothing to the reader it is meant to
				reassure. They are one click from a download, so they have not used it.
			-->
			<aside class="ask ask-prompt" data-review-prompt hidden
			       role="dialog" aria-modal="true" aria-labelledby="review-prompt-title">
				<div class="ask-body">
					<h2 id="review-prompt-title">One thing before you go</h2>
					<p>
						Continue to the download below. When you have
						actually used it — today, next week, whenever — come back and say how it
						went. Reviews can describe other users' experiences; they do not verify an
						installer's origin or safety. Use the release verification guide for that
						origin check.
					</p>
					<p class="hint">
						Nothing is offered in return. Positive and negative feedback are welcome,
						subject to the review platform's moderation rules.
					</p>
					<div class="ask-actions">
						<a class="button" href="#" data-review-continue rel="noopener">Continue to the download →</a>
						<a class="button button-quiet" href="${s.reviews.write}" rel="noopener nofollow">Write a review →</a>
						<button type="button" class="button button-quiet" data-review-dismiss>
							Do not ask again
						</button>
					</div>
				</div>
			</aside>
		</article>`
};

export const importFromSda = {
	slug: 'import-from-sda',
	parent: 'docs',
	guide: true,
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	sourced: (s) =>
		`Version covered: ODA ${s.version}. Import behavior checked against <a href="${s.repo}/tree/v${s.version}/src/main/import" rel="noopener">the tagged implementation</a>, <a href="${s.repo}/blob/v${s.version}/tests/import-service.test.ts" rel="noopener">its service tests</a>, and <a href="${s.sda.repo}" rel="noopener">SDA's published format</a>`,
	navTitle: 'Import',
	title: 'Import maFiles from SDA',
	description:
		'Moving accounts from SDA: which files to select, why encrypted maFiles need manifest.json, what is checked before anything is stored, and how to leave.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Import maFiles from Steam Desktop Authenticator',
		publisher: { '@type': 'Organization', name: s.publisher },
		step: [
			{ '@type': 'HowToStep', name: 'Find your maFiles directory' },
			{ '@type': 'HowToStep', name: 'Select the files, including manifest.json if encrypted' },
			{ '@type': 'HowToStep', name: 'Enter the SDA passphrase if the files are encrypted' },
			{ '@type': 'HowToStep', name: 'Review what was found and choose what to keep' }
		]
	}),
	body: () => `
		<article class="guide">
			<h1>Importing maFiles from Steam Desktop Authenticator</h1>
			<p class="lede">
				Your accounts are yours. Import reads the same <code>.maFile</code> format SDA
				writes, shows you what it found, and stores nothing until you say so.
			</p>

			<h2>Before you start</h2>
			<div class="callout">
				<p>
					<strong>Do not delete your SDA installation.</strong> Keep it until you have
					confirmed the imported accounts generate the same codes. Importing copies;
					it does not move. There is no step here that alters your existing files.
					Turn off automatic confirmation while checking the new setup, so neither
					application approves items before you have reviewed them.
				</p>
			</div>

			<h2>1. Find your maFiles</h2>
			<p>
				They live in the <code>maFiles</code> folder inside your SDA installation
				directory, one <code>.maFile</code> per account, named after the SteamID —
				plus a <code>manifest.json</code>.
			</p>

			<h2>2. Select them</h2>
			<p>
				Choose <em>Import maFiles</em> and select the account files. If your maFiles are
				encrypted you also need <code>manifest.json</code>: it holds the salt and
				initialisation vector, and without it an encrypted maFile cannot be decrypted at
				all. If you select an encrypted file and forget the manifest, the application
				looks for one beside the files you picked and adds it for you.
			</p>

			<h2>3. Unlock, if they are encrypted</h2>
			<p>
				You will be asked for the passphrase you set in SDA — not your Steam password,
				and not the passphrase for this application's vault. It is used to decrypt the
				files in memory and is not stored.
			</p>

			<h2>4. Review what was found</h2>
			<p>
				Nothing has been written yet at this point. The report lists each account it
				could read and flags anything that matters:
			</p>
			<ul>
				<li>Accounts already in your vault, so you do not import a duplicate.</li>
				<li>
					An <code>identity_secret</code> that is present but unusable — the account
					remains selectable with a warning. Login codes may still work when the
					<code>shared_secret</code> is usable, but confirmations will not.
				</li>
				<li>
					A maFile with no revocation code. ODA cannot use its built-in deactivation
					option without that code; Steam may offer recovery through a linked phone
					number or Steam Support. <a href="/lost-authenticator">Recovery routes</a>.
				</li>
				<li>A proxy setting found inside the file, which you can adopt or discard.</li>
				<li>
					Files that could not be read at all, and why. A missing or empty
					<code>identity_secret</code> is rejected here rather than imported.
				</li>
			</ul>
			<p>
				Tick the accounts you want and confirm the import. Read the result for each
				account: a warning or failed row is not a successful import. If you replace an
				existing entry, you replace that vault's stored copy; keep a backup first.
				Uncommitted staged files are discarded when you leave, lock the vault, or the
				ten-minute staging window expires.
			</p>

			<h2>5. Confirm the codes match</h2>
			<p>
				Put the two applications side by side and check that an imported account shows
				the same five characters as SDA does. Same secret, same clock, same code. That
				checks the code-generating secret at that moment. It does not check the
				confirmation secret, recovery code or Steam session. Sign in when ODA requests
				it and check that confirmations load; review the recipient and items before
				approving anything. Keep an independent backup even after these checks pass.
			</p>

			<h2>Leaving again</h2>
			<p>
				Use an account's <strong>Export</strong> button to save a standard
				<code>.maFile</code>. The file is <strong>unencrypted</strong>, even when the
				original import was encrypted. It contains authenticator secrets and any
				revocation code. Store it in a secure location and never upload it to a website
				or support report. ODA deliberately omits the Steam refresh token and proxy
				configuration: sign in again and configure routing in the destination app.
				Code compatibility does not guarantee that an unmaintained app's Steam login
				or confirmation features still work.
			</p>

			<h2>Related</h2>
			<ul class="plain next">
				<li><a href="/steam-desktop-authenticator">What is actually inside a maFile</a></li>
				<li><a href="/encrypted-mafile">Encrypted maFiles: the password and the manifest</a></li>
				<li><a href="/security">How they are stored once imported</a></li>
				<li><a href="/docs">Full documentation</a></li>
			</ul>
		</article>`
};

export const uninstall = {
	slug: 'uninstall',
	guide: true,
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	sourced: (s) =>
		`Version covered: ODA ${s.version}. Installed and portable data roots checked against <a href="${s.repo}/blob/v${s.version}/src/main/index.ts" rel="noopener">the tagged application path setup</a>; vault and backup names against <a href="${s.repo}/blob/v${s.version}/src/main/vault/storage.ts" rel="noopener">storage</a>; recovery paths against <a href="${s.repo}/blob/v${s.version}/src/main/vault/recovery.ts" rel="noopener">recovery</a>; package behavior against <a href="${s.repo}/blob/v${s.version}/electron-builder.config.mjs" rel="noopener">the release configuration</a>`,
	navTitle: 'Uninstall',
	parent: 'download',
	title: 'Uninstall Open Desktop Authenticator, and remove its data',
	description:
		'How to remove the application on Windows and Linux, what it leaves behind and where, and the one thing to do before you delete any of it.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Uninstall Open Desktop Authenticator',
		publisher: { '@type': 'Organization', name: s.publisher },
		step: [
			{
				'@type': 'HowToStep',
				name: 'Preserve access before deleting data',
				text: 'For each account, verify another working authenticator or a usable backup, or deliberately remove the authenticator through Steam. Keep the recovery code outside the vault.'
			},
			{
				'@type': 'HowToStep',
				name: 'Remove the application',
				text: 'Uninstall from the Microsoft Store, Windows Settings, or your package manager, or delete the portable folder or AppImage.'
			},
			{
				'@type': 'HowToStep',
				name: 'Remove the data',
				text: 'Delete the application data directory, which holds the encrypted vault, its backup and any recovery files.'
			}
		]
	}),
	body: (s) => `
		<article class="guide">
			<h1>Uninstall ${s.name}, and remove its data</h1>
			<p class="lede">
				Removing the application is the easy half. The half worth reading first is what
				happens to the Steam accounts it was holding, because uninstalling does not
				touch them.
			</p>

			<div class="callout callout-warn">
				<h2>Do this before you delete anything</h2>
				<p>
					<strong>Uninstalling does not remove the authenticator from your Steam
					account.</strong> Steam still expects codes from an authenticator this
					application was generating. Deleting your only usable copy can leave you
					unable to sign in until you complete Steam's recovery process.
				</p>
				<p>Either, for each account:</p>
				<ul>
					<li>
						<strong>Verify access elsewhere</strong> — check another working copy of
						the authenticator, or make and test a secure export or backup before
						removing this one. Uninstalling ODA does not require disabling Steam Guard.
					</li>
					<li>
						<strong>If you intend to deactivate it</strong>, use Remove account and
						explicitly select <em>Also remove the authenticator from Steam</em>. Ordinary
						removal only removes the vault entry. Deactivation needs the revocation
						code and your passphrase; it can cause Steam trading restrictions. Read
						<a href="/steam-guard-trade-holds">the consequences</a> first.
					</li>
					<li>
						<strong>Or make sure you have the revocation code</strong> — the
						<code>R</code> code Valve calls your recovery code, written down somewhere
						that is not the vault.
						<a href="/steam-revocation-code">What it is and how to get it back.</a>
						With it you can detach the authenticator from Steam later, without this
						application.
					</li>
				</ul>
				<p>
					If you have no working copy or usable backup and the vault is already gone,
					<a href="/lost-authenticator">the recovery routes are here</a>.
				</p>
			</div>

			<h2>1. Remove the application</h2>
			<dl class="facts">
				<dt>Microsoft Store</dt>
				<dd>
					Start menu, right-click ${s.name}, Uninstall. Or Settings, Apps, Installed
					apps. Back up your data first: package removal may also remove
					Windows-managed package data.
				</dd>
				<dt>Windows installer (the <code>.exe</code> from GitHub)</dt>
				<dd>
					Settings, Apps, Installed apps, ${s.name}, Uninstall. The uninstaller
					deliberately leaves your data behind so that removing the program does not
					also remove your stored authenticator secrets.
				</dd>
				<dt>Windows portable</dt>
				<dd>
					A portable build has no installer. Delete the
					<code>.exe</code> and the <code>open-desktop-authenticator</code> folder
					beside it, which is where it keeps the vault, settings, recovery records and
					other normal application data. While it runs, the single-file launcher also
					extracts Electron and Chromium runtime files to Windows Temp; it normally
					removes that runtime-only stage on exit.
				</dd>
				<dt>Linux AppImage</dt>
				<dd>Quit ODA and delete the <code>.AppImage</code> file. Remove any launcher or
				shortcut you created, then deal with application data below.</dd>
				<dt>Linux <code>.deb</code></dt>
				<dd>
					<code>sudo apt remove open-desktop-authenticator</code>, or
					<code>sudo dpkg -r open-desktop-authenticator</code>. As with the Windows
					installer, your data is left alone.
				</dd>
			</dl>

			<h2>2. What is left, and where</h2>
			<p>
				This project operates no server that stores a copy of your vault or account
				data. The application's persistent data lives in the directory below.
				Requested authenticator and confirmation operations send the necessary
				requests to Steam, and the optional update check contacts GitHub when it is
				enabled. <a href="/privacy">The privacy page names those destinations and
				what they receive.</a>
			</p>
			<dl class="facts">
				<dt>Windows, installed from GitHub</dt>
				<dd><code>%APPDATA%\\open-desktop-authenticator</code></dd>
				<dt>Microsoft Store</dt>
				<dd>Windows may redirect the application's data into the package's private
				storage under <code>%LOCALAPPDATA%\\Packages</code>. Check the ODA package's
				<code>LocalCache\\Roaming\\open-desktop-authenticator</code> directory as
				well as the installed path above. Locate and back up the actual vault before
				uninstalling; do not delete other applications' package folders.
				<a href="https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-behind-the-scenes" rel="noopener">Microsoft documents this possible AppData redirection</a>.</dd>
				<dt>Windows, portable</dt>
				<dd>
					<code>open-desktop-authenticator</code>, in the same folder as the
					<code>.exe</code>
				</dd>
				<dt>Linux</dt>
				<dd><code>~/.config/open-desktop-authenticator</code> by default, or
				<code>$XDG_CONFIG_HOME/open-desktop-authenticator</code> when that environment
				variable overrides the configuration directory.</dd>
			</dl>
			<p>Inside it:</p>
			<dl class="facts">
				<dt><code>vault.json</code></dt>
				<dd>
					Your accounts and their Steam secrets, encrypted with your passphrase. This
					is the file that matters.
				</dd>
				<dt><code>vault.json.bak</code></dt>
				<dd>
					The previous saved version, kept to help recover from a failed write.
					Encrypted too, and <strong>just as usable to somebody who
					has your passphrase</strong> — deleting only <code>vault.json</code> leaves
					this behind.
				</dd>
				<dt><code>recovery/</code></dt>
				<dd>
					<code>.oda-recovery</code> files created for imported, enrolled or transferred
					authenticators. They contain account secrets and any recovery code, not just
					the recovery code. Each is encrypted using the vault key in force when that
					file was written. Older copies may need an older passphrase, and a later
					authenticator transfer can make an old file's secrets obsolete.
				</dd>
				<dt>Other application files</dt>
				<dd>Interrupted-operation records, recovery staging files and Chromium data
				can also live here. Remove the whole ODA data directory when you intend to
				remove its local data, not only the three entries listed above.</dd>
			</dl>

			<h2>3. Remove the data</h2>
			<p>
				Quit ODA completely, including its tray icon, then delete its data directory
				if it remains after uninstalling. This removes that local copy. Check any
				other installation or portable folder, exports and backups separately.
				Files in the Recycle Bin, system backups or cloud-synced folders can remain
				recoverable; ordinary deletion is not a secure-erasure guarantee.
			</p>
			<p>
				Vault and recovery contents are encrypted. Other application data is not
				necessarily encrypted in the same way. Keep the encrypted backups you still
				need for access, with their passphrases stored separately.
			</p>
			<p>
				<strong>Exports you made are not in there.</strong> A <code>.maFile</code> you
				exported went wherever you saved it, and those are unencrypted unless you
				encrypted them yourself. If you were leaving for another authenticator, that
				file is the one you are keeping; if you were not, it is the one to delete first.
			</p>

			<h2>Licence</h2>
			<p>
				${s.name} is free software under the MIT licence — you may use, copy, modify and
				redistribute it, and it comes with no warranty.
				<a href="${s.repo}/blob/main/LICENSE" rel="noopener">Read the licence</a>. There
				is no separate ODA end-user agreement or ODA account, and nothing to cancel.
			</p>

			<h2>Related</h2>
			<ul>
				<li><a href="/download">Download and release status</a></li>
				<li><a href="/steam-revocation-code">Steam revocation code</a></li>
				<li><a href="/lost-authenticator">Lost access to an authenticator</a></li>
			</ul>

${reviewAsk(s, { got: 'Did this cover what you needed to remove?' })}
		</article>`
};

export const docs = {
	slug: 'docs',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	navTitle: 'Docs',
	title: 'Documentation: setup, codes, confirmations and backups',
	description:
		'Guides for Open Desktop Authenticator: setting up a vault, adding accounts, confirmations, backups, recovery codes and troubleshooting.',
	body: () => `
		<article>
			<h1>Documentation</h1>
			<p class="lede">
				The product manual and the Steam Guard reference library, grouped by the task
				you are trying to complete. If something here is wrong or missing,
				<a href="/support">tell us</a> — documentation faults are treated as faults.
			</p>

			<h2>Getting started</h2>
			<dl class="defs">
				<dt><a href="/import-from-sda">Importing from SDA</a></dt>
				<dd>Bringing existing maFile accounts across, including encrypted ones.</dd>
				<dt>Creating a vault</dt>
				<dd>
					On first run you choose a passphrase. It protects every secret the
					vault stores, and ODA cannot reset it. Use a strong, unique passphrase and
					keep a secure record separately from your vault backup.
				</dd>
				<dt>Adding an authenticator</dt>
				<dd>
					Choose <strong>Add authenticator</strong> for an account without a mobile
					authenticator. Sign in and complete Steam's sign-in challenge. Activation
					then uses a separate code delivered by Steam; follow the screen's email or
					phone-number hint. Record the revocation code outside this computer and
					confirm the backup when asked. If an authenticator already exists, use
					<a href="/move-steam-authenticator-to-pc">Move authenticator</a> instead of
					removing it first. If an operation's outcome is uncertain, follow its
					recovery instructions before attempting it again.
				</dd>
			</dl>

			<h2>Everyday use</h2>
			<dl class="defs">
				<dt>Codes</dt>
				<dd>
					Each account shows its current code and how much of the thirty-second window
					is left. Copy places it on the clipboard; ODA attempts to clear its own
					entry after 30 seconds by default, configurable in Settings. This does not
					clear clipboard history, cloud sync or copies already read by other apps.
				</dd>
				<dt>Confirmations</dt>
				<dd>
					Trades and market listings awaiting approval, with what Steam said about
					each: what is being traded, with whom, and when it was raised. Approve or
					cancel individually. Verify the recipient and items yourself before approving;
					a familiar account name is not proof that the request is yours.
				</dd>
				<dt>Automatic confirmation</dt>
				<dd>
					Optional, per account, and limited to market listings and trades. Anything
					else — most importantly an account recovery request — is held back and
					reported in Activity rather than approved. This limit is in the code, not in
					a setting.
					Automatic approval can still authorise an unwanted trade or sale. Leave it
					off if you need to review each request.
				</dd>
				<dt>Activity</dt>
				<dd>
					What automatic confirmation did while you were not watching, and anything it
					refused. The place to look if something feels wrong.
				</dd>
			</dl>

			<h2>Keeping access</h2>
			<dl class="defs">
				<dt>Revocation codes</dt>
				<dd>
					The code that detaches an authenticator from Steam. Revealing one requires
					your passphrase again even when the vault is unlocked. Store it somewhere
					that is not this computer.
				</dd>
				<dt>Backups</dt>
				<dd>
					The vault keeps the previous version of itself beside the current one. If the
					vault file is damaged, the unlock screen offers to load that backup. Restoring
					returns local records to how they were when the backup was written. It does
					not undo a Steam-side transfer or deactivation. The adjacent backup is also
					lost if the disk fails or the whole data folder is deleted: keep a separate
					encrypted copy and retain the passphrase that opens it.
				</dd>
				<dt>Recovery files</dt>
				<dd>
					Written automatically for imported, enrolled and transferred authenticators,
					and kept when a vault entry is removed. Address any backup warning shown by
					the application. A file needs the vault passphrase in force when it was
					written; changing today's passphrase does not unlock an older copy with the
					new one. A file cannot revive secrets Steam has replaced or deactivated.
				</dd>
			</dl>

			<h2>Troubleshooting</h2>
			<dl class="defs">
				<dt>Steam rejects the codes</dt>
				<dd>
					Check the clock first. Codes depend on time, and clock drift can make them
					invalid. ODA attempts to obtain Steam's time offset and shows time-sync
					failures; do not infer Steam's acceptance tolerance from the 30-second code
					period. <a href="/steam-guard-code-not-working">The full
					walkthrough, including the fixes on Windows and phone, is here.</a>
				</dd>
				<dt>An imported account cannot confirm trades</dt>
				<dd>
					Its maFile may have an <code>identity_secret</code> whose value is present
					but unusable; current imports flag this with a warning. Login codes may still
					work when the <code>shared_secret</code> is usable, but confirmations cannot.
					First check sign-in, connectivity and the account's configured proxy. If
					the secret is unusable, re-import a known-good copy; if none exists, use
					<a href="/lost-authenticator">Steam's recovery or transfer routes</a> before
					considering removal and re-enrollment.
				</dd>
				<dt>Sign-in wants approval on another device</dt>
				<dd>
					Steam is asking for confirmation on the device that already holds the
					authenticator. Use its current code if the sign-in screen offers that route.
					If the device is gone, <a href="/lost-authenticator">Steam's recovery flow</a>
					may use your recovery code, linked phone number or proof of ownership.
				</dd>
			</dl>

			<h2>maFile reference</h2>
			<dl class="defs">
				<dt><a href="/what-is-a-mafile">What a maFile contains</a></dt>
				<dd>The secrets, recovery code and session material inside the file, and why each matters.</dd>
				<dt><a href="/how-to-open-mafile">Opening a maFile safely</a></dt>
				<dd>How to inspect a copy locally without uploading live authenticator material.</dd>
				<dt><a href="/encrypted-mafile">Encrypted maFiles and manifest.json</a></dt>
				<dd>Why an SDA passphrase and the matching manifest are both required.</dd>
				<dt><a href="/import-from-sda">Importing from SDA</a></dt>
				<dd>The product workflow for selecting, checking, importing and later exporting accounts.</dd>
			</dl>

			<h2>Move or recover an authenticator</h2>
			<dl class="defs">
				<dt><a href="/lost-authenticator">Lost access completely</a></dt>
				<dd>The recovery routes in the order worth trying, all on Steam's own systems.</dd>
				<dt><a href="/steam-revocation-code">Find or use the recovery code</a></dt>
				<dd>What the R-code does and where to record it before a device is lost.</dd>
				<dt><a href="/move-steam-authenticator-new-phone">Move to a new phone</a></dt>
				<dd>Valve's phone-to-phone transfer and the restriction that follows it.</dd>
				<dt><a href="/move-steam-authenticator-to-pc">Move from a phone to a PC</a></dt>
				<dd>What a Steam transfer changes and why the old copy must be treated as replaced.</dd>
				<dt><a href="/steam-guard-trade-holds">Trade holds and restrictions</a></dt>
				<dd>Each trigger and duration, separated so different restrictions are not confused.</dd>
				<dt><a href="/steam-guard-code-not-working">Codes that Steam refuses</a></dt>
				<dd>Start with time synchronisation, then work through the less common causes.</dd>
			</dl>

			<h2>Choose and use an authenticator</h2>
			<dl class="defs">
				<dt><a href="/steam-guard-without-phone">Steam Guard without a smartphone</a></dt>
				<dd>The difference between needing a mobile device and keeping a phone number for recovery.</dd>
				<dt><a href="/approve-steam-confirmations-desktop">Trade confirmations on desktop</a></dt>
				<dd>How confirmation signing works and which secret and session it requires.</dd>
				<dt><a href="/steam-mobile-vs-desktop-authenticator">Mobile app or desktop</a></dt>
				<dd>The security, recovery and convenience trade-offs between device types.</dd>
				<dt><a href="/alternatives">Authenticator options compared</a></dt>
				<dd>Valve's app, SDA and this project, including the case against choosing ours.</dd>
				<dt><a href="/faq">Product FAQ</a></dt>
				<dd>Short answers about cost, platform support, privacy, imports and losing a passphrase.</dd>
			</dl>
		</article>`
};

export const faq = {
	slug: 'faq',
	parent: 'docs',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	navTitle: 'FAQ',
	title: 'FAQ: Steam Guard codes, maFiles and security',
	description:
		'Is it free, does it work with SDA maFiles, can it take my items, and what happens if I lose my passphrase. Answers about Open Desktop Authenticator.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: FAQ_ITEMS.map((item) => ({
			'@type': 'Question',
			name: item.q,
			acceptedAnswer: {
				'@type': 'Answer',
				text: typeof item.plain === 'function' ? item.plain(s) : item.plain
			}
		}))
	}),
	body: (s) => `
		<article>
			<h1>Frequently asked questions</h1>
			${FAQ_ITEMS.map(
				(item) => `
			<section class="faq-item">
				<h2>${item.q}</h2>
				${typeof item.a === 'function' ? item.a(s) : item.a}
			</section>`
			).join('')}

			<!--
				The troubleshooting hub.

				Put here rather than in the navigation deliberately. These pages answer
				Steam problems rather than questions about this application, so they do
				not belong in a nav bar aimed at someone evaluating the product — but
				they were reachable only from the sitemap, which for the busiest of them
				meant no internal link at all. A reader who arrives at the FAQ with a
				broken authenticator is exactly the person they are for.
			-->
			<section class="faq-item">
				<h2>Common Steam Guard problems</h2>
				<p>
					Answers to the Steam problems people arrive here with. None of these
					require our software, and most are solved on Steam itself.
				</p>
				<ul class="plain next">
					<li><a href="/steam-guard-code-not-working">My codes are being refused</a> — start with the clock</li>
					<li><a href="/move-steam-authenticator-new-phone">Moving to a new phone</a> — and the two-day versus fifteen-day difference</li>
				<li><a href="/move-steam-authenticator-to-pc">Moving one to a PC</a> — what Steam's transfer actually does to the phone's copy</li>
				<li><a href="/steam-guard-trade-holds">Every trade hold and restriction</a> — by cause and duration, quoted from Valve</li>
					<li><a href="/steam-revocation-code">Finding my recovery code</a> — the R-code, and where it still is</li>
					<li><a href="/lost-authenticator">I have lost access completely</a></li>
					<li><a href="/steam-guard-without-phone">Doing this without a smartphone</a></li>
					<li><a href="/how-to-open-mafile">Opening a maFile safely</a>, and <a href="/encrypted-mafile">when it is encrypted</a></li>
					<li><a href="/approve-steam-confirmations-desktop">How trade confirmations work</a></li>
					<li><a href="/steam-mobile-vs-desktop-authenticator">Mobile app or desktop?</a></li>
				</ul>
			</section>
		</article>`
};

const FAQ_ITEMS = [
	{
		q: 'Is it free?',
		plain:
			'Yes. The application is free and open source under the MIT licence. There is no paid tier, ODA account or application telemetry. The website has analytics described in its privacy notice.',
		a: `<p>Yes. The application is free and open source under the <a href="${'https://github.com/opendesktopauthenticator/open-desktop-authenticator/blob/main/LICENSE'}" rel="noopener">MIT licence</a>. There is no paid tier, ODA account or application telemetry. Steam operations still require your Steam account. This website uses analytics, as described in <a href="/privacy">its privacy notice</a>. MASTERPANEL LLC publishes ODA as an open-source project.</p>`
	},
	{
		q: 'Can I use my existing SDA maFiles?',
		plain:
			'Yes. It imports .maFile accounts, including SDA-encrypted files with the matching manifest and passphrase. Exports are unencrypted .maFile files and omit Steam refresh tokens and proxy configuration.',
		a: `<p>Yes — including SDA-encrypted files with the matching <code>manifest.json</code> and SDA passphrase. Exports are <strong>unencrypted</strong> maFiles and omit Steam refresh tokens and proxy configuration. Keep them secure, and sign in and set routing again in the destination app. <a href="/import-from-sda">How importing and exporting work</a>.</p>`
	},
	{
		q: 'How do I know this is not itself a scam?',
		plain: (s) =>
			`The source and release ${s.publication.github.latestVersion ?? s.publication.store.latestVersion} are public. Check official distribution addresses and verify release signatures and provenance. Those checks establish origin, not that the software is harmless; no independent security audit is published.`,
		/*
		 * **Derived, because this paragraph made a promise it was breaking.**
		 *
		 * Its last sentence says the site refuses to build if any page goes on
		 * saying something is missing after it is not — and this paragraph was
		 * saying "Nothing signs the checksum list" long after cosign started
		 * signing it. The claim was true of the machinery and false of the page
		 * making it. Now the list comes from the flags, so the sentence is
		 * describing something that actually holds.
		 */
		a: (s) => {
			const open = releaseGaps(s, 'sentence');
			const enforcement = `<a href="/download">The download page tracks those limits</a>. Automated site checks catch specified contradictory claims, but do not establish that every sentence is correct.`;
			return `<p>Start with <a href="/official">the official addresses</a>, the public source and <a href="/verify">the release verification steps</a>. The publisher identifies itself as MASTERPANEL LLC. A company name, public code or successful signature check is not a guarantee of harmless software: signatures establish origin, while review and testing assess behaviour.</p>
			<p>${
				open.length
					? `And here is what is <strong>not</strong> finished, because a page that only lists the reassuring half is doing the thing it warns you about. ${open.join(' ')} ${enforcement}`
					: `Everything this answer used to list as unfinished is now done. ${enforcement}`
			}</p>
			<p>We would rather you were sceptical of us and safe than trusting and robbed.</p>`;
		}
	},
	{
		q: 'What happens if I lose my vault passphrase?',
		plain:
			'ODA cannot reset a lost vault passphrase. Recovery files need the passphrase used when written; an older known passphrase may open an older backup. Other working authenticator copies, secure exports, or Steam recovery through a recovery code, linked phone or Support may preserve account access.',
		a: `<p>ODA has no passphrase reset or master key. You need the passphrase that encrypted the vault to open it.</p>
			<p><strong>Recovery files are also encrypted.</strong> They need the passphrase in force when each was written. An older file may open with an older passphrase you still know, but it will only restore working access if Steam has not replaced or deactivated that authenticator.</p>
			<p>Check for another working authenticator copy, a secure maFile export, or a usable independent backup. For Steam-side recovery, use the recovery code (the <code>revocation_code</code> field in a maFile) you stored outside the vault, your linked phone where Steam offers it, or Steam Support's ownership checks. <a href="/lost-authenticator">Follow the recovery guide</a>; losing the vault passphrase does not necessarily mean losing the Steam account.</p>`
	},
	{
		q: 'Does it work without an internet connection?',
		plain: 'Codes are generated offline. Confirmations and enrollment need to reach Steam.',
		a: `<p>Code generation is entirely offline — it is a calculation from a stored secret and the current time. Confirmations, sign-in and enrollment have to reach Steam, since they are conversations with Steam.</p>`
	},
	{
		q: 'Is it affiliated with Valve or with SDA?',
		plain:
			'No. It is an independent open-source project, not affiliated with Valve Corporation or with the authors of Steam Desktop Authenticator.',
		a: `<p>No. It is an independent project, not affiliated with or endorsed by Valve Corporation or the authors of Steam Desktop Authenticator. It supports SDA's maFile format for migration. Format compatibility is not an endorsement from SDA or Valve.</p>`
	},
	{
		q: 'Will it steal my items while I am not looking?',
		plain:
			'An authenticator that approves trades can authorise item transfers. ODA automatic confirmation is off by default and limited to trades and market listings; it can still approve an unwanted request of those types. Account-recovery confirmations are excluded from automatic approval.',
		a: `<p>ODA holds secrets that can authorise trade and market confirmations, so it must be treated as sensitive software. <strong>Automatic confirmation can approve an unwanted trade or sale</strong> if the request appears on Steam. It is off by default and configured per account; only trades and market listings are allowed, while account-recovery requests are held back and reported.</p><p>That restriction does not make automatic trading safe on a compromised account. Leave automatic confirmation off when you need to check every recipient and item. <a href="/security">Read the security model and its limits</a>.</p>`
	},
	{
		q: 'Which platforms does it run on?',
		plain:
			'Published builds target Windows 10 version 1809 or later and Windows 11 on x64 or ARM64, plus x64 Linux. The Store package and portable Windows build are x64; a native ARM64 installer is on GitHub. No macOS or Linux ARM64 build is published.',
		a: `<p>Published builds target Windows 10 version 1809 or later, Windows 11, and x64 Linux. GitHub offers x64 and ARM64 Windows installers; the portable Windows build and the recorded Store package are x64. Linux downloads are an AppImage and a Debian/Ubuntu package. Distribution compatibility depends on system libraries; a Linux package is not a promise that every distribution is supported.</p><p>No macOS or Linux ARM64 build is published. The declared Windows minimum is a compatibility floor, not a statement that an old Windows release still receives security updates. See <a href="/download">the downloads and release limits</a>.</p>`
	}
];

export const support = {
	slug: 'support',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	navTitle: 'Support',
	// Reveals the attachment field and uploads the files. The form works without it.
	script: 'support.js',
	title: 'Report a problem',
	description:
		'Report a bug, a documentation error, or a suspected fake Steam authenticator site. Tracked, answered, and resolvable without an account.',
	body: () => `
		<article>
			<h1>Report a problem</h1>
			<p class="lede">
				Bugs, documentation errors, and suspected clone sites. You do not need an
				account to report something. You receive a private report link: save the whole
				link, including its key, to follow up.
			</p>

			<div class="callout callout-warn">
				<h2>Never include a secret in a report</h2>
				<p>
					Do not paste a <code>.maFile</code>, a shared secret, an identity secret, a
					revocation code, a password or an API key into this form or into any message
					to us. Nobody here will ever ask for one. A report that needs to describe a
					secret can describe its shape without its value.
					For a vulnerability, use <a href="#security-reports">the private security
					channels below</a> rather than this general report form.
				</p>
			</div>

			<!--
				Deliberately not multipart. Files are uploaded one at a time to
				/support/attach and referenced here by id, so this stays a plain
				urlencoded post that works with script disabled — and so the server
				never has to parse multipart, which is a notoriously sharp thing to
				hand-roll and the last place this project wants a parser bug.
			-->
			<form class="form" method="post" action="/support/submit">
				<div class="field">
					<label for="kind">What is this about?</label>
					<select id="kind" name="kind" required>
						<option value="bug">A bug in the application</option>
						<option value="documentation">Something on this site is wrong or missing</option>
						<option value="clone-site">A suspected fake or clone download</option>
						<option value="other">Something else</option>
					</select>
				</div>

				<div class="field">
					<label for="summary">One line</label>
					<input id="summary" name="summary" type="text" maxlength="140" minlength="8" required
					       placeholder="Codes are rejected after importing from SDA">
				</div>

				<div class="field">
					<label for="detail">What happened</label>
					<textarea id="detail" name="detail" rows="8" maxlength="4000" minlength="20" required
					          placeholder="What you did, what you expected, what happened instead. Application version and operating system if it is a bug. For a clone site: the URL and where you found it."></textarea>
				</div>

				<!--
					Attachments are revealed by /assets/support.js. Without script there is
					no way to upload, so the control stays hidden rather than sitting there
					inert and taking a click that does nothing.
				-->
				<div class="field" data-attach hidden>
					<label for="files">Screenshots or a short video (optional)</label>
					<div class="dropzone" data-dropzone tabindex="0" role="button"
					     aria-describedby="files-hint">
						<strong>Drop files here, or choose them</strong>
						<p class="hint" id="files-hint">
							PNG, JPEG, GIF or WebP up to 6&nbsp;MB. MP4 or WebM up to 20&nbsp;MB.
							Four files at most.
						</p>
						<input id="files" type="file" multiple
						       accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/webm">
					</div>
					<p class="hint">
						<strong>Check the picture before you choose it.</strong> A screenshot of
						the application can have a code, an account name or a recovery code in the
						corner of it, and a screen recording can have far more than you meant to
						include. The check that refuses secrets in this form reads text — it
						cannot see inside an image, so nothing here will catch a secret that is
						only in a picture.
					</p>
					<p class="hint">
						Files upload as soon as you choose them, so we can check the type and size
						before you finish writing. <strong>Remove</strong> deletes our copy, not
						just the thumbnail. Anything you never attach to a report becomes eligible
						for deletion after two hours and is normally removed within a few hours.
						A failed removal is retried until it succeeds.
						<a href="/privacy">What we keep, and for how long</a>.
					</p>
					<ul class="attachments" data-list></ul>
				</div>

				<div class="field">
					<label for="contact">Where to reply, if you want one (optional)</label>
					<input id="contact" name="contact" type="text" maxlength="120"
					       placeholder="An email address, or leave this blank">
					<p class="hint">
						No account is created either way. Save your full private report link to check
						back; leaving an address means we can ask a follow-up question, which is
						often the difference between a fixed bug and a closed one.
					</p>
				</div>

				<div class="controls">
					<button type="submit">Send the report</button>
				</div>
			</form>

			<div class="callout">
				<p>
					Reports containing what looks like a shared secret, an identity secret, a
					revocation code or a private key are <strong>refused and not stored</strong>.
					That is deliberate: the check is in the code, not just in the sentence above.
				</p>
			</div>

			<h2>What to include</h2>
			<ul>
				<li>What you did, what you expected, and what happened instead.</li>
				<li>The application version and your operating system.</li>
				<li>Whether it happens every time or occasionally.</li>
				<li>For a suspected clone site: the URL, and where you encountered it.</li>
			</ul>

			<h2>What happens to a report</h2>
			<ol>
				<li>
					<strong>You get a link</strong>, holding a reference in the form
					<code>ODA-7K2M-B9QW</code> and the key that opens it. <strong>Keep the whole
					link</strong> — the reference on its own will not open the report, and there
					is no account to recover it from.
				</li>
				<li>
					<strong>Our triage policy:</strong> anything
					describing lost access, lost items, or a secret behaving unexpectedly is
					looked at ahead of everything else.
				</li>
				<li>
					<strong>Our aim is to answer each report</strong>, including a reason if we
					cannot make the requested change. General reports have no guaranteed response
					time. Steam account recovery and item disputes must go through Steam Support.
				</li>
			</ol>

			<h2>Reporting a clone site</h2>
			<p>
				Fake authenticator downloads are the reason this project exists, and a report
				takes a minute. Send the URL and where you found it — a search result, an
				advertisement, a video description, a Discord message. We collect them, warn
				about the patterns on the <a href="/scam-clones">scam clones page</a>, and report
				the worst to the registrars and hosts involved.
			</p>
			<p>
				You do not need to be sure. A site that turns out to be legitimate costs us five
				minutes; one that turns out not to be may save somebody their inventory.
			</p>

			<h2 id="security-reports">Security reports</h2>
			<p>
				<strong>Do not open a public issue for a security problem.</strong> There are
					two published private routes:
			</p>
			<ul class="plain next">
				<li>
					<strong><a href="https://github.com/opendesktopauthenticator/open-desktop-authenticator/security/advisories/new" rel="noopener">GitHub private vulnerability
					reporting</a></strong> — preferred. It keeps the discussion in a private
					advisory rather than a public issue and requires a GitHub account. If it is
					unavailable, use the email route.
				</li>
				<li>
					<strong>By email</strong>, if you would rather not use GitHub. The address is
					published in
					<a href="/.well-known/security.txt">our security.txt</a>, which is the
					standard place to look for security contact information. The same address
					is also in the repository's SECURITY.md.
				</li>
			</ul>
			<p>
				What we commit to, in writing: acknowledgement within 72 hours, an initial
				assessment within 7 days, and a fix or a dated plan within 30 days for a
				confirmed high or critical. Those are the commitments of a single maintainer,
				and if one is going to be missed we will say so before the deadline rather than
				after. The full policy is in
				<a href="${'https://github.com/opendesktopauthenticator/open-desktop-authenticator/blob/main/SECURITY.md'}" rel="noopener">SECURITY.md</a>.
			</p>
			<p>
				Please give us a reasonable window to release a fix before publishing details.
				We will not use that window to argue you into silence, and we will credit you
				unless you would rather we did not.
			</p>
		</article>`
};

export const notFound = {
	slug: '404',
	title: 'Page not found',
	description:
		'That address does not exist on this site. Links to the main pages: what SDA is, download status, verifying a build, and the documentation.',
	noindex: true,
	body: () => `
		<article>
			<h1>Page not found</h1>
			<p class="lede">That address does not exist on this site.</p>
			<p>If you followed a link from somewhere and expected a page here, <a href="/support">tell us where the link was</a> — a broken link on our own site is a fault worth fixing.</p>
			<ul class="plain next">
				<li><a href="/">Home</a></li>
				<li><a href="/steam-desktop-authenticator">About Steam Desktop Authenticator</a></li>
				<li><a href="/download">Download status</a></li>
				<li><a href="/docs">Documentation</a></li>
			</ul>
		</article>`
};
