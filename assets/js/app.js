import { getWorkspaceData, addRecord, updateRecord, deleteRecord, resetDemoData } from './api.js';

const main = document.querySelector('#main');
const toastRegion = document.querySelector('#toast-region');
const propertyModal = document.querySelector('#property-modal');
const repairModal = document.querySelector('#repair-modal');
const state = { properties: [], repairs: [], compliance: [], route: 'dashboard', search: '', statusFilter: 'all', repairFilter: 'all', loading: false, lastUpdated: null };
let searchTimer = null;
let searchSequence = 0;
let toastSequence = 0;

const currency = value => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(Number(value) || 0);
const dateShort = value => {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const relativeDate = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
};
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const propertyById = id => state.properties.find(property => property.id === id);
const propertyAddress = id => propertyById(id)?.address || 'Property removed';
const statusLabel = value => ({ occupied: 'Occupied', vacant: 'Vacant', maintenance: 'Maintenance', open: 'Open', scheduled: 'Scheduled', 'in-progress': 'In progress', complete: 'Complete', resolved: 'Resolved', emergency: 'Emergency', urgent: 'Urgent', routine: 'Routine', overdue: 'Overdue', 'due-soon': 'Due soon', 'due-later': 'Due later' }[value] || value || 'Unknown');
const pill = value => `<span class="status-pill ${slug(value)}">${escapeHTML(statusLabel(value))}</span>`;

function showToast(title, message, type = 'success') {
  const id = `toast-${++toastSequence}`;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `<span class="toast-mark" aria-hidden="true">${type === 'error' ? '!' : '✓'}</span><div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div><button class="toast-close" type="button" aria-label="Dismiss notification">×</button>`;
  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 5200);
}

function setLoading(isLoading, label = 'Loading your workspace…') {
  state.loading = isLoading;
  if (isLoading) main.innerHTML = `<div class="loading-state" role="status"><span class="spinner" aria-hidden="true"></span><span>${escapeHTML(label)}</span></div>`;
}

async function loadData({ showProgress = false } = {}) {
  if (showProgress) setLoading(true);
  try {
    const data = await getWorkspaceData();
    state.properties = Array.isArray(data.properties) ? data.properties : [];
    state.repairs = Array.isArray(data.repairs) ? data.repairs : [];
    state.compliance = Array.isArray(data.compliance) ? data.compliance : [];
    state.lastUpdated = new Date();
    render();
  } catch (error) {
    console.error('PropertyFlow workspace load failed.', error);
    main.innerHTML = `<section class="panel error-panel"><div class="stat-icon red" style="margin:0 auto 14px">!</div><h2>We couldn't load your workspace</h2><p>${escapeHTML(error.message || 'Something unexpected happened while loading the data.')}</p><button class="button button-primary" id="retry-load" type="button">Try again</button><p class="panel-subtitle">Open this project through VS Code Live Server so the browser can fetch the sample JSON files.</p></section>`;
    document.querySelector('#retry-load')?.addEventListener('click', () => loadData({ showProgress: true }));
  }
}

function getMetrics() {
  const total = state.properties.length;
  const occupied = state.properties.filter(item => item.status === 'occupied').length;
  const vacant = state.properties.filter(item => item.status === 'vacant').length;
  const maintenance = state.properties.filter(item => item.status === 'maintenance').length;
  const rent = state.properties.filter(item => item.status === 'occupied').reduce((sum, item) => sum + Number(item.rent || 0), 0);
  const occupancy = total ? Math.round((occupied / total) * 100) : 0;
  const openRepairs = state.repairs.filter(item => !['complete', 'resolved'].includes(item.status));
  const emergencies = openRepairs.filter(item => item.priority === 'emergency').length;
  const dueSoon = state.compliance.filter(item => ['overdue', 'due-soon'].includes(item.status)).length;
  return { total, occupied, vacant, maintenance, rent, occupancy, openRepairs, emergencies, dueSoon };
}

