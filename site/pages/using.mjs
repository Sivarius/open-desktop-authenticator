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
	// Valve documents the feature; the wire protocol is from open implementations.
	sourced: `Trade-offer flow checked against <a href="${VALVE.offers}" rel="noopener">Valve's offer guidance</a>; request tags and session requirements against <a href="https://github.com/DoctorMcKay/node-steamcommunity/blob/master/components/confirmations.js" rel="noopener">node-steamcommunity's public implementation</a>`,
	navTitle: 'Confirmations on PC',
	title: 'How Steam trade confirmations work on desktop',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'What actually signs a Steam trade confirmation, why desktop tools can do it, and the two questions to ask any software you let approve trades.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'How Steam trade confirmations work on desktop',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/approve-steam-confirmations-desktop`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>How Steam trade confirmations work on desktop</h1>
			<p class="lede">
				Steam can ask for a separate confirmation when you send items or list them
				for sale. Desktop authenticators can handle those requests using the
				authenticator's secrets and a signed-in Steam session. Here is how to review
				them, what to check when nothing appears, and what access you give the software.
			</p>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					A desktop tool approves confirmations by holding your
					<code>identity_secret</code> and signing each request with it, exactly as
					the phone does. <strong>It needs a live Steam session as well as the
					secret</strong> — the secret alone cannot sign in.
				</p>
				<p>
					That is why an authenticator file is worth protecting like the account
					itself, and why nothing here should ever be pasted into a website.
				</p>
			</div>

			<h2>What actually approves a Steam trade confirmation?</h2>
			<p>
				A confirmation approves a pending action; it does not necessarily complete
				a trade immediately. For example, an outgoing offer can need confirmation
				before it is sent, and then still needs the other person's acceptance.
				<a href="${VALVE.offers}" rel="noopener">Valve's trade-offer guide</a>
				describes confirmation through the mobile app, or by email without it.
				See also <a href="${VALVE.confirmations}" rel="noopener">Trade and Market
				Confirmations</a>. Follow the status Steam shows for the actual transaction.
			</p>
			<p>
				When Steam requires a mobile confirmation, three things have to come together
				before that request is valid:
			</p>
			<ol>
				<li>
					<strong>The identity secret</strong> from your authenticator. It is used as
					the HMAC key: the request sends a derived signature, not the raw secret.
				</li>
				<li>
					<strong>An authenticated Steam session</strong> — a live login for the
					account, not just the secret.
				</li>
				<li>
					<strong>A signature derived from the time and action tag</strong>. The
					message being signed is the current
					<a href="/steam-guard-code-not-working">Steam-corrected time</a> followed by
					a short tag naming the action — one tag for fetching the list, a different
					one for allowing, another for cancelling. The action request also includes
					the selected confirmation's ID and nonce. Those values are separate from
					the time-and-tag signature; it is not a signature over every trade detail.
				</li>
			</ol>
			<p class="hint">
				Valve documents the confirmation feature but not this wire format. The tag
				behaviour above matches the long-standing open implementation in
				<a href="https://github.com/DoctorMcKay/node-steamcommunity/blob/master/components/confirmations.js" rel="noopener">DoctorMcKay's
				node-steamcommunity</a>, a <a href="/credits">protocol reference for this
				project</a>. Our own confirmation implementation follows that request format.
			</p>
			<p>
				Do not treat this mechanism as a guarantee that a captured request cannot be
				reused. Steam controls timestamp acceptance and replay checks, and list keys
				are reusable in the public library. Protect the session and the device as
				well as the secrets. A working authenticator can remove
				<a href="${VALVE.holds}" rel="noopener">standard holds after 7 days</a>, but
				it does not remove account restrictions. <a href="${VALVE.protection}"
				rel="noopener">CS2 trades use Trade Protection instead of trade holds</a>.
			</p>

			<h2>How can a desktop program approve them?</h2>
			<p>
				By holding the identity secret and signing in as you. It imports the secret
				from a <a href="/what-is-a-mafile">maFile</a>, or receives it when the
				authenticator is first created, then produces the same signatures the phone
				does. These unofficial clients implement Steam's confirmation protocol.
				Valid cryptography and a valid session are required, but do not guarantee
				acceptance: Steam can also reject requests or restrict an account.
			</p>
			<p class="pull">
				That is the honest framing of "approve confirmations on PC": not a convenience
				feature, but moving trade authority from a device you carry to a machine that
				is often <em>left running</em>.
			</p>
			<p>
				It is worth being exact about what somebody gains by stealing that file,
				because both the panic and the shrug are wrong:
			</p>
			<ul class="check">
				<li class="no">
					<strong>The identity secret cannot sign in to Steam.</strong> On its own it
					signs confirmations and nothing else.
				</li>
				<li class="no">
					<strong>The shared secret is not your password.</strong> It supplies the
					second factor, so it closes half the gap rather than all of it.
				</li>
				<li class="yes">
					<strong>A usable session or refresh token changes that.</strong> A file
					carrying one may let a thief obtain account access without re-entering the
					password, depending on its scope, validity and Steam's checks.
				</li>
				<li class="yes">
					<strong>The secrets have no scheduled expiry in the file.</strong> Changing
					the password does not rotate them. A copied secret remains a risk while
					Steam recognises it as the account's current authenticator.
				</li>
			</ul>

			<h2>Why would anyone want confirmations on a PC?</h2>
			<ul>
				<li>
					<strong>A larger review surface.</strong> A desktop can make a long list
					easier to inspect alongside the original offers and listings. Batch controls
					vary by app and version; batching alone is not exclusive to a desktop.
				</li>
				<li>
					<strong>Several accounts at once.</strong> The Steam app
					<a href="${VALVE.guard}" rel="noopener">does hold multiple accounts</a>, but
					it shows one at a time; a desktop screen can show them side by side.
				</li>
				<li>
					<strong>No usable phone.</strong> A broken handset does not have to stop
					trading. <a href="/steam-guard-without-phone">There is more on that here.</a>
				</li>
			</ul>

			<h2>Is it safe to let software approve my trades?</h2>
			<p>
				Not "can it approve confirmations" — they all can, or they would not be
				offering. Ask <strong>what it will approve without asking you</strong>, and
				<strong>what happens to the secret while the machine is unattended</strong>.
			</p>
			<p>
				${s.name}'s answers, so you can compare them against anything else: automatic
				approval is off unless you switch it on, per account, and switching on
				automatic <em>trades</em> — the setting that can move items out of an account
				with nobody watching — requires typing a confirmation phrase rather than
				clicking a toggle. Locking the vault stops new approval requests; it cannot
				recall a request already sent to Steam. The vault locks after the configured
				idle period and on suspend. Secrets are <a href="/security">encrypted in
				the vault</a>, but are available to the application while unlocked; malware
				on the PC can undermine that protection.
			</p>
			<p>
				A tool that cannot answer those two questions clearly is asking you to hand
				over trade authority on trust alone.
			</p>

			<h2>How to review confirmations in ${s.short}</h2>
			<ol class="steps">
				<li><strong>Unlock the vault and choose the right account.</strong>
					<p>The account needs its current shared and identity secrets, obtained by
					<a href="/import-from-sda">import</a>, enrolment or
					<a href="/move-steam-authenticator-to-pc">transfer</a>.</p></li>
				<li><strong>Open Confirmations and sign in if prompted.</strong>
					<p>A login code can work offline while confirmations still require a new
					Steam session. Use <strong>Refresh</strong> to fetch the current list.</p></li>
				<li><strong>Match each entry to the action you intended.</strong>
					<p>Check the account, items, recipient or offer, and any displayed price
					against Steam. If the summary is insufficient, inspect the original offer
					or listing in Steam before pressing <strong>Approve</strong>.</p></li>
				<li><strong>Approve only entries you recognise.</strong>
					<p><strong>Approve all</strong> affects every ordinary entry shown, not a
					selection. Security-sensitive confirmations must be handled individually.
					Deny an unexpected request and review your Steam account security.</p></li>
			</ol>
			<h2>No confirmation appears, or approval fails</h2>
			<ul>
				<li><strong>Check Steam's transaction status.</strong> It may not be awaiting
					confirmation, may already be processed, or may belong to another account.
					An empty list does not prove a sale or trade succeeded.</li>
				<li><strong>Sign-in requested:</strong> renew the session. Re-importing the
					secret is not a substitute for signing in.</li>
				<li><strong>Connection or proxy error:</strong> restore the connection and
					refresh. Treat an incomplete-list warning as incomplete information.</li>
				<li><strong>Timeout after approval:</strong> check Steam's trade or Market
					history before retrying; the action may already have succeeded.</li>
			</ul>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/security"><b>Where the secrets live</b>
					<span>What this application stores, and what reaches the network.</span></a>
				</li>
				<li>
					<a href="/steam-mobile-vs-desktop-authenticator"><b>Mobile app or desktop</b>
					<span>An honest comparison, including when the answer is the phone.</span></a>
				</li>
				<li>
					<a href="/what-is-a-mafile"><b>The identity secret</b>
					<span>What signs a confirmation, and what else sits in the same file.</span></a>
				</li>
			</ul>

