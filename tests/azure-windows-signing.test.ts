import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { DebugLogger } from 'builder-util';
import type { Configuration } from 'app-builder-lib';
import { validateConfiguration } from 'app-builder-lib/out/util/config/config';

const loadSigning = () => import('../.github/scripts/windows-signing.mjs');
type SigningModule = Awaited<ReturnType<typeof loadSigning>>;
let validateAzureSigningEnvironment: SigningModule['validateAzureSigningEnvironment'];
let windowsSigningOptions: SigningModule['windowsSigningOptions'];
let windowsSigningReady: SigningModule['windowsSigningReady'];
beforeAll(async () => {
	({ validateAzureSigningEnvironment, windowsSigningOptions, windowsSigningReady } =
		await loadSigning());
});

const ROOT = resolve('.');
const ENV = {
	WINDOWS_SIGNING_READY: 'true',
	AZURE_CLIENT_ID: '11111111-1111-1111-1111-111111111111',
	AZURE_TENANT_ID: '22222222-2222-2222-2222-222222222222',
	AZURE_SUBSCRIPTION_ID: '33333333-3333-3333-3333-333333333333',
	AZURE_SIGNING_ENDPOINT: 'https://eus.codesigning.azure.net/',
	AZURE_SIGNING_ACCOUNT: 'masterpanel-oda-signing',
	AZURE_SIGNING_CERTIFICATE_PROFILE: 'oda-public-trust'
};
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');

describe('opt-in Windows signing configuration', () => {
	it.each(['', 'false', undefined])('stays unsigned for readiness %s', (value) => {
		expect(windowsSigningReady(value)).toBe(false);
		expect(windowsSigningOptions({ env: { WINDOWS_SIGNING_READY: value } })).toEqual({
			signExecutable: false
		});
	});
	it.each(['TRUE', 'yes', ' true', '1'])('rejects malformed readiness %s', (value) => {
		expect(() => windowsSigningReady(value)).toThrow('WINDOWS_SIGNING_READY');
	});
	it('enables only the supported SHA256 custom signer and requires signing success', () => {
		expect(
			windowsSigningOptions({ env: ENV, argv: ['--win', 'nsis:x64'], platform: 'win32' })
		).toEqual({
			signExecutable: true,
			forceCodeSigning: true,
			signtoolOptions: {
				sign: './.github/scripts/sign-windows.mjs',
				signingHashAlgorithms: ['sha256'],
				publisherName: 'MASTERPANEL LLC'
			}
		});
	});
	it('passes the installed electron-builder schema with signing enabled', async () => {
		const { default: config } = await import('../electron-builder.config.mjs');
		const win = {
			...config.win,
			...windowsSigningOptions({ env: ENV, argv: ['--win', 'nsis:x64'], platform: 'win32' })
		};
		await expect(
			validateConfiguration({ ...config, win } as Configuration, new DebugLogger(false))
		).resolves.toBeUndefined();
	});
	it.each(Object.keys(ENV).filter((name) => name !== 'WINDOWS_SIGNING_READY'))(
		'fails closed without %s',
		(name) => {
			expect(() => validateAzureSigningEnvironment({ ...ENV, [name]: '' })).toThrow(name);
		}
	);
	it('rejects a different endpoint, account, or profile', () => {
		for (const name of [
			'AZURE_SIGNING_ENDPOINT',
			'AZURE_SIGNING_ACCOUNT',
			'AZURE_SIGNING_CERTIFICATE_PROFILE'
		]) {
			expect(() => validateAzureSigningEnvironment({ ...ENV, [name]: 'other' })).toThrow(name);
		}
	});
	it.each(['appx', 'appx:x64', '--win=appx', '--win=appx:arm64'])(
		'never signs the Store target %s, even without Azure configuration',
		(target) => {
			expect(
				windowsSigningOptions({
					env: { WINDOWS_SIGNING_READY: 'true' },
					argv: [target],
					platform: 'win32'
				})
			).toEqual({ signExecutable: false });
		}
	);
	it.each(['nsis:x64', 'portable:x64', '--win=nsis:x64'])(
		'rejects mixed direct and Store targets (%s)',
		(target) => {
			expect(() =>
				windowsSigningOptions({ env: ENV, argv: ['--win=appx', target], platform: 'win32' })
			).toThrow('separately');
		}
	);
	it.each(['--linux', '--mac'])('leaves %s unchanged', (target) => {
		expect(windowsSigningOptions({ env: ENV, argv: [target], platform: 'linux' })).toEqual({
			signExecutable: false
		});
	});
	it('refuses to attempt Azure Windows signing on another host', () => {
		expect(() => windowsSigningOptions({ env: ENV, argv: ['--win'], platform: 'linux' })).toThrow(
			'Windows runner'
		);
	});
});

