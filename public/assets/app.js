// Shared sidebar rendered into #side on every app-shell page.
(function () {
  const path = window.location.pathname.replace(/\/+$/, "");
  const current = path.split("/").pop() || "dashboard.html";

  const links = [
    { href: "/pages/dashboard.html", label: "Dashboard", icon: '<path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/>' },
    { href: "/pages/records.html",   label: "Records",   icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
    { href: "/pages/providers.html", label: "Providers", icon: '<path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/>' },
    { href: "/pages/wellness.html",  label: "Wellness",  icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
    { href: "/pages/reminders.html", label: "Reminders", icon: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
  ];

  const bottom = [
    { href: "/pages/pitch.html", label: "Business plan", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>' },
    { href: "/pages/settings.html", label: "Settings", icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
    { href: "/pages/help.html", label: "Help",     icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  ];

  const svgFor = (path) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>";

  const renderLink = (l) => {
    const active = l.href.endsWith(current) ? " active" : "";
    return `<a href="${l.href}" class="side-link${active}">${svgFor(l.icon)}<span>${l.label}</span></a>`;
  };

  const html = `
    <a href="/" class="brand">
      <img src="/assets/logo.svg" alt="VitaLink" />
      <span>VitaLink</span>
    </a>
    <div class="side-section">Menu</div>
    ${links.map(renderLink).join("")}
    <div class="side-section" style="margin-top:12px;">Account</div>
    ${bottom.map(renderLink).join("")}
    <div class="side-footer">
      <div data-lang-mount style="margin-bottom:12px;"></div>
      <div id="side-user"></div>
    </div>
  `;

  const side = document.getElementById("side");
  if (!side) return;
  side.innerHTML = html;

  // Populate user card from stored session (or fall back to guest).
  const userSlot = document.getElementById("side-user");
  const user = window.VitalinkAuth && window.VitalinkAuth.currentUser();
  if (user) {
    const initials = window.VitalinkAuth.initialsFor(user.name);
    const maskedEmail = user.email.length > 22 ? user.email.slice(0, 20) + '…' : user.email;
    const shortName = user.name.split(' ').slice(0, 2).map((p, i, arr) => i === arr.length - 1 && arr.length > 1 ? p[0] + '.' : p).join(' ');
    userSlot.innerHTML =
      '<a href="/pages/settings.html" class="user-card" style="text-decoration:none;">' +
        '<div class="avatar">' + initials + '</div>' +
        '<div>' +
          '<div class="user-card-name">' + shortName + '</div>' +
          '<div class="user-card-mail">' + maskedEmail + '</div>' +
        '</div>' +
      '</a>';
  } else {
    userSlot.innerHTML =
      '<a href="/pages/signin.html" class="user-card" style="text-decoration:none;">' +
        '<div class="avatar" style="background:var(--soft-cloud); color:var(--text-muted);">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>' +
        '</div>' +
        '<div>' +
          '<div class="user-card-name">Guest</div>' +
          '<div class="user-card-mail">Tap to sign in</div>' +
        '</div>' +
      '</a>';
  }

  if (window.VitalinkI18n) {
    window.VitalinkI18n.mountPickers();
  }

  // Demo-data notice: shown at the very top of every app page so judges/visitors
  // understand this is a prototype with sample data.
  var mainInner = document.querySelector(".main .main-inner");
  if (mainInner && !mainInner.querySelector("[data-demo-notice]")) {
    var notice = document.createElement("div");
    notice.setAttribute("data-demo-notice", "");
    notice.className = "demo-notice";
    notice.innerHTML =
      '<svg class="demo-notice-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
      '<div class="demo-notice-body">' +
        '<strong>Preview mode.</strong> ' +
        'All metrics shown are sample data — connect Apple Health to sync your real numbers.' +
      "</div>";
    mainInner.insertBefore(notice, mainInner.firstChild);
  }

  // Guest-mode banner: if there's no signed-in user, show a subtle strip at the top
  // of the main content that explains this is a demo and links to sign-up.
  if (!user) {
    if (mainInner && !mainInner.querySelector("[data-guest-banner]")) {
      var banner = document.createElement("div");
      banner.setAttribute("data-guest-banner", "");
      banner.className = "guest-banner";
      banner.innerHTML =
        '<div class="guest-banner-dot"></div>' +
        '<div class="guest-banner-body">' +
          '<strong>You\'re exploring VitaLink as a guest.</strong> ' +
          "Every screen is fully clickable. " +
          '<a href="/pages/onboarding.html">Create a free account →</a> to save your data.' +
        "</div>" +
        '<button class="guest-banner-close" aria-label="Dismiss">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>' +
        "</button>";
      var demoNotice = mainInner.querySelector("[data-demo-notice]");
      if (demoNotice) demoNotice.after(banner);
      else mainInner.insertBefore(banner, mainInner.firstChild);
      banner.querySelector(".guest-banner-close").addEventListener("click", function () {
        banner.remove();
      });
    }
  }
})();
