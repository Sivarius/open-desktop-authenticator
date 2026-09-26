export default {
	slug: 'steam-desktop-authenticator',
	updated: '2026-09-26',
	navTitle: 'About SDA',
	title: 'Steam Desktop Authenticator (SDA), explained',
	description:
		'What SDA is, what a maFile actually contains, why searching for it is risky, and how to keep Steam Guard on your PC without losing the account.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Steam Desktop Authenticator: what it is, and how to use it safely',
		description:
			'An explanation of Steam Desktop Authenticator, maFiles, and the risks of downloading it from search results.',
		author: { '@type': 'Organization', name: s.publisher },
		publisher: { '@type': 'Organization', name: s.publisher },
		// The head carried a modified time and the Article object did not, so the
		// two disagreed about whether this page had ever been revised.
		dateModified: '2026-09-26',
		mainEntityOfPage: `${s.origin}/steam-desktop-authenticator`
	}),
	/*
	 * **The provenance clause in "This project" is load-bearing.**
	 *
	 * A pass that pulled a false signature claim out of five sentences rewrote
	 * three of them to say "published checksums and build provenance" and left
	 * this one carrying checksums alone — so the card whose whole job is
	 * convincing an SDA user that this is checkable listed less evidence than the
	 * release actually ships, while /verify step 4 and /download both send people
	 * to the attestation it had stopped mentioning. Understating is a smaller
	 * fault than overclaiming and still the wrong one for this page.
	 *
	 * **A JS comment, not an HTML one.** The first version of this note was
	 * written inside the template and rendered straight into
	 * site/dist/steam-desktop-authenticator.html — a maintainer's aside shipped to
	 * every visitor. It also claimed the phrase order in the signing sentence made
	 * the paragraph fail verify.mjs loudly if a flag were flipped back, which is
	 * backwards: a qualifier inside UNBUILT_CAPABILITY's window makes that check
	 * pass, not fail. Nothing here is doing that job, and the phrase order is
	 * ordinary English.
	 */
	body: (s) => `
		<article>
			<h1>Steam Desktop Authenticator: what it is, and how to use it safely</h1>

			<p class="lede">
				Steam Desktop Authenticator — almost always shortened to SDA — is a Windows
				program that implements Steam's mobile-authenticator functions on a computer.
				It is not Valve's phone-transfer feature. This page
				explains what it does, what it stores, why the search results for it are
				dangerous, and what your options are. It is not a download page for SDA, and we
				are not its authors.
			</p>

			<!--
				This page ranks for the query that gets people robbed, so the official
				repository belongs above the fold rather than in a paragraph two
				screens down. Somebody who reads one sentence and leaves should still
				leave with the right link.
			-->
			<div class="callout callout-warn">
				<h2>Before anything else: SDA is no longer maintained</h2>
				<p>
					Its own README states that it is ${s.sda.notice}, and
					${s.sda.authorsAdvice}. That is the project's own assessment of its own
					software, and it matters more than any opinion on this page.
					<strong>Steam's official mobile authenticator is the right answer for most
					people</strong>, and this page will not pretend otherwise.
				</p>
				<p>
					The rest of this page explains what SDA is, what it stores and why searching
					for it is dangerous — because many people still run it, still
					search for it, and are still handed counterfeits when they do. We have no
					usage figures for somebody else's software and will not invent any.
				</p>
			</div>

			<div class="origin-note">
				<p>
					<strong>If you are going to use it regardless, the only real home is
					<a href="${s.sda.repo}" rel="noopener">github.com/${s.sda.author}/SteamDesktopAuthenticator</a>.</strong>
					A lookalike domain, mirror or forum attachment does not establish that a file
					is the original release. Even a byte-identical copy would not change SDA's
					unsupported status.
				</p>
				<a class="button button-quiet" href="${s.sda.repo}" rel="noopener">The real repository →</a>
			</div>

			<h2>What Steam Guard actually is</h2>
			<p>
				When you enable Steam Guard Mobile Authenticator, Steam gives your device two
				long-lived secrets and keeps a copy:
			</p>
			<dl class="defs">
				<dt><code>shared_secret</code></dt>
				<dd>
					The seed for the five-character login codes. It is a time-based one-time
					password: your device and Steam both hash the secret together with the
					current thirty-second window, and get the same answer without ever talking
					to each other. Anyone holding this secret can generate your login
					codes for as long as that authenticator stays on the account — it does not
					expire on its own, and only removing or replacing it stops them.
				</dd>
				<dt><code>identity_secret</code></dt>
				<dd>
					The seed used to authenticate trade and market-confirmation requests. With
					this secret and a valid session, software can approve a pending confirmation;
					the secret alone cannot initiate a trade or create a logged-in session.
				</dd>
				<dt>The revocation code</dt>
				<dd>
					A short code in the form <code>R12345</code>, which Valve now calls your
					<a href="/steam-revocation-code">recovery code</a>. It is shown during setup
					and can be retrieved again while the authenticator is still accessible. It is how
					you detach the authenticator if you lose the device. If you do not have it
					and you lose your authenticator, a linked phone number or previously generated
					backup codes may still help. Otherwise use Steam Support's recovery process.
				</dd>
			</dl>

			<h2>What a maFile is</h2>
			<p>
				SDA stores each account in a file named after the SteamID with a
				<code>.maFile</code> extension. It is JSON, and a typical one carries the
				authenticator secrets and account metadata above, and may also hold session
				data that has not expired. In other words: <strong>a maFile is the
				account's second factor, in a file, on disk.</strong>
			</p>
			<p>
				SDA can encrypt maFiles with a passphrase. When it does, the file contents are
				base64 ciphertext and the salt and initialisation vector live beside it in
				<code>manifest.json</code> — which is why an encrypted maFile cannot be
				decrypted without that manifest, and why copying only the <code>.maFile</code>
				to a new machine leaves you with something you cannot open.
			</p>
			<div class="callout">
				<p>
					<strong>The practical consequence:</strong> treat a maFile as an account
					credential, not an ordinary settings file. It normally does not contain the
					password, but it may contain both authenticator secrets and usable session
					tokens. Changing the password alone does not rotate the authenticator secrets.
				</p>
			</div>

			<h2>Why people use a desktop authenticator at all</h2>
			<p>
				Steam's own mobile app is the intended route, and for most people it is the
				right one. Traders reach for a desktop tool for reasons that are practical
				rather than exotic:
			</p>
			<ul>
				<li>
					Managing confirmations alongside a desktop trading workflow can reduce
					switching between devices. Bulk controls depend on the application and version.
				</li>
				<li>
					A desktop code can be copied locally. Valve's mobile app also offers QR sign-in
					and sign-in approval, so using a phone does not always mean retyping a code.
				</li>
				<li>
					Accounts outlive phones. People who have lost an authenticator to a broken
					handset tend to want the secret somewhere they control.
				</li>
			</ul>
			<p>
				The trade-off continues after downloading: storing the Steam session and its
				authenticator on one computer exposes both to malware on that computer. A
				separate phone reduces that shared exposure, although it does not prevent phishing.
			</p>

			<h2>Looking for the Steam Desktop Authenticator download?</h2>
			<div class="callout callout-warn">
				<p>
					<strong>Get it from the project's own repository, and nowhere else:</strong>
					<a href="${s.sda.repo}" rel="noopener">github.com/${s.sda.author}/SteamDesktopAuthenticator</a>.
					SDA is released there by ${s.sda.author}. Any other site offering a
					&ldquo;Steam Desktop Authenticator download&rdquo; — an installer, a zip, a
					mirror, a &ldquo;fixed&rdquo; or &ldquo;updated&rdquo; build — is not the
					project, whatever the page looks like.
				</p>
			</div>
			<p>
				If you take one thing from this page, take the two minutes to check what you
				downloaded before you open a <code>.maFile</code> with it:
			</p>
			<ol class="signs">
				<li>
					<strong>Confirm the address.</strong> Releases live on the same repository as
					the source. A download page that has no source attached to it has nothing
					tying the file to the project.
				</li>
				<li>
					<strong>Compare a checksum against a trusted release record, if provided.</strong>
					A hash beside a file detects a mismatch but does not independently authenticate
					its publisher. <a href="/verify">Our guide explains the distinction</a>;
					ODA's signing and attestation commands do not apply to SDA.
					<span class="hint">
						Check which verification files the original SDA release actually supplies.
						Do not assume it provides ODA's signature or provenance records. If it does
						not provide an authenticated checksum, there is no checksum-origin check
						to perform; start from the ${s.sda.author} repository linked above and
						retain the unsupported-software warning.
					</span>
				</li>
				<li>
					<strong>Never enter a maFile, password or API key into a web page</strong>
					offering to check, repair or convert it.
				</li>
			</ol>
			<p>
				We publish <a href="/">an independent alternative</a>, which gives us a stake
				in this comparison. Our recommendation for most people remains Valve's mobile
				app. Download provenance does not make unsupported SDA a maintained product.
			</p>

			<h2>Why searching for "steam desktop authenticator download" is the dangerous part</h2>
			<p>
				SDA is distributed as source and as releases on its project page. The name,
				however, is generic enough that a great many other sites rank for it, and some
				of them may distribute unofficial or modified builds. SDA's own README warns
				about counterfeits. The following is a possible attack path, not a measurement
				of current search rankings or the behavior of every clone:
			</p>
			<ol>
				<li>A site that looks like a product page, often with a stolen screenshot.</li>
				<li>
					A file served directly by an unrelated website, rather than a link to the
					official ${s.sda.author} release page. SDA itself ships as a zip, so the
					archive is not the warning sign — who is handing it to you is.
				</li>
				<li>
					A build can generate correct codes while copying your maFile or retaining
					the passphrase you enter. Functionality does not prove safety.
				</li>
				<li>
					The attacker may use copied credentials immediately or later. A quiet period
					does not mean the file was safe.
				</li>
			</ol>
			<p>
				<a href="/scam-clones">We have written up the specific patterns and what to check
				for</a>, because the single most useful thing this project can do for somebody
				is make them harder to rob, whether or not they ever use our software.
			</p>

			<h2>Your options, honestly</h2>
			<div class="grid">
				<section>
					<h3>Steam's mobile app</h3>
					<p>
						Official, maintained by Valve, and our recommended default. If you are not
						trading in volume and you are not sure what a maFile is, this is the
						answer and you can stop reading.
					</p>
				</section>
				<section>
					<h3>SDA itself</h3>
					<p>
						No longer supported; its authors recommend the official mobile app. If you
						still need the original release, get it from its own source
						repository and its own releases — never from a search advertisement, a
						YouTube description, or a Discord message.
					</p>
				</section>
				<section>
					<h3>This project</h3>
					<p>
						An independent, open-source alternative, written to be checkable: public
						source, builds produced in public CI, and no self-updating. Version
						${s.release.version} publishes SHA-256 checksums, a Sigstore signature over
						that checksum list, and build provenance naming the workflow and commit
						that produced the bytes. Builds are not yet reproducible. Direct GitHub
						Windows ${s.release.version} downloads ${
							s.release.windowsCodeSigned
								? 'are code-signed and timestamped as MASTERPANEL LLC'
								: 'have no publisher signature'
						}; Linux verification uses checksums and
						provenance. Microsoft separately signs its Store package —
						<a href="/download">the download page tracks where each one stands</a>.
					</p>
				</section>
			</div>

			<h2>How this project relates to SDA</h2>
			<p>
				ODA is a separate implementation, not an official SDA release or an endorsed
				successor. It is built in the open and reads the
				same <code>.maFile</code> format so that nobody is trapped by their choice of
				tool. If you decide to leave, the application
				<a href="/import-from-sda">exports your accounts back out in the same
				format</a>. A security tool that holds your secrets hostage is not a security
				tool.
			</p>

			<h2>Related reading</h2>
			<ul class="plain next">
				<li><a href="/scam-clones">How the fake SDA sites work</a></li>
				<li><a href="/what-is-a-mafile">What is inside a maFile</a></li>
				<li><a href="/steam-guard-code-not-working">If SDA's codes are being refused</a></li>
				<li><a href="/encrypted-mafile">Encrypted maFiles and the manifest</a></li>
				<li><a href="/alternatives">How the options compare</a></li>
				<li><a href="/lost-authenticator">If you have already lost access</a></li>
				<li><a href="/verify">Verifying that a download is genuine</a></li>
				<li><a href="/import-from-sda">Moving maFiles into this application</a></li>
				<li><a href="/security">What this application does with your secrets</a></li>
			</ul>
		</article>`
};
