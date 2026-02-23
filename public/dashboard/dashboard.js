const tableBody = document.getElementById('vaultTableBody');
const cardsBody = document.getElementById('vaultCards');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const favoriteFilter = document.getElementById('favoriteFilter');
const folderFilter = document.getElementById('folderFilter');
const sortFilter = document.getElementById('sortFilter');
const themeToggle = document.getElementById('themeToggle');
const addItemBtn = document.getElementById('addItemBtn');
const backupBtn = document.getElementById('backupBtn');
const securityBtn = document.getElementById('securityBtn');
const logoutBtn = document.getElementById('logoutBtn');
const modal = document.getElementById('vaultModal');
const modalTitle = document.getElementById('modalTitle');
const modalError = document.getElementById('modalError');
const cancelBtn = document.getElementById('cancelBtn');
const vaultForm = document.getElementById('vaultForm');
const welcomeText = document.getElementById('welcomeText');
const historyModal = document.getElementById('historyModal');
const historyCloseBtn = document.getElementById('historyCloseBtn');
const historyItemLabel = document.getElementById('historyItemLabel');
const historyError = document.getElementById('historyError');
const historyList = document.getElementById('historyList');
const sessionsModal = document.getElementById('sessionsModal');
const sessionsCloseBtn = document.getElementById('sessionsCloseBtn');
const revokeOthersBtn = document.getElementById('revokeOthersBtn');
const sessionsError = document.getElementById('sessionsError');
const sessionsList = document.getElementById('sessionsList');
const refreshEventsBtn = document.getElementById('refreshEventsBtn');
const securityEventsList = document.getElementById('securityEventsList');
const twofaStatusText = document.getElementById('twofaStatusText');
const twofaSetupBtn = document.getElementById('twofaSetupBtn');
const twofaDisableBtn = document.getElementById('twofaDisableBtn');
const twofaSetupPanel = document.getElementById('twofaSetupPanel');
const twofaSecret = document.getElementById('twofaSecret');
const twofaUri = document.getElementById('twofaUri');
const twofaRecoveryCodes = document.getElementById('twofaRecoveryCodes');
const twofaVerifyCode = document.getElementById('twofaVerifyCode');
const twofaConfirmEnableBtn = document.getElementById('twofaConfirmEnableBtn');
const backupModal = document.getElementById('backupModal');
const backupCloseBtn = document.getElementById('backupCloseBtn');
const backupError = document.getElementById('backupError');
const exportPassphrase = document.getElementById('exportPassphrase');
const runExportBtn = document.getElementById('runExportBtn');
const exportOutput = document.getElementById('exportOutput');
const importPassphrase = document.getElementById('importPassphrase');
const backupJsonInput = document.getElementById('backupJsonInput');
const runImportBackupBtn = document.getElementById('runImportBackupBtn');
const csvInput = document.getElementById('csvInput');
const csvMapSite = document.getElementById('csvMapSite');
const csvMapUsername = document.getElementById('csvMapUsername');
const csvMapPassword = document.getElementById('csvMapPassword');
const csvMapNotes = document.getElementById('csvMapNotes');
const csvImportMode = document.getElementById('csvImportMode');
const runImportCsvBtn = document.getElementById('runImportCsvBtn');
const toastRegion = document.getElementById('toastRegion');

