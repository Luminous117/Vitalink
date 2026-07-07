// Shared sidebar rendered into #side on every app-shell page.
(function () {
  const path = window.location.pathname.replace(/\/+$/, "");
  const current = path.split("/").pop() || "dashboard.html";

  const links = [
    { href: "/pages/dashboard.html", label: "Dashboard", icon: '<path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/>' },
    { href: "/pages/records.html",   label: "Records",   icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
    { href: "/pages/providers.html", label: "Providers", icon: '<path d="M17 20h5v-2a4 4 0 0 0-3-3.87"/><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/>' },
    { href: "/pages/wellness.html",  label: "Wellness",  icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  ];

  const bottom = [
    { href: "/pages/pitch.html", label: "Business plan", icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>' },
    { href: "#", label: "Settings", icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
    { href: "#", label: "Help",     icon: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
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
      <div class="user-card">
        <div class="avatar">RM</div>
        <div>
          <div class="user-card-name">Rohit M.</div>
          <div class="user-card-mail">rahulmahajan1984@…</div>
        </div>
      </div>
    </div>
  `;

  const side = document.getElementById("side");
  if (side) side.innerHTML = html;
})();
