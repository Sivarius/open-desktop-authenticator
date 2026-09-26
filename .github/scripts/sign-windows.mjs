import { execFile } from 'node:child_process';
import { isAbsolute, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { validateAzureSigningEnvironment, windowsSigningReady } from './windows-signing.mjs';

const execute = promisify(execFile);
// The Microsoft module uses shared metadata and dependency-cache paths. Keep
// signing calls serial even if a future builder calls this hook concurrently.
let signingQueue = Promise.resolve();

export default function sign(configuration) {
	const next = signingQueue.then(async () => {
		if (process.platform !== 'win32' || !windowsSigningReady(process.env.WINDOWS_SIGNING_READY)) {
			throw new Error('The Azure signing hook requires an explicitly enabled Windows build.');
		}
		validateAzureSigningEnvironment();
		if (configuration.hash !== 'sha256') throw new Error('Only SHA-256 signing is supported.');
		const file = resolve(configuration.path);
		const withinRelease = relative(resolve('release'), file);
		if (withinRelease.startsWith('..') || isAbsolute(withinRelease)) {
			throw new Error('Refusing to sign a file outside the release output directory.');
		}
		if (!process.env.WINDOWS_SIGNING_RECEIPTS) throw new Error('Missing signing receipt path.');
		const { stdout, stderr } = await execute(
			'pwsh.exe',
			[
				'-NoProfile',
				'-NonInteractive',
				'-File',
				resolve('.github/scripts/invoke-azure-signing.ps1'),
				'-FilePath',
				file
			],
			{ timeout: 600_000, maxBuffer: 4 * 1024 * 1024, windowsHide: true }
		);
		if (stdout) process.stdout.write(stdout);
		if (stderr) process.stderr.write(stderr);
	});
	signingQueue = next;
	return next;
}
