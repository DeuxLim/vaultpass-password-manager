let csrfToken = null;
let csrfEndpoint = null;

function isMutatingMethod(method) {
  const upper = String(method || 'GET').toUpperCase();
  return upper === 'POST' || upper === 'PUT' || upper === 'PATCH' || upper === 'DELETE';
}

async function refreshCsrfToken() {
  if (!csrfEndpoint) {
    throw new Error('CSRF endpoint is not configured');
  }

  const response = await fetch(csrfEndpoint, {
    method: 'GET',
    credentials: 'same-origin'
  });

  const payload = await response.json().catch(() => ({ ok: false }));
  if (!response.ok || !payload.ok || !payload.csrf_token) {
    throw new Error('Unable to initialize CSRF token');
  }

  csrfToken = payload.csrf_token;
  return csrfToken;
}

async function initCsrf(endpoint) {
  csrfEndpoint = endpoint;
  return refreshCsrfToken();
}

async function apiRequest(url, method, body, retrying = false) {
  const upperMethod = String(method || 'GET').toUpperCase();

  if (isMutatingMethod(upperMethod) && !csrfToken) {
    await refreshCsrfToken();
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (isMutatingMethod(upperMethod) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const response = await fetch(url, {
    method: upperMethod,
    headers,
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({ ok: false, error: 'Invalid server response' }));

  if (response.status === 419 && isMutatingMethod(upperMethod) && !retrying) {
    await refreshCsrfToken();
    return apiRequest(url, upperMethod, body, true);
  }

  if (!response.ok || !payload.ok) {
    const error = new Error(payload.error || 'Request failed');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

window.VaultApi = { apiRequest, initCsrf };