function pageHeading(eyebrow, title, description, action = '') {
  return `<div class="page-heading"><div><span class="eyebrow">${escapeHTML(eyebrow)}</span><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ''}</div>`;
}
function propertyRows(properties, withActions = false) {
  if (!properties.length) return `<tr><td colspan="${withActions ? 5 : 4}"><div class="empty-state"><div class="empty-icon" aria-hidden="true">⌂</div><h3>No properties found</h3><p>Try changing your search or filters, or add a property to get started.</p><button class="button button-primary button-small" data-action="add-property">+ Add property</button></div></td></tr>`;
  return properties.map(property => `<tr><td><div class="property-cell"><span class="property-thumb" aria-hidden="true">⌂</span><span class="property-name"><strong>${escapeHTML(property.address)}</strong><span>${escapeHTML(property.postcode)}</span></span></div></td><td>${property.bedrooms} bed</td><td>${currency(property.rent)}</td><td>${pill(property.status)}</td>${withActions ? `<td><div class="table-actions"><button class="mini-action" data-action="cycle-property" data-id="${escapeHTML(property.id)}" aria-label="Change status for ${escapeHTML(property.address)}">Update</button><button class="mini-action danger" data-action="delete-property" data-id="${escapeHTML(property.id)}" aria-label="Delete ${escapeHTML(property.address)}">Delete</button></div></td>` : ''}</tr>`).join('');
}
function repairRows(repairs, withActions = true) {
  if (!repairs.length) return `<tr><td colspan="${withActions ? 5 : 4}"><div class="empty-state"><div class="empty-icon" aria-hidden="true">⌁</div><h3>Nothing to show</h3><p>No repairs match the current view. You can log a new repair whenever an issue is reported.</p><button class="button button-primary button-small" data-action="add-repair">+ Log repair</button></div></td></tr>`;
  return repairs.map(item => `<tr><td><div class="property-name"><strong>${escapeHTML(item.description)}</strong><span>${escapeHTML(item.id.toUpperCase())} · ${relativeDate(item.createdAt)}</span></div></td><td>${escapeHTML(propertyAddress(item.propertyId))}</td><td><span class="repair-priority ${slug(item.priority)}">${escapeHTML(statusLabel(item.priority))}</span></td><td>${pill(item.status)}</td>${withActions ? `<td><button class="mini-action" data-action="advance-repair" data-id="${escapeHTML(item.id)}">${item.status === 'complete' ? 'Reopen' : 'Update status'}</button></td>` : ''}</tr>`).join('');
}
function complianceRows(records) {
  if (!records.length) return `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon" aria-hidden="true">✓</div><h3>No compliance records</h3><p>There are no compliance items in this view.</p></div></td></tr>`;
  return records.map(item => `<tr><td><div class="property-name"><strong>${escapeHTML(item.type)}</strong><span>${escapeHTML(item.id.toUpperCase())}</span></div></td><td>${escapeHTML(propertyAddress(item.propertyId))}</td><td>${dateShort(item.dueDate)}</td><td>${pill(item.status)}</td></tr>`).join('');
}
function chartSvg() {
  const values = [61, 64, 60, 70, 68, 74, 72, 81, 78, 86, 83, 91];
  const points = values.map((value, index) => `${22 + index * 46},${145 - value * 1.23}`).join(' ');
  const area = `22,160 ${points} 528,160`;
  return `<svg viewBox="0 0 560 180" role="img" aria-label="Illustrative rent collection trend over the last twelve months"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5977d6" stop-opacity=".20"/><stop offset="100%" stop-color="#5977d6" stop-opacity="0"/></linearGradient></defs>${[32,68,104,140].map(y => `<line class="chart-gridline" x1="18" y1="${y}" x2="542" y2="${y}"/>`).join('')}<polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${points}"/>${values.map((value,index) => index === values.length-1 ? `<circle class="chart-point" cx="${22+index*46}" cy="${145-value*1.23}" r="4.5"/>` : '').join('')}<text class="chart-label" x="18" y="176">Nov</text><text class="chart-label" x="109" y="176">Jan</text><text class="chart-label" x="201" y="176">Mar</text><text class="chart-label" x="293" y="176">May</text><text class="chart-label" x="385" y="176">Jul</text><text class="chart-label" x="500" y="176">Oct</text></svg>`;
}

