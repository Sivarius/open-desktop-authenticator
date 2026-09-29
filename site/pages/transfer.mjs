/** Steam restrictions and ODA's separate, unofficial desktop-transfer workflow. */
import { reviewAsk } from '../markup.mjs';

const VALVE = {
	guard: 'https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31',
	transfer: 'https://help.steampowered.com/en/faqs/view/29A9-9EEE-09F0-75F9',
	restrictions: 'https://help.steampowered.com/en/faqs/view/451E-96B3-D194-50FC',
	holds: 'https://help.steampowered.com/en/faqs/view/34A1-EA3F-83ED-54AB',
	protection: 'https://help.steampowered.com/en/faqs/view/365F-4BEE-2AE2-7BDD'
};

export const tradeHolds = {
	slug: 'steam-guard-trade-holds',
	parent: 'docs',
	guide: true,
	sourced: `Restriction decisions checked against Valve's <a href="${VALVE.restrictions}" rel="noopener">restriction list</a>, <a href="${VALVE.holds}" rel="noopener">hold guidance</a> and <a href="${VALVE.protection}" rel="noopener">CS2 Trade Protection FAQ</a>; phone-transfer timing against its <a href="${VALVE.guard}" rel="noopener">Steam Guard FAQ</a>`,
	navTitle: 'Trade holds',
	title: 'Steam trade holds: timers, restrictions and CS2 exceptions',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Match Steam’s trade or Market restriction to its cause, timer and next step. Understand existing holds, phone transfers and CS2 Trade Protection.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam trade holds and restrictions: causes and timers',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/steam-guard-trade-holds`
	}),
	body: () => `
		<article class="guide">
			<h1>Steam trade holds and restrictions: causes and timers</h1>
			<p class="lede">Read the reason and expiry Steam shows for the blocked trade or Market action.
				An account restriction, a pending item hold and CS2 Trade Protection have different rules.
				Match that reason below before changing your authenticator.</p>
			<div class="answer">
				<span class="eyebrow">An existing hold or a future trade?</span>
				<p><strong>Adding an authenticator does not shorten an existing hold.</strong>
					Keeping it active can prevent standard holds on future transactions after the
					qualifying period. It does not clear account restrictions or item cooldowns.</p>
				<p>Valve says Steam Support cannot modify trade and Market restrictions.
					If you did not initiate the action that caused one, secure the account through
					<a href="https://help.steampowered.com/" rel="noopener">Steam Support</a>;
					do not wait to protect it just to preserve trading access.</p>
			</div>

			<h2>Match Steam's reason to the next step</h2>
			<div class="tbl" tabindex="0" role="region" aria-label="Steam restrictions and next steps">
				<table>
					<caption>Common reasons, summarized from Valve; Steam's displayed expiry controls your account.</caption>
					<thead><tr><th scope="col">Reason or situation</th><th scope="col">Effect and timer</th><th scope="col">What you can do</th></tr></thead>
					<tbody>
						<tr><th scope="row">Mobile authenticator removed</th><td>No trading or Market for <strong>15 days</strong>.</td><td>Restore account protection. Adding another authenticator does not cancel the restriction.</td></tr>
						<tr><th scope="row">Steam Mobile phone-to-phone transfer</th><td>Trade and Market restriction for <strong>2 days</strong>.</td><td>Wait for Steam's expiry. This is Valve's documented phone flow, not a guarantee for every desktop tool.</td></tr>
						<tr><th scope="row">Item held; no authenticator or one added less than 7 days ago</th><td>Standard holds can last <strong>up to 15 days</strong>.</td><td>Keep the authenticator active for future transactions. Existing holds continue. CS2 trades are the exception below.</td></tr>
						<tr><th scope="row">Forgotten password reset</th><td>No trading or Market for <strong>5 days</strong>; <strong>30 days</strong> if inactive for over two months.</td><td>Wait; changing a known password in settings is a different action. Secure a compromised account promptly.</td></tr>
						<tr><th scope="row">Accepted held trade cancelled</th><td>Trading restricted for <strong>7 days</strong>.</td><td>Check account security if the trade was unfamiliar. Support cannot remove this cooldown.</td></tr>
						<tr><th scope="row">Steam Guard newly enabled</th><td>Trading and Market unavailable until it has been enabled for <strong>15 days</strong>.</td><td>Keep protection enabled rather than restarting setup.</td></tr>
						<tr><th scope="row">New device authorized through email Steam Guard</th><td>This device is restricted for <strong>7 days</strong>.</td><td>An already-authorized device may still work. Valve exempts accounts with a mobile authenticator active for at least 7 days.</td></tr>
						<tr><th scope="row">Received CS2 item marked Trade Protected</th><td>Item delivered immediately; protected for <strong>7 days</strong>.</td><td>You can equip it, but cannot transfer, consume or modify it during protection.</td></tr>
					</tbody>
				</table>
			</div>
			<p class="hint">The first seven rows follow Valve's <a href="${VALVE.restrictions}" rel="noopener">restriction list</a>,
				<a href="${VALVE.holds}" rel="noopener">hold FAQ</a> and
				<a href="${VALVE.guard}" rel="noopener">Steam Guard FAQ</a>.
				The last row follows its <a href="${VALVE.protection}" rel="noopener">Trade Protection FAQ</a>.</p>

			<h2>A hold delays an item; a restriction blocks an action</h2>
			<p>A standard trade hold starts after both parties accept and delays delivery.
				A Market hold delays a sell listing appearing. A restriction can prevent the account,
				or a newly authorized device, from starting those actions. Check which one Steam names:
				a working login code does not establish that an item is tradable.</p>

			<h2>CS2 uses Trade Protection instead of trade holds</h2>
			<p>Valve currently lists CS2 as the supported game. Its traded items arrive immediately
				regardless of authenticator age, then have the seven-day protection described above.
				This does not bypass an account restriction that stops a trade being made.</p>
			<p>If an unauthorized protected trade occurred, first secure the account and review
				Steam Trade History. Reversal affects all eligible protected trades from the last
				seven days and gives the account initiating it a <strong>30-day trade and Market cooldown</strong>.
				It is an account-recovery action, not a shortcut around an item timer.
				Check <a href="${VALVE.protection}" rel="noopener">Valve's current conditions</a> before acting.</p>

			<h2>Moving devices: transfer and removal are different</h2>
			<p>For another phone, use <a href="/move-steam-authenticator-new-phone">Valve's transfer route</a>
				when available. Removing an authenticator first triggers the longer removal restriction.
				For a PC, read <a href="/move-steam-authenticator-to-pc">ODA's separate requirements and observed behavior</a>;
				Valve's phone-transfer documentation is not an official desktop procedure.</p>
			<p>The removal restriction and a new authenticator's qualifying period start from their
				respective actions. They do not automatically add together as 15 plus 7 days.
				If you re-enrol immediately, the first week can pass during the removal restriction;
				if you enrol later, that week starts later. Existing holds keep their own expiry.</p>

			<h2>The timer ended, but Steam still blocks me</h2>
			<p>Read the current message again. Purchase-history requirements, payment checks,
				limited accounts, bans and game-specific cooldowns can apply independently.
				Use Valve's <a href="${VALVE.restrictions}" rel="noopener">full restriction list</a>
				to identify the next condition. Repeated authenticator removal will not clear it.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/move-steam-authenticator-to-pc"><b>Moving an authenticator to a PC</b><span>ODA prerequisites, recovery steps and the limits of its recorded desktop test.</span></a></li>
				<li><a href="/move-steam-authenticator-new-phone"><b>Moving to a new phone</b><span>Valve's documented transfer and recovery options.</span></a></li>
				<li><a href="/steam-guard-code-not-working"><b>Codes being refused</b><span>Check time, the account and the current authenticator before resetting anything.</span></a></li>
			</ul>
		</article>`
};

