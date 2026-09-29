/**
 * The second batch of question-answering pages.
 *
 * Same selection rule as answers.mjs: distinct intents, each answerable better
 * here than by a content farm because the answer comes from having implemented
 * the thing.
 *
 * **Every durational and procedural claim here is cited to Valve.** The first
 * draft of these pages asserted a fifteen-minute rate limit, described a "My
 * Authenticator" screen that no longer exists under that name, and hid the
 * difference between a two-day and a fifteen-day restriction behind the phrase
 * "a period". None of that was checked; it was written in the confident
 * register of the rest of the site, which is exactly what makes it dangerous —
 * a reader following a recovery procedure has no way to tell a verified
 * instruction from a plausible one. Where Valve states a number, it is quoted
 * and linked. Where Valve does not, this says so instead of guessing.
 */

import { timeWindowDiagram, tradeHoldDiagram, manifestDiagram } from '../diagrams.mjs';

/** Valve's own pages, cited wherever this makes a claim about Steam's behaviour. */
const VALVE = {
	guard: 'https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31',
	restrictions: 'https://help.steampowered.com/en/faqs/view/451E-96B3-D194-50FC',
	transfer: 'https://help.steampowered.com/en/faqs/view/29A9-9EEE-09F0-75F9',
	emailCode: 'https://help.steampowered.com/en/wizard/HelpWithSteamGuardCode'
};

/** SDA's own encryption implementation — these are source-level claims. */
const SDA_ENCRYPTOR =
	'https://github.com/Jessecar96/SteamDesktopAuthenticator/blob/master/Steam%20Desktop%20Authenticator/FileEncryptor.cs';
const SDA_MANIFEST =
	'https://github.com/Jessecar96/SteamDesktopAuthenticator/blob/master/Steam%20Desktop%20Authenticator/Manifest.cs';

