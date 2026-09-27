/**
 * Moving an authenticator, and what Steam charges for each way of doing it.
 *
 * These two pages exist because this project implemented the transfer flow and
 * ran it against a real account, which is an unusual position to write from.
 * Valve documents phone-to-phone transfers. Desktop transfer behaviour is
 * separately supported by the implementation and the project's recorded test.
 *
 * **The discipline here is the same as everywhere else on this site.** Every
 * duration is quoted from Valve and linked. Where this project observed
 * something first-hand, the page says that it was observed rather than
 * documented, and says what was observed rather than generalising from it. Where
 * neither applies, the page says nothing.
 */

import { reviewAsk } from '../markup.mjs';

/** Valve's own pages. Every number on these pages comes from one of them. */
const VALVE = {
	guard: 'https://help.steampowered.com/en/faqs/view/7EFD-3CAE-64D3-1C31',
	restrictions: 'https://help.steampowered.com/en/faqs/view/451E-96B3-D194-50FC',
	holds: 'https://help.steampowered.com/en/faqs/view/34A1-EA3F-83ED-54AB',
	protection: 'https://help.steampowered.com/en/faqs/view/365F-4BEE-2AE2-7BDD'
};

export const tradeHolds = {
	slug: 'steam-guard-trade-holds',
	parent: 'docs',
	guide: true,
	sourced: `Every duration checked against Valve's <a href="${VALVE.restrictions}" rel="noopener">restriction</a>, <a href="${VALVE.holds}" rel="noopener">hold</a> and <a href="${VALVE.guard}" rel="noopener">transfer</a> guidance`,
	navTitle: 'Trade holds',
	title: 'Steam trade holds: timers, restrictions and CS2 exceptions',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'Steam trade hold and restriction timers, the CS2 Trade Protection exception, and why removal and enrolment waiting periods do not always add together.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Steam trade holds and restrictions, by cause and duration',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/steam-guard-trade-holds`
	}),
	// No `s` parameter: this page quotes Valve throughout and never interpolates
	// anything from the site config. Declaring one anyway failed `npm run lint`,
	// which the release workflow runs as a gate.
	body: () => `
		<article class="guide numbered">
			<h1>Steam trade holds and restrictions: causes and timers</h1>
			<p class="lede">
				Steam has several different restrictions and they get confused with one another
				constantly — partly because people call all of them &ldquo;the trade hold&rdquo;.
				They have different causes, different lengths, and only some are avoidable.
				The policy durations below come from Valve's linked guidance.
			</p>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					The two that catch people out are the authenticator ones.
					<strong>Removing a mobile authenticator costs 15 days</strong> of no trading and
					no Market. <strong>Valve's phone transfer carries 2 days.</strong> These are
					account restrictions, separate from item holds and CS2 Trade Protection.
				</p>
				<p>
					Read the reason and expiry Steam shows when you try the blocked action.
					Adding an authenticator does not shorten an existing hold. Steam Support says
					it cannot modify these restrictions.
				</p>
			</div>

			<ul class="stat-strip">
				<li>
					<b>2<small> days</small></b>
					<span>Transferring an authenticator to a new device.</span>
				</li>
				<li class="cost">
					<b>15<small> days</small></b>
					<span>Removing one. Unable to trade or use the Market at all.</span>
				</li>
				<li class="cost">
					<b>15<small> days</small></b>
					<span>Maximum standard item hold without an established authenticator. CS2 is different.</span>
				</li>
			</ul>

			<h2>What is the difference between a hold and a restriction?</h2>
			<p>
				They are not the same thing, and the difference decides what you can still do.
			</p>
			<ul class="check">
				<li class="no">
					<strong>A restriction blocks an action.</strong> Depending on its cause, it
					can affect trading, the Market, or only a newly authorised device.
				</li>
				<li class="yes">
					<strong>A hold delays delivery or listing.</strong> An accepted trade waits
					before items arrive; a Market sell listing waits before appearing for sale.
					Pending transactions can be cancelled. Valve explains that
					<a href="${VALVE.holds}" rel="noopener">holds give you a way to recover items
					before they are lost</a> if somebody else gets into your account.
				</li>
			</ul>

			<h2>CS2 items use Trade Protection instead of trade holds</h2>
			<p>
				<a href="${VALVE.protection}" rel="noopener">Valve's Trade Protected Items FAQ</a>
				says Counter-Strike 2 items are delivered immediately when a trade completes,
				regardless of authenticator age. They are then Trade Protected for 7 days:
				you can equip them, but cannot transfer, consume or modify them during that time.
				This does not remove account restrictions that prevent a trade from starting.
			</p>
			<p>
				Reversing protected trades through Steam Trade History reverses all eligible
				protected trades from the last 7 days and gives the initiating account a
				30-day trade and Market cooldown. It is a recovery action, not a way to shorten
				a wait. Valve currently lists CS2 as the only supported game; check its FAQ
				and the item's protection indicator for changes.
			</p>

			<h2>What causes the common restrictions?</h2>
			<div class="tbl">
				<table>
					<thead>
						<tr><th scope="col">Cause</th><th scope="col">What Steam does</th><th scope="col">How long</th></tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">Removing a mobile authenticator</th>
							<td>Cannot trade or use the Market</td>
							<td><span class="num warn">15 days</span></td>
						</tr>
						<tr>
							<th scope="row">Transferring one to a new device</th>
							<td>Trade and Market restriction</td>
							<td><span class="num">2 days</span></td>
						</tr>
						<tr>
							<th scope="row">Adding an authenticator: standard holds, excluding CS2 trades</th>
							<td>Trades made in the first 7 days still carry a hold</td>
							<td><span class="num warn">up to 15 days</span></td>
						</tr>
						<tr>
							<th scope="row">No authenticator: standard holds, excluding CS2 trades</th>
							<td>Items held before delivery</td>
							<td><span class="num warn">up to 15 days</span></td>
						</tr>
						<tr>
							<th scope="row">Resetting a forgotten password</th>
							<td>Cannot trade or use the Market</td>
							<td><span class="num warn">5 days</span></td>
						</tr>
						<tr>
							<th scope="row">Account inactive over two months, then a password reset</th>
							<td>Cannot trade or use the Market</td>
							<td><span class="num warn">30 days</span></td>
						</tr>
						<tr>
							<th scope="row">Cancelling an accepted trade while it is in a trade hold</th>
							<td>Cannot trade</td>
							<td><span class="num warn">7 days</span></td>
						</tr>
						<tr>
							<th scope="row">Steam Guard enabled less than 15 days</th>
							<td>Cannot trade or use the Market</td>
							<td><span class="num warn">until 15 days have passed</span></td>
						</tr>
						<tr>
							<th scope="row">New device authorised through email Steam Guard</th>
							<td>Trade and Market access blocked on that device; exception if a mobile authenticator has been active at least 7 days</td>
							<td><span class="num warn">7 days</span></td>
						</tr>
					</tbody>
				</table>
			</div>
			<p class="hint">
				Durations quoted from Valve's
				<a href="${VALVE.restrictions}" rel="noopener">Trading and Market Restrictions</a>,
				<a href="${VALVE.holds}" rel="noopener">Trade and Market Holds</a> and
				<a href="${VALVE.guard}" rel="noopener">Steam Guard Mobile Authenticator</a> pages.
				Where Valve does not state a number, this page does not invent one.
			</p>

			<h2>The 15 days people pay by accident</h2>
			<p>
				<a href="${VALVE.restrictions}" rel="noopener">Removing an authenticator
				triggers a 15-day trade and Community Market restriction</a>, even if you
				then set up another one.
			</p>
			<p>
				<a href="${VALVE.guard}" rel="noopener">Valve documents a 2-day trade and
				Market restriction after its transfer flow</a>. Use the transfer option when
				it is available and your intention is to change devices.
			</p>
			<p class="pull">
				Transferring and removing are different account actions.
				The documented restrictions differ by <em>thirteen days</em>.
			</p>
			<p>
				The removal restriction and the new authenticator's 7-day waiting period run
				from their respective actions; they do not automatically run one after the
				other. If you re-enrol immediately, that first week can pass during the
				15-day restriction. Waiting until day 15 to re-enrol starts the new week
				then. Steam's displayed expiry and each item's eligibility still control
				what you can do; adding security never cancels an already-applied hold.
			</p>

			<h2>Which of these can you avoid?</h2>
			<ul class="check">
				<li class="yes">
					<strong>The removal restriction.</strong> Transfer instead of removing —
					<a href="/move-steam-authenticator-to-pc">this is what the transfer flow is
					for</a>.
				</li>
				<li class="yes">
					<strong>The password-reset restriction.</strong> <em>Changing</em> a password you
					still know, from Steam's settings, does not trigger this restriction. A
					<em>reset</em> of a forgotten one triggers it.
				</li>
				<li class="no">
					<strong>Standard holds on future transactions.</strong> Keep an authenticator
					active for at least 7 days. This does not remove existing holds, restrictions
					or game-specific item cooldowns.
				</li>
				<li class="no">
					<strong>Any of them, once applied.</strong> Steam Support cannot lift these, and
					anybody offering to is selling something that does not exist.
				</li>
			</ul>

			<h2>The timer ended, but Steam still blocks me</h2>
			<p>
				Check the new message instead of assuming the same restriction was extended.
				Steam also applies purchase-history requirements for the Market, payment-method
				checks, limited-account restrictions, bans and item-specific cooldowns. This
				page covers the common authenticator-related causes; Valve's
				<a href="${VALVE.restrictions}" rel="noopener">full restriction list</a>
				covers the others. A working Guard code does not prove an item is tradable.
			</p>

			<div class="callout callout-warn">
				<p>
					<strong>No service can shorten a hold.</strong> These are applied by Steam and
					enforced server-side. An offer to remove one is a way of getting your password,
					your authenticator file, or your items — see
					<a href="/scam-clones">how those approaches work</a>.
				</p>
			</div>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/move-steam-authenticator-to-pc"><b>Moving an authenticator to a PC</b>
					<span>The 2-day route, and why the 15-day one is so widely recommended.</span></a>
				</li>
				<li>
					<a href="/move-steam-authenticator-new-phone"><b>Moving to a new phone</b>
					<span>The same choice, between two devices you own.</span></a>
				</li>
				<li>
					<a href="/steam-guard-code-not-working"><b>Codes being refused</b>
					<span>Check time, the account and the current authenticator before resetting anything.</span></a>
				</li>
			</ul>
		</article>`
};

export const moveToPc = {
	slug: 'move-steam-authenticator-to-pc',
	parent: 'docs',
	guide: true,
	navTitle: 'Move to a PC',
	title: 'Move your Steam authenticator from your phone to a PC',
	updated: '2026-09-12',
	reviewed: '2026-09-12',
	description:
		'Steam can move an authenticator to another device for a 2-day restriction. What the flow actually does, what it costs, and what it requires.',
	sourced: `Transfer rules checked against <a href="${VALVE.guard}" rel="noopener">Valve's Steam Guard guidance</a>; device replacement was observed in one real-account transfer`,
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: 'Moving a Steam authenticator from a phone to a desktop',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: '2026-09-12',
		mainEntityOfPage: `${s.origin}/move-steam-authenticator-to-pc`
	}),
	body: (s) => `
		<article class="guide numbered">
			<h1>Move your Steam authenticator from your phone to a PC</h1>
			<p class="lede">
				Valve documents transfers between phones with a two-day trade and Market
				restriction. ${s.name} implements Steam's replacement flow for moving to a PC.
				That desktop use is unofficial: the explanation below separates Valve's
				documented policy from what this project has implemented and tested.
			</p>

			<div class="answer">
				<span class="eyebrow">Short answer</span>
				<p>
					Steam does not copy the secret off your phone. It
					<strong>replaces</strong> the authenticator: you prove you hold the current one,
					Steam texts a code to the number on the account, and on submitting that code
					Steam issues a brand-new set of secrets to the new device and makes the phone's
					copy inert.
				</p>
				<p>
					<strong>Our recorded live transfer received the short restriction</strong>,
					consistent with Valve's 2-day policy, compared with
					<a href="/steam-guard-trade-holds">15 days for removing and re-adding</a>.
				</p>
			</div>

			<div class="callout callout-warn">
				<p>
					<strong>Do not remove the authenticator from your phone first.</strong> That is
					the fifteen-day path, and removes its mobile second factor. ${s.short}'s
					transfer flow needs a working current authenticator to complete sign-in.
				</p>
			</div>

			<h2>What Steam actually does</h2>
			<p>
				This is worth understanding, because it explains why the phone stops working and why
				nothing needs uninstalling.
			</p>
			<ol class="steps">
				<li>
					<strong>You prove you hold the current authenticator</strong>
					<p>By signing in with a code from it. Nothing has changed at this point.</p>
				</li>
				<li>
					<strong>Steam sends a code to the phone number on the account</strong>
					<p>
						Valve documents SMS and, in some countries, Telegram delivery. A sender
						name is not proof that a message is genuine. Use a code only for the
						transfer you started, in the application where you started it; never
						follow a message's link or send the code to someone else.
					</p>
				</li>
				<li>
					<strong>You submit that code, and Steam rotates the authenticator</strong>
					<p>
						New secrets are issued to the new device. The ones on the phone stop being the
						account's authenticator at that moment. This step cannot be undone.
					</p>
				</li>
				<li>
					<strong>You write down the new recovery code</strong>
					<p>
						Steam issues a fresh one. Keep it somewhere you can reach if the PC fails.
						It is an important recovery route; Steam's SMS and Support options may
						also be available. Do not rely on the previous authenticator's code.
					</p>
				</li>
			</ol>

			<p class="pull">
				Because the replacement happens on Steam's side, there is
				<em>nothing to uninstall</em>. The phone's authenticator is already inert — removing
				it afterwards would be the fifteen-day operation, for no benefit.
			</p>

			<h2>What you need before starting</h2>
			<ul class="check">
				<li class="yes">
					<strong>The authenticator still working on the phone.</strong> It is what proves
					the account is yours.
				</li>
				<li class="yes">
					<strong>Access to the phone number on the account.</strong> Steam texts a code to
					it and there is no way to finish without that code.
				</li>
				<li class="yes">
					<strong>Somewhere to write the new recovery code.</strong> Not on the machine you
					are moving to — that is the one it will not help you with.
				</li>
				<li class="no">
					<strong>Not your old recovery code.</strong> It is void the moment the transfer
					completes.
				</li>
			</ul>

			<h2>What we observed doing this</h2>
			<p>
				The project's recorded live test used one account with an active authenticator:
			</p>
			<ul class="check">
				<li class="yes">
					Codes generated on the new device were accepted by Steam immediately.
				</li>
				<li class="yes">
					The account's authenticator was gone from the phone afterwards, and its Steam
					sessions had been signed out — the expected consequence of a server-side
					replacement, with nothing done to the device itself.
				</li>
				<li class="yes">
					The restriction applied was the short one, consistent with Valve's documented
					two days rather than the fifteen a removal carries.
				</li>
				<li class="no">
					The test fetched an empty confirmation list. It did not approve a real
					confirmation using the transferred secret, so that action was not verified
					by this live test.
				</li>
			</ul>
			<p class="hint">
				One observation on one account is not a guarantee, and it is reported here as an
				observation rather than as documentation. Where Valve states something, this page
				quotes Valve instead — see
				<a href="${VALVE.guard}" rel="noopener">the Steam Guard Mobile Authenticator
				page</a>.
			</p>

			<h2>Can I use ${s.short} for this?</h2>
			<div class="callout">
				<p>
					<strong>${
						s.features.transfer.anyPublic
							? 'Yes — the transfer is built into the published application.'
							: 'Not yet.'
					}</strong>
					${
						s.features.transfer.anyPublic
							? 'It uses the flow described above and never substitutes remove-and-add.'
							: `${s.name} implements this flow in the upcoming ${s.version} source, and it has been run successfully against a real account — but the currently published GitHub ${s.publication.github.latestVersion ?? 'build'} and Microsoft Store ${s.publication.store.latestVersion ?? 'build'} builds do not contain it. <a href="/download">The download page tracks exactly where that stands.</a>`
					}
				</p>
				<p>
					Whatever you use, the thing to check is which operation it performs. Software
					that removes the authenticator and adds a new one has cost you thirteen extra
					days whether or not it says so.
				</p>
			</div>

			<h2>Steps in ${s.short}, and what to do if the transfer stops</h2>
			<ol class="steps">
				<li><strong>Unlock your vault and choose Move from phone.</strong>
					<p>Check the account name, complete sign-in with the current authenticator,
					and read the replacement warning before requesting the phone code.</p></li>
				<li><strong>Enter the phone code and finish the recovery steps.</strong>
					<p>Save the new recovery code, confirm it is written down, and complete the
					application's encrypted recovery-backup step.</p></li>
				<li><strong>Check the result before relying on it.</strong>
					<p>Use a new code to sign in to Steam, open Confirmations, and review Steam's
					restriction notice. Keep your backup accessible without this PC.</p></li>
			</ol>
			<p>
				If a timeout or storage error appears after submitting the phone code, Steam
				may already have replaced the authenticator. Follow the recovery screen;
				do not start a new transfer or remove the authenticator to clear the error.
				A local failure does not mean Steam undid the change. If no working
				authenticator can be recovered, use <a href="https://help.steampowered.com/"
				rel="noopener">Steam Support</a>.
			</p>

			<h2>Related</h2>
			<ul class="link-cards">
				<li>
					<a href="/steam-guard-trade-holds"><b>Every trade hold, by cause</b>
					<span>What each restriction is, how long it lasts, and which are avoidable.</span></a>
				</li>
				<li>
					<a href="/steam-mobile-vs-desktop-authenticator"><b>Phone or desktop?</b>
					<span>An honest comparison, including when the answer is to stay on the phone.</span></a>
				</li>
				<li>
					<a href="/steam-revocation-code"><b>Your recovery code</b>
					<span>What the new one does, and why the old one stops working.</span></a>
				</li>
			</ul>

${reviewAsk(s, { got: 'Did this get your authenticator onto your PC?' })}
		</article>`
};