function renderDashboard() {
  const m = getMetrics();
  const latest = [...state.properties].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,4);
  const overdue = state.compliance.filter(item => item.status === 'overdue').length;
  const attention = [
    { icon:'!', color:'red', title:`${m.emergencies} emergency ${m.emergencies === 1 ? 'repair' : 'repairs'}`, detail:m.emergencies ? 'Prioritise these issues and record the next action.' : 'No emergency repairs currently recorded.', route:'repairs' },
    { icon:'◷', color:'amber', title:`${m.dueSoon} compliance ${m.dueSoon === 1 ? 'item' : 'items'} need attention`, detail:overdue ? `${overdue} overdue · review certificates and dates.` : 'Upcoming certificate dates need checking.', route:'compliance' },
    { icon:'⌂', color:'blue', title:`${m.vacant} vacant ${m.vacant === 1 ? 'property' : 'properties'}`, detail:m.vacant ? 'Review marketing and viewing activity.' : 'All properties currently have an occupancy status.', route:'properties' }
  ];
  const complianceCurrent = state.compliance.filter(item => item.status === 'due-later').length;
  return `${pageHeading('PORTFOLIO OVERVIEW', 'Good afternoon, Sarah', 'Here’s what is happening across your property portfolio today.', '<button class="button button-secondary" data-action="refresh-data">↻ Refresh</button><button class="button button-primary" data-action="add-property"><span class="plus">+</span> Add property</button>')}
    <section class="stats-grid" aria-label="Portfolio key metrics">
      <article class="stat-card"><div class="stat-top"><span>Total properties</span><span class="stat-icon">⌂</span></div><div class="stat-value">${m.total}</div><div class="stat-foot"><span class="trend neutral">Portfolio</span><span>registered properties</span></div></article>
      <article class="stat-card"><div class="stat-top"><span>Occupied</span><span class="stat-icon green">✓</span></div><div class="stat-value">${m.occupied}</div><div class="stat-foot"><span class="trend">${m.occupancy}%</span><span>occupancy rate</span></div><div class="stat-progress" aria-label="${m.occupancy}% occupancy"><span style="width:${m.occupancy}%"></span></div></article>
      <article class="stat-card"><div class="stat-top"><span>Vacant properties</span><span class="stat-icon red">⌂</span></div><div class="stat-value">${m.vacant}</div><div class="stat-foot"><span class="${m.vacant ? 'trend' : 'trend neutral'}">${m.vacant ? 'Action needed' : 'On track'}</span><span>awaiting occupancy</span></div></article>
      <article class="stat-card"><div class="stat-top"><span>Monthly rent roll</span><span class="stat-icon amber">£</span></div><div class="stat-value">${currency(m.rent)}</div><div class="stat-foot"><span class="trend neutral">Occupied homes</span><span>potential monthly rent</span></div></article>
    </section>
    <section class="dashboard-grid">
      <article class="panel performance-panel"><div class="panel-header"><div><h2 class="panel-title">Portfolio performance</h2><p class="panel-subtitle">A visual overview of the rent roll trend</p></div><span class="status-pill due-later">Illustrative</span></div><div class="performance-summary"><div><div class="performance-number">${currency(m.rent)} <small>/ month</small></div><div class="performance-label">Current occupied rent roll</div></div><div><div class="performance-number">${m.occupancy}%</div><div class="performance-label">Occupancy rate</div></div><div class="mini-legend"><span class="legend-item"><i class="legend-dot"></i>Rent trend</span></div></div><div class="chart-wrap">${chartSvg()}</div><div class="chart-foot"><span>Trend graphic is illustrative sample data</span><span>Last 12 months</span></div></article>
      <article class="panel attention-panel"><div class="panel-header"><div><h2 class="panel-title">Needs your attention</h2><p class="panel-subtitle">Suggested next actions based on sample records</p></div><span class="status-pill ${m.emergencies || m.dueSoon || m.vacant ? 'urgent' : 'complete'}">${m.emergencies + m.dueSoon + m.vacant} items</span></div><div class="attention-list">${attention.map(item => `<button class="attention-item" data-route="${item.route}" style="width:100%;border-left:0;border-right:0;border-top:0;background:transparent;text-align:left;cursor:pointer"><span class="attention-icon ${item.color}" aria-hidden="true">${item.icon}</span><span class="attention-copy"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.detail)}</p></span><span class="attention-arrow" aria-hidden="true">›</span></button>`).join('')}</div></article>
    </section>
    <section class="panel activity-panel"><div class="panel-header"><div><h2 class="panel-title">Recently added properties</h2><p class="panel-subtitle">Quick access to the latest portfolio records</p></div><a class="text-link" href="#properties" data-route="properties">View all properties →</a></div><div class="table-wrap"><table><thead><tr><th>Property</th><th>Bedrooms</th><th>Monthly rent</th><th>Status</th></tr></thead><tbody>${propertyRows(latest)}</tbody></table></div></section>
    <section class="bottom-grid" style="margin-top:19px"><article class="panel"><div class="panel-header"><div><h2 class="panel-title">Compliance snapshot</h2><p class="panel-subtitle">Keep certification dates visible and actionable</p></div><a class="text-link" href="#compliance" data-route="compliance">Open register →</a></div><div class="compliance-summary"><div class="donut" role="img" aria-label="Compliance record summary: ${state.compliance.length} total records"><div class="donut-inner"><strong>${state.compliance.length}</strong><span>records</span></div></div><div class="compliance-key"><div class="key-row"><i class="key-square"></i>Up to date <strong>${complianceCurrent}</strong></div><div class="key-row"><i class="key-square amber"></i>Due soon <strong>${state.compliance.filter(item=>item.status==='due-soon').length}</strong></div><div class="key-row"><i class="key-square grey"></i>Overdue <strong>${overdue}</strong></div></div></div></article><article class="panel quick-actions"><div class="panel-header"><div><h2 class="panel-title">Quick actions</h2><p class="panel-subtitle">Common tasks, one click away</p></div></div><div class="quick-action-list"><button class="quick-action" data-action="add-property"><span class="qa-icon">＋</span><span><strong>Add property</strong><small>Expand portfolio</small></span></button><button class="quick-action" data-action="add-repair"><span class="qa-icon">⌁</span><span><strong>Log repair</strong><small>Record an issue</small></span></button><button class="quick-action" data-route="compliance"><span class="qa-icon">✓</span><span><strong>Compliance</strong><small>Check due dates</small></span></button><button class="quick-action" data-route="reports"><span class="qa-icon">▥</span><span><strong>View reports</strong><small>Portfolio summary</small></span></button></div></article></section>`;
}

