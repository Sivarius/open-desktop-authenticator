/**
 * Code signing policy.
 *
 * Direct Windows signing is recorded only after inspecting published files.
 * It is distinct from Store package signing, Linux integrity evidence and the
 * Sigstore checksum-list signature. No sponsor or security audit is implied.
 */

export const codeSigningPolicy = {
	slug: 'code-signing-policy',
	updated: '2026-09-26',
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
					<strong>The Windows installers and portable executable in GitHub v1.5.1 are
					code-signed and timestamped as MASTERPANEL LLC.</strong> We checked the four
					<a href="${s.repo}/releases/tag/v1.5.1" rel="noopener">published Windows files</a>
					for valid Authenticode signatures, timestamps, matching checksums and
					tag-bound build provenance. This signing statement does not cover Linux.
				</p>
				<p>
					Signing uses <a href="https://learn.microsoft.com/en-us/azure/artifact-signing/overview" rel="noopener">Microsoft Azure Artifact Signing</a>
					with our verified publisher identity. This is our signing service, not a
					Microsoft endorsement or an independent review of the application's security.
					Earlier direct Windows releases, including v1.0.0 and v1.5.0, remain without
					publisher signatures; their existing release files have not been replaced.
				</p>
				<p>
					Windows can now display MASTERPANEL LLC as the verified publisher. A valid
					signature does not guarantee that SmartScreen stops warning.
					<a href="https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation" rel="noopener">Microsoft now documents</a>
					that unsigned, self-signed and newly signed files can receive reputation
					warnings. Extended Validation certificates no longer bypass the reputation
					process. Signing identifies a publisher and protects signed bytes; it is not
					a guarantee of safe behavior.
					Use the signature, checksum and provenance checks together. Do not dismiss a
					malware detection or bypass an organisation's device policy because a file is signed.
				</p>
			</div>

			<h2>What carries a signature, and what does not</h2>
			<p>
				The v1.5.1 Windows x64, ARM64 and combined installers, plus the portable
				Windows executable, carry publisher signatures and Microsoft timestamps.
				Linux AppImage and Debian packages do not carry Authenticode signatures.
				Starting with version 1.5.0, the release workflow signs <code>SHA256SUMS.txt</code> with Sigstore and
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
					The Windows signing job also waits for approval in the protected
					<code>windows-signing</code> GitHub environment. The workflow uses a short-lived
					GitHub identity restricted to that repository and environment, with signing
					permission scoped to this certificate profile. It does not store a reusable
					Azure client secret. The environment permits self-review: this is an explicit
					release gate, not a claim of independent two-person approval.
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
				A code-signing certificate identifies who signed an executable; it does not
				identify which source produced it. Version 1.5.1 additionally publishes
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
