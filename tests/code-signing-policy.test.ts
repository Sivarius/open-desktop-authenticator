import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Windows signing began with 1.5.1 through Microsoft Azure Artifact Signing.
 * Public pages must preserve the separate meanings of Windows Authenticode,
 * Store package signing and Sigstore release evidence, including older releases.
 */

const root = join(__dirname, '..');
const read = (...parts: string[]) => readFileSync(join(root, ...parts), 'utf8');

const POLICY = read('site', 'pages', 'code-signing.mjs');
const HOME = read('site', 'pages', 'home.mjs');
const DOWNLOAD = read('site', 'pages', 'guides.mjs');
const INDEX = read('site', 'pages', 'index.mjs');
const BUILD = read('site', 'build.mjs');

/** The sentence their terms require of a sponsored project. */
const ATTRIBUTION = 'Free code signing provided by SignPath.io, certificate by SignPath Foundation';

let pages: typeof import('../site/pages/index.mjs', { with: { 'resolution-mode': 'import' } });
beforeAll(async () => {
	pages = await import('../site/pages/index.mjs');
});

const rendered = (slug: string, codeSigned: boolean) => {
	const page = pages.PAGES.find((candidate) => candidate.slug === slug);
	if (!page) throw new Error(`Missing signing surface: ${slug}`);
	const version = codeSigned ? '1.5.1' : '1.5.0';
	return page
		.body({
			name: 'Open Desktop Authenticator',
			version,
			repo: 'https://github.com/opendesktopauthenticator/open-desktop-authenticator',
			brand: { legal: 'MASTERPANEL LLC' },
			store: { url: 'https://apps.microsoft.com/detail/9NMM2XJ6HZ1D' },
			sda: {
				notice: 'no longer supported',
				authorsAdvice: 'use the official mobile app',
				author: 'Jessecar96',
				repo: 'https://github.com/Jessecar96/SteamDesktopAuthenticator'
			},
			reviews: {
				profile: 'https://example.test/reviews',
				write: 'https://example.test/review',
				widget: { locale: 'en-US', templateId: 'template', businessUnitId: 'unit', token: 'token' }
			},
			publication: {
				github: { current: true, latestVersion: version },
				store: { current: !codeSigned, latestVersion: '1.5.0' }
			},
			release: { version, codeSigned, checksums: true, signed: true, published: true }
		})
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ');
};

describe('the code signing policy page', () => {
	it('no longer carries a sponsor attribution', () => {
		expect(
			POLICY,
			'the page names SignPath as the sponsor of a certificate this project does not have, ' +
				'which is a false claim on the one page whose subject is who you can trust'
		).not.toContain(ATTRIBUTION);
	});

	it('is a real page in the site, not an orphan file', () => {
		expect(INDEX).toContain('codeSigningPolicy');
		expect(POLICY).toContain("slug: 'code-signing-policy'");
	});

	/*
	 * The page survives the sponsor. Both surfaces still link to it, because "who
	 * approved this release" is a question a reader has whether or not a signature
	 * exists — and a dangling route would be worse than the claim it replaced.
	 */
	it.each([
		['the home page', () => HOME],
		['the download page', () => DOWNLOAD]
	])('is still reachable from %s', (_where, source) => {
		expect(source()).toContain('/code-signing-policy');
	});

	it('still names both accountable roles', () => {
		expect(POLICY).toMatch(/Committers and reviewers/);
		expect(POLICY).toMatch(/Approvers/);
	});

	it('does not present a private GitHub membership roster as public identity evidence', () => {
		expect(POLICY).not.toMatch(/github\.com\/orgs\/\$\{s\.githubOrg\}\/people/);
		expect(POLICY).toMatch(/does\s+not publish a member roster/);
		expect(POLICY).toMatch(/named publisher accountable/);
		expect(POLICY).toContain('/owners');
	});

	it('still states the multi-factor requirement', () => {
		expect(POLICY).toMatch(/multi-factor authentication/i);
	});

	it('still covers privacy by link and by statement', () => {
		expect(POLICY).toContain('/privacy');
		expect(POLICY).toContain('No ODA backend. No ODA account. No cloud sync. No telemetry.');
		expect(POLICY).toMatch(/Steam operations contact Valve/);
		expect(POLICY).toMatch(/optional update\s+check contacts GitHub/);
		expect(POLICY).toMatch(/browser contacts the sites the user chooses/);
	});
});

