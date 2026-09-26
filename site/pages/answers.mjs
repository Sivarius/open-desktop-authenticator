import { releaseGaps, sentenceList, countPhrase } from '../markup.mjs';

// Tests render comparison copy with a deliberately minimal site object. Keep
// the canonical source usable there without weakening the production source of
// truth, which still comes from SITE.sda.repo.
const originalSdaRepo = (site) =>
	site.sda?.repo ?? 'https://github.com/Jessecar96/SteamDesktopAuthenticator';

/**
 * Pages that answer a question somebody is actually typing.
 *
 * **On how these were chosen.** There is no query data for this domain yet — it
 * has never been served to the public, so Search Console has nothing and there
 * is no analytics history to read. Anyone claiming otherwise would be inventing
 * numbers. These three exist because they cover distinct intents the rest of the
 * site could not answer at all:
 *
 *  - someone who has read the word "maFile" and does not know what it is;
 *  - someone who has already lost access and is looking for a way back, which is
 *    the highest-urgency moment in this whole subject;
 *  - someone explicitly shopping for something other than SDA.
 *
 * Each is a page we can write better than a content farm, because the answers
 * come from having implemented the format and the recovery paths. That is the
 * only durable reason to rank for anything.
 */

export const mafile = {
	slug: 'what-is-a-mafile',
	parent: 'docs',
	updated: '2026-09-12',
	navTitle: 'maFiles',
	title: 'What is a .maFile?',
	description:
		'A maFile is your Steam authenticator in a file: shared secret, identity secret, revocation code. What is inside one, how it is encrypted, how to handle it.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'What is a .maFile?',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: s.updated,
		mainEntityOfPage: `${s.origin}/what-is-a-mafile`
	}),
	body: () => `
		<article>
			<h1>What is a <code>.maFile</code>?</h1>
			<p class="lede">
				A readable maFile is a small JSON file holding one Steam account's authenticator
				secrets and metadata; SDA can also store it as encrypted ciphertext. Anyone with the
				<code>shared_secret</code> from it can generate that account's Steam Guard
				codes; with the <code>identity_secret</code> <em>and</em> a valid Steam
				session they can also
				<a href="/approve-steam-confirmations-desktop">approve confirmations</a>. A
				maFile can carry session material too, which is why losing one is treated here
				as a credential exposure that needs prompt investigation.
			</p>

			<h2>What is inside one</h2>
			<dl class="defs">
				<dt><code>shared_secret</code></dt>
				<dd>
					The seed the login codes are generated from, stored as base64 text.
					Combined with the current thirty-second time window it produces the five
					characters you type into Steam. It does not expire with time: it stays valid
					until the authenticator is removed or replaced, which is the only thing that
					stops a copy of it working.
				</dd>
				<dt><code>identity_secret</code></dt>
				<dd>
					The seed used to sign trade and market confirmations. This is the dangerous
					one: together with a valid Steam session it is what lets software approve a
					trade on your behalf. It cannot raise or approve one on its own.
				</dd>
				<dt><code>revocation_code</code></dt>
				<dd>
					Short, in the form <code>R12345</code>. One of the ways to detach the
					authenticator yourself — the one that still works when the device is gone
					and no phone number is linked.
					<a href="https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31" rel="noopener">Valve also documents</a> removing it from
					inside the Steam Mobile App and transferring it to a new device with an SMS
					code if you no longer have the old one. Printed backup codes are emergency
					sign-in codes, not replacement revocation codes. <a href="/lost-authenticator">Losing it is a
					different kind of problem</a>.
				</dd>
				<dt><code>Session</code></dt>
				<dd>
					Login tokens for the account. These do expire, which is why an old maFile
					often still generates valid codes but cannot fetch confirmations until you
					sign in again.
				</dd>
				<dt><code>account_name</code>, <code>steamid</code>, <code>device_id</code></dt>
				<dd>
					Identifying fields. The SteamID is a 64-bit number — large enough that
					software handling it as a JavaScript <code>Number</code> can round the last
					digits. Keep SteamIDs as strings or losslessly parsed integers.
				</dd>
			</dl>

			<h2>Encrypted maFiles</h2>
			<p>
				SDA can encrypt them. Its
				<a href="https://github.com/Jessecar96/SteamDesktopAuthenticator/blob/master/Steam%20Desktop%20Authenticator/FileEncryptor.cs" rel="noopener">encryption implementation</a>
				and <a href="https://github.com/Jessecar96/SteamDesktopAuthenticator/blob/master/Steam%20Desktop%20Authenticator/Manifest.cs" rel="noopener">manifest code</a>
				show that the file's contents are base64 ciphertext
				and the parameters needed to decrypt — the salt and the initialisation vector —
				are stored separately in <code>manifest.json</code>, keyed by SteamID.
			</p>
			<p>
				The practical consequences catch people out regularly:
			</p>
			<ul>
				<li>
					<strong>Copying only the <code>.maFile</code> to a new machine leaves you
					with something you cannot open.</strong> You need the manifest too.
				</li>
				<li>
					An encrypted maFile, its matching manifest and the correct passphrase can
					make a usable backup. Without the passphrase there is no supported decryption
					shortcut; recovering account access through Steam is a separate process.
				</li>
				<li>
					Encryption protects the file at rest on your disk. It does not protect it
					from a program you willingly type the passphrase into.
				</li>
			</ul>

			<h2>How to handle one</h2>
			<ul>
				<li>
					<strong>Treat it as an account credential.</strong> A password change alone
					does not rotate a leaked shared secret. Replace the compromised authenticator
					through Steam and revoke other exposed credentials too.
				</li>
				<li>
					<strong>Do not send a readable maFile to a website, bot or support ticket.</strong>
					ODA support does not need it. Anyone you give it to gains access to those
					credentials. Encrypt backups before placing them on storage outside your control.
				</li>
				<li>
					<strong>Keep the revocation code somewhere the file is not.</strong> A backup
					that loses both at once has not backed anything up.
				</li>
				<li>
					<strong>Be careful which program opens it.</strong>
					<a href="/scam-clones">Counterfeit authenticators exist specifically to be
					handed maFiles.</a>
				</li>
			</ul>

			<h2>Related</h2>
			<ul class="plain next">
				<li><a href="/steam-desktop-authenticator">Steam Desktop Authenticator explained</a></li>
				<li><a href="/how-to-open-mafile">How to open one safely</a></li>
				<li><a href="/encrypted-mafile">Encrypted maFiles, and the manifest they need</a></li>
				<li><a href="/import-from-sda">Importing maFiles into this application</a></li>
				<li><a href="/lost-authenticator">If you have lost access to your authenticator</a></li>
			</ul>
		</article>`
};