export const codeNotWorking = {
	slug: 'steam-guard-code-not-working',
	parent: 'docs',
	guide: true,
	sourced: `Clock and account checks from <a href="${VALVE.guard}" rel="noopener">Valve's Steam Guard troubleshooting</a>; email delivery from <a href="${VALVE.emailCode}" rel="noopener">Valve's code-help page</a>; durations from <a href="${VALVE.restrictions}" rel="noopener">Valve's restriction guidance</a>`,
	navTitle: 'Codes not working',
	title: 'Steam Guard code not working? Check the clock',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Steam Guard codes depend on time and the current authenticator secret. Check clock sync, the account, expired codes and replaced authenticators.',
	// Structured answers must match the visible article. Markup does not promise
	// a search-engine result treatment.
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'TechArticle',
				headline: 'Steam Guard code not working? Check the clock',
				author: { '@type': 'Organization', name: s.publisher },
				publisher: { '@type': 'Organization', name: s.publisher },
				dateModified: '2026-09-30',
				mainEntityOfPage: `${s.origin}/steam-guard-code-not-working`
			},
			{
				'@type': 'FAQPage',
				mainEntity: [
					{
						'@type': 'Question',
						name: 'Why is Steam saying my Steam Guard code is wrong?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Steam Guard codes change every thirty seconds. An inaccurate clock can generate codes outside the time range Steam accepts. Valve recommends checking device time and making sure you selected the correct account.'
						}
					},
					{
						'@type': 'Question',
						name: 'How do I fix the time so Steam Guard codes work?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'On Windows, open Settings, Time and language, Date and time, enable Set time automatically and press Sync now. Check the displayed time zone; automatic time zone is optional. On a phone, enable automatic date and time, then try a fresh Steam Guard code.'
						}
					},
					{
						'@type': 'Question',
						name: 'My clock is correct and codes are still refused. What else?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Check the account, use a fresh code that has not already been accepted, and pause if Steam reports too many attempts. If Steam replaced the authenticator, an old copy of its secret cannot authenticate the account; importing an unchanged backup alone does not replace it.'
						}
					}
				]
			}
		]
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Steam Guard code not working? Check the clock</h1>
			<p class="lede">
				Valve recommends checking the device's time and the selected account when
				authenticator codes fail. Start with those checks, then distinguish an expired
				code, a replaced authenticator and a sign-in problem. Removing the authenticator
				is not a routine troubleshooting step.
			</p>

			<div class="answer">
				<span class="eyebrow">Try these checks in order</span>
				<ol>
					<li><strong>Check which code Steam wants.</strong> A generated authenticator code,
						an email code and a phone-code message are different. Clock sync fixes only the generated-code case.</li>
					<li><strong>Match the login account.</strong> Check the account name above the code;
						a Steam profile's display name can differ from its login name.</li>
					<li><strong>Sync the device time, then use a fresh code.</strong> Wait for the next
						code if the current one was already accepted for another sign-in.</li>
					<li><strong>If Steam reports too many attempts, stop retrying.</strong> Follow its
						message. If you recently moved or replaced the authenticator, use its current copy.</li>
				</ol>
			</div>

			<h2>How do I fix the time on Windows?</h2>
			<ol class="steps">
				<li>
					<strong>Open the date and time settings</strong>
					<p>Settings → Time &amp; language → Date &amp; time.</p>
				</li>
				<li>
					<strong>Enable automatic time</strong>
					<p>
						Turn on <em>Set time automatically</em>. Check that the displayed time
						zone matches your location; you may choose it manually if automatic
						time zone is unavailable.
					</p>
				</li>
				<li>
					<strong>Press Sync now</strong>
					<p>
						If it fails, check the connection and try again. Then generate a fresh
						code — an old one on screen was computed before the fix.
					</p>
				</li>
			</ol>
			<p class="hint">
				<a href="https://support.microsoft.com/en-us/windows/experience/personalization/set-time-date-and-time-zone-settings-in-windows"
				rel="noopener">Microsoft's time-settings guide</a> covers automatic and
				manual time zones. If sync is unavailable on a managed PC, contact its administrator.
			</p>
			<p class="pull">
				Codes use elapsed time from a fixed UTC reference, not the displayed time
				zone. Changing only the zone does not change that timestamp. Manually
				setting the clock to a local time while the wrong zone is selected can,
				however, leave the underlying timestamp wrong.
			</p>

			<h2>How do I fix the time on a phone?</h2>
			<p>
				<strong>Android:</strong> search Settings for <em>Date &amp; time</em> and
				enable automatic or network-provided time; menu names vary by manufacturer.
				<strong>iPhone:</strong> Settings → General → Date &amp; Time → Set Automatically
				(or Set Time Automatically, depending on the version). See
				<a href="https://support.apple.com/101619" rel="noopener">Apple's time-settings help</a>.
				Reopen Steam and try the next code. Managed-device settings may require an
				administrator to enable time synchronisation.
			</p>

			<h2>My clock is right and codes are still refused. What else?</h2>
			<dl class="defs">
				<dt>The wrong account</dt>
				<dd>
					Check the account name shown above the code against the Steam login name.
					A profile's display name can differ. Valve specifically recommends this
					check for people with multiple accounts.
				</dd>
				<dt>The code is old or has already been used</dt>
				<dd>
					Wait for a fresh code and enter it promptly. Do not reuse a code that
					already completed another sign-in: Valve describes the codes as single-use.
				</dd>
				<dt>Too many attempts</dt>
				<dd>
					After a run of failures Steam may temporarily rate-limit repeated attempts for a while.
					Valve does not publish how long, so the only sound advice is to stop
					retrying and come back later rather than to guess at a number.
				</dd>
				<dt>The authenticator was moved or re-added since</dt>
				<dd>
					If Steam replaced the authenticator, an old phone or maFile can still
					display codes made from the previous secret, but those codes no longer
					authenticate this account. Use the current authenticator. Simply importing
					an unchanged backup into another desktop tool does not itself replace
					anything on Steam. See <a href="/what-is-a-mafile">what a maFile contains</a>.
				</dd>
			</dl>

			<h2>Related problems people hit at the same time</h2>
			<p>
				These are different failures that arrive looking identical, so they are worth
				ruling out before you conclude the authenticator is broken.
			</p>

			<h3>Steam says "invalid credentials" rather than a bad code</h3>
			<p>
				A general sign-in error does not isolate the authenticator as the cause.
				Check the login name, keyboard layout and password — and before using a
				password reset purely as a troubleshooting experiment, know what it
				costs: <a href="${VALVE.restrictions}" rel="noopener">resetting a forgotten
				password restricts trading and the Market for 5 days</a>, or 30 if the account
				has been inactive for more than two months. <em>Changing</em> a password you
				still know, from Steam's settings, carries no such restriction. If you
				suspect someone else has access, secure the account promptly regardless of
				the trading restriction.
			</p>

			<h3>The code screen never appears, or no code arrives by email</h3>
			<p>
				In Steam Mobile, open Steam Guard and choose <strong>Show Steam Guard code</strong>.
				If Steam is asking for an email code instead, check the address on the account
				and its spam folder. For an
				<strong>emailed</strong> code,
				<a href="${VALVE.emailCode}" rel="noopener">Valve's guidance is to allow up
				to thirty minutes and then sign in again to request another</a>. For an
				<strong>SMS</strong> code, avoid repeated requests: <a href="${VALVE.guard}"
				rel="noopener">Valve says delivery can stop after too many messages and
				recommends waiting a few minutes to an hour</a>. Login-attempt rate limits
				and message-delivery limits are different problems.
			</p>

			<h3>Codes work for one account but not another</h3>
			<p>
				If both codes come from the same app and clock, a general clock problem is
				less likely. First check the correct account is selected. If the account is
				right, the authenticator for that one may have been moved, replaced or
				enrolled again with a different secret, which leaves your copy generating
				codes for a secret Steam has replaced.
			</p>

			<h3>Codes worked yesterday and stopped today with no changes</h3>
			<p>
				Possible causes include clock drift, a clock correction after sleep, a
				temporary Steam error or an authenticator replaced elsewhere. Follow the
				checks above and read any Steam security emails. Unexpected account changes
				are a reason to use <a href="https://help.steampowered.com/" rel="noopener">Steam
				Support's account-recovery flow</a> from a trusted device.
			</p>

			<h2>Why does a wrong clock break the code?</h2>
			<p>
				A Steam Guard code is not random. It is computed from two ingredients: a
				secret your authenticator holds, and the current time, rounded to a
				thirty-second window. Steam runs the same computation on its side and checks
				that the answers match. Enough clock skew can put your code outside the
				range Steam accepts. Thirty seconds describes the generation interval;
				it is not a guarantee that Steam rejects a code at the exact instant the
				countdown reaches zero.
			</p>
			<p>
				<a href="${VALVE.guard}" rel="noopener">Valve's troubleshooting starts with
				checking the phone's time</a>. Desktop implementations, including ours,
				also generate codes from a shared secret and a Unix timestamp.
			</p>