function renderProperties() {
  const list = state.properties.filter(property => {
    const q = state.search.trim().toLowerCase();
    const matchesQuery = !q || `${property.address} ${property.postcode} ${property.bedrooms}`.toLowerCase().includes(q);
    return matchesQuery && (state.statusFilter === 'all' || property.status === state.statusFilter);
  });
  return `${pageHeading('PROPERTY REGISTER', 'Properties', 'Manage addresses, occupancy and rent details.', '<button class="button button-primary" data-action="add-property"><span class="plus">+</span> Add property</button>')}<section class="panel"><div class="toolbar-row"><label class="search-box"><span aria-hidden="true">⌕</span><span class="sr-only">Search properties</span><input id="property-search" type="search" value="${escapeHTML(state.search)}" placeholder="Search address, postcode or bedrooms…" autocomplete="off"></label><label class="sr-only" for="property-status-filter">Filter by status</label><select class="filter-select" id="property-status-filter"><option value="all" ${state.statusFilter==='all'?'selected':''}>All statuses</option><option value="occupied" ${state.statusFilter==='occupied'?'selected':''}>Occupied</option><option value="vacant" ${state.statusFilter==='vacant'?'selected':''}>Vacant</option><option value="maintenance" ${state.statusFilter==='maintenance'?'selected':''}>Maintenance</option></select><button class="button button-secondary button-small" data-action="clear-property-filters">Clear filters</button></div><div class="results-meta" id="property-results" role="status">Showing ${list.length} of ${state.properties.length} properties</div><div class="table-wrap"><table><thead><tr><th>Property</th><th>Bedrooms</th><th>Monthly rent</th><th>Status</th><th>Actions</th></tr></thead><tbody id="property-table-body">${propertyRows(list,true)}</tbody></table></div></section><p class="compliance-table-note">Sample portfolio records are stored in this browser using localStorage. Do not enter real tenant or landlord personal data.</p>`;
}

function renderRepairs() {
  const list = state.repairs.filter(item => state.repairFilter === 'all' || item.status === state.repairFilter).sort((a,b) => ({ emergency:0, urgent:1, routine:2 }[a.priority] ?? 3) - ({ emergency:0, urgent:1, routine:2 }[b.priority] ?? 3));
  const open = state.repairs.filter(item => !['complete','resolved'].includes(item.status)).length;
  return `${pageHeading('MAINTENANCE WORKFLOW', 'Repairs', 'Capture reported issues, prioritise risk and track progress.', '<button class="button button-primary" data-action="add-repair"><span class="plus">+</span> Log repair</button>')}<div class="summary-cards"><article class="summary-card"><span>Open repairs</span><strong>${open}</strong><small>Need follow-up</small></article><article class="summary-card"><span>Emergency priority</span><strong>${state.repairs.filter(item=>item.priority==='emergency'&&!['complete','resolved'].includes(item.status)).length}</strong><small>Review immediately</small></article><article class="summary-card"><span>Completed</span><strong>${state.repairs.filter(item=>['complete','resolved'].includes(item.status)).length}</strong><small>Closed in this register</small></article></div><section class="panel"><div class="toolbar-row"><span class="panel-title">Repair register</span><label class="sr-only" for="repair-status-filter">Filter repairs by status</label><select class="filter-select" id="repair-status-filter"><option value="all" ${state.repairFilter==='all'?'selected':''}>All statuses</option><option value="open" ${state.repairFilter==='open'?'selected':''}>Open</option><option value="scheduled" ${state.repairFilter==='scheduled'?'selected':''}>Scheduled</option><option value="in-progress" ${state.repairFilter==='in-progress'?'selected':''}>In progress</option><option value="complete" ${state.repairFilter==='complete'?'selected':''}>Complete</option></select></div><div class="table-wrap"><table><thead><tr><th>Issue</th><th>Property</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead><tbody>${repairRows(list,true)}</tbody></table></div><div class="compliance-table-note">Demo workflow only. Emergency reports must always follow your organisation’s real emergency procedure.</div></section>`;
}