describe('Windows signing release boundaries', () => {
	const workflow = read('.github/workflows/release.yml');
	const reusable = read('.github/workflows/package-windows.yml');
	const action = read('.github/actions/package-windows/action.yml');
	const smoke = read('.github/workflows/windows-signing-smoke.yml');
	it('keeps OIDC and environment approval out of unsigned Windows and other platform jobs', () => {
		const unsigned = reusable.slice(
			reusable.indexOf('\n  unsigned:'),
			reusable.indexOf('\n  signed:')
		);
		const signed = reusable.slice(reusable.indexOf('\n  signed:'));
		expect(unsigned).toContain('contents: read');
		expect(unsigned).not.toMatch(/id-token:|environment:/);
		expect(signed).toContain('environment: windows-signing');
		expect(signed).toContain('id-token: write');
		const otherPlatforms = workflow.slice(
			workflow.indexOf('  package:'),
			workflow.indexOf('  publish:')
		);
		expect(otherPlatforms).not.toMatch(/id-token:|azure\/login|os: windows-latest/);
		expect(workflow).toContain('needs: [package, package-windows]');
		expect(workflow).toContain(
			"signing: ${{ needs.version.outputs.windows-signing-ready == 'true' }}"
		);
		expect(workflow).toContain('WINDOWS_SIGNED: ${{ needs.package-windows.outputs.signed }}');
	});
	it('runs source verification before any Azure login and never publishes the smoke test', () => {
		expect(reusable.indexOf('check-windows-signing-source.ps1')).toBeGreaterThan(0);
		expect(reusable.indexOf('check-windows-signing-source.ps1')).toBeLessThan(
			reusable.lastIndexOf('uses: ./.github/actions/package-windows')
		);
		expect(smoke).toContain('mode: smoke');
		expect(smoke).toContain('ref: ${{ github.sha }}');
		expect(smoke).not.toMatch(/contents: write|gh release|attest-build/);
	});
	it('verifies direct downloads and copies them before Store packaging can overwrite unpacked trees', () => {
		expect(action.indexOf('verify-windows-signatures.ps1')).toBeLessThan(
			action.indexOf('Collect direct-download artifacts')
		);
		expect(action.indexOf('Collect direct-download artifacts')).toBeLessThan(
			action.indexOf('name: Package for the Store')
		);
		const store = action.slice(
			action.indexOf('name: Package for the Store'),
			action.indexOf('name: Verify Store notification')
		);
		expect(store).toContain("WINDOWS_SIGNING_READY: 'false'");
		expect(store).toContain('--win appx:x64 appx:arm64 --publish never');
		expect(action).toContain('name: windows-signing-verification');
	});
	it('pins both the signing action and every import of the Microsoft module', () => {
		expect(action).toContain('azure/login@a641126d1b8aa4d1fa005f4f92df94a3a4c4c906');
		expect(action).toContain("dotnet-version: '8.0.425'");
		expect(action).toContain('Install-Module TrustedSigning -RequiredVersion 0.5.8');
		const invoke = read('.github/scripts/invoke-azure-signing.ps1');
		expect(invoke).toContain('Import-Module TrustedSigning -RequiredVersion 0.5.8');
		expect(invoke).toContain('ExcludeAzureCliCredential = $false');
		for (const name of [
			'Environment',
			'WorkloadIdentity',
			'ManagedIdentity',
			'SharedTokenCache',
			'VisualStudio',
			'VisualStudioCode',
			'AzurePowerShell',
			'AzureDeveloperCli',
			'InteractiveBrowser'
		]) {
			expect(invoke).toContain(`Exclude${name}Credential = $true`);
		}
		expect(invoke.indexOf('Assert-OdaAuthenticodeSignature -FilePath')).toBeLessThan(
			invoke.indexOf('Add-Content')
		);
	});
});

