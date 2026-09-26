/**
 * The account of the theft this project came out of.
 *
 * The participant is unnamed. This is testimony, not an independently verified
 * forensic report. Keep observations separate from conclusions about exfiltration
 * and account ownership. The original amount was unclear; do not publish a
 * numerical valuation without a source record resolving it. Historical item
 * restrictions must not be presented as today's general Steam rules.
 */

export default {
	slug: 'steam-inventory-stolen',
	updated: '2026-09-12',
	navTitle: 'Our story',
	title: 'A fake SDA download emptied my Steam inventory',
	description:
		'A first-hand account: a poisoned search result, a two-week wait, and an inventory sold on the Community Market to buy the thief’s own listings.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'A fake SDA download emptied my Steam inventory',
		description:
			'A first-hand account of a counterfeit Steam Desktop Authenticator download and the theft that followed.',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		dateModified: s.updated,
		mainEntityOfPage: `${s.origin}/steam-inventory-stolen`
	}),
	body: () => `
		<article>
			<h1>A fake SDA download emptied my Steam inventory</h1>

			<p class="lede">
				A member of our team recounts losing their Steam inventory after installing a
				counterfeit SDA download. Their experience motivated this project. The story
				below records their recollection; it is not an independently verified incident report.
			</p>

			<div class="callout">
				<p>
					<strong>First-hand basis.</strong> A member of the MASTERPANEL LLC team
					wrote this from their own experience. The person is deliberately unnamed, but
					the publisher is accountable for the page. It is a personal account, not a
					forensic analysis of the counterfeit binary. We have not published the binary,
					transaction records or evidence identifying the recipient accounts. Timing
					is the person's recollection. The suspected copying of a maFile and
					control of the receiving accounts are conclusions, not independently established facts.
				</p>
			</div>

			<h2>I had already done it right once</h2>
			<p>
				I was starting out in trading and I needed Steam Guard on my PC. I got Steam
				Desktop Authenticator the correct way: from the project's own releases page. The
				fake sites I remember seeing then were below the genuine result in my searches.
			</p>
			<p>
				That is the part I want to be clear about, because it is the part that gets
				missed. I knew where the real one lived. I had already downloaded it from there.
			</p>

			<h2>Then I reinstalled Windows</h2>
			<p>
				Months later I rebuilt the machine, and set about reinstalling everything I
				used. I searched for SDA the way anyone does. This time one of those sites was
				sitting at the top of the results.
			</p>
			<p>
				I did not examine it. I was reinstalling twenty things that afternoon and this
				was the one I had used for months already. It looked like the thing I remembered.
				I downloaded it, set it up, imported my accounts, and it worked — codes, trades,
				confirmations, all of it, exactly as before.
			</p>
			<p>
				<strong>Working codes did not establish that the download was safe.</strong>
				I believe this was when my <a href="/what-is-a-mafile">maFile</a> was copied.
				The evidence accompanying this account does not establish exactly what the
				program sent or when.
			</p>

			<h2>Two weeks of nothing</h2>
			<p>
				Then about a fortnight later I was in a lecture at university and my phone
				started going. Not one notification — a stream of them, emails arriving faster
				than I could read the subject lines.
			</p>

			<h2>What they actually did</h2>
			<p>
				I remember about half my inventory being unavailable to trade. I thought that
				made me relatively safe. This account does not identify the exact
				item restrictions, so they cannot be generalised to today's Steam rules. What
				I saw next was Market activity:
			</p>
			<ol class="signs">
				<li>
					<strong>They listed and sold the entire inventory on the Community Market.</strong>
					As I remember it, the items were sold and the proceeds landed in my Steam Wallet.
				</li>
				<li>
					<strong>The balance bought overpriced listings.</strong> My account bought
					items I understood to be worth only a few cents. I believe the sellers were
					connected to the attacker; I do not have independent proof of who controlled them.
				</li>
				<li>
					<strong>I did not recover the value.</strong> By the time I read the first
					emails, the transactions I describe here had already happened.
				</li>
			</ol>
			<p>
				I remember low-value stickers among the final purchases. The account was left
				with items worth very little compared with what had been there.
			</p>
			<div class="callout">
				<p><strong>Today's rules are not inferred from this story.</strong>
					Valve documents <a href="https://help.steampowered.com/en/faqs/view/34A1-EA3F-83ED-54AB" rel="noopener">both trade and Market holds</a>,
					and <a href="https://help.steampowered.com/en/faqs/view/61F0-72B7-9A18-C70B" rel="noopener">completed Market purchases are final</a>.
					Eligible CS2 trades have a separate
					<a href="https://help.steampowered.com/en/faqs/view/365F-4BEE-2AE2-7BDD" rel="noopener">seven-day Trade Protection reversal route</a>.
					Do not assume that a trade restriction always permits selling, or that every
					kind of stolen-item transaction is irreversible.</p>
			</div>

			<h2>What I would tell myself</h2>
			<ul class="plain next">
				<li>
					<strong>Reinstalls deserve the same checks as first installs.</strong>
					Familiarity with a product can make it easy to skip checking a new download.
				</li>
				<li>
					<strong>A restriction is not a substitute for securing the account.</strong>
					Check what the specific restriction covers and respond to exposed credentials
					immediately.
				</li>
				<li>
					<strong>Bookmark the real release page.</strong> Not the search. The search is
					the attack surface.
				</li>
				<li>
					<strong>Check the file, not the website.</strong> A convincing page proves
					nothing. <a href="/verify">Check the checksum and provenance where available</a>
					to establish release origin. They do not establish that the program is safe.
				</li>
			</ul>

			<h2>Why this exists</h2>
			<p>
				SDA's <a href="https://github.com/Jessecar96/SteamDesktopAuthenticator" rel="noopener">own repository warns about fake downloads</a>.
				My experience is a reason to take that warning seriously. It is not evidence
				that today's search results or the timing of other thefts match mine.
			</p>
			<p>
				So <a href="/">this application</a> is built to be checked rather than trusted:
				<a href="${'https://github.com/opendesktopauthenticator/open-desktop-authenticator'}" rel="noopener">public source</a>,
				builds produced in public CI, and
				<a href="/security">a security page that says what it cannot protect you from</a>.
				Published checksums and build provenance ship with
				each release. Reproducible builds do not yet, and the binaries themselves are
				not code-signed —
				<a href="/download">the download page says where each one stands</a>. ODA has
				no built-in updater; updates to the Store edition are managed by Microsoft Store.
			</p>
			<p>
				If you use something else, use something else. Just
				<a href="/verify">verify what you downloaded</a> — and if a page like this ever
				becomes your story, <a href="/scam-clones">follow the recovery steps here</a>
				from a trusted device and check promptly for pending or reversible transactions.
			</p>
		</article>`
};
