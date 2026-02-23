async function apiRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({ ok: false, error: 'Invalid server response' }));

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

window.VaultApi = { apiRequest };
