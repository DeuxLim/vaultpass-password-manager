const tableBody = document.getElementById('vaultTableBody');
const cardsBody = document.getElementById('vaultCards');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addItemBtn = document.getElementById('addItemBtn');
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
const twofaStatusText = document.getElementById('twofaStatusText');
const twofaSetupBtn = document.getElementById('twofaSetupBtn');
const twofaDisableBtn = document.getElementById('twofaDisableBtn');
const twofaSetupPanel = document.getElementById('twofaSetupPanel');
const twofaSecret = document.getElementById('twofaSecret');
const twofaUri = document.getElementById('twofaUri');
const twofaRecoveryCodes = document.getElementById('twofaRecoveryCodes');
const twofaVerifyCode = document.getElementById('twofaVerifyCode');
const twofaConfirmEnableBtn = document.getElementById('twofaConfirmEnableBtn');
const toastRegion = document.getElementById('toastRegion');

const vaultId = document.getElementById('vaultId');
const siteInput = document.getElementById('siteInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const notesInput = document.getElementById('notesInput');

let items = [];
let historyItemId = 0;
let modalReturnFocus = null;
let historyReturnFocus = null;
let sessionsReturnFocus = null;
let toastTimer = null;

const requestApi = window.VaultApi.apiRequest;
const initCsrfApi = window.VaultApi.initCsrf;
const csrfReady = initCsrfApi('../api/auth/csrf.php');

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
  if (!term) return items;
  return items.filter((item) => {
    const haystack = `${item.site} ${item.username} ${item.notes || ''}`.toLowerCase();
    return haystack.includes(term);
  });
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

function closeHistoryModal() {
  historyModal?.close();
}

function closeSessionsModal() {
  sessionsModal?.close();
}

function resetTwoFactorSetupUi() {
  if (twofaSetupPanel) twofaSetupPanel.hidden = true;
  if (twofaSecret) twofaSecret.textContent = '';
  if (twofaUri) twofaUri.value = '';
  if (twofaRecoveryCodes) twofaRecoveryCodes.innerHTML = '';
  if (twofaVerifyCode) twofaVerifyCode.value = '';
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
    await Promise.all([loadSessions(), loadTwoFactorStatus()]);
  } catch (error) {
    sessionsError.textContent = error.message || 'Unable to load sessions.';
  }
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
      <td>${escapeHtml(item.site)}</td>
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
  } else {
    modalTitle.textContent = 'Edit Password';
    vaultId.value = item.id;
    siteInput.value = item.site;
    usernameInput.value = item.username;
    passwordInput.value = item.password;
    notesInput.value = item.notes || '';
  }

  modal.showModal();
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
  renderTable();
}

addItemBtn?.addEventListener('click', (e) => openModal(null, e.currentTarget));
securityBtn?.addEventListener('click', (e) => {
  openSessionsModal(e.currentTarget).catch((error) => {
    sessionsError.textContent = error.message || 'Unable to load sessions.';
  });
});
cancelBtn?.addEventListener('click', closeModal);
historyCloseBtn?.addEventListener('click', closeHistoryModal);
sessionsCloseBtn?.addEventListener('click', closeSessionsModal);
searchInput?.addEventListener('input', renderTable);
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
  resetTwoFactorSetupUi();
  if (twofaStatusText) twofaStatusText.textContent = 'Checking status...';

  if (sessionsReturnFocus instanceof HTMLElement) {
    sessionsReturnFocus.focus();
  }
  sessionsReturnFocus = null;
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
    const ok = await loadSession();
    if (!ok) return;
    await loadItems();
  } catch (_error) {
    showToast('Unable to load dashboard data.', 'error');
  }
})();