${timeWindowDiagram()}

			<h2>Can a desktop authenticator avoid this entirely?</h2>
			<p>
				${s.name} queries Steam's time service and applies the measured difference
				to the local clock. It refreshes that measurement and detects clock jumps.
				This helps with drift, but requires a successful network request; an offline
				PC or unavailable proxy can prevent it. If the app says the clock has not
				been checked against Steam, correct Windows time, check the connection or
				configured proxy, and allow the app to retry. Time correction cannot fix
				a wrong account or a replaced authenticator secret.
			</p>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/lost-authenticator"><b>Lost the authenticator entirely</b>
					<span>The recovery routes in order, and what each one costs in days.</span></a>
				</li>
				<li>
					<a href="/what-is-a-mafile"><b>What is inside a maFile</b>
					<span>Every field explained, and which ones are the account itself.</span></a>
				</li>
				<li>
					<a href="/steam-desktop-authenticator"><b>Steam Desktop Authenticator</b>
					<span>What SDA is, and why searching for the download is the risky part.</span></a>
				</li>
			</ul>
		</article>`
};

export const moveAuthenticator = {
	slug: 'move-steam-authenticator-new-phone',
	parent: 'docs',
	guide: true,
	sourced: `Steps checked against <a href="${VALVE.transfer}" rel="noopener">Valve's transfer walkthrough</a>; durations against its <a href="${VALVE.guard}" rel="noopener">Guard</a> and <a href="${VALVE.restrictions}" rel="noopener">restriction</a> guidance`,
	navTitle: 'New phone',
	title: 'Move your Steam authenticator to a new phone: 2 days, not 15',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		"Move Steam Guard to a new phone: Valve's 2-day restriction, SMS requirements, saving the recovery code, and options when the old phone is gone.",
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Move a Steam authenticator to a new phone',
		publisher: { '@type': 'Organization', name: s.publisher },
		step: [
			{ '@type': 'HowToStep', name: 'Install Steam Mobile on the new phone and sign in' },
			{ '@type': 'HowToStep', name: 'Choose Move Authenticator on the Steam Guard page' },
			{ '@type': 'HowToStep', name: 'Enter the code sent to the linked phone number' },
			{ '@type': 'HowToStep', name: 'Save the new recovery code and check the new authenticator' }
		]
	}),
	body: (s) => `
		<article class="guide">
			<h1>Move your Steam authenticator to a new phone</h1>
			<p class="lede">
				Use Steam's transfer option when changing phones. Valve documents a two-day
				trade and Market restriction after transfer; removing the authenticator
				instead triggers fifteen days. Keep the old authenticator and linked phone
				number accessible until the new setup is checked.
			</p>

			<div class="callout callout-warn">
				<p>
					<strong>Every path below runs through Steam's own mobile app or Steam's
					official help site, and nothing else.</strong> No third-party service is
					needed for any of them — so never give your password, an SMS code or your
					recovery code to something claiming it has to perform the transfer for
					you.
				</p>
			</div>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					Install Steam Mobile on the new phone, sign in, and choose
					<strong>Move Authenticator</strong>. Valve's walkthrough asks for a code
					sent to the linked phone number, then shows a new recovery code to save.
				</p>
				<p>
					Removing the authenticator and enrolling again instead costs
					<strong>fifteen days</strong>, compared with the transfer's two-day
					restriction. Other existing restrictions may still apply after either timer ends.
				</p>
			</div>

			<h2>How long are the trade restrictions after moving or replacing it?</h2>
			<ul class="stat-strip">
				<li>
					<b>2<small> days</small></b>
					<span>Valve's transfer flow, including its SMS route when the old authenticator is unavailable.</span>
				</li>
				<li class="cost">
					<b>15<small> days</small></b>
					<span>Removing the authenticator triggers this restriction even if you re-enrol immediately.</span>
				</li>
			</ul>

			<div class="tbl">
				<table>
					<thead>
						<tr><th scope="col">What you do</th><th scope="col">What it costs</th></tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row"><strong>Transfer</strong> to the new phone (Move Authenticator)</th>
							<td><span class="num">2 days</span><br>of trade and Market restriction</td>
						</tr>
						<tr>
							<th scope="row"><strong>Remove</strong> the authenticator, then add it again</th>
							<td><span class="num warn">15 days</span><br>unable to trade or use the Market</td>
						</tr>
						<tr>
							<th scope="row">Standard trades in the first <strong>7 days</strong> after adding one; CS2 trades excluded</th>
							<td><span class="num warn">up to 15 days</span><br>held on those trades specifically</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="hint">
				Durations quoted from Valve's
				<a href="${VALVE.guard}" rel="noopener">Steam Guard Mobile Authenticator FAQ</a>
				and <a href="${VALVE.restrictions}" rel="noopener">Trading and Market
				Restrictions</a>. Steam Support cannot lift any of them, and nothing legitimate
				shortens them.
			</p>

${tradeHoldDiagram()}

			<h2>1. You still have the old authenticator — transfer it</h2>
			<p>
				This is Valve's documented two-day path. Install the
				Steam Mobile app on the new phone and sign in; confirm that sign-in using the
				authenticator you still have. Then on the new device open the
				<strong>Steam Guard</strong> page, choose <strong>Move Authenticator</strong>,
				and enter the code Steam texts you.
				<a href="${VALVE.transfer}" rel="noopener">Valve's walkthrough is here.</a>
			</p>
			<p>
				This walkthrough also requires access to the linked phone number. After
				entering the code, <strong>write down the new recovery code</strong>. Check
				that the new app generates a working code before wiping or giving away the
				old phone. Uninstalling an app is different from choosing Remove Authenticator;
				do not remove the account's authenticator after completing the transfer.
			</p>

			<h2>2. Old phone gone, number still yours</h2>
			<p>
				Sign in on the new phone. When asked to confirm the sign-in, choose
				<strong>"I no longer have access to my authenticator"</strong> and follow the
				steps — Steam texts a code to the number on the account. This is still a
				transfer, so it is still the two-day restriction rather than fifteen.
			</p>

			<h2>3. No phone and no number — the recovery code</h2>
			<p>
				The <a href="/steam-revocation-code">recovery code</a> removes the
				authenticator without needing the old device. You use it through Steam's
				browser-based recovery process, after signing in or otherwise proving the
				account is yours — the code is one half of that, not the whole of it. This is
				the fifteen-day path, because removing an authenticator is what it is, but it
				works when nothing else will.
			</p>

			<h2>4. None of the above — Steam Support</h2>
			<p>
				A help request to remove the authenticator, with proof the account is yours:
				the evidence requested by the official recovery wizard. Expect it to take
				time: Steam has to satisfy itself that the account is yours before detaching
				its second factor — the same check that stops somebody else asking on your
				behalf.
				<a href="/lost-authenticator">The full recovery order is here</a>.
			</p>

			<h2>I am getting a new phone soon. What should I do now?</h2>
			<p>
				If you know a new phone is coming and you are <em>keeping the number</em>,
				you can transfer once the phone arrives. Confirm you can still receive Steam's
				messages and keep your recovery code accessible. If you are <em>losing the
				number too</em>, review Steam's <strong>Account Details → Manage your phone
				number</strong> and recovery options while you still have access. Do not assume
				a working old app alone bypasses the phone-code step. Valve's fallback removal
				instructions carry the 15-day restriction.
			</p>

			<h2>Can I stop doing this every time I change phone?</h2>
			<p>
				There is a second way to hold a Steam authenticator: in a file on a machine
				you control, rather than inside one phone. That is what
				<a href="/steam-desktop-authenticator">desktop authenticators</a> do — the
				secret lives in a <a href="/what-is-a-mafile">maFile</a> you can back up
				yourself. It is a real trade-off rather than a free win: a file can be stolen
				in ways a phone cannot, which is why ours keeps it
				<a href="/security">encrypted locally</a>. Confirmations and transfers still
				need a Steam connection. Steam allows only one
				authenticator on an account at a time, so this is a move rather than an
				addition — <a href="/steam-mobile-vs-desktop-authenticator">the comparison is
				here</a>.
			</p>
			<div class="callout callout-warn">
				<p>
					<strong>Which restriction you get depends on the route, not on the
					device.</strong> Steam's two-day figure is documented for its own
					<em>Move Authenticator</em> flow. A tool that instead removes the
					authenticator and enrols a new one takes the fifteen-day path, and plenty
					of desktop tools do exactly that.
				</p>
				<p>
					${s.short} uses the transfer, not remove-and-add, and we have run it against
					a real account and watched the two-day restriction apply —
					<a href="/move-steam-authenticator-to-pc">the details are here</a>. For any
					other desktop tool, read its documented migration procedure and Steam's
					warnings before starting; do not experiment with authenticator removal.
				</p>
			</div>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/move-steam-authenticator-to-pc"><b>Moving it to a PC instead</b>
					<span>ODA's desktop transfer steps and the limits of its recorded test.</span></a>
				</li>
				<li>
					<a href="/steam-revocation-code"><b>Your recovery code</b>
					<span>The R-code that detaches an authenticator, and where to find it.</span></a>
				</li>
				<li>
					<a href="/steam-guard-code-not-working"><b>Codes refused after the move</b>
					<span>Check the clock, the selected account, and whether the old secret was
					replaced.</span></a>
				</li>
				<li>
					<a href="/lost-authenticator"><b>Lost access entirely</b>
					<span>What to do when neither the old phone nor the number is available.</span></a>
				</li>
			</ul>
		</article>`
};

