import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

type Config = {
	origin: string;
	counterId: number;
	preferenceKey: string;
	publicPaths: string[];
};

const { buildBootstrap } = createRequire(__filename)('../site/metrica/basic-metrica.cjs') as {
	buildBootstrap: (config: Config) => string;
};

const ORIGIN = 'https://opendesktopauthenticator.com';
const COUNTER = 112394427;
const PREFERENCE = 'oda_metrica';
const PUBLIC_PATHS = ['/', '/download', '/privacy'];

type Script = {
	src: string;
	async: boolean;
	referrerPolicy: string;
	onload?: () => void;
	onerror?: () => void;
	remove: ReturnType<typeof vi.fn>;
};
type Tracker = ((...args: unknown[]) => void) & { a?: IArguments[]; l?: number };
type Controls = { refresh(): void; disable(): void; enable(): void };
type PrivacySignals = {
	globalPrivacyControl?: boolean;
	doNotTrack?: string;
	msDoNotTrack?: string;
};
type BrowserOptions = {
	url?: string;
	publicPaths?: string[];
	navigator?: PrivacySignals;
	windowDoNotTrack?: string;
	preference?: string;
	storageReadDenied?: boolean;
	storageWriteDenied?: boolean;
};

function browser(options: BrowserOptions = {}) {
	const scripts: Script[] = [];
	const calls: unknown[][] = [];
	const cookieWrites: string[] = [];
	const preferences = new Map<string, string>();
	if (options.preference !== undefined) preferences.set(PREFERENCE, options.preference);
	const events = new Map<string, () => void>();
	const location = new URL(options.url ?? `${ORIGIN}/`);
	const navigator: PrivacySignals = { ...options.navigator };
	const window: {
		doNotTrack?: string;
		ym?: Tracker;
		__basicMetricaPublic?: Controls;
		addEventListener(name: string, listener: () => void): void;
	} = {
		doNotTrack: options.windowDoNotTrack,
		addEventListener(name, listener) {
			events.set(name, listener);
		}
	};
	const history = {
		pushState(_state: unknown, _title: string, url: string) {
			location.href = new URL(url, location.href).href;
		},
		replaceState(_state: unknown, _title: string, url: string) {
			location.href = new URL(url, location.href).href;
		}
	};
	const localStorage = {
		getItem(key: string) {
			if (options.storageReadDenied) throw new Error('Storage access denied');
			return preferences.get(key) ?? null;
		},
		setItem(key: string, value: string) {
			if (options.storageWriteDenied) throw new Error('Storage access denied');
			preferences.set(key, value);
		}
	};
	const document = {
		hidden: false,
		get cookie() {
			return '_ym_uid=old-analytics-id; unrelated=keep';
		},
		set cookie(value: string) {
			cookieWrites.push(value);
		},
		createElement(tag: string): Script {
			expect(tag).toBe('script');
			return { src: '', async: false, referrerPolicy: '', remove: vi.fn() };
		},
		head: {
			appendChild(script: Script) {
				scripts.push(script);
			}
		},
		addEventListener(name: string, listener: () => void) {
			events.set(name, listener);
		}
	};
	const config = {
		origin: ORIGIN,
		counterId: COUNTER,
		preferenceKey: PREFERENCE,
		publicPaths: options.publicPaths ?? PUBLIC_PATHS
	};
	runInNewContext(buildBootstrap(config), {
		window,
		document,
		navigator,
		location,
		history,
		localStorage,
		setTimeout
	});
	return {
		window,
		navigator,
		location,
		history,
		scripts,
		calls,
		preferences,
		cookieWrites,
		controls: window.__basicMetricaPublic!,
		finishLoading(script = scripts.at(-1)!) {
			// Simulate the vendor replacing its queue before firing the load event.
			window.ym = (...args: unknown[]) => calls.push(args);
			script.onload?.();
		},
		emit(name: string) {
			events.get(name)?.();
		}
	};
}

