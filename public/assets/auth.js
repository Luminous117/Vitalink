// VitaLink — client-side authentication for the prototype.
// Accounts are persisted in localStorage. A real launch would move this to
// a proper backend with hashed passwords and email verification. The hash
// below is not cryptographically secure — it exists so the passphrase
// isn't stored in cleartext in the demo.
(function () {
  const ACCOUNTS_KEY = 'vitalink.accounts';
  const SESSION_KEY  = 'vitalink.session';

  function hash(s) {
    // Simple non-secure hash. Good enough for a prototype.
    let h = 5381;
    for (let i = 0; i < s.length; i++) {
      h = ((h << 5) + h) + s.charCodeAt(i);
      h |= 0;
    }
    return 'h' + (h >>> 0).toString(36);
  }

  function loadAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {};
  }
  function saveAccounts(map) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(map));
  }

  function normalizeEmail(e) {
    return String(e || '').trim().toLowerCase();
  }

  function initialsFor(name) {
    if (!name) return 'VL';
    const parts = String(name).trim().split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]).join('').toUpperCase();
  }

  function signUp({ name, email, passphrase }) {
    const emailN = normalizeEmail(email);
    if (!name || !emailN || !passphrase) {
      return { ok: false, error: 'Please fill in every field.' };
    }
    if (passphrase.length < 12) {
      return { ok: false, error: 'Passphrase must be at least 12 characters.' };
    }
    const accounts = loadAccounts();
    if (accounts[emailN]) {
      return { ok: false, error: 'An account with that email already exists. Try signing in.' };
    }
    accounts[emailN] = {
      name: name.trim(),
      email: emailN,
      passHash: hash(passphrase),
      createdAt: new Date().toISOString(),
    };
    saveAccounts(accounts);
    setSession(emailN);
    return { ok: true, user: accounts[emailN] };
  }

  function signIn({ email, passphrase }) {
    const emailN = normalizeEmail(email);
    const accounts = loadAccounts();
    const acc = accounts[emailN];
    if (!acc) return { ok: false, error: 'No account found for that email.' };
    if (acc.passHash !== hash(passphrase || '')) {
      return { ok: false, error: 'Incorrect passphrase.' };
    }
    setSession(emailN);
    return { ok: true, user: acc };
  }

  function setSession(email) {
    localStorage.setItem(SESSION_KEY, email);
  }
  function signOut() {
    localStorage.removeItem(SESSION_KEY);
  }

  function currentUser() {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const accounts = loadAccounts();
    return accounts[email] || null;
  }

  window.VitalinkAuth = {
    signUp,
    signIn,
    signOut,
    currentUser,
    initialsFor,
    normalizeEmail,
  };
})();
