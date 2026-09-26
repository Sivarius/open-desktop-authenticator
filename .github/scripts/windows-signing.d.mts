export const WINDOWS_PUBLISHER: string;
export const TRUSTED_SIGNING_VERSION: string;
export function windowsSigningReady(value?: string): boolean;
export function validateAzureSigningEnvironment(env?: NodeJS.ProcessEnv): void;
export function windowsSigningOptions(options?: {
	env?: NodeJS.ProcessEnv;
	argv?: string[];
	platform?: string;
}): {
	signExecutable: boolean;
	forceCodeSigning?: boolean;
	signtoolOptions?: {
		sign: string;
		signingHashAlgorithms: string[];
		publisherName: string;
	};
};
