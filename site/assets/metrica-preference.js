/* Browser preference for website-only Yandex Metrica. */
(() => {
  const button = document.getElementById('oda-metrica-toggle');
  const status = document.getElementById('oda-metrica-status');
  if (!button || !status) return;
  function state() {
    if (navigator.globalPrivacyControl === true || [navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some(v => v === '1' || v === 'yes')) return { enabled: false, locked: true, text: 'Yandex analytics is disabled by your browser privacy signal.' };
    try {
      const value = localStorage.getItem('oda_metrica');
      const enabled = value !== '0' && value !== 'denied';
      return { enabled, locked: false, text: enabled ? 'Yandex analytics is enabled for public website pages in this browser.' : 'Yandex analytics is disabled in this browser.' };
    } catch (_) { return { enabled: false, locked: true, text: 'Yandex analytics is disabled because browser storage is unavailable.' }; }
  }
  function update() {
    const current = state();
    status.textContent = current.text;
    button.textContent = current.enabled ? 'Disable Yandex analytics' : 'Enable Yandex analytics';
    button.disabled = current.locked;
    button.setAttribute('aria-pressed', String(current.enabled));
  }
  button.addEventListener('click', () => {
    const api = window.__basicMetricaPublic;
    if (!api) return;
    state().enabled ? api.disable() : api.enable();
    update();
  });
  window.addEventListener('storage', update);
  window.addEventListener('focus', update);
  window.addEventListener('metrica:preferencechange', update);
  update();
})();