function renderCompliance() {
  const sorted = [...state.compliance].sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  const overdue = sorted.filter(item => item.status === 'overdue').length;
  const soon = sorted.filter(item => item.status === 'due-soon').length;
  const current = sorted.filter(item => item.status === 'due-later').length;
  return `${pageHeading('SAFETY & CERTIFICATION', 'Compliance', 'Monitor key certificate records and the dates that need follow-up.')}<div class="page-notice"><span aria-hidden="true">ⓘ</span><div><strong>Sample data for learning purposes</strong>Certificate requirements and expiry dates vary. Verify legal obligations and source dates before using a real compliance register.</div></div><div class="summary-cards"><article class="summary-card"><span>Overdue items</span><strong>${overdue}</strong><small>Require review</small></article><article class="summary-card"><span>Due soon</span><strong>${soon}</strong><small>Upcoming deadlines</small></article><article class="summary-card"><span>Due later</span><strong>${current}</strong><small>Further ahead in this sample</small></article></div><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Compliance register</h2><p class="panel-subtitle">Sorted by next due date</p></div><span class="status-pill due-later">${sorted.length} records</span></div><div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Property</th><th>Due date</th><th>Review status</th></tr></thead><tbody>${complianceRows(sorted)}</tbody></table></div><div class="compliance-table-note">The displayed statuses are static sample values; this prototype does not automatically calculate legal expiry status.</div></section>`;
}

function renderReports() {
  const m = getMetrics();
  const occupiedShare = m.total ? Math.round(m.occupied / m.total * 100) : 0;
  const vacantShare = m.total ? Math.round(m.vacant / m.total * 100) : 0;
  const maintenanceShare = Math.max(0,100-occupiedShare-vacantShare);
  const priorities = ['emergency','urgent','routine'].map(priority => ({priority,count:state.repairs.filter(item=>item.priority===priority).length}));
  const max = Math.max(1,...priorities.map(item=>item.count));
  return `${pageHeading('PORTFOLIO INSIGHTS', 'Reports', 'A quick operational summary of the sample data in this workspace.', '<button class="button button-secondary" data-action="export-report">↓ Export CSV</button>')}<div class="summary-cards"><article class="summary-card"><span>Potential monthly rent</span><strong>${currency(state.properties.reduce((sum,item)=>sum+Number(item.rent||0),0))}</strong><small>Assumes every property is let</small></article><article class="summary-card"><span>Occupied rent roll</span><strong>${currency(m.rent)}</strong><small>Based on occupied sample properties</small></article><article class="summary-card"><span>Occupancy rate</span><strong>${m.occupancy}%</strong><small>${m.occupied} of ${m.total} properties occupied</small></article></div><div class="report-grid"><article class="panel report-card"><h2>Property status mix</h2><p>Distribution of the current property register.</p><div class="bar-list"><div class="bar-item"><span>Occupied</span><div class="bar-track"><span style="width:${occupiedShare}%;background:#25956e"></span></div><strong>${m.occupied}</strong></div><div class="bar-item"><span>Vacant</span><div class="bar-track"><span style="width:${vacantShare}%;background:#d94745"></span></div><strong>${m.vacant}</strong></div><div class="bar-item"><span>Maintenance</span><div class="bar-track"><span style="width:${maintenanceShare}%;background:#e5ac42"></span></div><strong>${m.maintenance}</strong></div></div><div class="report-note">Occupancy rate uses occupied properties divided by all registered properties. Figures update when property statuses change.</div></article><article class="panel report-card"><h2>Repairs by priority</h2><p>Use priority counts to review workload and risk.</p><div class="bar-list">${priorities.map(item=>`<div class="bar-item"><span>${escapeHTML(statusLabel(item.priority))}</span><div class="bar-track"><span style="width:${item.count/max*100}%;background:${item.priority==='emergency'?'#d94745':item.priority==='urgent'?'#e5ac42':'#5874d1'}"></span></div><strong>${item.count}</strong></div>`).join('')}</div><div class="report-note">Priority counts include all records, including completed items. This is an operational overview, not a financial statement.</div></article></div>`;
}

