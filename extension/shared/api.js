const DEFAULT_BASE_URL = resolveDefaultBaseUrl();
let csrfToken = null;

function resolveDefaultBaseUrl() {
  try {
    const manifest = chrome.runtime.getManifest();
    const homepageUrl = String(manifest?.homepage_url || '').trim();
    if (homepageUrl) {
      const url = new URL(homepageUrl);
      return `${url.origin}`;
    }
  } catch (_error) {
    // Fall back to localhost for local development if manifest homepage is missing.
  }

  return 'http://localhost:8000';
}

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
  return apiRequestWithRetry(path, method, body, true);
}

function isMutatingMethod(method) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
}

async function fetchCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const data = await apiRequestWithRetry('/api/auth/csrf.php', 'GET', null, false);
  const token = String(data?.csrf_token || '').trim();
  if (!token) {
    throw new Error('Unable to load CSRF token');
  }

  csrfToken = token;
  return csrfToken;
}

async function apiRequestWithRetry(path, method = 'GET', body = null, retryOnCsrfError = true) {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const upperMethod = method.toUpperCase();
  const options = {
    method: upperMethod,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  };

  if (body !== null) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  if (isMutatingMethod(upperMethod)) {
    const token = await fetchCsrfToken();
    options.headers['X-CSRF-Token'] = token;
  }

  const response = await fetch(url, options);
  let data = null;

  try {
    data = await response.json();
  } catch (_error) {
    throw new Error(`Request failed (${response.status})`);
  }

  if (retryOnCsrfError && isMutatingMethod(upperMethod) && response.status === 403) {
    csrfToken = null;
    const token = await fetchCsrfToken();
    options.headers['X-CSRF-Token'] = token;
    return apiRequestWithRetry(path, method, body, false);
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
