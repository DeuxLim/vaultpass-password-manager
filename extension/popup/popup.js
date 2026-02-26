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

let items = [];

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
      <p class="vault-meta">${escapeHtml(item.username)}</p>
      <div class="item-actions">
        <button type="button" data-action="fill" data-id="${item.id}">Fill</button>
        <button type="button" data-action="copy-user" data-id="${item.id}">Copy User</button>
        <button type="button" data-action="copy-pass" data-id="${item.id}">Copy Pass</button>
      </div>
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
  const item = items.find((row) => row.id === id);
  if (!item) return;

  try {
    if (button.dataset.action === 'fill') {
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
    } else if (button.dataset.action === 'copy-user') {
      await navigator.clipboard.writeText(item.username);
    } else if (button.dataset.action === 'copy-pass') {
      await navigator.clipboard.writeText(item.password);
    }
    setError('');
  } catch (error) {
    setError(error?.message || 'Action failed.');
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

(async function init() {
  const baseUrl = await getBaseUrl();
  baseUrlInput.value = baseUrl;
  await checkSessionAndLoad();
})();
