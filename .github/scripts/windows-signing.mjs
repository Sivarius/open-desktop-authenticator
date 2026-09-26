import { pathToFileURL } from 'node:url';

export const WINDOWS_PUBLISHER = 'MASTERPANEL LLC';
export const TRUSTED_SIGNING_VERSION = '0.5.8';

export function windowsSigningReady(value = '') {
	if (value === '' || value === 'false') return false;
	if (value === 'true') return true;
	throw new Error('WINDOWS_SIGNING_READY must be empty, false, or true.');
}

export function validateAzureSigningEnvironment(env = process.env) {
	for (const name of ['AZURE_CLIENT_ID', 'AZURE_TENANT_ID', 'AZURE_SUBSCRIPTION_ID']) {
		if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(env[name] ?? '')) {
			throw new Error(`${name} must contain the configured Azure GUID.`);
		}
	}
	const expected = {
		AZURE_SIGNING_ENDPOINT: 'https://eus.codesigning.azure.net/',
		AZURE_SIGNING_ACCOUNT: 'masterpanel-oda-signing',
		AZURE_SIGNING_CERTIFICATE_PROFILE: 'oda-public-trust'
	};
	for (const [name, value] of Object.entries(expected)) {
		if (env[name] !== value) throw new Error(`${name} must be ${value}.`);
	}
}

export function windowsSigningOptions({
	env = process.env,
	argv = process.argv,
	platform = process.platform
} = {}) {
	const ready = windowsSigningReady(env.WINDOWS_SIGNING_READY);
	const targets = argv.map((arg) => arg.replace(/^--win=/, ''));
	const store = targets.some((arg) => /^appx(?:$|:)/.test(arg));
	const direct = targets.some((arg) => /^(?:nsis|portable)(?::|$)/.test(arg));
	if (store && direct) throw new Error('Build AppX separately from direct Windows downloads.');
	const nonWindows = argv.includes('--linux') || argv.includes('--mac');
	if (!ready || store || nonWindows) return { signExecutable: false };
	if (platform !== 'win32') throw new Error('Azure Windows signing requires a Windows runner.');
	validateAzureSigningEnvironment(env);
	return {
		signExecutable: true,
		forceCodeSigning: true,
		signtoolOptions: {
			sign: './.github/scripts/sign-windows.mjs',
			signingHashAlgorithms: ['sha256'],
			publisherName: WINDOWS_PUBLISHER
		}
	};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	if (process.argv.includes('--readiness')) {
		console.log(`ready=${windowsSigningReady(process.env.WINDOWS_SIGNING_READY)}`);
	} else if (process.argv.includes('--validate')) {
		validateAzureSigningEnvironment();
	} else {
		throw new Error('Use --readiness or --validate.');
	}
}