${reviewAsk(s, { got: 'Did this get your confirmations working on the desktop?' })}
		</article>`
};

export const mobileVsDesktop = {
	slug: 'steam-mobile-vs-desktop-authenticator',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`Official-app features and the one-authenticator rule checked against <a href="${VALVE.guard}" rel="noopener">Valve's guidance</a>; desktop claims against <a href="${s.repo}" rel="noopener">this project's source</a>`,
	navTitle: 'Mobile or desktop',
	title: 'Steam mobile app or a desktop authenticator?',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'An honest comparison of Steam Guard on the official mobile app versus a desktop authenticator, including who should ignore the desktop option entirely.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam mobile app or a desktop authenticator?',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/steam-mobile-vs-desktop-authenticator`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Steam mobile app or a desktop authenticator?</h1>
			<p class="lede">
				We build a desktop authenticator, so treat this page with the suspicion it
				deserves — and then read the recommendation, which is that most people should
				use Steam's official mobile app and not think about this again.
			</p>

			<div class="callout">
				<p>
					<strong>Use the official Steam Mobile app if it works for you.</strong> It is
					made by Valve, it holds the secret in storage you never have to manage, and
					keeps the second factor on a separate device from the PC you use to sign in.
					Valve also provides account recovery and phone transfers. A linked phone
					number can help recovery even when you use a desktop authenticator; those
					options belong to the Steam account, not exclusively to the mobile app.
				</p>
			</div>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					<strong>Use Steam's official mobile app unless you have a specific reason
					not to.</strong> It is Valve's own, it needs no file management from you,
					and it separates your authenticator from your desktop session. Steam's
					own recovery options remain relevant whichever device holds the secret.
				</p>
				<p>
					A desktop authenticator is mainly useful for bulk confirmations, managing
					several accounts side by side, controlling your own backups, or operating
					without the official mobile app.
				</p>
			</div>

			<div class="tbl">
				<table>
					<thead>
						<tr>
							<th scope="col">&nbsp;</th>
							<th scope="col">Steam Mobile app</th>
							<th scope="col">A desktop authenticator</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">Who makes it</th>
							<td>Valve</td>
							<td>Third parties, including us</td>
						</tr>
						<tr>
							<th scope="row">Account recovery</th>
							<td>Steam's recovery flow; SMS when a phone number is linked</td>
							<td>
								Your backup or recovery code, plus Steam's recovery options;
								SMS availability depends on the linked number and recovery flow
							</td>
						</tr>
						<tr>
							<th scope="row">Confirming many trades</th>
							<td>Review and confirm in the mobile app; controls depend on its version</td>
							<td>Larger display; some tools, including ODA, offer batch approval</td>
						</tr>
						<tr>
							<th scope="row">Needs a phone</th>
							<td>Yes — Android or iOS</td>
							<td>No</td>
						</tr>
						<tr>
							<th scope="row">Who holds the secret</th>
							<td>The app, in storage you never see</td>
							<td>A file on your disk, which you must protect and back up</td>
						</tr>
						<tr>
							<th scope="row">If you lose the device</th>
							<td>Valve's own recovery flow</td>
							<td>A usable backup, recovery code, or Steam's account-recovery flow</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="hint">
				The honest summary of that table: the mobile app is the safest default for most
				people. A desktop tool is a specialist option for the specific workflows above.
			</p>

			<h2>Can I use the Steam app and a desktop authenticator together?</h2>
			<p>
				Worth settling first, because it is widely misunderstood: Valve states that
				<a href="${VALVE.guard}" rel="noopener">an account "can only be on one
				authenticator ... at a time"</a>. A server-side transfer replaces the
				authenticator, so its old secrets stop working. Copying the same secret
				between desktop tools is different: both copies can generate the same codes
				until Steam replaces that authenticator. That is one duplicated credential,
				not two independently enrolled authenticators, and every copy needs protection.
				Valve does not document an official export of mobile-app secrets to a desktop.
			</p>

			<h2>When is Steam's mobile app the better choice?</h2>
			<dl class="defs">
				<dt>Recovery</dt>
				<dd>
					The mobile app has Valve's documented recovery and transfer instructions.
					With either type of authenticator, preserve the
					<a href="/steam-revocation-code">recovery code</a> and keep your account's
					phone number and email current. Desktop users additionally need to protect
					and test their own backups.
				</dd>
				<dt>Nothing for you to mislay</dt>
				<dd>
					The secret lives in the app's own storage — there is no user-managed file to
					copy to the wrong place, sync to cloud storage, or hand to the wrong
					program. The mobile app still stores credentials and can be affected by
					device compromise; the difference is that you do not manage the secret file.
				</dd>
				<dt>It is official</dt>
				<dd>
					No third party between you and Valve. Every desktop option, ours included,
					asks you to trust somebody else with the most sensitive thing on the
					account.
				</dd>
				<dt>Modern sign-in</dt>
				<dd>
					The app can approve logins by notification and by QR code, so there is often
					no code to type at all. It also
					<a href="${VALVE.guard}" rel="noopener">holds several accounts at once</a> and
					sends sign-in notifications for each — which is more than it usually gets
					credit for.
				</dd>
				<dt>A separate device</dt>
				<dd>
					Keeping the authenticator on a phone means compromise of the PC alone does
					not automatically expose the authenticator's stored secrets. You still
					need to reject fraudulent approval requests and protect both devices.
				</dd>
			</dl>

			<h2>When is a desktop authenticator the better choice?</h2>
			<dl class="defs">
				<dt>Many accounts, side by side</dt>
				<dd>
					The app holds multiple accounts but shows one at a time. On a desktop they
					can be visible together, which for someone managing several is not merely
					faster but easier to check carefully.
				</dd>
				<dt>Trading volume</dt>
				<dd>
					A larger screen can help you compare
					<a href="/approve-steam-confirmations-desktop">pending confirmations</a>
					with offers and listings. Batch approval is useful only when every entry
					has been reviewed; speed is not a reason to approve an unfamiliar trade.
				</dd>
				<dt>No smartphone, or no wish to use one</dt>
				<dd>
					Some people do not have a suitable handset; some will not install the app.
					<a href="/steam-guard-without-phone">This is the page for that</a> — and it
					is more complicated than it sounds.
				</dd>
				<dt>Backups you control</dt>
				<dd>
					A file can be copied deliberately and kept somewhere safe. That is the same
					property as the risk — it cuts both ways, honestly.
				</dd>
			</dl>

			<h2>So which should I use?</h2>
			<p>
				If you have a working smartphone, trade occasionally, and run one account:
				<strong>use the mobile app.</strong> Nothing here should talk you out of it.
			</p>
			<p>
				If you run several accounts, trade in volume, or cannot use the app at all,
				then a desktop authenticator may solve a real problem. Compare how each
				option handles backups, device compromise and recovery.
				<a href="/alternatives">The alternatives page compares several options,
				including the ones that are not ours</a>, and
				<a href="/scam-clones">the counterfeits are a genuine hazard</a> in this
				particular corner of the internet.
			</p>
			<p>
				A server-side transfer can affect trading. Steam's own phone-to-phone transfer
				carries a two-day trade and Market restriction. A move involving an unofficial
				desktop authenticator may instead require removing the authenticator and
				enrolling again, which is the
				<a href="/move-steam-authenticator-new-phone">fifteen-day path</a> — so it is
				worth reading the procedure before starting. Importing an unchanged maFile
				is a local copy and does not itself trigger an authenticator-removal restriction.</p>

			<h2>Questions that decide it either way</h2>

			<h3>Does Valve officially support desktop authenticators?</h3>
			<p>
				Valve documents its own mobile app. ${s.name} is a third-party project,
				and its ability to communicate with Steam is not an endorsement from Valve
				or a guarantee of future compatibility. This page cannot promise that Steam
				will always accept an unofficial client or make a policy exception for it.
			</p>

			<h3>What happens to my items while I switch?</h3>
			<p>
				Steam documents two days for its transfer and fifteen for authenticator
				removal. A local maFile import does not itself perform either account
				action. Existing restrictions and item protections still apply.
				<a href="/steam-guard-trade-holds">The timers and CS2 exception are explained here.</a>
			</p>

			<h3>Can I go back to the phone app afterwards?</h3>
			<p>
				Yes. Start in Steam Mobile and look for the documented transfer route;
				Valve also describes an SMS route when the previous authenticator is
				unavailable. Availability depends on your account and linked phone number.
				Do not remove the authenticator first just because it currently runs on a PC.
				If recovery ultimately requires removal and re-enrolment, that removal
				carries a 15-day trade and Market restriction.
			</p>

			<h3>What if I lose the computer?</h3>
			<p>
				A usable backup of the current authenticator can restore login codes, provided
				you can decrypt it and the clock is correct. Confirmations may require a new
				Steam sign-in. ${s.short}'s encrypted vault and per-account recovery files
				require the passphrase used to encrypt them; keep that accessible separately.
				A recovery file contains the authenticator data without its refresh token. Without a
				backup, try Steam's linked-number recovery, the
				<a href="/steam-revocation-code">recovery code</a>, or Steam Support. If the
				computer was stolen or compromised, restoring a copy does not invalidate
				the stolen secrets; secure the account through Steam.
			</p>

			<h2>Where ${s.short} stands today</h2>
			<p>
				Stated so you can weigh it: this is a young project. Version 1.0 was published
				on ${s.releasedOn}, no independent audit has happened, and it has none of the
				years of scrutiny the mobile app has.</p>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/move-steam-authenticator-to-pc"><b>Moving yours to a PC</b>
					<span>What Steam's transfer does, and the two days it costs.</span></a>
				</li>
				<li>
					<a href="/alternatives"><b>Every desktop option, compared</b>
					<span>What each one is, who maintains it, and what it asks of you.</span></a>
				</li>
				<li>
					<a href="/security"><b>How this one stores secrets</b>
					<span>The encryption, the threat model, and what it does not protect against.</span></a>
				</li>
				<li>
					<a href="/steam-guard-code-not-working"><b>If codes stop being accepted</b>
					<span>Check time, account selection and whether the authenticator was replaced.</span></a>
				</li>
			</ul>
		</article>`
};

export const withoutPhone = {
	slug: 'steam-guard-without-phone',
	parent: 'docs',
	guide: true,
	sourced: `No-number setup checked against <a href="${VALVE.setup}" rel="noopener">Valve's enrolment guidance</a>; the email-code path includes one labelled no-number account observation`,
	navTitle: 'Without a phone',
	title: 'Steam Guard without a smartphone',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'Steam’s official authenticator needs Android or iOS, but a phone number is optional. What desktop tools change, and what you lose without SMS recovery.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam Guard without a smartphone',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/steam-guard-without-phone`
	}),
	body: (s) => `
		<article class="guide">
			<h1>Steam Guard without a smartphone</h1>
			<p class="lede">
				Two different questions hide inside this one, and mixing them up is why the
				answers you find online contradict each other. One is about the device that
				generates codes. The other is about the phone number on your account — and
				the second has an answer most people do not expect.
			</p>

			<div class="callout callout-warn">
				<p>
					<strong>Two different things, and only one of them is required.</strong>
					Valve's official mobile authenticator runs on a supported Android or iOS
					device, so without one of those the official app is not an option. A
					<em>phone number</em>, however, is optional in Valve's current setup flow —
					its own guide includes a way to skip that step. The rest of this page separates the two.
				</p>
			</div>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					Two separate questions get tangled together here.
					<strong>Valve's official authenticator app does require an Android or iOS
					device</strong> — there is no official desktop version of it. But a
					<strong>phone number is optional in Valve's current setup flow</strong>.
					Generating Steam Guard login codes needs a secret and the correct time, so
					that part can run on a desktop; trade confirmations additionally need an
					identity secret and an authenticated Steam session.
				</p>
				<p>
					Skipping the phone number removes SMS recovery. Keep the
					<a href="/steam-revocation-code">recovery code</a>; if you use a desktop
					authenticator, also keep a usable <a href="/encrypted-mafile">protected backup</a>.
				</p>
			</div>

			<h2>Question 1: does the authenticator have to run on a phone?</h2>
			<p>
				<strong>No.</strong> Generating login codes requires a secret and the correct
				time, so that function can run on a desktop; trade confirmations additionally
				require the identity secret and an authenticated session. That is what
				<a href="/steam-desktop-authenticator">desktop authenticators</a> are, and
				they have existed for years. But note this is a
				<a href="/steam-mobile-vs-desktop-authenticator">replacement when you transfer
				from the phone</a>: Steam allows one enrolled authenticator on an account
				at a time. A copied desktop secret is still the same authenticator.
			</p>

			<h2>Question 2: can the account have no phone number at all?</h2>
			<p>
				<strong>Yes.</strong> Valve's current setup walkthrough documents an
				enrolment path for people without access to a phone number, and says so
				directly:
			</p>
			<div class="callout">
				<p>
					In <a href="${VALVE.setup}" rel="noopener">Valve's setup walkthrough</a>,
					select <strong>I don't have access to a phone number</strong> beneath the
					Next button to use the documented no-number option.
				</p>
			</div>
			<p>
				So a number is not a hard requirement in Valve's current setup flow for attaching an authenticator.
				Steam still asks for one first, and still recommends it — Valve's step for
				entering a number explains why, since it is what lets you recover the account
				by text later. But there is a documented way past it.
			</p>
			<p>
				This matches what we see. Our own enrolment decides from Steam's response
				whether to expect the activation code by SMS or by email rather than assuming
				SMS, and one recorded live run against an account with no phone — on 10 August 2026 —
				completed with the code delivered by email. That is a single observed account
				flow rather than a guarantee, but it is consistent with the documented path
				above.
			</p>
			<p>
				To add or update a number, use Steam's <strong>Account Details → Contact
				Info → Add a phone number</strong> or <strong>Manage your phone number</strong>.
				${s.short} does not manage the number for you.
			</p>

			<h2>Can I just use Steam Guard by email?</h2>
			<p>
				Yes. <a href="https://help.steampowered.com/en/faqs/view/451E-96B3-D194-50FC"
				rel="noopener">Valve recognises email Steam Guard as an account-protection
				method</a>. It does not require a smartphone or a desktop authenticator.
				If you only need sign-in protection and can secure your email account,
				this may meet your needs. Standard trade and Market holds can apply without
				an established mobile authenticator; <a href="/steam-guard-trade-holds">CS2
				Trade Protection and account restrictions are separate</a>.
			</p>

			<h2>What do I lose by not having a phone number?</h2>
			<p>
				Skipping the number is supported for authenticator setup. It does not
				guarantee access to every game feature or other phone-gated Steam feature.
				For recovery, the main differences are:
			</p>
			<ul class="check">
				<li class="yes">
					<strong>You keep the authenticator itself.</strong> Codes and trade
					confirmations continue to work without SMS, provided the authenticator
					secrets and session remain valid.
				</li>
				<li class="yes">
					<strong>You keep the recovery code.</strong> It still detaches the
					authenticator, and it does not depend on a phone number.
				</li>
				<li class="no">
					<strong>You lose SMS recovery.</strong> Steam has no linked number to use
					for that self-service route.
				</li>
				<li class="no">
					<strong>You lose Valve's documented SMS-based phone-to-phone transfer
					path.</strong> An alternative may require authenticator removal,
					re-enrolment or Steam Support.
				</li>
			</ul>
			<div class="callout callout-warn">
				<p>
					<strong>So the recovery code stops being good practice and starts being the
					plan.</strong> Without a phone number, your self-service fallbacks are a
					working backup of the authenticator or the
					<a href="/steam-revocation-code">recovery code</a>. Without either, the
					remaining route is Steam Support.
				</p>
			</div>

			<h2>What if I have a phone but will not install the app?</h2>
			<p>
				A desktop authenticator is one option, and a linked number can preserve
				Steam's SMS recovery options. You then manage the secrets and backups on
				the PC, and trade confirmations need an internet connection and Steam session.
				If an authenticator is already on the account, check the
				<a href="/move-steam-authenticator-to-pc">transfer requirements</a> before
				changing anything. Email Steam Guard is another option if its limitations
				fit how you use the account.
			</p>

			<h2>Related questions about phone numbers</h2>

			<h3>Can I remove the phone number after adding an authenticator?</h3>
			<p>
				Valve documents removal in <strong>Account Details → Manage your phone
				number → Remove number</strong>. Read Steam's warnings before confirming.
				Removing a number and removing the authenticator are different actions;
				losing the number removes the SMS recovery option.
			</p>

			<h3>Can two accounts share one phone number?</h3>
			<p>
				<a href="${VALVE.guard}" rel="noopener">Valve says yes</a> — the same number
				may be used on multiple accounts. Valve also warns that linked accounts may
				be treated as the same identity for policies or restrictions, and some games
				apply VAC or game bans across accounts sharing a number. Consider that
				consequence before sharing one.
			</p>

			<h3>Does a landline or VoIP number work?</h3>
			<p>
				Steam sends codes by SMS, so a number that cannot receive text messages is not
				useful for this, and <a href="${VALVE.guard}" rel="noopener">Valve says it
				does not accept new VoIP numbers</a>. If
				the number is the obstacle, the no-number option above is the cleaner route.
			</p>

			<h2>What am I taking on with a desktop authenticator?</h2>
			<p>
				Responsibility for a file and for the device that can read it. The mobile
				app manages its own credential storage; a desktop tool gives you backups
				that you must protect against loss and disclosure.
				${s.name} keeps it <a href="/security">encrypted locally and locks
				itself when idle</a>, but malware can compromise an unlocked PC — and
				<a href="/steam-mobile-vs-desktop-authenticator">if a smartphone is genuinely
				an option for you, the official app is still the simpler answer</a>.
			</p>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/steam-revocation-code"><b>The code that gets you back in</b>
					<span>Keep this fallback accessible even if the device is lost.</span></a>
				</li>
				<li>
					<a href="/steam-mobile-vs-desktop-authenticator"><b>Mobile app or desktop</b>
					<span>The trade-offs side by side, with no thumb on the scale.</span></a>
				</li>
				<li>
					<a href="/lost-authenticator"><b>If you are already locked out</b>
					<span>Every way back in, in the order worth trying them.</span></a>
				</li>
			</ul>
		</article>`
};

export const openMafile = {
	slug: 'how-to-open-mafile',
	parent: 'docs',
	guide: true,
	sourced: (s) =>
		`File identification and opening branches checked against <a href="${s.sda.repo}" rel="noopener">SDA's published source and maFile layout</a>`,
	navTitle: 'Opening a maFile',
	title: 'How to open a Steam maFile safely',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'An unencrypted maFile is JSON you can read in Notepad; encrypted ones need the SDA passphrase and manifest.json. How to inspect one safely.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Open and inspect a Steam maFile safely',
		publisher: { '@type': 'Organization', name: s.publisher },
		step: [
			{ '@type': 'HowToStep', name: 'Find the maFiles folder beside the SDA program' },
			{ '@type': 'HowToStep', name: 'Copy the file before touching it' },
			{ '@type': 'HowToStep', name: 'Open the copy in a plain text editor' },
			{ '@type': 'HowToStep', name: 'Check whether it is readable or encrypted' }
		]
	}),
	body: (s) => `
		<article class="guide">
			<h1>How to open a Steam <code>.maFile</code> safely</h1>
			<p class="lede">
				There is no special program needed to look inside one. A maFile is a small
				text file, and a text editor opens it — showing either readable fields or, if
				it was encrypted, a block of base64 you will need the passphrase and manifest
				to make sense of. The care required is not technical — it is about what you do
				with the file afterwards.
			</p>

			<div class="callout callout-warn">
				<p>
					<strong>Never use an online file viewer or converter on a real
					maFile.</strong> Some generic online file viewers ask you to upload the file
					to read it. Uploading an unencrypted maFile exposes the authenticator secret
					itself. An encrypted one should not be uploaded either: it is sensitive
					backup material, and it may become readable if its matching
					<code>manifest.json</code> and passphrase are exposed later. There is no
					legitimate reason for a website to see either.
				</p>
			</div>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					<strong>Any plain-text editor can display a maFile</strong> — Notepad, VS
					Code, anything. An unencrypted one contains JSON; an encrypted one shows
					base64 ciphertext. There is nothing to install and nothing to convert. Work
					on a copy, not the original.
				</p>
				<p>
					The danger is not opening it. It is
					<strong>where the contents go afterwards</strong>: never into a website, a
					Discord bot, a pastebin, an AI chat, or a support form.
				</p>
			</div>

			<h2>1. Where is the maFiles folder?</h2>
			<p>
				SDA is a portable program, so its <code>maFiles</code> folder sits
				<strong>beside the SDA executable</strong> — wherever you extracted it.
				It has no fixed location inside Steam's installation. Check the folder
				containing the SDA program or search for <code>*.maFile</code> and
				<code>manifest.json</code>. Copies can exist in several places; keep track
				of which backup belongs to the current authenticator.
			</p>
			<p class="hint">
				Enable file-name extensions in File Explorer. A filename ending in
				<code>.maFile.exe</code> is an executable, not an authenticator data file.
			</p>

			<h2>2. Why should I copy it first?</h2>
			<p>
				Close SDA first and copy the whole <code>maFiles</code> folder into a
				private local folder that is not automatically shared or synced. Include
				<code>manifest.json</code> so encrypted files remain usable. Inspect a copy
				without saving changes; accidental edits can corrupt the only surviving backup.
			</p>

			<h2>3. What opens a .maFile?</h2>
			<p>
				Anything that reads plain text. What matters more is what you deliberately do
				not use — and double-clicking counts as not choosing, because Windows will
				pick something for you.
			</p>
			<ul class="check">
				<li class="yes">
					<strong>A trusted local text editor.</strong> Use <strong>Open with</strong>
					and pick it yourself. An unencrypted maFile shows JSON — curly braces and
					quoted field names; an encrypted SDA file contains base64 ciphertext.
					Avoid cloud editors or extensions that send document contents to remote services.
				</li>
				<li class="no">
					<strong>Not an online JSON viewer, formatter or "maFile decoder".</strong>
					Never upload either type. Pasting an unencrypted maFile into a web page
					exposes its secrets; uploading an encrypted one exposes sensitive backup
					material that may become readable if its matching manifest and passphrase are
					later obtained — whatever the page promises about not storing anything.
				</li>
				<li class="no">
					<strong>Not an AI chat, a Discord bot or a pastebin.</strong> An unencrypted
					file exposes live secrets immediately; an encrypted one is still sensitive
					backup material. You cannot rely on retrieving or deleting every copy
					after it has been shared.
				</li>
				<li class="no">
					<strong>No converter is needed just to inspect it.</strong> A maFile is
					already text. Decryption is a separate operation requiring the right
					passphrase and matching metadata.
				</li>
			</ul>

			<h2>4. Is mine encrypted or readable?</h2>
			<dl class="defs">
				<dt>Readable field names</dt>
				<dd>
					<code>shared_secret</code>, <code>identity_secret</code>,
					<code>account_name</code> and friends. This is an unencrypted maFile, and
					treat any credentials in it as sensitive even if the file is old.
					<a href="/what-is-a-mafile">Here is what each field does.</a>
				</dd>
				<dt>A block of base64 text, possibly split across lines</dt>
				<dd>
					This is consistent with SDA encryption, but appearance alone does not
					prove the file is valid. You will need the passphrase <em>and</em> the
					<code>manifest.json</code> that was beside it —
					<a href="/encrypted-mafile">this is the page for that</a>.
				</dd>
				<dt>Neither, or the file will not open</dt>
				<dd>
					It may be corrupt, empty, from a different tool or simply the wrong file.
					File size alone is not a reliable test. Keep the original and look for a
					matching backup before attempting changes.
				</dd>
			</dl>

			<div class="callout callout-warn">
				<p>
					<strong>Opening a copy in a text editor does not run anything — but the
					contents are still live secrets.</strong> Editors keep recent-file history
					and documents folders are often synced to cloud storage, so where you put
					that copy matters. Do not paste the
					contents into a website, a Discord bot, a pastebin, an AI chat, or a support
					form — <a href="/support">including ours</a>. Pasting an unencrypted maFile
					hands over its secrets; an encrypted one is still sensitive backup material
					and should not be uploaded either. If the
					<code>shared_secret</code> is readable in what you paste, whoever receives
					it can generate your Steam Guard codes while that secret remains the account's
					current authenticator — there is no scheduled expiry in the file.
					The <code>shared_secret</code> on its own does not hand over the password.
					But a maFile carrying a still-usable session or refresh token may allow
					account actions immediately, and even without one, the second factor stops
					being an obstacle. A compromised <code>shared_secret</code> cannot be fixed
					by changing your password — it takes removing or replacing the
					authenticator.
				</p>
			</div>

			<h2>5. Is it safe to load it into an authenticator?</h2>
			<p>
				"Opening" a maFile in an authenticator is a much larger act than reading it.
				You are handing a program the authority to act as your authenticator
				indefinitely — <a href="/what-is-a-mafile">these secrets do not expire on their
				own</a>, and stop working only when the authenticator is removed or replaced.
				To Steam the requests it signs carry the same cryptography yours would.
			</p>
			<p>
				So the question is not whether the software can read the format. It is whether
				you are willing to give the people who wrote it that authority. Before loading
				a maFile into anything, including ${s.short}, check that you can name who
				publishes it, <a href="/verify">verify the download is what they published</a>,
				and read what it does with the secret afterwards.
				<a href="/scam-clones">Counterfeit authenticators exist specifically to be
				handed maFiles</a>, and they look like the real thing.
			</p>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/what-is-a-mafile"><b>A maFile, field by field</b>
					<span>What each value does, and which ones are the account itself.</span></a>
				</li>
				<li>
					<a href="/encrypted-mafile"><b>When it is encrypted</b>
					<span>The passphrase, the manifest, and why one without the other fails.</span></a>
				</li>
				<li>
					<a href="/import-from-sda"><b>Importing one</b>
					<span>Bringing accounts into this application, and exporting them back out.</span></a>
				</li>
			</ul>

${reviewAsk(s, { got: 'Did this let you open your maFile?' })}
		</article>`
};
