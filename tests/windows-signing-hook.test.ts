import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { execute } = vi.hoisted(() => ({ execute: vi.fn() }));
vi.mock('node:child_process', () => ({ execFile: execute }));

// No real child process, signing module, token, or Azure request is used here.
describe.skipIf(process.platform !== 'win32')('the per-file Windows signing hook', () => {
	beforeEach(() => {
		vi.resetModules();
		execute.mockReset();
		for (const [name, value] of Object.entries({
			WINDOWS_SIGNING_READY: 'true',
			AZURE_CLIENT_ID: '11111111-1111-1111-1111-111111111111',
			AZURE_TENANT_ID: '22222222-2222-2222-2222-222222222222',
			AZURE_SUBSCRIPTION_ID: '33333333-3333-3333-3333-333333333333',
			AZURE_SIGNING_ENDPOINT: 'https://eus.codesigning.azure.net/',
			AZURE_SIGNING_ACCOUNT: 'masterpanel-oda-signing',
			AZURE_SIGNING_CERTIFICATE_PROFILE: 'oda-public-trust',
			WINDOWS_SIGNING_RECEIPTS: resolve('unused-test-receipts.jsonl')
		}))
			vi.stubEnv(name, value);
	});
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('serializes per-file calls and passes file paths without shell interpolation', async () => {
		const callbacks: Array<
			(error: Error | null, result: { stdout: string; stderr: string }) => void
		> = [];
		execute.mockImplementation(
			(_file: string, _args: string[], _options: object, callback: (typeof callbacks)[number]) => {
				callbacks.push(callback);
			}
		);
		const { default: sign } = await import('../.github/scripts/sign-windows.mjs');
		const first = sign({ path: 'release/file with spaces.exe', hash: 'sha256' });
		const second = sign({ path: 'release/second.exe', hash: 'sha256' });
		await vi.waitFor(() => {
			expect(execute).toHaveBeenCalledTimes(1);
		});
		expect(execute.mock.calls[0]?.slice(0, 3)).toEqual([
			'pwsh.exe',
			[
				'-NoProfile',
				'-NonInteractive',
				'-File',
				resolve('.github/scripts/invoke-azure-signing.ps1'),
				'-FilePath',
				resolve('release/file with spaces.exe')
			],
			{ timeout: 600_000, maxBuffer: 4 * 1024 * 1024, windowsHide: true }
		]);
		callbacks[0]?.(null, { stdout: '', stderr: '' });
		await first;
		await vi.waitFor(() => {
			expect(execute).toHaveBeenCalledTimes(2);
		});
		callbacks[1]?.(null, { stdout: '', stderr: '' });
		await second;
	});
	it.each([
		['outside release', '../outside.exe', 'sha256', 'WINDOWS_SIGNING_READY', 'true'],
		['wrong digest', 'release/file.exe', 'sha1', 'WINDOWS_SIGNING_READY', 'true'],
		['disabled', 'release/file.exe', 'sha256', 'WINDOWS_SIGNING_READY', 'false'],
		['missing receipts', 'release/file.exe', 'sha256', 'WINDOWS_SIGNING_RECEIPTS', '']
	])('rejects %s before starting a process', async (_label, path, hash, name, value) => {
		vi.stubEnv(name, value);
		const { default: sign } = await import('../.github/scripts/sign-windows.mjs');
		await expect(sign({ path, hash })).rejects.toThrow();
		expect(execute).not.toHaveBeenCalled();
	});
	it('does not continue after a signing process fails', async () => {
		execute.mockImplementation(
			(_file: string, _args: string[], _options: object, callback: (error: Error) => void) => {
				callback(new Error('Signing failed'));
			}
		);
		const { default: sign } = await import('../.github/scripts/sign-windows.mjs');
		await expect(sign({ path: 'release/first.exe', hash: 'sha256' })).rejects.toThrow(
			'Signing failed'
		);
		await expect(sign({ path: 'release/second.exe', hash: 'sha256' })).rejects.toThrow(
			'Signing failed'
		);
		expect(execute).toHaveBeenCalledTimes(1);
	});
});
