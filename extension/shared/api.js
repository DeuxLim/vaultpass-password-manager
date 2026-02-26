const DEFAULT_BASE_URL = 'http://localhost:8000';

export async function getBaseUrl() {
  const stored = await chrome.storage.sync.get(['vaultpass_base_url']);
  const value = String(stored.vaultpass_base_url || '').trim();
  return value || DEFAULT_BASE_URL;
}

export async function setBaseUrl(baseUrl) {
  const value = String(baseUrl || '').trim().replace(/\/$/, '');
  await chrome.storage.sync.set({ vaultpass_base_url: value || DEFAULT_BASE_URL });
  return value || DEFAULT_BASE_URL;
}

export async function apiRequest(path, method = 'GET', body = null) {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const options = {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  };

  if (body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  let data = null;

  try {
    data = await response.json();
  } catch (_error) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
}

export async function openLoginPage() {
  const baseUrl = await getBaseUrl();
  const loginUrl = `${baseUrl}/pages/login.html`;
  await chrome.tabs.create({ url: loginUrl });
}