export const revocationCode = {
	slug: 'steam-revocation-code',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`Phone recovery steps checked against <a href="${VALVE.guard}" rel="noopener">Valve's Steam Guard guidance</a>; ODA recovery storage against its <a href="${s.repo}/blob/main/src/main/vault/recovery.ts" rel="noopener">recovery-file implementation</a>`,
	navTitle: 'Recovery code',
	title: 'Steam revocation code: find it or choose a recovery route',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Find your Steam recovery or revocation code on a working phone or in a retained backup. Choose a recovery route when the code or device is missing.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam revocation code: find it or choose a recovery route',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/steam-revocation-code`
	}),
	body: (s) => `
		<article class="guide">
			<h1>Steam revocation code: find it or choose a recovery route</h1>
			<p class="lede">Valve calls it a <strong>recovery code</strong>; SDA files may store it as
				<code>revocation_code</code>. It helps remove a lost authenticator through Steam's
				recovery process. It is different from the changing login code and the one-use backup login codes.</p>
			<div class="answer">
				<span class="eyebrow">Start with what you still have</span>
				<ul>
					<li><strong>The phone authenticator still works:</strong> open Steam Guard,
						tap the gear, then <strong>Recovery Code</strong>. Record it somewhere accessible
						without that phone. You do not need to remove the authenticator to view it.</li>
					<li><strong>You retained a code or desktop backup:</strong> check that it belongs
						to the current authenticator. A maFile may contain <code>revocation_code</code>;
						an encrypted file must be opened with its matching metadata and passphrase first.</li>
					<li><strong>You have neither:</strong> if you can receive messages at Steam's linked
						number, try its <a href="/move-steam-authenticator-new-phone">phone-transfer recovery route</a>.
						Otherwise use <a href="https://help.steampowered.com/" rel="noopener">Steam Support</a>
						and follow its account-ownership checks.</li>
				</ul>
			</div>

			<p class="hint">The phone path above follows <a href="${VALVE.guard}" rel="noopener">Valve's recovery-code instructions</a>.</p>

<h2>Checking a retained backup</h2>
			<p>For SDA, work on a copy of the entire maFiles folder. An unencrypted maFile can be read
				in a trusted local text editor; search for <code>revocation_code</code>. Not all exports
				contain it, and a file from an authenticator that was replaced may hold an obsolete code.
				See <a href="/how-to-open-mafile">read, decrypt or import a maFile</a> for the right branch.</p>
			<p>For ${s.short}, preserve the vault, recovery files and their passphrase. If the account
				is still accessible in the app, use its recovery-code controls rather than editing
				encrypted storage. A readable code in an old backup is not proof it still matches Steam.
				Do not upload the file or code to a decoder, chat or support form, including ours.</p>

			<h2>Using Steam's recovery-code route</h2>
			<ol class="steps">
				<li><strong>Open Steam Support yourself.</strong><p>Choose <strong>Help, I can't sign in</strong>,
					then the lost or deleted mobile-authenticator option. Identify the account and
					complete the checks Steam offers for your situation.</p></li>
				<li><strong>Choose the recovery-code option when offered.</strong><p>Enter the code only in
					Steam's own form. Read which account action you are confirming; the code does not
					skip the other ownership or access checks.</p></li>
				<li><strong>Restore protection after recovery.</strong><p>If you removed the authenticator,
					set up the replacement and save its new recovery code. Keep a desktop backup separate
					from the machine and retain the passphrase needed to open it.</p></li>
			</ol>
			<p class="callout callout-warn"><strong>Removal has a cost:</strong> Valve applies a
				<a href="${VALVE.restrictions}" rel="noopener">15-day trade and Market restriction</a>.
				If the task is moving to another phone and Steam offers a transfer, review that option
				first. A recovery code is not a way to bypass an existing restriction.</p>

			<h2>What the code can and cannot do</h2>
			<dl class="defs">
				<dt>Recovery code versus backup login code</dt><dd>The recovery code is used for
					authenticator removal. A backup login code is a one-use replacement for a login code.
					Valve documents generating backup codes under Account Details → Manage Steam Guard.</dd>
				<dt>A new authenticator needs a new recovery code</dt><dd>After replacement or re-enrolment,
					retain the newly issued code. A copy of the previous one does not recover the new authenticator.</dd>
				<dt>The code is sensitive, but not a normal sign-in credential</dt><dd>Steam's recovery
					process also checks access or ownership. A leaked code still compromises a recovery
					secret; review account security rather than assuming it is harmless.</dd>
				<dt>No code and no usable device or backup</dt><dd>Check the linked-number route before
					using Steam Support. A third-party tool cannot reconstruct missing authenticator
					secrets from an account name. The <a href="/lost-authenticator">lost-access guide</a>
					keeps the recovery options in order.</dd>
			</dl>
			<h2>Preserve the next code</h2>
			<p>${s.name} asks you to record the recovery code and acknowledge it during setup.
				Complete that step and any encrypted recovery-backup retry. During a transfer,
				Steam has already replaced the authenticator when the new code is shown: saving it
				protects an account change that has already happened. Keep the code and backup
				accessible if the PC is lost, and update your records after replacing an authenticator.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/lost-authenticator"><b>Lost access, in recovery order</b><span>Working backups, the linked number and Steam Support.</span></a></li>
				<li><a href="/move-steam-authenticator-new-phone"><b>Moving to a new phone</b><span>Check the transfer option before removing the current authenticator.</span></a></li>
				<li><a href="/what-is-a-mafile"><b>What else a maFile holds</b><span>A reference for the fields beside the recovery code.</span></a></li>
			</ul>
		</article>`
};
export const encryptedMafile = {
	slug: 'encrypted-mafile',
	parent: 'docs',
	guide: true,
	// Valve documents none of this. The format and the crypto are SDA's.
	sourced: `Encryption, salt and IV handling checked against <a href="${SDA_ENCRYPTOR}" rel="noopener">SDA's FileEncryptor source</a>; manifest entries and file mapping against <a href="${SDA_MANIFEST}" rel="noopener">SDA's Manifest source</a>`,
	navTitle: 'Encrypted maFiles',
	title: 'Encrypted maFiles: the password, and the manifest',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'An encrypted SDA maFile needs the passphrase set in SDA plus the manifest.json beside it. Why copying the file alone fails, and what to try next.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Encrypted maFiles: the password, and the manifest',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/encrypted-mafile`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Encrypted maFiles: the password, and the manifest</h1>
			<p class="lede">
				You have a <code>.maFile</code>, something is asking for a password, and
				nothing you type works. Start by checking which password it needs, and whether
				you kept the matching encryption information with the file.
			</p>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					An encrypted maFile wants <strong>the passphrase you set in SDA</strong> —
					not your Steam password, and not your email password. It also needs the
					<code>manifest.json</code> that was sitting beside it, because the salt and
					initialisation vector live in that file rather than in the maFile.
				</p>
				<p>
					A lone encrypted <code>.maFile</code> is an incomplete backup unless you
					also preserved its matching salt and IV elsewhere.
					<strong>Copy the whole <code>maFiles</code> folder.</strong>
				</p>
			</div>

			<h2>Which password does an encrypted maFile want?</h2>
			<p>
				<strong>The encryption passphrase set inside SDA, on the machine that made
				the file.</strong> Not your Steam password, not your Windows password, not
				the email password. When SDA's encryption was switched on it asked for a
				passphrase of its own — that is the one. If somebody else set the machine up,
				it may be theirs rather than yours.
			</p>

			<h2>Why won't my encrypted maFile open on another machine?</h2>
			<p>
				SDA does not keep everything needed for decryption inside the maFile itself.
				<code>manifest.json</code>, in the same folder, maps each filename to
				the salt used to derive the encryption key from your passphrase and the
				initialisation vector used by AES-CBC. The practical rule:
			</p>
			<div class="callout">
				<p>
					<strong>Decryption needs the matching salt and IV as well as the
					passphrase.</strong> SDA stores those values in <code>manifest.json</code>.
					Copy the whole <code>maFiles</code> folder together, preserving filenames.
				</p>
			</div>
${manifestDiagram()}
			<p class="pull">
				This is a common way people lock themselves out
				<em>while believing they made a backup</em>: the <code>.maFile</code> went to
				the USB stick, the manifest stayed behind, and the machine was wiped.
			</p>
			<p>If that is where you are, work through these in order before assuming it is lost:</p>
			<ol class="steps">
				<li>
					<strong>Look for the original folder, not the file</strong>
					<p>
						Old drive, old user profile, an SDA folder in a previous Windows
						installation, a full-disk image. You need the <code>manifest.json</code>
						that lived beside this maFile.
					</p>
				</li>
				<li>
					<strong>Check every other backup you made</strong>
					<p>
						Cloud sync, an old external disk, a zip of the whole SDA directory. A
						complete backup of the <code>maFiles</code> folder from the same SDA
						installation should include the matching manifest; a backup containing
						only the individual <code>.maFile</code> will not.
					</p>
				</li>
				<li>
					<strong>If the matching encryption data is gone, use account recovery</strong>
					<p>
						Ordinary importers cannot decrypt without the matching salt and IV.
						They could survive in another backup even if the original manifest is
						gone. Do not upload the files to a website promising recovery. Move to
						<a href="/lost-authenticator">account recovery</a> instead — that path
						still works without the file.
					</p>
				</li>
			</ol>

			<h2>Why does it only say the passphrase is wrong?</h2>
			<p>
				SDA derives a key from your passphrase with PBKDF2 and encrypts with
				<strong>AES-256-CBC</strong> — a mode with no authentication tag. That
				matters: an authenticated cipher would at least detect reliably that
				<em>something</em> was wrong, though not which thing. Without one you get a
				padding error, or occasionally plausible-looking rubbish, and those look
				identical whether the real problem is
			</p>
			<ul>
				<li>a wrong passphrase,</li>
				<li>the wrong salt or IV — usually a mismatched <code>manifest.json</code>,</li>
				<li>or a corrupted file.</li>
			</ul>
			<p>
				<a href="/import-from-sda">${s.short}'s importer</a> checks whether the
				decrypted result parses as a maFile and checks manifest fields. That can
				catch missing or malformed data, but a generic decryption error alone does
				not prove which input is wrong. Valid JSON is also not cryptographic proof
				that a file was never modified.
			</p>

			<h2>Other things that look like a passphrase problem</h2>

			<h3>How do I tell whether a maFile is encrypted at all?</h3>
			<p>
				Open a copy in a text editor. Readable field names like
				<code>shared_secret</code> mean it is not encrypted and nothing is being asked
				of you. Base64 text, possibly split across lines, is consistent with SDA
				encryption but does not by itself prove the file is intact.
				<a href="/how-to-open-mafile">The full walkthrough is here.</a>
			</p>

			<h3>I have the manifest but it still will not open</h3>
			<p>
				Match the entry's <code>filename</code> to the original maFile name, and
				check that <code>encryption_salt</code> and <code>encryption_iv</code> came
				from the same backup. The SteamID alone is insufficient: SDA can generate
				new salt and IV values when it rewrites or re-encrypts an account. Restore
				a complete matching snapshot rather than mixing files from different dates.
			</p>

			<h3>Can I decrypt it without SDA?</h3>
			<p>
				Yes, but not by any tool that merely "supports AES". It has to implement
				<a href="${SDA_ENCRYPTOR}" rel="noopener">SDA's exact scheme</a> — the same
				PBKDF2 parameters, a 32-byte key, CBC mode, PKCS#7 padding, and the manifest
				mapping that tells it which salt and IV belong to which account. Ours does.
				That specificity is also the reason to be careful which tool you hand it to.
			</p>

			<h2>What if I have lost the passphrase completely?</h2>
			<p>
				There is no password-reset service for SDA encryption. Recovery depends on
				finding the passphrase, another usable copy, or guessing the correct passphrase;
				a strong unknown passphrase makes guessing impractical. Check your password
				manager, old records, keyboard layout and remembered variants locally. The
				Steam account can still have other recovery routes:
			</p>
			<ol>
				<li>
					<strong>Look for an unencrypted copy.</strong> SDA's encryption was off by
					default, so an older backup of the folder may be plain JSON.
					<a href="/how-to-open-mafile">Open one in a text editor</a> — readable field
					names mean unencrypted.
				</li>
				<li>
					<strong>A still-working copy of this authenticator.</strong> Preserve it
					and make a fresh protected backup before changing anything. Steam Mobile
					can show its recovery code; a desktop file may contain one. A recovery
					code removes an authenticator when used in recovery; it does not add a
					replacement automatically and removal carries a 15-day restriction.
				</li>
				<li>
					<strong>Neither?</strong> <a href="/lost-authenticator">The lost-access
					page</a> covers an available SMS transfer, a saved recovery code, and
					Steam Support when those options are unavailable.
				</li>
			</ol>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/how-to-open-mafile"><b>Opening one safely</b>
					<span>What to look at it with, and what never to paste it into.</span></a>
				</li>
				<li>
					<a href="/what-is-a-mafile"><b>A maFile, field by field</b>
					<span>Which values are the account's second factor and which are metadata.</span></a>
				</li>
				<li>
					<a href="/import-from-sda"><b>Importing from SDA</b>
					<span>Bringing accounts across, encrypted files included.</span></a>
				</li>
			</ul>
		</article>`
};
