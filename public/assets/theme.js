// VitaLink theme toggle — persists in localStorage, respects prefers-color-scheme,
// auto-injects a sun/moon button into the marketing nav and the app sidebar footer.
(function () {
  var KEY = 'vitalink-theme';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var initial = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initial);

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function iconFor(theme) { return theme === 'dark' ? SUN : MOON; }
  function labelFor(theme) { return theme === 'dark' ? 'Light mode' : 'Dark mode'; }

  function refreshAllButtons() {
    var t = document.documentElement.getAttribute('data-theme');
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].innerHTML = iconFor(t);
      btns[i].setAttribute('data-label', labelFor(t));
      btns[i].setAttribute('aria-label', labelFor(t));
      btns[i].setAttribute('title', labelFor(t));
    }
  }

  function refreshLogos() {
    var t = document.documentElement.getAttribute('data-theme');
    var srcLight = '/assets/logo.svg';
    var srcDark = '/assets/logo-dark.svg';
    var imgs = document.querySelectorAll('img[src*="/assets/logo"], img[data-logo]');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].src = t === 'dark' ? srcDark : srcLight;
    }
  }

  function makeBtn() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('data-i18n-skip', '1');
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      refreshAllButtons();
      refreshLogos();
    });
    return btn;
  }

  function mount() {
    // Marketing nav (index, pitch)
    var navs = document.querySelectorAll('.nav-links');
    for (var i = 0; i < navs.length; i++) {
      if (navs[i].querySelector('.theme-toggle')) continue;
      var btn = makeBtn();
      var cta = navs[i].querySelector('.btn');
      if (cta) navs[i].insertBefore(btn, cta); else navs[i].appendChild(btn);
    }
    // App sidebar footer (rendered by app.js)
    var footers = document.querySelectorAll('.side-footer');
    for (var j = 0; j < footers.length; j++) {
      if (footers[j].querySelector('.theme-toggle')) continue;
      footers[j].insertBefore(makeBtn(), footers[j].firstChild);
    }
    refreshAllButtons();
    refreshLogos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  // Re-run after sidebar renders (app.js may inject after DOMContentLoaded)
  setTimeout(mount, 60);
  setTimeout(mount, 400);

  // Follow OS changes only if user hasn't explicitly chosen
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var handler = function (e) {
      var explicit = null;
      try { explicit = localStorage.getItem(KEY); } catch (err) {}
      if (explicit) return;
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      refreshAllButtons();
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq.addListener) mq.addListener(handler);
  }
})();
