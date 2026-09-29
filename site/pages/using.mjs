/**
 * Pages for somebody choosing an authenticator, or working out how to use one.
 *
 * The rescue pages in rescues.mjs catch people mid-accident. These catch them
 * earlier — deciding, or trying something they have not done before — which is
 * a different register: less urgency, more comparison, and a much stronger
 * obligation to be even-handed.
 *
 * **The comparison page recommends Steam's own app for most readers**, and
 * describes it accurately rather than conveniently. An earlier draft implied the
 * mobile app handles one account at a time; Valve documents the opposite, and
 * understating a competitor is the same failure as overstating yourself. The
 * readers a desktop authenticator genuinely suits can recognise themselves from
 * an honest description of the trade, and the rest are better served elsewhere.
 */

import { reviewAsk } from '../markup.mjs';

/** Valve's own pages, cited wherever this makes a claim about Steam's behaviour. */
const VALVE = {
	guard: 'https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31',
	setup: 'https://help.steampowered.com/en/faqs/view/6891-E071-C9D9-0134',
	holds: 'https://help.steampowered.com/en/faqs/view/34A1-EA3F-83ED-54AB',
	confirmations: 'https://help.steampowered.com/en/faqs/view/2E6E-A02C-5581-8904',
	offers: 'https://help.steampowered.com/en/faqs/view/1115-91C5-050C-1D60',
	protection: 'https://help.steampowered.com/en/faqs/view/365F-4BEE-2AE2-7BDD'
};

