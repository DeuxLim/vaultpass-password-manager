const tableBody = document.getElementById('vaultTableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const addItemBtn = document.getElementById('addItemBtn');
const logoutBtn = document.getElementById('logoutBtn');
const modal = document.getElementById('vaultModal');
const modalTitle = document.getElementById('modalTitle');
const modalError = document.getElementById('modalError');
const cancelBtn = document.getElementById('cancelBtn');
const vaultForm = document.getElementById('vaultForm');
const welcomeText = document.getElementById('welcomeText');

const vaultId = document.getElementById('vaultId');
const siteInput = document.getElementById('siteInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const notesInput = document.getElementById('notesInput');

let items = [];

const requestApi = window.VaultApi.apiRequest;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function filteredItems() {
  const term = (searchInput?.value || '').toLowerCase().trim();
  if (!term) return items;
  return items.filter((item) => {
    const haystack = `${item.site} ${item.username}`.toLowerCase();
    return haystack.includes(term);
  });
}

function renderTable() {
  const visible = filteredItems();

  if (visible.length === 0) {
    tableBody.innerHTML = '';
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
        <button data-action="copy-user" data-id="${item.id}" class="action-secondary">Copy User</button>
        <button data-action="copy-pass" data-id="${item.id}" class="action-secondary">Copy Pass</button>
        <button data-action="edit" data-id="${item.id}">Edit</button>
        <button data-action="delete" data-id="${item.id}" class="action-danger">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openModal(item = null) {
  modalError.textContent = '';

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

addItemBtn?.addEventListener('click', () => openModal());
cancelBtn?.addEventListener('click', closeModal);
searchInput?.addEventListener('input', renderTable);

logoutBtn?.addEventListener('click', async () => {
  try {
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
    if (vaultId.value) {
      await requestApi('../api/vault/update.php', 'POST', {
        id: Number(vaultId.value),
        ...payload,
      });
    } else {
      await requestApi('../api/vault/create.php', 'POST', payload);
    }

    closeModal();
    await loadItems();
  } catch (error) {
    modalError.textContent = error.message;
  }
});

tableBody?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id || 0);
  if (!action || !id) return;

  const item = items.find((row) => row.id === id);
  if (!item) return;

  if (action === 'copy-user') {
    await navigator.clipboard.writeText(item.username);
    return;
  }

  if (action === 'copy-pass') {
    await navigator.clipboard.writeText(item.password);
    return;
  }

  if (action === 'edit') {
    openModal(item);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm(`Delete saved password for ${item.site}?`);
    if (!confirmed) return;

    await requestApi('../api/vault/delete.php', 'POST', { id });
    await loadItems();
  }
});

(async function init() {
  const ok = await loadSession();
  if (!ok) return;
  await loadItems();
})();