describe('public-page Metrica privacy boundaries', () => {
	it.each([
		['an unlisted page', `${ORIGIN}/not-a-public-page`, PUBLIC_PATHS],
		['a private ticket', `${ORIGIN}/support/ticket/private-token`, PUBLIC_PATHS],
		['an accidentally allowlisted admin path', `${ORIGIN}/admin`, [...PUBLIC_PATHS, '/admin']],
		['a different origin', 'https://example.org/download', PUBLIC_PATHS]
	])('does not load analytics on %s', (_label, url, publicPaths) => {
		const page = browser({ url, publicPaths });
		expect(page.scripts).toHaveLength(0);
		expect(page.window.ym).toBeUndefined();
		expect(page.calls).toEqual([]);
	});

	it.each<[string, BrowserOptions]>([
		['Global Privacy Control', { navigator: { globalPrivacyControl: true } }],
		['navigator Do Not Track', { navigator: { doNotTrack: '1' } }],
		['window Do Not Track', { windowDoNotTrack: 'yes' }],
		['legacy Do Not Track', { navigator: { msDoNotTrack: '1' } }],
		['a saved disabled choice', { preference: '0' }],
		['a saved denied choice', { preference: 'denied' }],
		['unreadable storage', { storageReadDenied: true }]
	])('does not load analytics with %s', (_label, options) => {
		const page = browser(options);
		page.controls.refresh();
		page.emit('focus');
		expect(page.scripts).toHaveLength(0);
		expect(page.calls).toEqual([]);
		expect(page.cookieWrites.length).toBeGreaterThan(0);
		expect(page.cookieWrites.every((cookie) => cookie.startsWith('_ym_uid=;'))).toBe(true);
	});

	it('sends only allowlisted paths, excluding query, hash, referrer details and page titles', () => {
		const page = browser({ url: `${ORIGIN}/download?email=private@example.org#secret-token` });
		expect(page.scripts).toHaveLength(1);
		expect(page.scripts[0]).toMatchObject({
			src: `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER}`,
			referrerPolicy: 'origin'
		});
		expect(page.window.ym?.a ?? []).toHaveLength(0);
		page.finishLoading();
		expect(page.calls).toEqual([
			[
				COUNTER,
				'init',
				expect.objectContaining({
					url: `${ORIGIN}/download`,
					referrer: `${ORIGIN}/`,
					defer: true,
					webvisor: false,
					trackLinks: false,
					trackHash: false,
					clickmap: false,
					ecommerce: false,
					sendTitle: false
				})
			],
			[COUNTER, 'hit', `${ORIGIN}/download`, { title: '', referer: `${ORIGIN}/` }]
		]);
		page.history.replaceState(null, '', '/download?another=private-value#another-secret');
		expect(page.calls).toHaveLength(2);
		page.history.pushState(null, '', '/privacy?account=private-account#private-fragment');
		expect(page.calls.at(-1)).toEqual([
			COUNTER,
			'hit',
			`${ORIGIN}/privacy`,
			{ title: '', referer: `${ORIGIN}/` }
		]);
		expect(JSON.stringify(page.calls)).not.toMatch(/private|secret|email|account|fragment/);
		page.history.pushState(null, '', '/support/ticket/private-token');
		expect(page.calls.at(-1)).toEqual([COUNTER, 'destruct']);
		expect(page.calls.filter((call) => call[1] === 'hit')).toHaveLength(2);
	});

	it.each(['saved choice', 'privacy signal', 'private navigation'])(
		'rechecks a changed %s before the vendor can initialize',
		(change) => {
			const page = browser();
			if (change === 'saved choice') page.preferences.set(PREFERENCE, '0');
			if (change === 'privacy signal') page.navigator.globalPrivacyControl = true;
			if (change === 'private navigation') page.location.pathname = '/support/ticket/private-token';
			page.finishLoading();
			expect(page.calls).toEqual([]);
		}
	);

	it('cancels a pending vendor load and ignores its late callback after disable and re-enable', () => {
		const page = browser();
		const first = page.scripts[0]!;
		page.controls.disable();
		expect(first.remove).toHaveBeenCalledOnce();
		expect(page.preferences.get(PREFERENCE)).toBe('0');
		page.finishLoading(first);
		expect(page.calls).toEqual([]);
		page.controls.enable();
		expect(page.scripts).toHaveLength(2);
		expect(page.preferences.get(PREFERENCE)).toBe('1');
		page.finishLoading(first);
		expect(page.calls).toEqual([]);
		page.finishLoading(page.scripts[1]);
		expect(page.calls.map((call) => call[1])).toEqual(['init', 'hit']);
	});

	it('keeps disable effective in this tab even when saving the preference fails', () => {
		const page = browser({ storageWriteDenied: true });
		page.controls.disable();
		page.controls.refresh();
		page.emit('focus');
		page.finishLoading();
		expect(page.scripts).toHaveLength(1);
		expect(page.scripts[0]!.remove).toHaveBeenCalledOnce();
		expect(page.calls).toEqual([]);
		page.controls.enable();
		expect(page.scripts).toHaveLength(1);
		expect(page.calls).toEqual([]);
	});

	it('stops an initialized counter when another tab saves a disabled preference', () => {
		const page = browser();
		page.finishLoading();
		page.preferences.set(PREFERENCE, '0');
		page.emit('storage');
		expect(page.calls.map((call) => call[1])).toEqual(['init', 'hit', 'destruct']);
		page.emit('focus');
		expect(page.calls).toHaveLength(3);
	});
});