export const confirmationsOnDesktop = {
	slug: 'approve-steam-confirmations-desktop',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`Transaction states checked against <a href="${VALVE.offers}" rel="noopener">Valve's trade-offer guidance</a>; review controls and incomplete-list behavior against ODA's <a href="${s.repo}/blob/main/src/renderer/screens/Confirmations.tsx" rel="noopener">confirmation screen</a> and <a href="${s.repo}/blob/main/src/main/confirmations/policy.ts" rel="noopener">approval policy</a>`,
	navTitle: 'Confirmations on PC',
	title: 'Approve Steam trade confirmations on desktop',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Review Steam trade and Market confirmations in ODA, check the right account and transaction, and diagnose empty lists, sign-in requests or approval errors.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Approve Steam trade confirmations on desktop',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/approve-steam-confirmations-desktop`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Approve Steam trade confirmations on desktop</h1>
			<p class="lede">In ${s.short}, open the intended account's Confirmations, refresh the list,
				and compare each entry with the trade or Market listing you created before approving it.
				A working Guard code alone does not establish that the confirmation session works.</p>
			<div class="answer">
				<span class="eyebrow">What you need</span>
				<p>The account must have its current authenticator secrets and a usable Steam session.
					If its authenticator is still only on a phone, desktop approval requires an appropriate
					<a href="/move-steam-authenticator-to-pc">transfer</a>; if you have an SDA file,
					use <a href="/import-from-sda">import</a>. Neither a username nor a login code
					alone gives a desktop tool confirmation access.</p>
				<p><strong>Do not approve an unfamiliar entry to clear the list.</strong> Confirm the
					account, items and intended recipient or price against Steam. If the summary is
					insufficient, inspect the original offer or listing first.</p>
			</div>

			<h2>How to review confirmations in ${s.short}</h2>
			<ol class="steps">
				<li><strong>Unlock the vault and choose the account.</strong><p>Check the account name
					before opening <strong>Confirmations</strong>; several accounts can have similar display names.</p></li>
				<li><strong>Sign in if prompted, then refresh.</strong><p>Generated codes can work offline;
					confirmation lists need a connection and a valid session. Read any connection or
					incomplete-list warning before acting.</p></li>
				<li><strong>Compare the entry with the transaction you intended.</strong><p>Check it against
					Steam's offer or listing. Approve only the entries you recognize; deny an unexpected
					request and review account security.</p></li>
				<li><strong>Check the result in Steam.</strong><p>Approval authorizes a pending action.
					An outgoing trade offer may still need the other party's acceptance, and item holds
					or account restrictions may apply. Use the transaction's actual status as the result.</p></li>
			</ol>
			<p><strong>Approve all</strong> applies to every ordinary entry shown, not a selection.
				Review the full list first. Security-sensitive confirmations are handled individually;
				batch approval is not a shortcut for them.</p>

			<h2>No confirmation appears, or approval fails</h2>
			<dl class="defs">
				<dt>An empty list</dt><dd>Check the account and Steam's transaction status. The action may
					not require confirmation, may already be processed, or may belong to a different account.
					An empty list does not prove that a trade or sale succeeded.</dd>
				<dt>Sign-in requested</dt><dd>Renew the Steam session. Re-importing the same file does not
					replace signing in; a valid login code and a valid session are separate requirements.</dd>
				<dt>Connection, proxy or incomplete-list warning</dt><dd>Correct the reported connection
					problem and refresh. Do not interpret a partial list as the complete set of pending actions.</dd>
				<dt>Timeout after approval</dt><dd>Check Steam's trade or Market history before retrying.
					The request may have succeeded even if ODA did not receive the response.</dd>
				<dt>Codes work but requests are rejected</dt><dd>The session, identity secret or Steam's
					account state may differ from the login-code state. Check whether the authenticator was
					replaced after this backup, and read the error. Do not remove the authenticator as a routine fix.</dd>
			</dl>

			<h2>What approval does on Steam</h2>
			<p><a href="${VALVE.offers}" rel="noopener">Valve's trade-offer guide</a> explains
				confirmation through Steam Mobile, or email when the account does not use it.
				Confirming an outgoing offer can authorize it to be sent; it does not itself establish
				that the other party accepted it. See also
				<a href="${VALVE.confirmations}" rel="noopener">Valve's confirmation guidance</a>.</p>
			<p>A desktop client is unofficial. It uses the <code>identity_secret</code>, a valid
				authenticated session and a time-dependent signature. That is separate from generating
				a login code with <code>shared_secret</code>. Our
				<a href="${s.repo}/blob/main/src/main/confirmations/protocol.ts" rel="noopener">protocol implementation</a>
				and the <a href="/what-is-a-mafile">maFile field reference</a> describe those roles.
				Steam controls whether the request is accepted.</p>

			<h2>Manual review and automatic approval are different</h2>
			<p>${s.short}'s automatic approval is off unless enabled per account. Enabling automatic
				trades requires a confirmation phrase. Keep it off if you want to inspect every request.
				Locking the vault stops new approval requests; it cannot recall a request already sent.
				The app locks on suspend and after the configured idle period.</p>
			<p>Secrets are <a href="/security">encrypted at rest</a> but available to the app while
				unlocked. Protect the PC and its backups. A copied identity secret cannot log in on its
				own, but a usable session alongside it can enable account actions.</p>
			<p>Approval does not bypass <a href="/steam-guard-trade-holds">holds, restrictions or
				CS2 Trade Protection</a>. If Steam blocks the transaction, follow the reason it shows.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/import-from-sda"><b>Import an existing authenticator</b><span>Check files and account details before using them in ODA.</span></a></li>
				<li><a href="/steam-mobile-vs-desktop-authenticator"><b>Mobile app or desktop</b><span>Choose where your credentials and backups will live.</span></a></li>
				<li><a href="/what-is-a-mafile"><b>The identity secret</b><span>The confirmation credential and the other fields beside it.</span></a></li>
			</ul>
${reviewAsk(s, { got: 'Did this get your confirmations working on the desktop?' })}
		</article>`
};
export const mobileVsDesktop = {
	slug: 'steam-mobile-vs-desktop-authenticator',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`Mobile features and transfer options checked against <a href="${VALVE.guard}" rel="noopener">Valve's Steam Guard guidance</a>; ODA storage and recovery boundaries against its <a href="${s.repo}/blob/main/docs/THREAT_MODEL.md" rel="noopener">threat model</a> and <a href="${s.repo}/blob/main/src/main/vault/recovery.ts" rel="noopener">recovery implementation</a>`,
	navTitle: 'Mobile or desktop',
	title: 'Steam mobile or desktop authenticator: devices and recovery',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Decide where to keep your Steam authenticator: compare device separation, backup responsibility and recovery after a lost phone or PC.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam mobile or desktop authenticator: devices and recovery',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/steam-mobile-vs-desktop-authenticator`
	}),
	body: (s) => `
		<article class="guide">
			<h1>Steam mobile or desktop authenticator?</h1>
			<p class="lede">Choose the device and recovery arrangement you can maintain.
				Steam Mobile keeps the authenticator on a separate device from your desktop session.
				A desktop tool gives you local files and backups to manage. This page compares those
				responsibilities; the <a href="/alternatives">product comparison</a> covers individual tools.</p>
			<div class="answer">
				<span class="eyebrow">Choose by the way you work</span>
				<p><strong>Use Steam Mobile if you want Valve's app and less file management.</strong>
					It supports multiple accounts and QR or notification sign-in, not just typed codes.</p>
				<p>A desktop authenticator may suit account management on a larger screen,
					manual backup control or a situation without a usable smartphone. Choose it only
					with a plan for the PC, the backup and the passphrase. ${s.publisher}, the publisher
					of ${s.short}, writes this comparison.</p>
			</div>

			<h2>Where will your credentials and recovery copies live?</h2>
			<div class="tbl" tabindex="0" role="region" aria-label="Mobile and desktop credential storage comparison"><table>
				<thead><tr><th scope="col">Decision</th><th scope="col">Steam Mobile</th><th scope="col">Desktop authenticator</th></tr></thead>
				<tbody>
					<tr><th scope="row">Separation from the PC</th><td>Authenticator stored on the phone; protect both devices and reject unexpected approvals.</td><td>Authenticator and signed-in Steam session may share a PC. Malware there can compromise both.</td></tr>
					<tr><th scope="row">Credential files</th><td>The app manages its credential storage.</td><td>You manage a vault or maFiles and their backups; encryption and lock behavior depend on the tool.</td></tr>
					<tr><th scope="row">Lost device</th><td>Use Steam's transfer or recovery options based on access still available.</td><td>A usable current backup can restore the authenticator. Otherwise use the recovery code or Steam's recovery options.</td></tr>
					<tr><th scope="row">Recovery materials</th><td>Keep the recovery code and linked account contacts accessible.</td><td>Also preserve the backup and its passphrase separately from the PC.</td></tr>
					<tr><th scope="row">Reviewing confirmations</th><td>Review on the mobile device.</td><td>A larger screen can help compare pending entries with offers and listings. Review every entry before batching.</td></tr>
				</tbody>
			</table></div>

			<h2>Can the phone and desktop be independent authenticators?</h2>
			<p><a href="${VALVE.guard}" rel="noopener">Valve documents one authenticator per account</a>.
				A server-side transfer replaces it, so the previous secrets stop working.
				Copying one maFile between desktop tools is different: both copies hold the same
				credential until it is replaced. That is a duplicated authenticator, not a separately
				enrolled fallback. Every copy needs protection. Valve does not document an official
				mobile-secret export for a desktop app.</p>

			<h2>Choose a recovery route before switching</h2>
			<ol class="steps">
				<li><strong>Check what you can access without the device.</strong><p>Keep the current
					recovery code, email and any linked phone number available. A number helps with
					Steam's SMS recovery whether you use mobile or desktop software.</p></li>
				<li><strong>If choosing a desktop, check the backup requirements.</strong><p>${s.short}'s
					encrypted vault and per-account recovery files need the passphrase used to encrypt
					them. A recovery file retains authenticator data without the refresh token;
					confirmations can require a fresh Steam sign-in after recovery.</p></li>
				<li><strong>Read the actual move procedure.</strong><p>Valve's phone transfer,
					<a href="/move-steam-authenticator-to-pc">ODA's desktop replacement flow</a>, and
					<a href="/import-from-sda">a local maFile import</a> perform different operations.
					Do not remove the current authenticator first merely to change software.</p></li>
			</ol>

			<h2>What if the computer is lost or compromised?</h2>
			<p>A backup of the current authenticator can restore codes if you can decrypt it and
				the clock is correct. Confirmations may need a new session. Without a usable backup,
				check the linked-number route, <a href="/steam-revocation-code">recovery code</a>
				and Steam Support.</p>
			<p>Restoring a backup does not invalidate a stolen copy. If the PC was stolen or
				compromised, secure the Steam account from a trusted device and review its recovery
				options. Encryption protects files at rest; malware can access secrets available
				to an unlocked app. See <a href="/security">ODA's storage and lock boundaries</a>.</p>

			<h2>Does switching affect trades?</h2>
			<p>Valve documents two days for its phone-transfer flow and fifteen days for authenticator
				removal. Desktop behavior must be checked against the tool's procedure and evidence.
				A local import of unchanged secrets performs neither Steam-side action. Existing
				restrictions and <a href="/steam-guard-trade-holds">item protections</a> still apply.</p>
			<p>To return to a phone, start with Steam Mobile's documented transfer/recovery options.
				Availability depends on the access and linked number you retain. A third-party client
				working today is not a guarantee of future Steam compatibility.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/move-steam-authenticator-to-pc"><b>Move to a PC</b><span>ODA prerequisites and its historical transfer-test limits.</span></a></li>
				<li><a href="/steam-guard-without-phone"><b>No smartphone or no number?</b><span>Separate device requirements from message and recovery requirements.</span></a></li>
				<li><a href="/alternatives"><b>Compare products</b><span>Original SDA, ODA, Steam Mobile and other choices.</span></a></li>
			</ul>
		</article>`
};
export const withoutPhone = {
	slug: 'steam-guard-without-phone',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`The no-number choice is documented in <a href="${VALVE.setup}" rel="noopener">Valve's setup walkthrough</a>. ODA delivery handling was reviewed in its <a href="${s.repo}/blob/main/src/main/steam/enrollment.ts" rel="noopener">enrolment implementation</a>; email activation is also recorded in a <a href="${s.repo}/blob/main/docs/PHASE0_FINDINGS.md" rel="noopener">single historical account test</a> on August 10, 2026`,
	navTitle: 'Without a phone',
	title: 'Steam Guard without a smartphone or phone number',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Choose email Steam Guard, the official app without a linked number, or a desktop authenticator. Understand setup, transfer and recovery requirements.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam Guard without a smartphone or phone number',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/steam-guard-without-phone`
	}),
	body: (s) => `
		<article class="guide">
			<h1>Steam Guard without a smartphone or phone number</h1>
			<p class="lede">A device that runs an authenticator and a phone number used for messages
				are separate requirements. Valve's app needs a supported Android or iOS device, but
				its current setup offers a way to continue without a phone number. Email Steam Guard
				and unofficial desktop authenticators are other routes with different trade-offs.</p>
			<div class="answer">
				<span class="eyebrow">Choose your situation</span>
				<ul>
					<li><strong>You need sign-in protection without an authenticator app:</strong> consider
						email Steam Guard. Protect access to the email account; trade and Market conditions differ.</li>
					<li><strong>You can run Steam Mobile but have no number:</strong> use Valve's documented
						no-number setup option below, and retain the recovery code.</li>
					<li><strong>You need authenticator codes on a PC:</strong> compare the
						<a href="/steam-desktop-authenticator">desktop choices</a>. You will manage credentials
						and backups on that PC; these are third-party clients.</li>
					<li><strong>You already lost the phone authenticator:</strong> use the
						<a href="/lost-authenticator">recovery guide</a>. Installing a desktop app alone
						cannot retrieve secrets from a lost phone.</li>
				</ul>
			</div>

			<h2>Use Steam Mobile without linking a number</h2>
			<p>In <a href="${VALVE.setup}" rel="noopener">Valve's setup walkthrough</a>, the number
				step includes <strong>I don't have access to a phone number</strong> beneath the Next
				button. Follow that option and save the recovery code when presented. A number is
				optional for this setup; it remains useful for recovery and may be required by other
				Steam or game features.</p>
			<p>Without a linked number, Steam cannot use it for SMS recovery. Keep the recovery code
				accessible without the device. If you later add or change a number, use Steam's
				<strong>Account Details → Contact Info</strong>. ${s.short} does not manage that setting.</p>

			<h2>Use email Steam Guard for sign-in</h2>
			<p><a href="https://help.steampowered.com/en/faqs/view/451E-96B3-D194-50FC" rel="noopener">Valve recognizes
				email Steam Guard</a> as account protection. It does not require a smartphone or a
				desktop authenticator. If you only need to sign in, this may fit your needs.</p>
			<p>Email protection is not the same as an established mobile authenticator for item
				holds. Review <a href="/steam-guard-trade-holds">standard holds, account restrictions
				and the CS2 exception</a> before choosing it for a trading account. If an authenticator
				already exists, switching methods is an account change; read Steam's warnings before removal.</p>

			<h2>Set up a desktop authenticator</h2>
			<p>For an existing SDA file, <a href="/import-from-sda">import the current authenticator</a>.
				For an account without an existing authenticator, ${s.short}'s Add authenticator flow
				uses Steam's response to tell you whether the activation code is sent by SMS or email.
				Follow the channel actually shown, save the recovery code and complete the encrypted backup.</p>
			<p>A <a href="${s.repo}/blob/main/docs/PHASE0_FINDINGS.md" rel="noopener">recorded test on August 10, 2026</a>
				completed enrolment for one no-number account using an emailed activation code.
				This is historical evidence for that account, not a new test of the latest release or
				a guarantee of the route Steam will offer yours.</p>
			<p><strong>Moving an existing phone authenticator is different from enrolment.</strong>
				<a href="/move-steam-authenticator-to-pc">ODA's Move from phone flow</a> requires the
				current authenticator for sign-in and the phone code from the linked number.
				Do not remove it just to try no-number setup.</p>

			<h2>Plan recovery before removing a device from use</h2>
			<ul>
				<li>Retain the <a href="/steam-revocation-code">recovery code</a> for the current authenticator.</li>
				<li>For a desktop, preserve a usable protected backup and the passphrase needed to open it
					separately from the computer. A copied but undecryptable file is not usable recovery.</li>
				<li>Without a linked number, SMS recovery and the SMS transfer option are unavailable.
					Other options depend on the access you still have and Steam's recovery flow.</li>
				<li>If no current authenticator, usable backup or recovery route remains, use
					<a href="https://help.steampowered.com/" rel="noopener">Steam Support</a> for ownership checks.</li>
			</ul>

			<h2>Phone-number questions</h2>
			<dl class="defs">
				<dt>Can several accounts share one number?</dt><dd><a href="${VALVE.guard}" rel="noopener">Valve permits it</a>,
					but warns that shared-number accounts may be linked for policies and restrictions.
					Check the consequences before sharing one.</dd>
				<dt>Can I use a landline or VoIP number?</dt><dd>Valve excludes numbers that cannot
					receive text messages and says it does not accept new VoIP numbers. Follow its
					current number requirements rather than using a public code-receiving service.</dd>
				<dt>Can I remove a linked number later?</dt><dd>Steam provides that action under Account Details →
					Manage your phone number. Read the warnings first: removing a number and removing
					the authenticator are different, and the number's removal loses SMS recovery.</dd>
			</dl>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/steam-revocation-code"><b>Find your recovery code</b><span>Preserve a route that does not depend on this device surviving.</span></a></li>
				<li><a href="/steam-mobile-vs-desktop-authenticator"><b>Mobile or desktop?</b><span>Compare credential storage, device separation and recovery.</span></a></li>
				<li><a href="/lost-authenticator"><b>Already locked out?</b><span>Choose a recovery route from the access you still have.</span></a></li>
			</ul>
		</article>`
};
export const openMafile = {
	slug: 'how-to-open-mafile',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`File format checked against <a href="${s.sda.repo}/blob/master/Steam%20Desktop%20Authenticator/Manifest.cs" rel="noopener">SDA's manifest implementation</a>; ODA input requirements against its <a href="${s.repo}/blob/main/src/main/import/service.ts" rel="noopener">import service</a>. The JSON example below is synthetic and cannot authenticate an account`,
	navTitle: 'Opening a maFile',
	title: 'How to open a Steam maFile: read, decrypt or import',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Choose how to read, decrypt or import a Steam maFile. Work on a local copy, keep the matching SDA manifest, and identify readable JSON or encrypted data.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'How to open a Steam maFile: read, decrypt or import',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/how-to-open-mafile`
	}),
	body: (s) => `
		<article class="guide">
			<h1>How to open a Steam <code>.maFile</code></h1>
			<p class="lede">Choose whether you want to read its fields, decrypt an SDA backup,
				or use the authenticator in another app. A local text editor can display the file;
				it cannot decrypt encrypted contents just by opening them.</p>
			<div class="answer">
				<span class="eyebrow">Choose your task</span>
				<ul>
					<li><strong>Read the fields:</strong> open a copied file in a trusted local text editor.
						Readable JSON needs no converter. The example below shows what to look for.</li>
					<li><strong>Decrypt an SDA file:</strong> keep the matching <code>manifest.json</code>
						and SDA encryption passphrase. Follow the <a href="/encrypted-mafile">encrypted-file guide</a>;
						the Steam password is not a replacement for that passphrase.</li>
					<li><strong>Use the account in ${s.short}:</strong> follow <a href="/import-from-sda">the import steps</a>.
						Import reads authenticator data; it does not remove or replace the authenticator on Steam.</li>
				</ul>
			</div>
			<p class="callout callout-warn"><strong>Keep real maFiles local.</strong> They contain
				authentication secrets or encrypted backups of them. Do not upload one to an online
				viewer, converter, AI chat or support form, including ours.</p>

			<h2>Make a working copy first</h2>
			<ol class="steps">
				<li><strong>Find the SDA folder.</strong><p>Its <code>maFiles</code> folder normally sits beside
					the SDA executable, wherever you extracted it. It is not inside a fixed Steam folder.
					Search your own backups for <code>*.maFile</code> and <code>manifest.json</code> if needed.</p></li>
				<li><strong>Close SDA and copy the entire maFiles folder.</strong><p>Use a private local
					folder, preserving the manifest beside the files. Do not overwrite your only backup.
					Avoid a location automatically shared or synced to another service.</p></li>
				<li><strong>Open the copy with a local text editor.</strong><p>Choose <strong>Open with → Notepad</strong>
					or another editor you trust. Enable filename extensions: <code>.maFile.exe</code> is
					an executable, not a maFile. Inspect without saving changes.</p></li>
			</ol>

			<h2>Recognize readable JSON</h2>
			<p>An unencrypted file has quoted names and values inside curly braces. Fields differ
				between exports. This <strong>synthetic example contains no usable credentials</strong>;
				it illustrates names only and is not an import-ready account:</p>
			<pre><code>{
  "account_name": "example_account_not_real",
  "shared_secret": "NOT_A_REAL_SECRET",
  "identity_secret": "NOT_A_REAL_SECRET",
  "revocation_code": "NOT_A_REAL_RECOVERY_CODE"
}</code></pre>
			<p><code>shared_secret</code> generates login codes; <code>identity_secret</code> is used
				for confirmation signatures. A file may also contain a session or refresh token.
				See the <a href="/what-is-a-mafile">field reference</a> before treating an unfamiliar
				value as harmless. Missing <code>revocation_code</code> does not mean a viewer hid it;
				some files simply do not contain that optional field.</p>

			<h2>If you see encoded text instead</h2>
			<p>A block of base64 text is consistent with SDA encryption, but its appearance alone
				does not establish that the file is valid. SDA's matching manifest supplies the encryption
				metadata; the correct passphrase is also needed. Keep these together and use a local
				compatible importer. Renaming the file or formatting it as JSON will not decrypt it.</p>
			<p>An empty file, malformed JSON or an unexpected format may indicate the wrong file or
				a damaged copy. Preserve it, compare with another retained backup and follow the
				<a href="/encrypted-mafile">manifest/passphrase checks</a> before editing anything.
				A missing passphrase or missing authenticator secret cannot be recovered from the filename.</p>

			<h2>Importing is a separate trust decision</h2>
			<p>A text editor displays a copy. An authenticator uses its secrets to generate codes and,
				with a valid Steam session, act on confirmations. Before importing, identify the publisher
				and <a href="/verify">verify the download</a>. For ${s.short}, review the parsed accounts
				before committing the import, then check a fresh code and the confirmation session separately.</p>
			<p>Opening or importing an old backup does not make an obsolete secret current again.
				If the authenticator was replaced on Steam, use a backup of the replacement or
				<a href="/lost-authenticator">Steam's recovery routes</a>. If you already shared a real
				file with an untrusted service, treat its secrets as exposed; changing a password alone
				does not rotate authenticator secrets.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/what-is-a-mafile"><b>A maFile, field by field</b><span>What the fields mean and which can authorize account actions.</span></a></li>
				<li><a href="/encrypted-mafile"><b>When it is encrypted</b><span>Check the passphrase, manifest and file mapping.</span></a></li>
				<li><a href="/import-from-sda"><b>Importing into ODA</b><span>Choose files, review accounts and verify the result.</span></a></li>
			</ul>
${reviewAsk(s, { got: 'Did this let you open your maFile?' })}
		</article>`
};