const vaultId = document.getElementById('vaultId');
const siteInput = document.getElementById('siteInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const notesInput = document.getElementById('notesInput');
const passwordStrengthLabel = document.getElementById('passwordStrengthLabel');
const passwordStrengthFill = document.getElementById('passwordStrengthFill');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const folderInput = document.getElementById('folderInput');
const tagsInput = document.getElementById('tagsInput');
const favoriteInput = document.getElementById('favoriteInput');
const generatorLength = document.getElementById('generatorLength');
const generatorLengthValue = document.getElementById('generatorLengthValue');
const generatorUpper = document.getElementById('generatorUpper');
const generatorLower = document.getElementById('generatorLower');
const generatorNumbers = document.getElementById('generatorNumbers');
const generatorSymbols = document.getElementById('generatorSymbols');
const healthTotal = document.getElementById('healthTotal');
const healthWeak = document.getElementById('healthWeak');
const healthReused = document.getElementById('healthReused');
const healthOld = document.getElementById('healthOld');

let items = [];
let historyItemId = 0;
let modalReturnFocus = null;
let historyReturnFocus = null;
let sessionsReturnFocus = null;
let backupReturnFocus = null;
let toastTimer = null;
let parsedCsvHeaders = [];
let parsedCsvRows = [];

const requestApi = window.VaultApi.apiRequest;
const initCsrfApi = window.VaultApi.initCsrf;
const csrfReady = initCsrfApi('../api/auth/csrf.php');

function applyTheme(theme) {
  const normalized = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', normalized);
  if (themeToggle) {
    themeToggle.textContent = normalized === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}

function initTheme() {
  const stored = window.localStorage.getItem('vaultpass_theme');
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
    return;
  }

  const preferredDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(preferredDark ? 'dark' : 'light');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function showToast(message, type = 'success') {
  if (!toastRegion) return;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }

  const text = String(message || '').trim();
  if (!text) return;

  toastRegion.textContent = text;
  toastRegion.classList.remove('is-success', 'is-error', 'is-visible');
  toastRegion.classList.add(type === 'error' ? 'is-error' : 'is-success', 'is-visible');

  toastTimer = window.setTimeout(() => {
    toastRegion.classList.remove('is-visible');
  }, 2600);
}

function filteredItems() {
  const term = (searchInput?.value || '').toLowerCase().trim();
  const favoriteMode = favoriteFilter?.value || 'all';
  const folderMode = folderFilter?.value || 'all';
  const sortMode = sortFilter?.value || 'updated_desc';

  let filtered = items.filter((item) => {
    if (favoriteMode === 'favorites' && !item.is_favorite) return false;
    if (favoriteMode === 'non-favorites' && item.is_favorite) return false;
    if (folderMode !== 'all' && (item.folder || '') !== folderMode) return false;

    if (!term) return true;
    const tagsText = Array.isArray(item.tags) ? item.tags.join(' ') : '';
    const haystack = `${item.site} ${item.username} ${item.folder || ''} ${tagsText} ${item.notes || ''}`.toLowerCase();
    return haystack.includes(term);
  });

  filtered = [...filtered];
  if (sortMode === 'site_asc') {
    filtered.sort((a, b) => String(a.site).localeCompare(String(b.site)));
  } else if (sortMode === 'site_desc') {
    filtered.sort((a, b) => String(b.site).localeCompare(String(a.site)));
  } else if (sortMode === 'created_desc') {
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  return filtered;
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return '—';
  return tags.map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('');
}

function parseTagsInput(rawValue) {
  const raw = String(rawValue || '');
  const dedup = new Map();
  raw.split(',').forEach((value) => {
    const tag = value.trim();
    if (!tag) return;
    dedup.set(tag.slice(0, 40), true);
  });
  return Array.from(dedup.keys()).slice(0, 20);
}

function populateFolderFilter() {
  if (!folderFilter) return;

  const selected = folderFilter.value || 'all';
  const folders = [...new Set(items.map((item) => String(item.folder || '').trim()).filter((value) => value !== ''))]
    .sort((a, b) => a.localeCompare(b));

  folderFilter.innerHTML = [
    '<option value="all">All folders</option>',
    ...folders.map((folder) => `<option value="${escapeHtml(folder)}">${escapeHtml(folder)}</option>`),
  ].join('');

  if (selected !== 'all' && folders.includes(selected)) {
    folderFilter.value = selected;
  }
}

function renderHealthSummary() {
  const total = items.length;
  const weak = items.filter((item) => scorePassword(item.password) < 60).length;

  const passwordCounts = new Map();
  items.forEach((item) => {
    const value = String(item.password || '');
    if (!value) return;
    passwordCounts.set(value, (passwordCounts.get(value) || 0) + 1);
  });
  const reused = Array.from(passwordCounts.values()).filter((count) => count > 1).reduce((sum, count) => sum + count, 0);

  const now = Date.now();
  const oldThresholdDays = 180;
  const old = items.filter((item) => {
    const updatedAt = new Date(item.updated_at).getTime();
    if (Number.isNaN(updatedAt)) return false;
    const ageDays = (now - updatedAt) / (1000 * 60 * 60 * 24);
    return ageDays >= oldThresholdDays;
  }).length;

  if (healthTotal) healthTotal.textContent = String(total);
  if (healthWeak) healthWeak.textContent = String(weak);
  if (healthReused) healthReused.textContent = String(reused);
  if (healthOld) healthOld.textContent = String(old);
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function scorePassword(password) {
  const value = String(password || '');
  if (!value) return 0;

  let score = Math.min(40, value.length * 3);
  if (/[a-z]/.test(value)) score += 12;
  if (/[A-Z]/.test(value)) score += 12;
  if (/\d/.test(value)) score += 12;
  if (/[^A-Za-z0-9]/.test(value)) score += 14;
  if (/(.)\1{2,}/.test(value)) score -= 10;
  if (/^\d+$/.test(value) || /^[A-Za-z]+$/.test(value)) score -= 8;

  return Math.max(0, Math.min(100, score));
}

function strengthLevel(score) {
  if (score >= 80) return { label: 'Strong', tone: '#1e5a33' };
  if (score >= 60) return { label: 'Good', tone: '#155eef' };
  if (score >= 40) return { label: 'Fair', tone: '#b54708' };
  return { label: 'Weak', tone: '#b42318' };
}

function updatePasswordStrength() {
  if (!passwordStrengthLabel || !passwordStrengthFill) return;

  const score = scorePassword(passwordInput?.value || '');
  if (score === 0) {
    passwordStrengthLabel.textContent = 'Strength: —';
    passwordStrengthFill.style.width = '0%';
    passwordStrengthFill.style.background = '#c8ccd5';
    return;
  }

  const level = strengthLevel(score);
  passwordStrengthLabel.textContent = `Strength: ${level.label} (${score}/100)`;
  passwordStrengthLabel.style.color = level.tone;
  passwordStrengthFill.style.width = `${score}%`;
  passwordStrengthFill.style.background = level.tone;
}

function generatorConfig() {
  return {
    length: Number(generatorLength?.value || 16),
    upper: Boolean(generatorUpper?.checked),
    lower: Boolean(generatorLower?.checked),
    numbers: Boolean(generatorNumbers?.checked),
    symbols: Boolean(generatorSymbols?.checked),
  };
}

function generatePassword() {
  const cfg = generatorConfig();
  let chars = '';
  if (cfg.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (cfg.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (cfg.numbers) chars += '0123456789';
  if (cfg.symbols) chars += '!@#$%^&*()-_=+[]{}:;,.?';

  if (!chars) {
    throw new Error('Select at least one character set for generation.');
  }

  const bytes = new Uint32Array(cfg.length);
  window.crypto.getRandomValues(bytes);
  let output = '';
  for (let i = 0; i < cfg.length; i += 1) {
    output += chars[bytes[i] % chars.length];
  }

  return output;
}

function closeHistoryModal() {
  historyModal?.close();
}

function closeSessionsModal() {
  sessionsModal?.close();
}

function closeBackupModal() {
  backupModal?.close();
}

function resetTwoFactorSetupUi() {
  if (twofaSetupPanel) twofaSetupPanel.hidden = true;
  if (twofaSecret) twofaSecret.textContent = '';
  if (twofaUri) twofaUri.value = '';
  if (twofaRecoveryCodes) twofaRecoveryCodes.innerHTML = '';
  if (twofaVerifyCode) twofaVerifyCode.value = '';
}

function resetBackupUi() {
  if (backupError) backupError.textContent = '';
  if (exportPassphrase) exportPassphrase.value = '';
  if (exportOutput) exportOutput.value = '';
  if (importPassphrase) importPassphrase.value = '';
  if (backupJsonInput) backupJsonInput.value = '';
  if (csvInput) csvInput.value = '';
  parsedCsvHeaders = [];
  parsedCsvRows = [];
  populateCsvMapping([]);
}

function parseCsv(text) {
  const rows = [];
  let cell = '';
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      const normalized = row.map((value) => value.trim());
      if (normalized.some((value) => value !== '')) {
        rows.push(normalized);
      }
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  const normalized = row.map((value) => value.trim());
  if (normalized.some((value) => value !== '')) {
    rows.push(normalized);
  }

  return rows;
}

function detectHeaderMapping(headers) {
  const normalized = headers.map((h) => h.toLowerCase());
  const find = (candidates) => normalized.findIndex((h) => candidates.some((c) => h.includes(c)));

  return {
    site: find(['site', 'url', 'domain', 'website']),
    username: find(['username', 'user', 'login', 'email']),
    password: find(['password', 'pass']),
    notes: find(['note', 'notes', 'memo']),
  };
}

function setSelectOptions(select, headers, includeEmpty = false) {
  if (!select) return;
  const options = [];
  if (includeEmpty) {
    options.push('<option value="">(none)</option>');
  }
  options.push(...headers.map((header, index) => `<option value="${index}">${escapeHtml(header)}</option>`));
  select.innerHTML = options.join('');
}

function populateCsvMapping(headers) {
  setSelectOptions(csvMapSite, headers);
  setSelectOptions(csvMapUsername, headers);
  setSelectOptions(csvMapPassword, headers);
  setSelectOptions(csvMapNotes, headers, true);

  if (headers.length === 0) return;

  const mapping = detectHeaderMapping(headers);
  if (csvMapSite && mapping.site >= 0) csvMapSite.value = String(mapping.site);
  if (csvMapUsername && mapping.username >= 0) csvMapUsername.value = String(mapping.username);
  if (csvMapPassword && mapping.password >= 0) csvMapPassword.value = String(mapping.password);
  if (csvMapNotes && mapping.notes >= 0) csvMapNotes.value = String(mapping.notes);
}

function toCsvImportRows() {
  const siteIndex = Number(csvMapSite?.value ?? -1);
  const usernameIndex = Number(csvMapUsername?.value ?? -1);
  const passwordIndex = Number(csvMapPassword?.value ?? -1);
  const notesIndexRaw = csvMapNotes?.value ?? '';
  const notesIndex = notesIndexRaw === '' ? -1 : Number(notesIndexRaw);

  if (siteIndex < 0 || usernameIndex < 0 || passwordIndex < 0) {
    throw new Error('Map site, username, and password columns before importing.');
  }

  return parsedCsvRows.map((row) => ({
    site: String(row[siteIndex] ?? '').trim(),
    username: String(row[usernameIndex] ?? '').trim(),
    password: String(row[passwordIndex] ?? ''),
    notes: notesIndex >= 0 ? String(row[notesIndex] ?? '').trim() : '',
  }));
}

async function runEncryptedExport() {
  const passphrase = exportPassphrase?.value ?? '';
  if (passphrase.trim().length < 10) {
    throw new Error('Export passphrase must be at least 10 characters.');
  }

  await csrfReady;
  const data = await requestApi('../api/vault/export.php', 'POST', { passphrase });
  const backupJson = JSON.stringify(data.backup || {}, null, 2);
  if (exportOutput) exportOutput.value = backupJson;

  const blob = new Blob([backupJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `vaultpass-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  showToast(`Backup exported (${Number(data.item_count || 0)} item(s)).`);
}

async function runEncryptedImport() {
  const passphrase = importPassphrase?.value ?? '';
  const backupRaw = backupJsonInput?.value ?? '';

  if (passphrase.trim() === '') {
    throw new Error('Import passphrase is required.');
  }
  if (backupRaw.trim() === '') {
    throw new Error('Paste the backup JSON payload to import.');
  }

  let parsed;
  try {
    parsed = JSON.parse(backupRaw);
  } catch (_error) {
    throw new Error('Backup JSON is invalid.');
  }

  await csrfReady;
  const data = await requestApi('../api/vault/import-backup.php', 'POST', {
    passphrase,
    backup: parsed,
  });
  await loadItems();

  const imported = Number(data.imported_count || 0);
  const errors = Number(data.error_count || 0);
  showToast(`Backup import finished: ${imported} imported, ${errors} error(s).`, errors > 0 ? 'error' : 'success');
}

async function runCsvImport() {
  if (parsedCsvRows.length === 0) {
    throw new Error('Paste CSV content first.');
  }

  const rows = toCsvImportRows();
  const mode = String(csvImportMode?.value || 'append');

  await csrfReady;
  const data = await requestApi('../api/vault/import-csv.php', 'POST', { rows, mode });
  await loadItems();

  const imported = Number(data.imported_count || 0);
  const errors = Number(data.error_count || 0);
  showToast(`CSV import finished: ${imported} imported, ${errors} error(s).`, errors > 0 ? 'error' : 'success');
}

function renderTwoFactorStatus(enabled, recoveryCodesRemaining) {
  if (!twofaStatusText || !twofaSetupBtn || !twofaDisableBtn) return;

  if (enabled) {
    twofaStatusText.textContent = `Enabled (${recoveryCodesRemaining} recovery code(s) remaining).`;
    twofaSetupBtn.disabled = true;
    twofaDisableBtn.disabled = false;
  } else {
    twofaStatusText.textContent = 'Not enabled.';
    twofaSetupBtn.disabled = false;
    twofaDisableBtn.disabled = true;
  }
}

async function loadTwoFactorStatus() {
  if (twofaStatusText) {
    twofaStatusText.textContent = 'Checking status...';
  }

  const data = await requestApi('../api/auth/2fa-status.php', 'GET');
  renderTwoFactorStatus(Boolean(data.enabled), Number(data.recovery_codes_remaining || 0));
}

async function startTwoFactorSetup() {
  sessionsError.textContent = '';
  resetTwoFactorSetupUi();

  await csrfReady;
  const data = await requestApi('../api/auth/2fa-setup.php', 'POST');
  const recoveryCodes = Array.isArray(data.recovery_codes) ? data.recovery_codes : [];

  if (twofaSecret) twofaSecret.textContent = String(data.secret || '');
  if (twofaUri) twofaUri.value = String(data.otpauth_uri || '');
  if (twofaRecoveryCodes) {
    twofaRecoveryCodes.innerHTML = recoveryCodes.map((code) => `<code>${escapeHtml(code)}</code>`).join('');
  }
  if (twofaSetupPanel) twofaSetupPanel.hidden = false;
  if (twofaVerifyCode) twofaVerifyCode.focus();

  showToast('2FA setup generated. Save your recovery codes now.');
}

async function confirmTwoFactorEnable() {
  const code = twofaVerifyCode?.value.trim() || '';
  if (!code) {
    sessionsError.textContent = 'Enter the 6-digit code from your authenticator app.';
    return;
  }

  sessionsError.textContent = '';
  await csrfReady;
  await requestApi('../api/auth/2fa-enable.php', 'POST', { code });
  resetTwoFactorSetupUi();
  await loadTwoFactorStatus();
  showToast('2FA enabled successfully.');
}

async function disableTwoFactor() {
  const password = window.prompt('Enter your account password to disable 2FA:');
  if (!password) return;

  const token = window.prompt('Enter current authenticator code or a recovery code:');
  if (!token) return;

  sessionsError.textContent = '';
  await csrfReady;
  await requestApi('../api/auth/2fa-disable.php', 'POST', { password, token });
  resetTwoFactorSetupUi();
  await loadTwoFactorStatus();
  showToast('2FA disabled.');
}

async function loadHistory(itemId) {
  historyError.textContent = '';
  historyList.innerHTML = '<p class="history-empty">Loading history...</p>';

  const data = await requestApi(`../api/vault/list-versions.php?item_id=${itemId}`, 'GET');
  const versions = data.versions || [];
  const itemSite = data.item?.site || '';

  historyItemLabel.textContent = itemSite ? `Item: ${itemSite}` : 'Item history';

  if (versions.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No previous versions yet.</p>';
    return;
  }

  historyList.innerHTML = versions.map((version) => {
    const notes = (version.notes || '').trim();
    const notesPreview = notes ? escapeHtml(notes.slice(0, 90)) : 'No notes';
    return `
      <article class="history-entry">
        <div class="history-entry-head">
          <p class="history-entry-time">${escapeHtml(formatDateTime(version.created_at))}</p>
          <p class="history-entry-source">${escapeHtml(version.source || 'update')}</p>
        </div>
        <p class="history-entry-meta">Username: ${escapeHtml(version.username)}</p>
        <p class="history-entry-meta">Site: ${escapeHtml(version.site)}</p>
        <p class="history-entry-meta">Folder: ${escapeHtml(version.folder || '—')}</p>
        <p class="history-entry-meta">Tags: ${escapeHtml(Array.isArray(version.tags) && version.tags.length > 0 ? version.tags.join(', ') : '—')}</p>
        <p class="history-entry-meta">Notes: ${notesPreview}</p>
        <button
          type="button"
          class="action-neutral"
          data-action="restore-version"
          data-version-id="${version.id}"
          aria-label="Restore version from ${escapeHtml(formatDateTime(version.created_at))}"
        >
          Restore This Version
        </button>
      </article>
    `;
  }).join('');
}

function sessionDeviceLabel(userAgent) {
  const ua = String(userAgent || '').toLowerCase();
  if (ua.includes('iphone') || ua.includes('android') || ua.includes('mobile')) {
    return 'Mobile browser';
  }

  if (ua.includes('mac') || ua.includes('windows') || ua.includes('linux')) {
    return 'Desktop browser';
  }

  return 'Browser session';
}

function renderSessionsList(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    sessionsList.innerHTML = '<p class="history-empty">No active sessions found.</p>';
    return;
  }

  sessionsList.innerHTML = sessions.map((session) => {
    const isCurrent = Boolean(session.is_current);
    const isRevoked = Boolean(session.revoked_at);
    const status = isCurrent ? 'Current' : (isRevoked ? 'Revoked' : 'Active');
    const action = (!isCurrent && !isRevoked)
      ? `<button type="button" class="action-danger" data-action="revoke-session" data-session-id="${session.id}">Revoke</button>`
      : '<button type="button" class="action-secondary" disabled>Unavailable</button>';

    return `
      <article class="session-entry ${isCurrent ? 'is-current' : ''}">
        <div class="session-entry-head">
          <p class="session-entry-title">${escapeHtml(sessionDeviceLabel(session.user_agent))}</p>
          <span class="session-status ${isCurrent ? 'is-current' : (isRevoked ? 'is-revoked' : 'is-active')}">${status}</span>
        </div>
        <p class="session-entry-meta">IP: ${escapeHtml(session.ip_address || 'unknown')}</p>
        <p class="session-entry-meta">Last activity: ${escapeHtml(formatDateTime(session.last_activity))}</p>
        <p class="session-entry-meta">Created: ${escapeHtml(formatDateTime(session.created_at))}</p>
        <div class="session-entry-actions">${action}</div>
      </article>
    `;
  }).join('');
}

function formatEventName(eventType) {
  const value = String(eventType || '').trim();
  if (!value) return 'Unknown event';
  return value.replaceAll('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderSecurityEvents(events) {
  if (!securityEventsList) return;

  if (!Array.isArray(events) || events.length === 0) {
    securityEventsList.innerHTML = '<p class="history-empty">No security events yet.</p>';
    return;
  }

  securityEventsList.innerHTML = events.map((event) => `
    <article class="event-item">
      <p class="event-title">${escapeHtml(formatEventName(event.event_type))}</p>
      <p class="event-meta">When: ${escapeHtml(formatDateTime(event.created_at))}</p>
      <p class="event-meta">IP: ${escapeHtml(event.ip_address || 'unknown')}</p>
    </article>
  `).join('');
}

async function loadSecurityEvents() {
  if (!securityEventsList) return;
  securityEventsList.innerHTML = '<p class="history-empty">Loading security events...</p>';

  const data = await requestApi('../api/auth/security-events.php?limit=40', 'GET');
  if (sessionsError && data.available === false) {
    sessionsError.textContent = data.warning || 'Security events are unavailable until migration 001 is applied.';
  }
  renderSecurityEvents(data.events || []);
}

async function loadSessions() {
  sessionsError.textContent = '';
  sessionsList.innerHTML = '<p class="history-empty">Loading sessions...</p>';

  const data = await requestApi('../api/auth/sessions.php', 'GET');
  renderSessionsList(data.sessions || []);
}

async function openHistoryModal(item, triggerElement = null) {
  historyItemId = item.id;
  historyError.textContent = '';
  historyReturnFocus = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
  historyModal.showModal();

  try {
    await loadHistory(item.id);
  } catch (error) {
    historyError.textContent = error.message || 'Unable to load history.';
  }
}

async function openSessionsModal(triggerElement = null) {
  sessionsError.textContent = '';
  sessionsReturnFocus = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
  sessionsModal.showModal();

  try {
    await Promise.all([loadSessions(), loadTwoFactorStatus(), loadSecurityEvents()]);
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to load sessions.';
  }
}

function openBackupModal(triggerElement = null) {
  backupError.textContent = '';
  backupReturnFocus = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
  backupModal.showModal();
}

function renderTable() {
  const visible = filteredItems();

  if (visible.length === 0) {
    tableBody.innerHTML = '';
    cardsBody.innerHTML = '';

    if (items.length === 0) {
      emptyState.textContent = 'No saved passwords yet. Add your first credential to get started.';
    } else {
      emptyState.textContent = 'No matches found. Try another search term.';
    }

    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  tableBody.innerHTML = visible.map((item) => `
    <tr>
      <td class="favorite-cell">
        <button
          type="button"
          data-action="toggle-favorite"
          data-id="${item.id}"
          class="favorite-btn ${item.is_favorite ? 'is-favorite' : ''}"
          aria-label="${item.is_favorite ? 'Remove favorite' : 'Mark as favorite'} for ${escapeHtml(item.site)}"
          title="${item.is_favorite ? 'Favorite' : 'Not favorite'}"
        >★</button>
      </td>
      <td>${escapeHtml(item.site)}</td>
      <td>${escapeHtml(item.folder || '—')}</td>
      <td>${renderTags(item.tags)}</td>
      <td>${escapeHtml(item.username)}</td>
      <td>${escapeHtml(item.password)}</td>
      <td>${escapeHtml(item.notes || '')}</td>
      <td class="actions">
        <button type="button" data-action="copy-user" data-id="${item.id}" class="action-secondary" aria-label="Copy username for ${escapeHtml(item.site)}">Copy User</button>
        <button type="button" data-action="copy-pass" data-id="${item.id}" class="action-secondary" aria-label="Copy password for ${escapeHtml(item.site)}">Copy Pass</button>
        <button type="button" data-action="edit" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.site)}">Edit</button>
        <button type="button" data-action="history" data-id="${item.id}" class="action-neutral" aria-label="View history for ${escapeHtml(item.site)}">History</button>
        <button type="button" data-action="delete" data-id="${item.id}" class="action-danger" aria-label="Delete ${escapeHtml(item.site)}">Delete</button>
      </td>
    </tr>
  `).join('');

  cardsBody.innerHTML = visible.map((item) => `
    <article class="vault-card">
      <header>
        <h3>${escapeHtml(item.site)}</h3>
      </header>
      <dl>
        <div>
          <dt>Favorite</dt>
          <dd>
            <button
              type="button"
              data-action="toggle-favorite"
              data-id="${item.id}"
              class="favorite-btn ${item.is_favorite ? 'is-favorite' : ''}"
              aria-label="${item.is_favorite ? 'Remove favorite' : 'Mark as favorite'} for ${escapeHtml(item.site)}"
            >★</button>
          </dd>
        </div>
        <div>
          <dt>Folder</dt>
          <dd>${escapeHtml(item.folder || '—')}</dd>
        </div>
        <div>
          <dt>Tags</dt>
          <dd>${renderTags(item.tags)}</dd>
        </div>
        <div>
          <dt>Username</dt>
          <dd>${escapeHtml(item.username)}</dd>
        </div>
        <div>
          <dt>Password</dt>
          <dd>${escapeHtml(item.password)}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>${escapeHtml(item.notes || '—')}</dd>
        </div>
      </dl>
      <div class="card-actions">
        <button type="button" data-action="copy-user" data-id="${item.id}" class="action-secondary" aria-label="Copy username for ${escapeHtml(item.site)}">Copy User</button>
        <button type="button" data-action="copy-pass" data-id="${item.id}" class="action-secondary" aria-label="Copy password for ${escapeHtml(item.site)}">Copy Pass</button>
        <button type="button" data-action="edit" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.site)}">Edit</button>
        <button type="button" data-action="history" data-id="${item.id}" class="action-neutral" aria-label="View history for ${escapeHtml(item.site)}">History</button>
        <button type="button" data-action="delete" data-id="${item.id}" class="action-danger" aria-label="Delete ${escapeHtml(item.site)}">Delete</button>
      </div>
    </article>
  `).join('');
}

function openModal(item = null, triggerElement = null) {
  modalError.textContent = '';
  modalReturnFocus = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;

  if (!item) {
    modalTitle.textContent = 'Add Password';
    vaultId.value = '';
    siteInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    notesInput.value = '';
    if (folderInput) folderInput.value = '';
    if (tagsInput) tagsInput.value = '';
    if (favoriteInput) favoriteInput.checked = false;
    if (generatorLength) generatorLength.value = '16';
    if (generatorLengthValue) generatorLengthValue.textContent = '16';
    if (generatorUpper) generatorUpper.checked = true;
    if (generatorLower) generatorLower.checked = true;
    if (generatorNumbers) generatorNumbers.checked = true;
    if (generatorSymbols) generatorSymbols.checked = true;
  } else {
    modalTitle.textContent = 'Edit Password';
    vaultId.value = item.id;
    siteInput.value = item.site;
    usernameInput.value = item.username;
    passwordInput.value = item.password;
    notesInput.value = item.notes || '';
    if (folderInput) folderInput.value = item.folder || '';
    if (tagsInput) tagsInput.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    if (favoriteInput) favoriteInput.checked = Boolean(item.is_favorite);
  }

  modal.showModal();
  updatePasswordStrength();
  window.setTimeout(() => {
    siteInput.focus();
  }, 0);
}

function closeModal() {
  modal.close();
}

async function loadSession() {
  const res = await fetch('../api/auth/session.php', { credentials: 'same-origin' });
  const data = await res.json();

  if (!data?.authenticated) {
    window.location.href = '../pages/login.html';
    return false;
  }

  welcomeText.textContent = `Welcome, ${data.user?.name || 'User'}`;
  return true;
}

async function loadItems() {
  const data = await requestApi('../api/vault/list.php', 'GET');
  items = data.items || [];
  populateFolderFilter();
  renderHealthSummary();
  renderTable();
}

addItemBtn?.addEventListener('click', (e) => openModal(null, e.currentTarget));
backupBtn?.addEventListener('click', (e) => {
  resetBackupUi();
  openBackupModal(e.currentTarget);
});
securityBtn?.addEventListener('click', (e) => {
  openSessionsModal(e.currentTarget).catch((error) => {
    sessionsError.textContent = error.message || 'Unable to load sessions.';
  });
});
cancelBtn?.addEventListener('click', closeModal);
historyCloseBtn?.addEventListener('click', closeHistoryModal);
sessionsCloseBtn?.addEventListener('click', closeSessionsModal);
backupCloseBtn?.addEventListener('click', closeBackupModal);
searchInput?.addEventListener('input', renderTable);
favoriteFilter?.addEventListener('change', renderTable);
folderFilter?.addEventListener('change', renderTable);
sortFilter?.addEventListener('change', renderTable);
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  window.localStorage.setItem('vaultpass_theme', next);
});
passwordInput?.addEventListener('input', updatePasswordStrength);
generatorLength?.addEventListener('input', () => {
  if (generatorLengthValue) {
    generatorLengthValue.textContent = String(generatorLength.value);
  }
});
generatePasswordBtn?.addEventListener('click', () => {
  try {
    const generated = generatePassword();
    passwordInput.value = generated;
    updatePasswordStrength();
    showToast('Generated secure password.');
  } catch (error) {
    modalError.textContent = error.message || 'Unable to generate password.';
  }
});
csvInput?.addEventListener('input', () => {
  backupError.textContent = '';
  const raw = csvInput.value || '';
  if (raw.trim() === '') {
    parsedCsvHeaders = [];
    parsedCsvRows = [];
    populateCsvMapping([]);
    return;
  }

  const parsed = parseCsv(raw);
  if (parsed.length < 2) {
    parsedCsvHeaders = [];
    parsedCsvRows = [];
    populateCsvMapping([]);
    return;
  }

  parsedCsvHeaders = parsed[0];
  parsedCsvRows = parsed.slice(1);
  populateCsvMapping(parsedCsvHeaders);
});

runExportBtn?.addEventListener('click', async () => {
  backupError.textContent = '';
  try {
    await runEncryptedExport();
  } catch (error) {
    backupError.textContent = error.message || 'Unable to export backup.';
  }
});

runImportBackupBtn?.addEventListener('click', async () => {
  backupError.textContent = '';
  try {
    await runEncryptedImport();
  } catch (error) {
    backupError.textContent = error.message || 'Unable to import backup.';
  }
});

runImportCsvBtn?.addEventListener('click', async () => {
  backupError.textContent = '';
  try {
    await runCsvImport();
  } catch (error) {
    backupError.textContent = error.message || 'Unable to import CSV.';
  }
});
refreshEventsBtn?.addEventListener('click', async () => {
  sessionsError.textContent = '';
  try {
    await loadSecurityEvents();
    showToast('Security events refreshed.');
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to refresh security events.';
  }
});
twofaSetupBtn?.addEventListener('click', async () => {
  try {
    await startTwoFactorSetup();
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to start 2FA setup.';
  }
});
twofaConfirmEnableBtn?.addEventListener('click', async () => {
  try {
    await confirmTwoFactorEnable();
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to enable 2FA.';
  }
});
twofaDisableBtn?.addEventListener('click', async () => {
  try {
    await disableTwoFactor();
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to disable 2FA.';
  }
});

modal?.addEventListener('close', () => {
  if (modalReturnFocus instanceof HTMLElement) {
    modalReturnFocus.focus();
  }
  modalReturnFocus = null;
});

historyModal?.addEventListener('close', () => {
  historyError.textContent = '';
  historyItemLabel.textContent = '';
  historyList.innerHTML = '';
  historyItemId = 0;

  if (historyReturnFocus instanceof HTMLElement) {
    historyReturnFocus.focus();
  }
  historyReturnFocus = null;
});

sessionsModal?.addEventListener('close', () => {
  sessionsError.textContent = '';
  sessionsList.innerHTML = '';
  if (securityEventsList) securityEventsList.innerHTML = '';
  resetTwoFactorSetupUi();
  if (twofaStatusText) twofaStatusText.textContent = 'Checking status...';

  if (sessionsReturnFocus instanceof HTMLElement) {
    sessionsReturnFocus.focus();
  }
  sessionsReturnFocus = null;
});

backupModal?.addEventListener('close', () => {
  resetBackupUi();

  if (backupReturnFocus instanceof HTMLElement) {
    backupReturnFocus.focus();
  }
  backupReturnFocus = null;
});

revokeOthersBtn?.addEventListener('click', async () => {
  const confirmed = window.confirm('Revoke all sessions except this current session?');
  if (!confirmed) return;

  sessionsError.textContent = '';

  try {
    await csrfReady;
    const data = await requestApi('../api/auth/revoke-other-sessions.php', 'POST');
    await loadSessions();

    if ((data.revoked_count || 0) > 0) {
      showToast(`Revoked ${data.revoked_count} other session(s).`);
    } else {
      showToast('No other active sessions to revoke.');
    }
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to revoke other sessions.';
  }
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await csrfReady;
    await requestApi('../api/auth/logout.php', 'POST');
    window.location.href = '../pages/login.html';
  } catch (_error) {
    window.location.href = '../pages/login.html';
  }
});

vaultForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  modalError.textContent = '';

  const payload = {
    site: siteInput.value.trim(),
    username: usernameInput.value.trim(),
    password: passwordInput.value,
    notes: notesInput.value.trim(),
    folder: folderInput?.value.trim() || '',
    tags: parseTagsInput(tagsInput?.value || ''),
    is_favorite: favoriteInput?.checked ? 1 : 0,
  };

  if (!payload.site || !payload.username || !payload.password) {
    modalError.textContent = 'Site, username, and password are required.';
    return;
  }

  try {
    await csrfReady;
    const isUpdate = Boolean(vaultId.value);

    if (isUpdate) {
      await requestApi('../api/vault/update.php', 'POST', {
        id: Number(vaultId.value),
        ...payload,
      });
      showToast('Password entry updated.');
    } else {
      await requestApi('../api/vault/create.php', 'POST', payload);
      showToast('Password entry added.');
    }

    closeModal();
    await loadItems();
  } catch (error) {
    modalError.textContent = error.message;
  }
});

async function handleVaultAction(target) {
  if (!(target instanceof HTMLElement)) return;

  const actionButton = target.closest('button[data-action]');
  if (!(actionButton instanceof HTMLElement)) return;

  const action = actionButton.dataset.action;
  const id = Number(actionButton.dataset.id || 0);
  if (!action || !id) return;

  const item = items.find((row) => row.id === id);
  if (!item) return;

  if (action === 'copy-user') {
    try {
      await navigator.clipboard.writeText(item.username);
      showToast(`Username copied for ${item.site}.`);
    } catch (_error) {
      showToast('Unable to copy username.', 'error');
    }
    return;
  }

  if (action === 'copy-pass') {
    try {
      await navigator.clipboard.writeText(item.password);
      showToast(`Password copied for ${item.site}.`);
    } catch (_error) {
      showToast('Unable to copy password.', 'error');
    }
    return;
  }

  if (action === 'edit') {
    openModal(item, actionButton);
    return;
  }

  if (action === 'toggle-favorite') {
    await csrfReady;
    const nextValue = item.is_favorite ? 0 : 1;
    await requestApi('../api/vault/toggle-favorite.php', 'POST', { id, is_favorite: nextValue });
    await loadItems();
    showToast(nextValue === 1 ? `Marked ${item.site} as favorite.` : `Removed ${item.site} from favorites.`);
    return;
  }

  if (action === 'history') {
    await openHistoryModal(item, actionButton);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm(`Delete saved password for ${item.site}?`);
    if (!confirmed) return;

    await csrfReady;
    await requestApi('../api/vault/delete.php', 'POST', { id });
    await loadItems();
    showToast(`Deleted entry for ${item.site}.`);
  }
}

tableBody?.addEventListener('click', async (e) => {
  try {
    await handleVaultAction(e.target);
  } catch (error) {
    showToast(error.message || 'Action failed.', 'error');
  }
});

cardsBody?.addEventListener('click', async (e) => {
  try {
    await handleVaultAction(e.target);
  } catch (error) {
    showToast(error.message || 'Action failed.', 'error');
  }
});

historyList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const actionButton = target.closest('button[data-action="restore-version"]');
  if (!(actionButton instanceof HTMLElement)) return;

  const versionId = Number(actionButton.dataset.versionId || 0);
  if (!versionId || !historyItemId) return;

  const confirmed = window.confirm('Restore this version? Current values will be saved as a backup version.');
  if (!confirmed) return;

  historyError.textContent = '';
  try {
    await csrfReady;
    await requestApi('../api/vault/restore-version.php', 'POST', { version_id: versionId });
    await loadItems();
    await loadHistory(historyItemId);
    showToast('Version restored successfully.');
  } catch (error) {
    historyError.textContent = error.message;
  }
});

sessionsList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const actionButton = target.closest('button[data-action="revoke-session"]');
  if (!(actionButton instanceof HTMLElement)) return;

  const sessionId = Number(actionButton.dataset.sessionId || 0);
  if (!sessionId) return;

  const confirmed = window.confirm('Revoke this session? The device will be signed out.');
  if (!confirmed) return;

  sessionsError.textContent = '';

  try {
    await csrfReady;
    await requestApi('../api/auth/revoke-session.php', 'POST', { session_id: sessionId });
    await loadSessions();
    showToast('Session revoked.');
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to revoke session.';
  }
});

(async function init() {
  try {
    initTheme();
    const ok = await loadSession();
    if (!ok) return;
    await loadItems();
  } catch (_error) {
    showToast('Unable to load dashboard data.', 'error');
  }
})();