function render() {
  state.loading = false;
  const route = ['dashboard','properties','repairs','compliance','reports'].includes(state.route) ? state.route : 'dashboard';
  state.route = route;
  document.querySelectorAll('[data-route].nav-link').forEach(link => {
    const active = link.dataset.route === route;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  document.querySelector('#breadcrumb-current').textContent = ({dashboard:'Overview',properties:'Properties',repairs:'Repairs',compliance:'Compliance',reports:'Reports'})[route];
  document.querySelector('#nav-property-count').textContent = state.properties.length;
  const openCount = state.repairs.filter(item => !['complete','resolved'].includes(item.status)).length;
  document.querySelector('#nav-repair-count').textContent = openCount;
  main.innerHTML = ({dashboard:renderDashboard,properties:renderProperties,repairs:renderRepairs,compliance:renderCompliance,reports:renderReports})[route]();
  if (route === 'properties') bindPropertySearch();
  if (route === 'repairs') document.querySelector('#repair-status-filter')?.addEventListener('change', event => { state.repairFilter = event.target.value; render(); });
}

function bindPropertySearch() {
  const input = document.querySelector('#property-search');
  input?.addEventListener('input', event => {
    state.search = event.target.value;
    const currentSequence = ++searchSequence;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(async () => {
      // Sequence guard: only the latest scheduled search may update the results.
      await new Promise(resolve => window.setTimeout(resolve, 90));
      if (currentSequence !== searchSequence || state.route !== 'properties') return;
      const q = state.search.trim().toLowerCase();
      const results = state.properties.filter(property => {
        const matchesQuery = !q || `${property.address} ${property.postcode} ${property.bedrooms}`.toLowerCase().includes(q);
        return matchesQuery && (state.statusFilter === 'all' || property.status === state.statusFilter);
      });
      const body = document.querySelector('#property-table-body');
      if (body) body.innerHTML = propertyRows(results,true);
      const meta = document.querySelector('#property-results');
      if (meta) meta.textContent = `Showing ${results.length} of ${state.properties.length} properties`;
    }, 180);
  });
  document.querySelector('#property-status-filter')?.addEventListener('change', event => { state.statusFilter = event.target.value; render(); });
}

function navigate(route) {
  if (!['dashboard','properties','repairs','compliance','reports'].includes(route)) route = 'dashboard';
  state.route = route;
  if (window.location.hash !== `#${route}`) window.location.hash = route;
  render();
  document.querySelector('#sidebar').classList.remove('is-open');
  document.querySelector('.mobile-overlay')?.classList.remove('visible');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');
}

function resetFormErrors(form) {
  form.querySelectorAll('.field-error').forEach(node => { node.textContent = ''; });
  form.querySelectorAll('[aria-invalid="true"]').forEach(node => node.removeAttribute('aria-invalid'));
}
function setFieldError(form, name, message) {
  const input = form.elements.namedItem(name);
  const target = form.querySelector(`[data-error-for="${name}"]`);
  if (input) input.setAttribute('aria-invalid','true');
  if (target) target.textContent = message;
}
function setFormBusy(form, busy, label) {
  const submit = form.querySelector('[type="submit"]');
  if (!submit) return;
  submit.disabled = busy;
  const labelNode = submit.querySelector('.button-label');
  const spinner = submit.querySelector('.button-spinner');
  if (labelNode && !submit.dataset.originalLabel) submit.dataset.originalLabel = labelNode.textContent;
  if (labelNode) labelNode.textContent = busy ? label : submit.dataset.originalLabel;
  if (spinner) spinner.hidden = !busy;
}
function openPropertyModal() {
  const form = document.querySelector('#property-form');
  form.reset(); resetFormErrors(form);
  document.querySelector('#property-modal-title').textContent = 'Add a property';
  propertyModal.showModal();
  window.setTimeout(() => form.elements.namedItem('address').focus(), 20);
}
function openRepairModal() {
  const form = document.querySelector('#repair-form');
  form.reset(); resetFormErrors(form);
  const select = document.querySelector('#repair-property-select');
  select.innerHTML = '<option value="">Choose a property</option>' + state.properties.map(property => `<option value="${escapeHTML(property.id)}">${escapeHTML(property.address)}</option>`).join('');
  if (!state.properties.length) { showToast('Add a property first','You need a property record before logging a repair.','error'); return; }
  repairModal.showModal();
  window.setTimeout(() => select.focus(), 20);
}

async function handlePropertySubmit(event) {
  event.preventDefault();
  const form = event.currentTarget; resetFormErrors(form);
  const data = new FormData(form);
  const record = { id:`p-${Date.now().toString(36)}`, address:String(data.get('address')||'').trim(), postcode:String(data.get('postcode')||'').trim().toUpperCase(), bedrooms:Number(data.get('bedrooms')), rent:Number(data.get('rent')), status:String(data.get('status')||'occupied'), createdAt:new Date().toISOString() };
  let valid = true;
  if (record.address.length < 4) { setFieldError(form,'address','Enter a full property address.'); valid = false; }
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(record.postcode)) { setFieldError(form,'postcode','Enter a valid UK-style postcode, for example OL8 2AB.'); valid = false; }
  if (!Number.isInteger(record.bedrooms) || record.bedrooms < 1 || record.bedrooms > 5) { setFieldError(form,'bedrooms','Choose a bedroom count.'); valid = false; }
  if (!Number.isFinite(record.rent) || record.rent < 1 || record.rent > 100000) { setFieldError(form,'rent','Enter a rent between £1 and £100,000 per month.'); valid = false; }
  if (!valid) { form.querySelector('[aria-invalid="true"]')?.focus(); showToast('Check the highlighted fields','Please correct the errors before saving.','error'); return; }
  if (state.properties.some(property => property.address.toLowerCase() === record.address.toLowerCase() && property.postcode.toLowerCase() === record.postcode.toLowerCase())) { setFieldError(form,'address','This address and postcode already exist in the register.'); showToast('Possible duplicate','A property with this address and postcode already exists.','error'); form.elements.namedItem('address').focus(); return; }
  setFormBusy(form,true,'Saving…');
  try {
    await addRecord('properties',record);
    state.properties = [record,...state.properties];
    propertyModal.close(); state.route = 'properties'; state.search = ''; state.statusFilter = 'all'; navigate('properties');
    showToast('Property added',`${record.address} has been added to the register.`);
  } catch (error) { showToast('Property not saved',error.message || 'Try again.','error'); }
  finally { setFormBusy(form,false); }
}

async function handleRepairSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget; resetFormErrors(form);
  const data = new FormData(form);
  const record = { id:`r-${Date.now().toString(36)}`, propertyId:String(data.get('propertyId')||''), description:String(data.get('description')||'').trim(), priority:String(data.get('priority')||'routine'), status:String(data.get('status')||'open'), createdAt:new Date().toISOString() };
  let valid = true;
  if (!propertyById(record.propertyId)) { setFieldError(form,'propertyId','Choose a property from the list.'); valid = false; }
  if (record.description.length < 6) { setFieldError(form,'description','Describe the issue in at least 6 characters.'); valid = false; }
  if (!valid) { form.querySelector('[aria-invalid="true"]')?.focus(); showToast('Check the highlighted fields','Please correct the errors before saving.','error'); return; }
  setFormBusy(form,true,'Saving…');
  try {
    await addRecord('repairs',record);
    state.repairs = [record,...state.repairs]; repairModal.close(); navigate('repairs');
    showToast('Repair logged',`${statusLabel(record.priority)} repair recorded for ${propertyAddress(record.propertyId)}.`);
  } catch (error) { showToast('Repair not saved',error.message || 'Try again.','error'); }
  finally { setFormBusy(form,false); }
}

