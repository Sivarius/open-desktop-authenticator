/** Generate a same-origin bootstrap for explicitly allowed public pageviews. */
function bootstrap(config) {
  'use strict';
  if (window.__basicMetricaPublic) return;
  var allowedPaths = new Set(config.publicPaths);
  var initialized = false;
  var lastPage = '';
  var libraryRequested = false;
  var libraryReady = false;
  var pendingScript = null;
  var loadGeneration = 0;
  var disabledInTab = false;

  function allowed() {
    if (disabledInTab) return false;
    if (location.origin !== config.origin || !allowedPaths.has(location.pathname)) return false;
    if (/^\/(?:api|admin|dashboard|auth|login|signup|register|checkout|ticket|tickets|report|reports)(?:\/|$)/i.test(location.pathname)) return false;
    if (navigator.globalPrivacyControl === true) return false;
    if ([navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some(function (value) { return value === '1' || value === 'yes'; })) return false;
    try {
      var choice = config.preferenceKey ? localStorage.getItem(config.preferenceKey) : null;
      if (choice === '0' || choice === 'denied') return false;
    } catch (_) {
      return false;
    }
    return true;
  }

  function clearCookies() {
    var names = document.cookie.split(';').map(function (part) { return part.trim().split('=')[0]; });
    var host = location.hostname;
    names.forEach(function (name) {
      if (!/^_ym_/.test(name)) return;
      ['', host, '.' + host].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax; Secure';
      });
    });
  }

  function stop() {
    if (window.ym && Array.isArray(window.ym.a)) {
      window.ym.a = window.ym.a.filter(function (args) { return Number(args[0]) !== config.counterId; });
    }
    if (!libraryReady && pendingScript) {
      loadGeneration += 1;
      pendingScript.remove();
      pendingScript = null;
      libraryRequested = false;
    }
    if (initialized && libraryReady && window.ym) window.ym(config.counterId, 'destruct');
    initialized = false;
    lastPage = '';
  }

  function refresh() {
    if (!allowed()) {
      stop();
      clearCookies();
      return;
    }
    var safeUrl = config.origin + location.pathname;
    if (!window.ym) {
      window.ym = function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
    }
    // Never queue an init or hit while the vendor library is downloading.
    // Re-check the live preference and path when it finishes loading instead.
    if (!libraryReady) {
      if (!libraryRequested) {
        libraryRequested = true;
        var generation = ++loadGeneration;
        var script = document.createElement('script');
        pendingScript = script;
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + config.counterId;
        script.referrerPolicy = 'origin';
        script.onload = function () {
          if (generation !== loadGeneration) return;
          libraryReady = true;
          pendingScript = null;
          refresh();
        };
        script.onerror = function () {
          if (generation !== loadGeneration) return;
          pendingScript = null;
          libraryRequested = false;
        };
        document.head.appendChild(script);
      }
      return;
    }
    if (!initialized) {
      window.ym(config.counterId, 'init', {
        defer: true,
        url: safeUrl,
        referrer: config.origin + '/',
        clickmap: false,
        trackLinks: false,
        accurateTrackBounce: false,
        webvisor: false,
        ecommerce: false,
        trackHash: false,
        childIframe: false,
        sendTitle: false,
        disableYtm: true
      });
      initialized = true;
    }
    if (lastPage !== safeUrl) {
      window.ym(config.counterId, 'hit', safeUrl, { title: '', referer: config.origin + '/' });
      lastPage = safeUrl;
    }
  }

  function disable() {
    disabledInTab = true;
    try { if (config.preferenceKey) localStorage.setItem(config.preferenceKey, '0'); } catch (_) {}
    stop();
    clearCookies();
  }

  function enable() {
    disabledInTab = false;
    try { if (config.preferenceKey) localStorage.setItem(config.preferenceKey, '1'); } catch (_) { return; }
    refresh();
  }

  ['pushState', 'replaceState'].forEach(function (method) {
    var original = history[method];
    history[method] = function () {
      var result = original.apply(this, arguments);
      refresh();
      return result;
    };
  });
  window.addEventListener('popstate', refresh);
  window.addEventListener('storage', refresh);
  window.addEventListener('focus', refresh);
  window.addEventListener('metrica:preferencechange', refresh);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  // Existing analytics controls may save their choice during the click event.
  // Re-read only that preference after the event; no click data is collected.
  document.addEventListener('click', function () { setTimeout(refresh, 0); }, true);
  window.__basicMetricaPublic = { refresh: refresh, disable: disable, enable: enable };
  refresh();
}

function buildBootstrap(config) {
  if (!Number.isSafeInteger(config.counterId) || config.counterId <= 0) throw new Error('Invalid Metrica counter ID');
  const origin = new URL(config.origin);
  if (origin.protocol !== 'https:' || origin.origin !== config.origin) throw new Error('Expected canonical HTTPS origin');
  if (!Array.isArray(config.publicPaths) || !config.publicPaths.length || config.publicPaths.some((value) => typeof value !== 'string' || !value.startsWith('/') || /[?#]/.test(value))) throw new Error('Invalid public page allowlist');
  return '/* Basic public-page analytics. Generated from the current public sitemap. */\n(' + bootstrap.toString() + ')(' + JSON.stringify(config) + ');\n';
}

module.exports = { buildBootstrap };
