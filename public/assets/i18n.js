// VitaLink — full-site translation via Google Translate,
// driven by a custom in-house language picker so the UX matches our brand.
//
// How it works:
//   1. On first load, i18n.js reads the saved language from localStorage.
//   2. If it's not English, we set a `googtrans` cookie that Google Translate
//      reads to translate every text node on the page automatically.
//   3. When the user picks a new language in our picker, we update the cookie
//      and reload — Google translates the newly loaded HTML.
//   4. Google's own UI (banner, tooltip, highlight) is hidden via CSS so
//      only our custom pill and dropdown are visible.
//
// Trade-offs: this uses Google's free translate service — a real launch would
// route through a paid API for consistency and to avoid the third-party dep.
(function () {
  const LANGS = [
    { code: 'en',    native: 'English',    dir: 'ltr' },
    { code: 'es',    native: 'Español',    dir: 'ltr' },
    { code: 'fr',    native: 'Français',   dir: 'ltr' },
    { code: 'de',    native: 'Deutsch',    dir: 'ltr' },
    { code: 'pt',    native: 'Português',  dir: 'ltr' },
    { code: 'it',    native: 'Italiano',   dir: 'ltr' },
    { code: 'ja',    native: '日本語',      dir: 'ltr' },
    { code: 'zh-CN', native: '中文',        dir: 'ltr' },
    { code: 'ko',    native: '한국어',      dir: 'ltr' },
    { code: 'hi',    native: 'हिन्दी',      dir: 'ltr' },
    { code: 'ru',    native: 'Русский',    dir: 'ltr' },
    { code: 'ar',    native: 'العربية',    dir: 'rtl' },
  ];

  const STORAGE_KEY = 'vitalink.lang';

  function currentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGS.find(l => l.code === saved)) return saved;
    return 'en';
  }

  function shortCode(code) {
    // Show a short badge on the picker button: EN, ES, ZH, etc.
    if (code === 'zh-CN') return 'ZH';
    return code.slice(0, 2).toUpperCase();
  }

  function clearGoogTransCookie() {
    // Clear on all possible domain / path combos.
    const parts = location.hostname.split('.');
    const domains = ['', '.' + location.hostname];
    if (parts.length > 1) domains.push('.' + parts.slice(-2).join('.'));
    domains.forEach(d => {
      document.cookie = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' + (d ? ';domain=' + d : '');
    });
  }

  function setLang(code) {
    localStorage.setItem(STORAGE_KEY, code);
    clearGoogTransCookie();
    if (code !== 'en') {
      // Google Translate reads this cookie to translate the page.
      const value = '/en/' + code;
      document.cookie = 'googtrans=' + value + ';path=/';
      document.cookie = 'googtrans=' + value + ';path=/;domain=.' + location.hostname;
    }
    location.reload();
  }

  // Apply the saved language on every page load by making sure the cookie
  // matches localStorage before Google's script runs.
  function primeGoogTransCookie() {
    const lang = currentLang();
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    const cur = match ? decodeURIComponent(match[1]) : '';
    const want = lang === 'en' ? '' : ('/en/' + lang);
    if (cur !== want) {
      clearGoogTransCookie();
      if (want) {
        document.cookie = 'googtrans=' + want + ';path=/';
      }
      if (match) {
        // Cookie was wrong — reload once to let Google pick it up.
        location.reload();
      }
    }
  }

  function loadGoogleTranslate() {
    if (document.getElementById('google_translate_element')) return;
    const mount = document.createElement('div');
    mount.id = 'google_translate_element';
    document.body.appendChild(mount);

    window.googleTranslateElementInit = function () {
      // eslint-disable-next-line no-undef
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: LANGS.filter(l => l.code !== 'en').map(l => l.code).join(','),
        autoDisplay: false,
      }, 'google_translate_element');
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }

  // ---- Custom picker UI -------------------------------------------------------
  function refreshPicker(root) {
    const lang = currentLang();
    const label = root.querySelector('.lang-picker-code');
    if (label) label.textContent = shortCode(lang);
    root.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });
  }

  function buildPicker() {
    const wrap = document.createElement('div');
    wrap.className = 'lang-picker notranslate'; // notranslate = don't let Google translate the picker itself
    wrap.setAttribute('translate', 'no');
    wrap.innerHTML = `
      <button type="button" class="lang-picker-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span class="lang-picker-code">EN</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lang-picker-caret"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="lang-menu" role="listbox">
        ${LANGS.map(l => `
          <button type="button" class="lang-option" role="option" data-lang="${l.code}">
            <span class="lang-option-code">${shortCode(l.code)}</span>
            <span class="lang-option-name">${l.native}</span>
          </button>
        `).join('')}
      </div>
    `;
    const btn = wrap.querySelector('.lang-picker-btn');
    const menu = wrap.querySelector('.lang-menu');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', () => {
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    menu.addEventListener('click', (e) => e.stopPropagation());
    wrap.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', () => setLang(opt.dataset.lang));
    });
    refreshPicker(wrap);
    return wrap;
  }

  function mountPickers() {
    document.querySelectorAll('.nav-links').forEach(nav => {
      if (nav.querySelector('.lang-picker')) return;
      const picker = buildPicker();
      const anchor = nav.querySelector('.btn');
      if (anchor) nav.insertBefore(picker, anchor);
      else nav.appendChild(picker);
    });
    document.querySelectorAll('[data-lang-mount]').forEach(el => {
      if (el.querySelector('.lang-picker')) return;
      el.appendChild(buildPicker());
    });
  }

  function applyDirection() {
    const lang = currentLang();
    const meta = LANGS.find(l => l.code === lang) || LANGS[0];
    document.documentElement.setAttribute('dir', meta.dir);
    document.documentElement.setAttribute('lang', lang);
  }

  function init() {
    applyDirection();
    primeGoogTransCookie();
    mountPickers();
    loadGoogleTranslate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.VitalinkI18n = { mountPickers, setLang, currentLang };
})();
