import { apiRequest, getBaseUrl, setBaseUrl, openLoginPage } from '../shared/api.js';

const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const baseUrlInput = document.getElementById('baseUrlInput');
const saveBaseUrlBtn = document.getElementById('saveBaseUrlBtn');
const authStatus = document.getElementById('authStatus');
const openLoginBtn = document.getElementById('openLoginBtn');
const refreshBtn = document.getElementById('refreshBtn');
const vaultPanel = document.getElementById('vaultPanel');
const searchInput = document.getElementById('searchInput');
const vaultList = document.getElementById('vaultList');
const emptyState = document.getElementById('emptyState');
const errorText = document.getElementById('errorText');
const genLength = document.getElementById('genLength');
const genUpper = document.getElementById('genUpper');
const genLower = document.getElementById('genLower');
const genNumbers = document.getElementById('genNumbers');
const genSymbols = document.getElementById('genSymbols');
const runGenerateBtn = document.getElementById('runGenerateBtn');
const copyGeneratedBtn = document.getElementById('copyGeneratedBtn');
const generatedPassword = document.getElementById('generatedPassword');

let items = [];
const pendingActions = new Set();

function setError(message = '') {
  errorText.textContent = String(message || '').trim();
}

function filteredItems() {
  const q = String(searchInput.value || '').toLowerCase().trim();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = `${item.site} ${item.username} ${item.notes || ''}`.toLowerCase();
    return haystack.includes(q);
  });
}

function normalizeItemType(value) {
  return String(value || '').trim() === 'secure_note' ? 'secure_note' : 'login';
}

function formatItemType(value) {
  return normalizeItemType(value) === 'secure_note' ? 'Secure Note' : 'Login';
}

function renderItemActions(item) {
  if (normalizeItemType(item.item_type) === 'secure_note') {
    return '<button type="button" data-action="copy-note" data-id="' + item.id + '">Copy Note</button>';
  }

  return `
    <button type="button" data-action="fill" data-id="${item.id}">Fill</button>
    <button type="button" data-action="copy-user" data-id="${item.id}">Copy User</button>
    <button type="button" data-action="copy-pass" data-id="${item.id}">Copy Pass</button>
  `;
}

function renderList() {
  const visible = filteredItems();
  if (visible.length === 0) {
    vaultList.innerHTML = '';
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  vaultList.innerHTML = visible.map((item) => `
    <article class="vault-item">
      <h2>${escapeHtml(item.site)}</h2>
      <p class="vault-meta">${escapeHtml(formatItemType(item.item_type))} · ${escapeHtml(normalizeItemType(item.item_type) === 'secure_note' ? 'No login fields' : item.username)}</p>
      <div class="item-actions ${normalizeItemType(item.item_type) === 'secure_note' ? 'item-actions-note' : ''}">${renderItemActions(item)}</div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function generatePassword() {
  const length = Math.max(8, Math.min(64, Number(genLength?.value || 16)));
  genLength.value = String(length);

  let chars = '';
  if (genUpper?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (genLower?.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (genNumbers?.checked) chars += '0123456789';
  if (genSymbols?.checked) chars += '!@#$%^&*()-_=+[]{}:;,.?';

  if (!chars) {
    throw new Error('Select at least one character set');
  }

  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  let output = '';
  for (let i = 0; i < length; i += 1) {
    output += chars[values[i] % chars.length];
  }
  return output;
}

async function checkSessionAndLoad() {
  setError('');
  vaultPanel.hidden = true;
  openLoginBtn.hidden = true;
  refreshBtn.hidden = true;
  authStatus.textContent = 'Checking session...';

  try {
    const session = await apiRequest('/api/auth/session.php', 'GET');
    if (!session?.authenticated) {
      authStatus.textContent = 'Not logged in to VaultPass web app.';
      openLoginBtn.hidden = false;
      refreshBtn.hidden = false;
      return;
    }

    authStatus.textContent = `Signed in as ${session.user?.name || 'User'}`;
    refreshBtn.hidden = false;

    const data = await apiRequest('/api/vault/list.php', 'GET');
    items = Array.isArray(data.items) ? data.items : [];
    vaultPanel.hidden = false;
    renderList();
  } catch (error) {
    authStatus.textContent = 'Unable to reach backend.';
    openLoginBtn.hidden = false;
    refreshBtn.hidden = false;
    setError(error.message || 'Request failed.');
  }
}

vaultList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.dataset.id || 0);
  const action = String(button.dataset.action || '').trim();
  if (!action) return;
  const actionKey = `${action}:${id}`;
  if (pendingActions.has(actionKey)) return;

  const item = items.find((row) => row.id === id);
  if (!item) return;

  pendingActions.add(actionKey);
  button.disabled = true;

  try {
    if (action === 'fill') {
      if (normalizeItemType(item.item_type) === 'secure_note') {
        throw new Error('Secure notes cannot be autofilled.');
      }
      const response = await chrome.runtime.sendMessage({
        type: 'EXT_FILL_ACTIVE_TAB',
        credential: {
          id: item.id,
          site: item.site,
          username: item.username,
          password: item.password,
        },
      });
      if (!response?.ok) {
        throw new Error(response?.error || 'Unable to fill in page');
      }
    } else if (action === 'copy-note') {
      const note = String(item.notes || '').trim();
      if (!note) {
        throw new Error('Secure note is empty.');
      }
      await navigator.clipboard.writeText(note);
    } else if (action === 'copy-user') {
      if (normalizeItemType(item.item_type) === 'secure_note') {
        throw new Error('Secure notes do not contain usernames.');
      }
      await navigator.clipboard.writeText(item.username);
    } else if (action === 'copy-pass') {
      if (normalizeItemType(item.item_type) === 'secure_note') {
        throw new Error('Secure notes do not contain passwords.');
      }
      await navigator.clipboard.writeText(item.password);
    }
    setError('');
  } catch (error) {
    setError(error?.message || 'Action failed.');
  } finally {
    pendingActions.delete(actionKey);
    button.disabled = false;
  }
});

searchInput.addEventListener('input', renderList);
settingsToggle.addEventListener('click', () => {
  settingsPanel.hidden = !settingsPanel.hidden;
});

saveBaseUrlBtn.addEventListener('click', async () => {
  try {
    const updated = await setBaseUrl(baseUrlInput.value);
    baseUrlInput.value = updated;
    await checkSessionAndLoad();
  } catch (error) {
    setError(error.message || 'Unable to save URL.');
  }
});

openLoginBtn.addEventListener('click', async () => {
  await openLoginPage();
});

refreshBtn.addEventListener('click', async () => {
  await checkSessionAndLoad();
});

runGenerateBtn.addEventListener('click', () => {
  try {
    const value = generatePassword();
    generatedPassword.value = value;
    setError('');
  } catch (error) {
    setError(error.message || 'Unable to generate password.');
  }
});

copyGeneratedBtn.addEventListener('click', async () => {
  try {
    const value = String(generatedPassword.value || '').trim();
    if (!value) {
      throw new Error('Generate a password first.');
    }
    await navigator.clipboard.writeText(value);
    setError('');
  } catch (error) {
    setError(error.message || 'Unable to copy password.');
  }
});

(async function init() {
  const baseUrl = await getBaseUrl();
  baseUrlInput.value = baseUrl;
  try {
    generatedPassword.value = generatePassword();
  } catch (_error) {
    generatedPassword.value = '';
  }
  await checkSessionAndLoad();
})();
