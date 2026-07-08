// Shared record data + modal + search UI.
// Used by records.html (list) and dashboard.html (search).
(function () {
  const RECORDS = [
    {
      id: 'cbc-2025-11',
      title: 'Complete Blood Count (CBC)',
      type: 'Lab',
      status: 'normal',
      date: '2025-11-14',
      provider: 'Quest Diagnostics',
      orderedBy: 'Dr. Meera Patel',
      note: 'All markers within normal reference ranges.',
      values: [
        { label: 'White blood cells', value: '6.2', unit: 'K/µL', range: '4.5–11.0' },
        { label: 'Red blood cells', value: '4.9', unit: 'M/µL', range: '4.5–5.9' },
        { label: 'Hemoglobin', value: '14.8', unit: 'g/dL', range: '13.5–17.5' },
        { label: 'Hematocrit', value: '44%', unit: '%', range: '38.8–50.0' },
        { label: 'Platelets', value: '256', unit: 'K/µL', range: '150–450' },
      ],
    },
    {
      id: 'lipid-2025-11',
      title: 'Lipid Panel',
      type: 'Lab',
      status: 'pending',
      date: '2025-11-12',
      provider: 'Quest Diagnostics',
      orderedBy: 'Dr. Meera Patel',
      note: 'Awaiting review by ordering physician. Expected Thursday.',
      values: [
        { label: 'Total cholesterol', value: '—', unit: 'mg/dL', range: '< 200' },
        { label: 'LDL', value: '—', unit: 'mg/dL', range: '< 100' },
        { label: 'HDL', value: '—', unit: 'mg/dL', range: '> 40' },
        { label: 'Triglycerides', value: '—', unit: 'mg/dL', range: '< 150' },
      ],
    },
    {
      id: 'chest-xray-2025-10',
      title: 'Chest X-ray',
      type: 'Imaging',
      status: 'clear',
      date: '2025-10-28',
      provider: 'City Radiology',
      orderedBy: 'Dr. Nguyen',
      note: 'Two-view PA and lateral chest radiograph. Lungs are clear. Heart size normal. No pleural effusion.',
      values: [],
    },
    {
      id: 'physical-2025-10',
      title: 'Annual physical — visit note',
      type: 'Visit note',
      status: 'active',
      date: '2025-10-03',
      provider: 'Dr. Meera Patel',
      orderedBy: 'Dr. Meera Patel',
      note: 'Overall health excellent. Continue current supplements. Recheck lipid panel in 3 months. Encourage 150 min/week aerobic activity.',
      values: [
        { label: 'Blood pressure', value: '118/76', unit: 'mmHg', range: '< 120/80' },
        { label: 'Weight', value: '168', unit: 'lbs', range: '—' },
        { label: 'Resting HR', value: '68', unit: 'bpm', range: '60–100' },
      ],
    },
    {
      id: 'rx-vitd3',
      title: 'Vitamin D3 1000 IU',
      type: 'Prescription',
      status: 'active',
      date: '2025-09-15',
      provider: 'CVS Pharmacy',
      orderedBy: 'Dr. Meera Patel',
      note: '90-day supply, 2 refills remaining. Take once daily with food.',
      values: [],
    },
    {
      id: 'flu-2025',
      title: 'Flu vaccine (2025 season)',
      type: 'Immunization',
      status: 'active',
      date: '2025-09-22',
      provider: 'CVS MinuteClinic',
      orderedBy: '—',
      note: 'Quadrivalent inactivated influenza vaccine. No adverse reaction.',
      values: [],
    },
    {
      id: 'vision-2025-08',
      title: 'Vision exam',
      type: 'Visit note',
      status: 'active',
      date: '2025-08-15',
      provider: 'Dr. Lin Zhou',
      orderedBy: 'Dr. Lin Zhou',
      note: 'Updated Rx: -1.25 OD / -1.00 OS. No signs of retinal abnormality.',
      values: [
        { label: 'Right eye (OD)', value: '-1.25', unit: 'D', range: '—' },
        { label: 'Left eye (OS)', value: '-1.00', unit: 'D', range: '—' },
      ],
    },
    {
      id: 'covid-booster-2025',
      title: 'COVID-19 booster (2025)',
      type: 'Immunization',
      status: 'active',
      date: '2025-09-22',
      provider: 'CVS MinuteClinic',
      orderedBy: '—',
      note: 'Updated formulation. Administered in left deltoid.',
      values: [],
    },
    {
      id: 'a1c-2025-04',
      title: 'Hemoglobin A1C',
      type: 'Lab',
      status: 'normal',
      date: '2025-04-10',
      provider: 'Quest Diagnostics',
      orderedBy: 'Dr. Meera Patel',
      note: 'A1C of 5.2% indicates no evidence of diabetes.',
      values: [
        { label: 'A1C', value: '5.2', unit: '%', range: '< 5.7' },
      ],
    },
  ];

  const STATUS_BADGE = {
    normal:  { label: 'Normal',  cls: 'green' },
    clear:   { label: 'Clear',   cls: 'green' },
    active:  { label: 'Active',  cls: 'green' },
    pending: { label: 'Pending', cls: 'amber' },
  };

  const TYPE_ICON = {
    Lab: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    Imaging: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    'Visit note': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    Prescription: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    Immunization: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  };

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fmtDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  }

  function rowHTML(r) {
    const icon = TYPE_ICON[r.type] || TYPE_ICON['Visit note'];
    const badge = STATUS_BADGE[r.status] || { label: r.status || '—', cls: '' };
    const iconCls = r.type === 'Lab' ? 'green' : r.type === 'Imaging' ? 'navy' : r.type === 'Prescription' ? '' : r.type === 'Immunization' ? 'navy' : 'green';
    return (
      '<div class="list-row rec-row" data-record-id="' + r.id + '" tabindex="0" role="button" style="cursor:pointer;">' +
        '<div class="list-icon ' + iconCls + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg></div>' +
        '<div class="list-body">' +
          '<div class="list-title">' + escapeHTML(r.title) + '</div>' +
          '<div class="list-sub">' + escapeHTML(r.provider) + (r.orderedBy && r.orderedBy !== '—' ? ' · ' + escapeHTML(r.orderedBy) : '') + '</div>' +
        '</div>' +
        '<div class="list-meta"><span class="badge ' + badge.cls + '">' + badge.label + '</span><br/><span style="margin-top:6px;display:inline-block;">' + fmtDate(r.date) + '</span></div>' +
      '</div>'
    );
  }

  function renderList(filter) {
    const listEl = document.querySelector('[data-records="list"]');
    if (!listEl) return;
    const q = (filter || '').toLowerCase().trim();
    const items = q
      ? RECORDS.filter(r => (r.title + ' ' + r.provider + ' ' + r.type + ' ' + (r.orderedBy || '')).toLowerCase().includes(q))
      : RECORDS.slice();
    items.sort((a, b) => (a.date < b.date ? 1 : -1));
    listEl.innerHTML = items.map(rowHTML).join('') || '<div class="rem-empty">No records match your search.</div>';
  }

  // ---- Modal ------------------------------------------------------------------
  function ensureModal() {
    let m = document.getElementById('rec-modal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'rec-modal';
    m.className = 'rec-modal';
    m.innerHTML = (
      '<div class="rec-modal-backdrop"></div>' +
      '<div class="rec-modal-card" role="dialog" aria-modal="true">' +
        '<button class="rec-modal-close" aria-label="Close">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
        '<div class="rec-modal-body"></div>' +
      '</div>'
    );
    document.body.appendChild(m);
    m.querySelector('.rec-modal-backdrop').addEventListener('click', closeModal);
    m.querySelector('.rec-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    return m;
  }

  function openRecord(id) {
    const r = RECORDS.find(x => x.id === id);
    if (!r) return;
    const m = ensureModal();
    const badge = STATUS_BADGE[r.status] || { label: r.status || '—', cls: '' };
    const values = (r.values || []).map(v => (
      '<div class="rec-value-row">' +
        '<div class="rec-value-label">' + escapeHTML(v.label) + '</div>' +
        '<div class="rec-value-val">' + escapeHTML(v.value) + ' <span class="rec-value-unit">' + escapeHTML(v.unit || '') + '</span></div>' +
        '<div class="rec-value-range">Ref: ' + escapeHTML(v.range || '—') + '</div>' +
      '</div>'
    )).join('');
    m.querySelector('.rec-modal-body').innerHTML = (
      '<div class="rec-modal-head">' +
        '<span class="badge ' + badge.cls + '">' + badge.label + '</span>' +
        '<h2>' + escapeHTML(r.title) + '</h2>' +
        '<div class="rec-modal-meta">' +
          '<span><strong>' + escapeHTML(r.type) + '</strong></span>' +
          '<span>·</span><span>' + fmtDate(r.date) + '</span>' +
          '<span>·</span><span>' + escapeHTML(r.provider) + '</span>' +
        '</div>' +
      '</div>' +
      (values ? '<div class="rec-values">' + values + '</div>' : '') +
      (r.note ? '<div class="rec-note"><h4>Notes</h4><p>' + escapeHTML(r.note) + '</p></div>' : '') +
      '<div class="rec-modal-actions">' +
        '<button class="btn btn-outline">Download PDF</button>' +
        '<button class="btn btn-primary">Share securely</button>' +
      '</div>'
    );
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    const m = document.getElementById('rec-modal');
    if (!m) return;
    m.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // ---- Delegated clicks -------------------------------------------------------
  document.addEventListener('click', (e) => {
    const row = e.target.closest('[data-record-id]');
    if (!row) return;
    openRecord(row.getAttribute('data-record-id'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const row = e.target.closest('[data-record-id]');
    if (row) openRecord(row.getAttribute('data-record-id'));
  });

  // ---- Search (dashboard) -----------------------------------------------------
  function initSearch() {
    document.querySelectorAll('[data-search="records"]').forEach(input => {
      const container = document.createElement('div');
      container.className = 'search-results';
      input.parentElement.appendChild(container);

      const render = () => {
        const q = input.value.toLowerCase().trim();
        if (!q) { container.classList.remove('is-open'); container.innerHTML = ''; return; }
        const hits = RECORDS.filter(r => (r.title + ' ' + r.provider + ' ' + r.type + ' ' + (r.orderedBy || '')).toLowerCase().includes(q)).slice(0, 6);
        if (!hits.length) {
          container.innerHTML = '<div class="search-empty">No records match "' + escapeHTML(q) + '"</div>';
        } else {
          container.innerHTML = hits.map(r => (
            '<button type="button" class="search-result" data-record-id="' + r.id + '">' +
              '<div class="search-result-title">' + escapeHTML(r.title) + '</div>' +
              '<div class="search-result-sub">' + escapeHTML(r.type) + ' · ' + escapeHTML(r.provider) + ' · ' + fmtDate(r.date) + '</div>' +
            '</button>'
          )).join('');
        }
        container.classList.add('is-open');
      };
      input.addEventListener('input', render);
      input.addEventListener('focus', render);
      document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && e.target !== input) container.classList.remove('is-open');
      });
    });

    // Filter records list on records page
    const listSearch = document.querySelector('[data-search="records-filter"]');
    if (listSearch) {
      listSearch.addEventListener('input', () => renderList(listSearch.value));
    }
  }

  function init() {
    renderList('');
    initSearch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.VitalinkRecords = { records: RECORDS, openRecord, renderList };
})();