async function advanceRepair(id) {
  const repair = state.repairs.find(item => item.id === id);
  if (!repair) { showToast('Repair not found','Refresh the workspace and try again.','error'); return; }
  const nextStatus = repair.status === 'open' ? 'scheduled' : repair.status === 'scheduled' ? 'in-progress' : repair.status === 'in-progress' ? 'complete' : 'open';
  try {
    const updated = await updateRecord('repairs',id,{status:nextStatus});
    state.repairs = state.repairs.map(item => item.id === id ? updated : item);
    render(); showToast('Repair status updated',`Status changed to ${statusLabel(nextStatus).toLowerCase()}.`);
  } catch (error) { showToast('Status not updated',error.message || 'Try again.','error'); }
}

async function cyclePropertyStatus(id) {
  const property = propertyById(id);
  if (!property) { showToast('Property not found','Refresh the workspace and try again.','error'); return; }
  const sequence = ['occupied','vacant','maintenance'];
  const nextStatus = sequence[(sequence.indexOf(property.status)+1) % sequence.length];
  try {
    const updated = await updateRecord('properties',id,{status:nextStatus});
    state.properties = state.properties.map(item => item.id === id ? updated : item);
    render(); showToast('Property status updated',`${property.address} is now marked ${statusLabel(nextStatus).toLowerCase()}.`);
  } catch (error) { showToast('Status not updated',error.message || 'Try again.','error'); }
}

