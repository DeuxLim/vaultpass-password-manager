import { apiRequest } from '../shared/api.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['vaultpass_base_url']).then((data) => {
    if (!data.vaultpass_base_url) {
      chrome.storage.sync.set({ vaultpass_base_url: 'http://localhost:8000' });
    }
  });
});

const SECOND_LEVEL_TLDS = new Set(['co', 'com', 'org', 'net', 'gov', 'ac', 'edu']);

function normalizeHostname(value) {
  const input = String(value || '').trim().toLowerCase();
  if (!input) return '';

  try {
    const url = input.includes('://') ? new URL(input) : new URL(`https://${input}`);
    return String(url.hostname || '').replace(/^www\./, '');
  } catch (_error) {
    return input
      .replace(/^https?:\/\//, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/^www\./, '');
  }
}

function registrableDomain(hostname) {
  const host = normalizeHostname(hostname);
  const labels = host.split('.').filter(Boolean);
  if (labels.length <= 2) return host;

  const tld = labels[labels.length - 1];
  const sld = labels[labels.length - 2];
  if (tld.length === 2 && SECOND_LEVEL_TLDS.has(sld) && labels.length >= 3) {
    return labels.slice(-3).join('.');
  }

  return labels.slice(-2).join('.');
}

function siteMatchScore(site, pageHost) {
  const siteHost = normalizeHostname(site);
  const currentHost = normalizeHostname(pageHost);
  if (!siteHost || !currentHost) return 0;

  if (siteHost === currentHost) return 400;
  if (currentHost.endsWith(`.${siteHost}`)) return 320;
  if (siteHost.endsWith(`.${currentHost}`)) return 280;

  const siteRoot = registrableDomain(siteHost);
  const pageRoot = registrableDomain(currentHost);
  if (siteRoot && siteRoot === pageRoot) return 220;
  if (site.includes(currentHost)) return 140;
  return 0;
}

async function fetchVaultItems() {
  const data = await apiRequest('/api/vault/list.php', 'GET');
  return Array.isArray(data?.items) ? data.items : [];
}

function findMatches(items, pageHost) {
  return items
    .map((item) => ({ item, score: siteMatchScore(item.site, pageHost) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.item.updated_at || 0).getTime() - new Date(a.item.updated_at || 0).getTime();
    })
    .map((entry) => entry.item);
}

async function getMatchedCredentials(url) {
  const host = normalizeHostname(url);
  if (!host) {
    return { ok: true, items: [] };
  }

  const items = await fetchVaultItems();
  const matches = findMatches(items, host).slice(0, 8);
  return {
    ok: true,
    items: matches.map((item) => ({
      id: item.id,
      site: item.site,
      username: item.username,
      password: item.password,
      updated_at: item.updated_at,
    })),
  };
}

function sanitizeCredential(credential) {
  return {
    site: String(credential?.site || '').trim(),
    username: String(credential?.username || '').trim(),
    password: String(credential?.password || ''),
  };
}

async function saveSubmittedCredential(payload) {
  const url = String(payload?.url || '').trim();
  const host = normalizeHostname(url);
  const username = String(payload?.username || '').trim();
  const password = String(payload?.password || '');
  if (!host || !username || !password) {
    return { ok: false, error: 'Missing required login fields' };
  }

  const items = await fetchVaultItems();
  const matches = findMatches(items, host);
  const usernameMatch = matches.find((item) => String(item.username || '').trim().toLowerCase() === username.toLowerCase());
  const target = usernameMatch || matches[0] || null;

  if (target) {
    await apiRequest('/api/vault/update.php', 'POST', {
      id: target.id,
      site: target.site || host,
      username,
      password,
      notes: target.notes || '',
      folder: target.folder || '',
      tags: Array.isArray(target.tags) ? target.tags : [],
      is_favorite: target.is_favorite ? 1 : 0,
    });
    return { ok: true, mode: 'updated', id: target.id };
  }

  const created = await apiRequest('/api/vault/create.php', 'POST', {
    site: host,
    username,
    password,
    notes: 'Saved from VaultPass extension',
  });

  return { ok: true, mode: 'created', id: Number(created?.id || 0) };
}

async function fillInActiveTab(credential) {
  const normalized = sanitizeCredential(credential);
  if (!normalized.username || !normalized.password) {
    return { ok: false, error: 'Invalid credential payload' };
  }

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab?.id) {
    return { ok: false, error: 'No active tab available' };
  }

  try {
    await chrome.tabs.sendMessage(activeTab.id, {
      type: 'EXT_FILL_CREDENTIAL',
      credential: normalized,
    });
  } catch (error) {
    const message = String(error?.message || '');
    const noReceiver = message.includes('Receiving end does not exist');
    if (!noReceiver) {
      throw error;
    }

    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id, allFrames: true },
      files: ['content/content.js'],
    });

    await chrome.tabs.sendMessage(activeTab.id, {
      type: 'EXT_FILL_CREDENTIAL',
      credential: normalized,
    });
  }

  return { ok: true };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      if (message?.type === 'EXT_GET_MATCHED_CREDENTIALS') {
        sendResponse(await getMatchedCredentials(message.url));
        return;
      }

      if (message?.type === 'EXT_SAVE_SUBMITTED_LOGIN') {
        sendResponse(await saveSubmittedCredential(message.payload || {}));
        return;
      }

      if (message?.type === 'EXT_FILL_ACTIVE_TAB') {
        sendResponse(await fillInActiveTab(message.credential || {}));
        return;
      }

      sendResponse({ ok: false, error: 'Unknown action' });
    } catch (error) {
      sendResponse({ ok: false, error: error?.message || 'Extension request failed' });
    }
  })();

  return true;
});
