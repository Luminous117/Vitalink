// VitaLink — reminders feature.
// Persists to localStorage. Renders into any element with [data-reminders="list"]
// and hooks the form at [data-reminders="form"]. Optionally renders a compact
// "today" summary into [data-reminders="today"].
(function () {
  const STORAGE_KEY = 'vitalink.reminders';
  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const ICONS = {
    med: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/><line x1="12" y1="8" x2="12" y2="16"/></svg>',
    appt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    water: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 5-6 8-6 12a6 6 0 0 0 12 0c0-4-2-7-6-12z"/></svg>',
    move: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    sleep: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  };

  const TYPE_LABELS = {
    med: 'Medication',
    appt: 'Appointment',
    water: 'Hydration',
    move: 'Movement',
    sleep: 'Sleep',
  };

  const SEEDS = [
    { id: 'seed-1', type: 'med',   title: 'Vitamin D3 · 1000 IU',      time: '20:00', days: [1,2,3,4,5,6,0], note: '', done: false },
    { id: 'seed-2', type: 'appt',  title: 'Dr. Patel · Cardiology',    time: '10:30', days: [3],             note: 'Video visit', done: false },
    { id: 'seed-3', type: 'water', title: 'Drink a glass of water',    time: '14:00', days: [1,2,3,4,5],     note: '', done: false },
    { id: 'seed-4', type: 'move',  title: 'Evening walk',              time: '18:30', days: [1,2,3,4,5,6,0], note: '20 minutes minimum', done: true },
  ];

  const uid = () => 'r-' + Math.random().toString(36).slice(2, 9);

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return SEEDS;
  }
  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  let state = load();

  function fmtTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const am = h < 12; const hh = ((h + 11) % 12) + 1;
    return hh + ':' + String(m).padStart(2, '0') + ' ' + (am ? 'AM' : 'PM');
  }
  function fmtDays(days) {
    if (!days || !days.length) return '—';
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && days.includes(1) && days.includes(2) && days.includes(3) && days.includes(4) && days.includes(5)) return 'Weekdays';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
    return days.slice().sort().map(d => DAY_NAMES[d]).join(', ');
  }

  function itemHTML(r) {
    return (
      '<div class="rem-item' + (r.done ? ' is-done' : '') + '" data-id="' + r.id + '">' +
        '<button class="rem-check" data-action="toggle" aria-label="Toggle complete">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</button>' +
        '<div class="rem-icon type-' + r.type + '">' + (ICONS[r.type] || ICONS.med) + '</div>' +
        '<div class="rem-body">' +
          '<div class="rem-title">' + escapeHTML(r.title) + '</div>' +
          '<div class="rem-meta">' +
            '<span>' + fmtTime(r.time) + '</span>' +
            '<span>·</span>' +
            '<span>' + fmtDays(r.days) + '</span>' +
            (r.note ? '<span>·</span><span>' + escapeHTML(r.note) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<button class="rem-delete" data-action="delete" aria-label="Delete reminder">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg>' +
        '</button>' +
      '</div>'
    );
  }
  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function render() {
    const listEls = document.querySelectorAll('[data-reminders="list"]');
    listEls.forEach(root => {
      if (!state.length) {
        root.innerHTML = (
          '<div class="rem-empty">' +
            '<div class="rem-empty-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></div>' +
            '<div style="font-weight:600;color:var(--trust-navy);margin-bottom:4px;">No reminders yet</div>' +
            '<div>Add your first reminder to get started.</div>' +
          '</div>'
        );
      } else {
        const sorted = state.slice().sort((a, b) => (a.done - b.done) || (a.time || '').localeCompare(b.time || ''));
        root.innerHTML = '<div class="rem-list">' + sorted.map(itemHTML).join('') + '</div>';
      }
    });

    // Compact "today" widget for dashboard
    const today = new Date().getDay();
    document.querySelectorAll('[data-reminders="today"]').forEach(root => {
      const items = state.filter(r => (r.days || []).includes(today));
      if (!items.length) {
        root.innerHTML = '<div class="rem-empty" style="padding:24px 12px;"><div>Nothing due today. Enjoy the quiet.</div></div>';
        return;
      }
      const sorted = items.slice().sort((a,b) => (a.done - b.done) || (a.time || '').localeCompare(b.time || ''));
      root.innerHTML = '<div class="rem-list">' + sorted.slice(0, 4).map(itemHTML).join('') + '</div>';
    });
  }

  // ---- Event delegation for toggle/delete -------------------------------------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const item = btn.closest('.rem-item');
    if (!item) return;
    const id = item.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'toggle') {
      state = state.map(r => r.id === id ? { ...r, done: !r.done } : r);
    } else if (action === 'delete') {
      state = state.filter(r => r.id !== id);
    }
    save(state);
    render();
  });

  // ---- Form wiring ------------------------------------------------------------
  function initForm() {
    const form = document.querySelector('[data-reminders="form"]');
    if (!form) return;

    // Day-of-week toggles
    let selectedDays = [1, 2, 3, 4, 5]; // default weekdays
    const daysWrap = form.querySelector('[data-rem-days]');
    if (daysWrap) {
      daysWrap.innerHTML = DAY_LABELS.map((lbl, i) =>
        '<button type="button" class="rem-day' + (selectedDays.includes(i) ? ' is-on' : '') + '" data-day="' + i + '">' + lbl + '</button>'
      ).join('');
      daysWrap.addEventListener('click', (e) => {
        const b = e.target.closest('[data-day]');
        if (!b) return;
        const d = Number(b.getAttribute('data-day'));
        selectedDays = selectedDays.includes(d) ? selectedDays.filter(x => x !== d) : selectedDays.concat(d);
        b.classList.toggle('is-on');
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = form.querySelector('[name="type"]').value;
      const title = form.querySelector('[name="title"]').value.trim();
      const time = form.querySelector('[name="time"]').value;
      const note = (form.querySelector('[name="note"]') || {}).value || '';
      if (!title) return;
      state = state.concat({
        id: uid(),
        type,
        title,
        time,
        note: note.trim(),
        days: selectedDays.slice(),
        done: false,
      });
      save(state);
      form.reset();
      // Reset day chips to default (weekdays)
      selectedDays = [1,2,3,4,5];
      if (daysWrap) daysWrap.querySelectorAll('.rem-day').forEach((b, i) => {
        b.classList.toggle('is-on', selectedDays.includes(i));
      });
      render();
    });
  }

  function init() {
    initForm();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.VitalinkReminders = { render, load, save };
})();