async function removeProperty(id) {
  const property = propertyById(id);
  if (!property) return;
  const relatedRepairs = state.repairs.some(item => item.propertyId === id);
  if (relatedRepairs) { showToast('Property has linked repairs','Close or reassign its repair records before deleting this property.','error'); return; }
  if (!window.confirm(`Delete ${property.address} from this demo register? This cannot be undone.`)) return;
  try {
    await deleteRecord('properties',id);
    state.properties = state.properties.filter(item => item.id !== id);
    render(); showToast('Property deleted',`${property.address} was removed from the demo register.`);
  } catch (error) { showToast('Property not deleted',error.message || 'Try again.','error'); }
}

function exportCsv() {
  const headers = ['Address','Postcode','Bedrooms','Monthly rent GBP','Status'];
  const rows = state.properties.map(item => [item.address,item.postcode,item.bedrooms,item.rent,statusLabel(item.status)]);
  const csvCell = value => `"${String(value ?? '').replace(/"/g,'""')}"`;
  const csv = [headers,...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'propertyflow-property-report.csv'; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  showToast('Report exported',`${rows.length} property records exported to CSV.`);
}

document.querySelectorAll('.primary-nav [data-route]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); navigate(link.dataset.route); }));

main.addEventListener('click', event => {
  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) { event.preventDefault(); navigate(routeTarget.dataset.route); return; }
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;
  const { action, id } = actionTarget.dataset;
  if (action === 'add-property') openPropertyModal();
  if (action === 'add-repair') openRepairModal();
  if (action === 'advance-repair') advanceRepair(id);
  if (action === 'cycle-property') cyclePropertyStatus(id);
  if (action === 'delete-property') removeProperty(id);
  if (action === 'clear-property-filters') { state.search=''; state.statusFilter='all'; render(); }
  if (action === 'refresh-data') { loadData({showProgress:true}).then(()=>showToast('Workspace refreshed','Latest browser-saved data has been loaded.')); }
  if (action === 'export-report') exportCsv();
});

document.querySelector('#property-form').addEventListener('submit',handlePropertySubmit);
document.querySelector('#repair-form').addEventListener('submit',handleRepairSubmit);
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click',() => document.getElementById(button.dataset.close)?.close()));
[ propertyModal, repairModal ].forEach(dialog => dialog.addEventListener('click',event => { if (event.target === dialog) dialog.close(); }));
document.querySelector('#notifications-button').addEventListener('click',() => navigate('compliance'));
document.querySelector('#menu-toggle').addEventListener('click',() => {
  const sidebar = document.querySelector('#sidebar');
  const isOpen = sidebar.classList.toggle('is-open');
  document.querySelector('#menu-toggle').setAttribute('aria-expanded',String(isOpen));
  let overlay = document.querySelector('.mobile-overlay');
  if (!overlay) { overlay = document.createElement('button'); overlay.className='mobile-overlay'; overlay.type='button'; overlay.setAttribute('aria-label','Close navigation'); document.body.append(overlay); overlay.addEventListener('click',() => { sidebar.classList.remove('is-open'); overlay.classList.remove('visible'); document.querySelector('#menu-toggle').setAttribute('aria-expanded','false'); }); }
  overlay.classList.toggle('visible',isOpen);
});
window.addEventListener('hashchange',() => {
  const route = window.location.hash.slice(1) || 'dashboard';
  if (route !== state.route) navigate(route);
});
window.addEventListener('keydown',event => { if (event.key === 'Escape') { document.querySelector('#sidebar').classList.remove('is-open'); document.querySelector('.mobile-overlay')?.classList.remove('visible'); document.querySelector('#menu-toggle').setAttribute('aria-expanded','false'); } });

document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short'}).format(new Date());
document.querySelector('#footer-year').textContent = new Date().getFullYear();
state.route = window.location.hash.slice(1) || 'dashboard';
loadData({showProgress:true});