// These tests exercise the actual PowerShell policies without contacting Azure,
// installing signing tools, or invoking the signing hook.
describe.skipIf(process.platform !== 'win32')('Windows signing PowerShell guards', () => {
	const roots: string[] = [];
	afterEach(() => {
		for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
	});
	function powershell(script: string, cwd = ROOT, env: NodeJS.ProcessEnv = {}) {
		return spawnSync(
			'pwsh',
			[
				'-NoProfile',
				'-NonInteractive',
				'-EncodedCommand',
				Buffer.from(script, 'utf16le').toString('base64')
			],
			{ cwd, encoding: 'utf8', env: { ...process.env, ...env } }
		);
	}
	it.each([
		['Valid', 'MASTERPANEL LLC', '$true', true],
		['NotSigned', 'MASTERPANEL LLC', '$true', false],
		['HashMismatch', 'MASTERPANEL LLC', '$true', false],
		['Valid', 'Other Publisher', '$true', false],
		['Valid', 'MASTERPANEL LLC', '$false', false]
	])(
		'accepts only a valid publisher and timestamp (%s, %s, %s)',
		(status, publisher, timestamp, valid) => {
			const result = powershell(
				`$ErrorActionPreference='Stop'; . './.github/scripts/windows-authenticode.ps1'; Assert-OdaSignatureDetails -Status '${status}' -Publisher '${publisher}' -HasTimestamp ${timestamp}`
			);
			expect(result.status === 0, result.stderr).toBe(valid);
		}
	);
	function repository() {
		const root = mkdtempSync(join(tmpdir(), 'oda-signing-source-'));
		roots.push(root);
		function git(...args: string[]) {
			const result = spawnSync(
				'git',
				['-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false', ...args],
				{ cwd: root, encoding: 'utf8' }
			);
			expect(result.status, result.stderr).toBe(0);
			return result.stdout.trim();
		}
		git('init', '-b', 'main');
		git('config', 'user.name', 'Signing Policy Test');
		git('config', 'user.email', 'test@example.invalid');
		writeFileSync(join(root, 'package.json'), '{"version":"1.5.0"}');
		git('add', 'package.json');
		git('commit', '-m', 'Main fixture');
		git('tag', 'v1.5.0');
		git('remote', 'add', 'origin', root);
		return { root, git };
	}
	function checkSource(root: string, env: NodeJS.ProcessEnv) {
		return powershell(
			`& '${join(ROOT, '.github/scripts/check-windows-signing-source.ps1').replaceAll("'", "''")}'`,
			root,
			env
		);
	}
	it('accepts a release tag on main and rejects a tag off main', () => {
		const { root, git } = repository();
		const env = { SIGNING_MODE: 'release', GITHUB_REF: 'refs/tags/v1.5.0' };
		const accepted = checkSource(root, env);
		expect(accepted.status, accepted.stderr).toBe(0);
		git('checkout', '-b', 'unreviewed');
		git('commit', '--allow-empty', '-m', 'Unreviewed fixture');
		git('tag', '-f', 'v1.5.0');
		const rejected = checkSource(root, env);
		expect(rejected.status).not.toBe(0);
		expect(rejected.stderr).toContain('not in origin/main history');
	});
	it('requires the exact version tag, and the exact main workflow commit for smoke', () => {
		const { root, git } = repository();
		const sha = git('rev-parse', 'HEAD');
		expect(
			checkSource(root, { SIGNING_MODE: 'release', GITHUB_REF: 'refs/heads/main' }).status
		).not.toBe(0);
		git('tag', 'v1.6.0');
		expect(
			checkSource(root, { SIGNING_MODE: 'release', GITHUB_REF: 'refs/tags/v1.6.0' }).status
		).not.toBe(0);
		const env = { SIGNING_MODE: 'smoke', GITHUB_REF: 'refs/heads/main', GITHUB_SHA: sha };
		const accepted = checkSource(root, env);
		expect(accepted.status, accepted.stderr).toBe(0);
		expect(checkSource(root, { ...env, GITHUB_REF: 'refs/heads/topic' }).status).not.toBe(0);
		expect(checkSource(root, { ...env, GITHUB_SHA: '0'.repeat(40) }).status).not.toBe(0);
	});
	it('requires matching final-file hashes and all three embedded-uninstaller receipts', () => {
		const root = mkdtempSync(join(tmpdir(), 'oda-signature-receipts-'));
		roots.push(root);
		writeFileSync(join(root, 'package.json'), '{"version":"1.5.0"}');
		const installers = ['x64', 'arm64', 'universal'].map(
			(arch) => `open-desktop-authenticator-1.5.0-${arch}-setup.exe`
		);
		const files = [
			...installers,
			'open-desktop-authenticator-1.5.0-portable.exe',
			'win-unpacked/Open Desktop Authenticator.exe',
			'win-arm64-unpacked/Open Desktop Authenticator.exe'
		];
		mkdirSync(join(root, 'release/win-unpacked'), { recursive: true });
		mkdirSync(join(root, 'release/win-arm64-unpacked'), { recursive: true });
		const receipts = files.map((name) => {
			const path = join(root, 'release', name);
			writeFileSync(path, name);
			return {
				path,
				sha256: createHash('sha256').update(name).digest('hex'),
				publisher: 'MASTERPANEL LLC',
				timestamp: true
			};
		});
		for (const name of installers)
			receipts.push({
				path: join(root, 'release', name.slice(0, -3) + '__uninstaller.exe'),
				sha256: '0'.repeat(64),
				publisher: 'MASTERPANEL LLC',
				timestamp: true
			});
		const receiptFile = join(root, 'receipts.jsonl');
		const save = () =>
			writeFileSync(receiptFile, receipts.map((receipt) => JSON.stringify(receipt)).join('\n'));
		save();
		// Mock Windows' signature API only; the real final-file set, receipt,
		// publisher checks and file hashing execute unchanged. Crypto trust itself
		// still requires the later live smoke test on signed binaries.
		const script = `
		function Get-AuthenticodeSignature {
			param([string]$LiteralPath)
			$certificate = [pscustomobject]@{}
			$certificate | Add-Member -MemberType ScriptMethod -Name GetNameInfo -Value { 'MASTERPANEL LLC' }
			[pscustomobject]@{ Status = 'Valid'; SignerCertificate = $certificate; TimeStamperCertificate = $certificate }
		}
		& '${join(ROOT, '.github/scripts/verify-windows-signatures.ps1').replaceAll("'", "''")}'`;
		const run = () =>
			powershell(script, root, {
				WINDOWS_SIGNING_READY: 'true',
				WINDOWS_SIGNING_RECEIPTS: receiptFile
			});
		const accepted = run();
		expect(accepted.status, accepted.stderr).toBe(0);
		const uninstaller = receipts.pop();
		save();
		const missing = run();
		expect(missing.status).not.toBe(0);
		expect(missing.stderr).toContain('No verified receipt for embedded uninstaller');
		if (uninstaller) receipts.push(uninstaller);
		save();
		writeFileSync(join(root, 'release', files[0]!), 'modified after signing');
		const changed = run();
		expect(changed.status).not.toBe(0);
		expect(changed.stderr).toContain('Missing matching signing receipt');
	});
});