export const moveToPc = {
	slug: 'move-steam-authenticator-to-pc',
	parent: 'docs',
	guide: true,
	navTitle: 'Move to a PC',
	title: 'Move your Steam authenticator from your phone to a PC',
	updated: '2026-09-30',
	reviewed: '2026-09-30',
	description:
		'Move Steam Guard to ODA on a PC: prerequisites, phone-code steps and recovery checks. Desktop behavior is separate from Valve’s phone-transfer policy.',
	sourced: (s) =>
		`Phone policy checked against <a href="${VALVE.guard}" rel="noopener">Valve's Steam Guard FAQ</a>; ODA steps against its <a href="${s.repo}/blob/main/src/renderer/screens/MoveAuthenticator.tsx" rel="noopener">transfer screen</a>. Outcomes are scoped to the <a href="${s.repo}/blob/main/docs/AUTHENTICATOR_TRANSFER.md" rel="noopener">historical one-account test record</a>, not a new release test`,
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Moving a Steam authenticator from a phone to a desktop',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-30',
		mainEntityOfPage: `${s.origin}/move-steam-authenticator-to-pc`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Move your Steam authenticator from your phone to a PC</h1>
			<p class="lede">${s.name} can replace a phone authenticator with one stored in its PC vault.
				You need the current authenticator for sign-in and access to the linked phone number.
				If you already have a usable SDA maFile, <a href="/import-from-sda">import it instead</a>;
				copying an existing secret does not require this transfer.</p>
			<div class="answer">
				<span class="eyebrow">Before you start</span>
				<p><strong>Do not remove the authenticator from your phone first.</strong>
					A successful transfer replaces it on Steam's side: the old secrets stop working.
					Save the new recovery code and complete the recovery-backup step before relying on the PC.</p>
				<p>This desktop workflow is unofficial. Valve documents a two-day restriction for
					<a href="${VALVE.transfer}" rel="noopener">its phone-to-phone route</a>.
					One historical ODA transfer received that short restriction; it is not a promise
					for your account. Check Steam's resulting notice.</p>
			</div>

			<h2>What you need before starting</h2>
			<ul>
				<li>A verified <a href="/download">ODA download</a>, an unlocked vault and its passphrase.</li>
				<li>The Steam account's login credentials and a working current authenticator.</li>
				<li>Access to the account's linked number for the transfer code. A no-number account
					cannot use this ODA phone-code flow.</li>
				<li>A private place to retain the new recovery code and an encrypted backup separately from this PC.</li>
			</ul>
			<p>If the current authenticator is already lost, start with <a href="/lost-authenticator">Steam's recovery options</a>.
				Do not remove and re-add it just to satisfy these prerequisites.</p>

			<h2>Move from phone in ${s.short}</h2>
			<p><strong>${s.features.transfer.anyPublic ? 'Yes — the transfer is built into the published application.' : 'Not yet.'}</strong>
				${
					s.features.transfer.anyPublic
						? 'It uses the flow described below and never substitutes remove-and-add.'
						: `${s.name} implements this flow in the upcoming ${s.version} source, but the currently published GitHub ${s.publication.github.latestVersion ?? 'build'} and Microsoft Store ${s.publication.store.latestVersion ?? 'build'} builds do not contain it. Check <a href="/download">published availability</a> before following these steps.`
				}</p>
			<ol class="steps">
				<li><strong>Unlock the vault and choose Move from phone.</strong><p>Check the account name,
					complete sign-in with the current authenticator and read the replacement warning.</p></li>
				<li><strong>Request and enter the phone code.</strong><p>Use only the code for the transfer
					you started. Enter it in ODA, not a message's link or a third-party support chat.</p></li>
				<li><strong>Save the new recovery code.</strong><p>At this point Steam has already replaced
					the authenticator. Record the new code away from this PC, acknowledge it in ODA,
					and finish any encrypted recovery-backup warning. Do not rely on the old recovery code.</p></li>
				<li><strong>Select Done, then check the account.</strong><p>After saving the recovery information, return to the account list. Confirm a fresh code
					is accepted at a Steam sign-in you initiate. Check <a href="/approve-steam-confirmations-desktop">Confirmations</a>
					separately and read Steam's trade/Market notice. A working login code does not
					prove approval of a trade has been tested.</p></li>
			</ol>

			<h2>If the transfer stops</h2>
			<dl class="defs">
				<dt>Sign-in fails before the phone-code step</dt><dd>Check the account and
					<a href="/steam-guard-code-not-working">current Guard code</a>. Pause if Steam
					reports too many attempts. Do not remove the phone authenticator.</dd>
				<dt>No phone code arrives</dt><dd>Confirm access to the linked number and follow
					<a href="${VALVE.guard}" rel="noopener">Valve's delivery troubleshooting</a>.
					Repeated requests can delay delivery; some regions use Telegram for the linked number.</dd>
				<dt>Timeout or storage error after submitting the phone code</dt><dd>Steam may already
					have replaced the authenticator. Follow ODA's recovery screen instead of starting a
					new transfer. If it says the replacement is only in memory, keep ODA open and use
					<strong>Finish recovery</strong> after correcting the reported storage problem.</dd>
				<dt>Vault saved, separate backup still pending</dt><dd>Save the displayed recovery code
					and use the offered recovery-backup retry. Retain the vault and passphrase; a backup
					warning does not mean Steam reversed the transfer.</dd>
			</dl>
			<p>If no usable authenticator or retained recovery material remains, use
				<a href="https://help.steampowered.com/" rel="noopener">Steam Support</a>.</p>

			<h2>What changes on Steam, and what has been tested</h2>
			<p>The replacement flow issues new authenticator secrets rather than extracting the old
				ones from the phone. The previous authenticator no longer works after replacement.
				Removing an authenticator is a separate operation with a
				<a href="/steam-guard-trade-holds">15-day trade and Market restriction</a>.</p>
			<p>The project's <a href="${s.repo}/blob/main/docs/AUTHENTICATOR_TRANSFER.md" rel="noopener">historical live-test record</a>
				covers one account: Steam accepted the new codes, the old phone's authenticator
				was removed, its sessions signed out, and the short restriction was observed.
				That run fetched an empty confirmation list; it did not approve a real confirmation
				with the transferred secret. This is retained evidence, not a new test of the latest release.</p>
			<h2>Related</h2>
			<ul class="link-cards">
				<li><a href="/steam-guard-trade-holds"><b>Trade restrictions</b><span>Match Steam's notice to its cause and next step.</span></a></li>
				<li><a href="/steam-mobile-vs-desktop-authenticator"><b>Phone or desktop?</b><span>Where your credentials and recovery copies will live.</span></a></li>
				<li><a href="/steam-revocation-code"><b>Your recovery code</b><span>Find and preserve the code for the current authenticator.</span></a></li>
			</ul>
${reviewAsk(s, { got: 'Did this get your authenticator onto your PC?' })}
		</article>`
};