export const lostAuthenticator = {
	slug: 'lost-authenticator',
	parent: 'docs',
	guide: true,
	sourced:
		'Recovery routes checked against <a href="https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31" rel="noopener">Valve\'s current Steam Guard guidance</a>; no undocumented bypass or support duration is asserted',
	// Edited 14 Aug (UTC) to drop the unsupported Support durations. Without
	// this the page inherits SITE.updated and advertises a stale lastmod.
	updated: '2026-09-12',
	navTitle: 'Lost access',
	title: 'Lost your Steam authenticator?',
	description:
		'Lost Steam authenticator? The order to try things in, with or without a revocation code, and what Steam Support can and cannot do for you.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Recover access after losing a Steam authenticator',
		publisher: { '@type': 'Organization', name: s.publisher },
		/*
		 * These steps must match the order the page actually recommends.
		 * They did not: the prose sends a reader to a linked phone and to backup
		 * codes before Steam Support, while this list jumped straight from "no
		 * revocation code" to Support — so an assistant quoting the structured
		 * data told people to give up two steps early.
		 */
		step: [
			{ '@type': 'HowToStep', name: 'Find any surviving copy of the secret' },
			{ '@type': 'HowToStep', name: 'Try Steam recovery with a linked phone number' },
			{ '@type': 'HowToStep', name: 'Try a printed Steam backup code' },
			{ '@type': 'HowToStep', name: 'Use the revocation code if you have it' },
			{ '@type': 'HowToStep', name: 'Contact Steam Support if none of those work' }
		]
	}),
	body: () => `
		<article class="guide">
			<h1>Lost your Steam authenticator?</h1>
			<p class="lede">
				A dead phone, a wiped machine, a deleted folder. This page is the order to try
				things in, based on what you still have. If you suspect theft rather than
				device loss, start with <a href="/scam-clones">the compromised-account steps</a>
				from a trusted device; restoring a leaked secret will not make it safe again.
			</p>

			<div class="callout callout-warn">
				<p>
					<strong>Account recovery happens through Steam's own site or app.</strong>
					A surviving local backup can also restore desktop authenticator data. No
					third-party tool can reconstruct a missing strong secret from an account name
					or bypass Steam's ownership checks. Do not upload maFiles or pay a stranger
					promising to unlock the account.
				</p>
			</div>

			<h2>1. Is there a copy of the secret anywhere?</h2>
			<p>
				Look for a backup containing the authenticator that is still active on Steam:
			</p>
			<ul>
				<li>A <code>.maFile</code> in an old SDA folder, or in a backup of one.</li>
				<li>
					The same folder on a machine you still have — an old laptop, a drive you kept.
					<a href="/what-is-a-mafile">Encrypted ones also need
					<code>manifest.json</code></a> and the original encryption passphrase.
				</li>
				<li>
					An ODA vault or per-account recovery file, with the passphrase that encrypted
					that file. See <a href="/docs">ODA's recovery-file instructions</a>.
				</li>
			</ul>
			<p>
				If you find one, import it somewhere you control and confirm it produces codes
				Steam accepts before you rely on it.
			</p>

			<p>
				<strong>Being signed in does not prove that a device holds the authenticator.</strong>
				Check the Steam Mobile app's Steam Guard screen for a working code or recovery
				code before signing out or reinstalling it. An existing session may help you
				access account settings, but it does not guarantee that Steam will let you
				replace the authenticator without further verification.
			</p>

			<h2>2. Is a phone number still linked to the account?</h2>
			<p>
				If you can receive messages at that number, you may not need the recovery code.
				<a href="https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31" rel="noopener">Valve's own instructions</a> say that when you
				no longer have access to your authenticator, you can choose
				<em>"I no longer have access to my authenticator"</em> at the sign-in
				confirmation and transfer it to a new device using an SMS code sent to that
				number. Follow the app's prompts; a linked number you cannot access is not
				an available SMS recovery route.
			</p>

			<h2>3. Do you have unused Steam backup codes?</h2>
			<p>
				A previously generated backup code can replace a generated Steam Guard code
				at sign-in. It does not replace the password, recover the authenticator secret
				or guarantee a transfer. Once signed in, follow Steam's account-recovery prompts.
			</p>

			<h2>4. Do you have the revocation code?</h2>
			<p>
				It looks like <code>R12345</code> and was shown when the authenticator was first
				added. With it, you can remove the authenticator yourself from Steam's help
				pages, then set a new one up. Use
				<a href="https://help.steampowered.com/" rel="noopener">Steam's help site</a>
				and follow the lost-authenticator prompts; the checks depend on your account.
			</p>
			<p>
				Removing the authenticator puts a hold on trading and the Market for a period.
				That is Steam's rule, not something a tool can shorten — anything advertising
				otherwise is a scam.
			</p>

			<h2>5. No recovery code and no phone number</h2>
			<p>
				Then it is Steam Support, through a help request to remove the authenticator.
				Follow the evidence requests in your ticket.
				<a href="https://help.steampowered.com/en/faqs/view/40A0-8B4B-B54B-C51A" rel="noopener">Steam's ownership guidance</a>
				covers historical payment evidence and activated product codes; account names, public
				profile details and guesses about creation dates do not establish ownership.
				Provide requested evidence only through the official help site. We cannot
				promise a response time or recovery outcome.
			</p>
			<p>
				Only Valve can change Steam's account-access decision. A third-party service
				cannot guarantee recovery, and handing it credentials creates another exposure.
			</p>

			<h2>Making sure this does not happen again</h2>
			<ul>
				<li>
					<strong>Write the revocation code on paper.</strong> Not in the same place as
					the maFile, and not only on the machine that holds it.
				</li>
				<li>
					<strong>Keep an offline copy of the secret</strong> somewhere encrypted that
					is not the computer you use every day.
				</li>
				<li>
					<strong>Test the backup once.</strong> An untested backup is a belief, not a
					backup.
				</li>
			</ul>
			<p>
				This is the reasoning behind two decisions in our own application: a recovery
				file is created during enrollment or transfer, and it is kept when an account
				is removed locally. Resolve any recovery-write warning before relying on that
				file, keep the passphrase used when it was created, and copy it off the daily-use disk.
			</p>

			<h2>Related</h2>
			<ul class="plain next">
				<li><a href="/steam-revocation-code">The revocation code, in detail</a></li>
				<li><a href="/what-is-a-mafile">What is inside a maFile</a></li>
				<li><a href="/security">How this application stores and protects secrets</a></li>
				<li><a href="/scam-clones">Why "recovery tools" are the wrong search</a></li>
			</ul>
		</article>`
};

