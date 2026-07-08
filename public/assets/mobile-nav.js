// VitaLink mobile nav — injects a sticky top bar with hamburger + brand + theme toggle,
// and (on marketing pages) a slide-in drawer with all nav links + language + CTA.
// On app pages, the existing .sidebar is used as the drawer and toggled via .is-open.
(function () {
  var HAMBURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  var CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function ensureMobileTopbar() {
    if (document.querySelector('.mobile-topbar')) return;
    var brandSrc = document.querySelector('.brand, .sidebar .brand');
    var brandInner = brandSrc
      ? brandSrc.innerHTML
      : '<img src="/assets/logo.svg" alt="VitaLink" /><span>VitaLink</span>';

    var topbar = el('div', 'mobile-topbar');
    var btn = el('button', 'mobile-topbar-btn', HAMBURGER);
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('data-mobile-nav-open', '');
    var brand = el('a', 'brand', brandInner);
    brand.href = '/';
    topbar.appendChild(btn);
    topbar.appendChild(brand);
    document.body.insertBefore(topbar, document.body.firstChild);
  }

  function buildOverlay() {
    var overlay = document.querySelector('.mobile-drawer-overlay');
    if (overlay) return overlay;
    overlay = el('div', 'mobile-drawer-overlay');
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);
    return overlay;
  }

  function buildMarketingDrawer() {
    // For marketing pages (index, pitch) — build a fresh drawer with the nav links.
    if (document.querySelector('.mobile-drawer[data-mobile-drawer]')) return;
    var links = [];
    var navLinksEl = document.querySelector('.nav .nav-links');
    if (navLinksEl) {
      var anchors = navLinksEl.querySelectorAll('a');
      for (var i = 0; i < anchors.length; i++) {
        links.push({
          href: anchors[i].getAttribute('href'),
          text: anchors[i].textContent.trim(),
          cta: anchors[i].classList.contains('btn-primary')
        });
      }
    }

    var drawer = el('div', 'mobile-drawer');
    drawer.setAttribute('data-mobile-drawer', '');
    var head = el('div', 'mobile-drawer-head');
    var brand = el('a', 'brand', '<img src="/assets/logo.svg" alt="VitaLink" /><span>VitaLink</span>');
    brand.href = '/';
    var closeBtn = el('button', 'mobile-drawer-close', CLOSE);
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.addEventListener('click', closeDrawer);
    head.appendChild(brand);
    head.appendChild(closeBtn);
    drawer.appendChild(head);

    var linkWrap = el('div', 'mobile-drawer-links');
    var ctaLink = null;
    for (var j = 0; j < links.length; j++) {
      if (links[j].cta) { ctaLink = links[j]; continue; }
      var a = el('a', '', links[j].text);
      a.href = links[j].href;
      linkWrap.appendChild(a);
    }
    drawer.appendChild(linkWrap);

    var controls = el('div', 'mobile-drawer-controls');
    controls.setAttribute('data-mobile-controls', '');
    // Language picker mount point + theme toggle mount point
    var lang = el('div');
    lang.setAttribute('data-lang-mount', '');
    controls.appendChild(lang);
    // Theme toggle will be injected by theme.js via .mobile-drawer-controls selector.
    if (ctaLink) {
      var cta = el('a', 'mobile-drawer-cta', ctaLink.text);
      cta.href = ctaLink.href;
      controls.appendChild(cta);
    }
    drawer.appendChild(controls);

    document.body.appendChild(drawer);
  }

  function openDrawer() {
    var appSidebar = document.querySelector('.app-shell .sidebar');
    var marketingDrawer = document.querySelector('.mobile-drawer[data-mobile-drawer]');
    var target = appSidebar || marketingDrawer;
    if (!target) return;
    buildOverlay().classList.add('is-open');
    target.classList.add('is-open');
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() {
    var overlay = document.querySelector('.mobile-drawer-overlay');
    if (overlay) overlay.classList.remove('is-open');
    var openEls = document.querySelectorAll('.sidebar.is-open, .mobile-drawer.is-open');
    for (var i = 0; i < openEls.length; i++) openEls[i].classList.remove('is-open');
    document.body.classList.remove('drawer-open');
  }

  function wireOpeners() {
    var btns = document.querySelectorAll('[data-mobile-nav-open]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', openDrawer);
    }
  }

  function isAppPage() {
    return !!document.querySelector('.app-shell');
  }

  function ensureAuthorCredit() {
    if (document.querySelector('.author-credit')) return;
    var c = el('div', 'author-credit', 'Created by Rohit Mahajan');
    document.body.appendChild(c);
  }

  function mount() {
    ensureMobileTopbar();
    if (!isAppPage()) buildMarketingDrawer();
    ensureAuthorCredit();
    wireOpeners();
    // Close drawer on link click inside it
    document.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== document.body) {
        if (t.tagName === 'A' && (t.closest('.mobile-drawer, .app-shell .sidebar'))) {
          closeDrawer();
          break;
        }
        t = t.parentNode;
      }
    });
    // Escape closes
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  // Re-run for app pages where sidebar renders after DOMContentLoaded (app.js)
  setTimeout(mount, 60);
  setTimeout(mount, 400);
})();
