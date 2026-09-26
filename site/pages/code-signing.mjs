/**
 * Code signing policy.
 *
 * **This page was originally written to a sponsor's requirements.** An
 * application to use the SignPath Foundation's managed signing service was
 * declined — their programme is for projects with established public
 * visibility, which is a threshold a new project cannot clear by writing better
 * code — so every claim that signed builds were coming, and the attribution line
 * that named them as the sponsor, have been removed. Naming a sponsor who is not
 * sponsoring you is the one thing a page about trust cannot do.
 *
 * The page stays, because most of it never depended on that. "Who is allowed to
 * approve a release" is exactly the question the verification chain leaves open,
 * and it is worth answering whether or not anything is signed. What it says now
 * is the settled position rather than a plan: the Store build carries
 * Microsoft's signature, the direct downloads carry none, and the checksums and
 * the provenance attestation are how a stranger checks them.
 */

export const codeSigningPolicy = {
	slug: 'code-signing-policy',
	updated: '2026-09-12',
	navTitle: 'Code signing policy',
	title: 'Code signing policy',
	description:
		'Which builds carry a signature and which do not, who is accountable for a release, and how to verify one without trusting us.',
	structuredData: (s) => ({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Code signing policy',
		description: 'Signing roles, approval, and verification for Open Desktop Authenticator.',
		publisher: { '@id': s.organizationId }
	}),
	body: (s) => `
		<article>
			<h1>Code signing policy</h1>

			<div class="callout">
				<p>
					<strong>The direct downloads are not code-signed, and no certificate is
					planned.</strong> None of the builds on
					<a href="${s.repo}/releases/latest" rel="noopener">the releases page</a> carry
					a code-signing certificate. Windows may warn or block execution, depending on
					its reputation checks and local policy.
				</p>
				<p>
					We applied for the SignPath Foundation's free open-source signing service and
					were declined. Under that programme, a qualifying project may use a certificate
					issued to SignPath Foundation through its managed signing service. The certificate
					is not issued to the project; SignPath Foundation is the displayed publisher. Its
					<a href="https://signpath.org/terms.html" rel="noopener">published conditions</a>
					require an executable project to have verifiable reputation and leave the
					acceptance decision to the foundation. The rejection said this project did
					not yet have enough public visibility — stars, forks, articles, or independent
					discussion. That outcome is our application record, not something a reader can
					verify on SignPath's public site, so it is labelled here as our report of what
					happened.
				</p>
				<p>
					A valid code-signing certificate would change one important detail: Windows
					could display a verified publisher name instead of an unknown publisher. It
					would not guarantee that SmartScreen stops warning.
					<a href="https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation" rel="noopener">Microsoft now documents</a>
					that unsigned, self-signed and newly signed files can receive reputation
					warnings. Extended Validation certificates no longer bypass the reputation
					process. Signing identifies a publisher and protects signed bytes; it is not
					a guarantee of safe behavior.
					So the honest answer is the one below: use the Store build if you want Microsoft's
					signature, and verify the direct downloads by checksum and attestation.
				</p>
			</div>

			<h2>What carries a signature, and what does not</h2>
			<p>
				The direct installers and executables are not code-signed. Starting with version
				1.5, the release workflow signs <code>SHA256SUMS.txt</code> with Sigstore and
				publishes build provenance for the artifacts. Those records identify this
				project's public workflow and the exact tag in
				<a href="${s.repo}" rel="noopener">this repository</a>; they are not a
				conventional signature on the executable itself.
			</p>
			<p>
				<strong>The Microsoft Store package is separate.</strong> Microsoft
				<a href="https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements" rel="noopener">re-signs the MSIX/AppX package it distributes</a>.
				Windows verifies that package during installation. This does not individually
				code-sign every executable inside it. <a href="/download">The download page</a>
				explains the two distribution channels.
			</p>

			<h2>Team roles</h2>
			<dl class="defs">
				<dt>Committers and reviewers</dt>
				<dd>
					People granted write or review access to the repository. The organisation does
					not publish a member roster, so its public people page is not used as identity
					evidence. Commits, pull-request reviews and workflow runs that actually happen
					remain visible in the public repository.
				</dd>
				<dt>Approvers</dt>
				<dd>
					People with permission to create a release tag and run the release workflow.
					Those GitHub roles are not publicly enumerated. The named publisher accountable
					for the product and its releases is
					<a href="/owners">${s.brand.legal}</a>.
				</dd>
				<dt>Multi-factor authentication</dt>
				<dd>
					Our policy requires it for every person in both roles on GitHub. This is a
					publisher policy statement: GitHub's private membership and account-security
					settings are not public evidence that every account complies. MFA reduces
					password-only compromise; stolen sessions, tokens and compromised workflows
					remain risks that MFA alone does not remove.
				</dd>
			</dl>

			<h2>Privacy</h2>
			<p>
				No ODA backend. No ODA account. No cloud sync. No telemetry. User-requested
				Steam operations contact Valve. In direct GitHub builds, the optional update
				check contacts GitHub; Microsoft Store builds do not perform that check. The
				user-driven browser contacts the sites the user chooses and the third-party
				resources those pages load. Visiting our site through that browser is also
				covered by the website portion of the privacy policy.
				<a href="/privacy">The full privacy policy is here</a>, and
				<a href="/security">the security page</a> describes what the application stores
				and where.
			</p>

			<h2>Verifying a release</h2>
			<p>
				A conventional code-signing certificate would identify who signed an executable;
				it would not identify which source produced it. Version 1.5 instead publishes
				<code>SHA256SUMS.txt</code>, a Sigstore signature over that list, and build
				provenance naming the workflow run, commit and tag.
				<a href="/verify">The verification steps walk through all three</a>, and they are
				worth running whether or not a file is signed.
			</p>
			<p>
				Our two official distribution channels are listed on
				<a href="/official">our official domains page</a>.
			</p>
		</article>`
};

export default codeSigningPolicy;