/**
 * The old SignPath application must not reappear as a current pending service
 * or a sponsor. Historical release notes remain descriptions of their release.
 */
describe('what the project says about signing', () => {
	const SURFACES: [string, string][] = [
		...readdirSync(join(root, 'site', 'pages'))
			.filter((name) => name.endsWith('.mjs'))
			.map((name): [string, string] => [`site/pages/${name}`, read('site', 'pages', name)]),
		['site/markup.mjs', read('site', 'markup.mjs')],
		['site/build.mjs', BUILD],
		['README.md', read('README.md')],
		['.github/workflows/release.yml', read('.github', 'workflows', 'release.yml')],
		/*
		 * **The changelog was the surface nobody remembered.** This list was
		 * written to stop exactly that — "a guard that only looks where you
		 * remembered to look" — and then omitted the one document a reader opens
		 * to find out what a release contains. The 1.0.0 entry said the direct
		 * downloads "carry no code-signing certificate yet" for a week after the
		 * application was declined, so the file recording what is true of each
		 * release was the last place still promising one.
		 */
		['CHANGELOG.md', read('CHANGELOG.md')],
		['docs/RELEASE_CHECKLIST.md', read('docs', 'RELEASE_CHECKLIST.md')]
	];

	it('has surfaces to check at all', () => {
		expect(
			SURFACES.length,
			'nothing was read, so every assertion below is vacuous'
		).toBeGreaterThan(8);
	});

	/*
	 * Checksum-list and historical signing gaps are independent of the obsolete
	 * promise that the SignPath application will provide a future certificate.
	 */
	const PENDING =
		/code[- ]signing certificate yet|certificate yet|are applying to|application is in progress|has not been granted|once (that|the certificate) is granted|until the SignPath|when signing exists|blocked on SignPath/i;

	it.each(SURFACES)('%s does not say a certificate is coming', (_where, source) => {
		const hit = PENDING.exec(source);
		expect(
			hit?.[0],
			'this surface still describes an obsolete pending code-signing application'
		).toBeUndefined();
	});

	it.each(['code-signing-policy', 'download', 'verify'])(
		'%s describes the signed Windows release without reviving the old no-signing stance',
		(slug) => {
			const body = rendered(slug, true);
			expect(body).toContain('MASTERPANEL LLC');
			expect(body).toContain('Microsoft Azure Artifact Signing');
			expect(body).toContain('Linux packages');
			expect(body).not.toMatch(/no certificate is|none is (?:currently )?planned|SignPath/i);
		}
	);

	it('requires a valid signature and expected publisher for the signed Windows release', () => {
		const signed = rendered('verify', true);
		expect(signed).toMatch(/Status should read Valid/);
		expect(signed).toMatch(/SignerCertificate should name MASTERPANEL LLC/);
		expect(signed).toContain('TimeStamperCertificate');
		expect(signed).toMatch(
			/NotSigned\s*, or any result other than Valid means this check has not succeeded/
		);
		expect(signed).not.toMatch(/Status reads NotSigned for this release/);
		expect(rendered('verify', false)).toMatch(/Status reads NotSigned for this release/);
	});

	it('moves Windows signing from missing to finished only for the signed release', () => {
		const signed = rendered('download', true);
		const unsigned = rendered('download', false);
		expect(signed.split('What is finished')[1]?.split('What is still missing')[0]).toMatch(
			/Windows installers and the portable executable signed and timestamped/
		);
		expect(signed.split('What is still missing')[1]).not.toContain('code-signing certificate');
		expect(unsigned.split('What is still missing')[1]).toContain('code-signing certificate');
		expect(unsigned).not.toContain('Microsoft Azure Artifact Signing');
	});
});