export const alternatives = {
	slug: 'alternatives',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`Compared against <a href="https://help.steampowered.com/en/faqs/view/6891-E071-C9D9-0134" rel="noopener">Valve's Steam Guard guidance</a> and <a href="${originalSdaRepo(s)}" rel="noopener">SDA's official repository</a>`,
	updated: '2026-09-12',
	navTitle: 'Alternatives',
	title: 'Steam authenticator alternatives to SDA, compared',
	description:
		'Steam authenticator alternatives compared honestly: Steam Mobile, SDA and Open Desktop Authenticator — including where the right answer is not ours.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Steam authenticator options compared',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: s.updated,
		mainEntityOfPage: `${s.origin}/alternatives`
	}),
	body: (s) => `
		<article>
			<h1>Steam authenticator alternatives to SDA, compared</h1>
			<p class="lede">
				Three realistic options, and the honest case for each — including the one where
				the answer is not us. We would rather you chose correctly than chose ours.
			</p>

			<h2>Steam Mobile — the default, and the right answer for most people</h2>
			<p>
				<a href="https://help.steampowered.com/en/faqs/view/6891-E071-C9D9-0134" rel="noopener">Valve's own app</a>.
				It is maintained by the people who run the service, it comes
				from the stores linked by <a href="https://store.steampowered.com/mobile" rel="noopener">Valve's mobile page</a>.
				Keeping the authenticator on a separate phone reduces the chance that malware
				on the trading PC compromises both factors. Phone loss is recoverable when
				you retain a recovery route; plan that before changing devices.
			</p>
			<p>
				<strong>Choose it if:</strong> you are not confirming listings in bulk, you are
				not sure what a maFile is, or you would rather not be responsible for storing a
				maFile. It is our recommended default; you still need to secure the phone,
				review approvals and preserve recovery access.
			</p>
			<p>
				<strong>Trade-offs:</strong> using a separate device can interrupt a desktop
				workflow. The app supports QR sign-in and approval prompts as well as generated
				codes, so manual retyping is optional. A lost or broken phone still requires
				the recovery preparations described above.
			</p>

			<h2>Steam Desktop Authenticator — no longer supported</h2>
			<p>
				The original SDA is a longstanding community desktop implementation. Its
				<a href="${originalSdaRepo(s)}" rel="noopener">README says it is no longer supported</a>,
				will receive no more updates, and recommends Steam's official mobile app.
			</p>
			<p>
				<strong>If you already use it:</strong> back up the maFiles, matching manifest
				and passphrase, preserve recovery access, and plan a move to a supported option.
				The original repository remains the reference for identifying genuine SDA;
				we do not recommend starting with unsupported software.
			</p>
			<p>
				<strong>Against it:</strong> there is no promised maintenance when Steam or
				security requirements change. The project's own warning about
				<a href="/scam-clones">counterfeit downloads</a> adds a separate acquisition risk.
			</p>

			<h2>Open Desktop Authenticator — this project</h2>
			<p>
				An independent implementation published by the team writing this comparison.
				Public source, builds in public CI, no updater inside ODA, and
				<a href="/security">a documented security model that includes what it cannot
				protect you from</a>. Every release publishes checksums and build provenance.
				${
					releaseGaps(s).length
						? `${countPhrase(releaseGaps(s).length)} not yet done:
							${sentenceList(releaseGaps(s, 'noun'))} —
							<a href="/download">the download page says where each one stands</a>.`
						: `Nothing on that list is still outstanding —
							<a href="/download">the download page shows where each one stands</a>.`
				}
			</p>
			<p>
				<strong>Choose it if:</strong> you want a desktop authenticator and you want to
				be able to check what it does — or have somebody else check.
			</p>
			<p>
				<strong>Against it, plainly:</strong> it is new. Version 1.0 was published on
				${s.releasedOn}, with no years of community scrutiny behind it and no track
				record comparable to a mature project. Source availability and provenance do
				not substitute for an independent security audit. Desktop custody puts the
				second factor on the same computer you may use to trade; use Valve's mobile
				app if you do not need that trade-off.
			</p>

			<h2>The comparison that actually matters</h2>
			<p>
				Not the feature list — the failure modes. Ask of any authenticator, including
				ours:
			</p>
			<ol>
				<li><strong>Can I verify that what I ran is what was published?</strong></li>
				<li><strong>Where does the secret live, and who else can read it?</strong></li>
				<li><strong>What happens when I lose the device?</strong> <a href="/lost-authenticator">Answer that before you need it.</a></li>
				<li><strong>Who controls updates, and how are they authenticated?</strong> Every update changes the code entrusted with the secret; delaying security fixes also carries risk.</li>
				<li><strong>What can it approve without asking me?</strong></li>
			</ol>
			<p>
				A tool that answers those five well is a tool worth using, whoever wrote it.
			</p>

			<h2>Related</h2>
			<ul class="plain next">
				<li><a href="/steam-mobile-vs-desktop-authenticator">Mobile app or desktop: an honest comparison</a></li>
				<li><a href="/steam-desktop-authenticator">Steam Desktop Authenticator explained</a></li>
				<li><a href="/verify">How to verify any download</a></li>
				<li><a href="/download">Our release status</a></li>
			</ul>
		</article>`
};
