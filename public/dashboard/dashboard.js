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
const sessionPolicyText = document.getElementById('sessionPolicyText');
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
const networkBanner = document.getElementById('networkBanner');
const networkBannerText = document.getElementById('networkBannerText');
const networkBannerDismissBtn = document.getElementById('networkBannerDismissBtn');

const vaultId = document.getElementById('vaultId');
const siteInput = document.getElementById('siteInput');
const itemTypeInput = document.getElementById('itemTypeInput');
const usernameFieldGroup = document.getElementById('usernameFieldGroup');
const passwordFieldGroup = document.getElementById('passwordFieldGroup');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const notesInput = document.getElementById('notesInput');
const passwordStrengthLabel = document.getElementById('passwordStrengthLabel');
const passwordStrengthFill = document.getElementById('passwordStrengthFill');
const generatePasswordBtn = document.getElementById('generatePasswordBtn');
const identityFieldGroup = document.getElementById('identityFieldGroup');
const identityFullName = document.getElementById('identityFullName');
const identityEmail = document.getElementById('identityEmail');
const identityPhone = document.getElementById('identityPhone');
const identityCompany = document.getElementById('identityCompany');
const identityAddress1 = document.getElementById('identityAddress1');
const identityAddress2 = document.getElementById('identityAddress2');
const identityCity = document.getElementById('identityCity');
const identityState = document.getElementById('identityState');
const identityZip = document.getElementById('identityZip');
const identityCountry = document.getElementById('identityCountry');
const paymentFieldGroup = document.getElementById('paymentFieldGroup');
const paymentCardholder = document.getElementById('paymentCardholder');
const paymentNumber = document.getElementById('paymentNumber');
const paymentExpMonth = document.getElementById('paymentExpMonth');
const paymentExpYear = document.getElementById('paymentExpYear');
const paymentCvc = document.getElementById('paymentCvc');
const paymentZip = document.getElementById('paymentZip');
const notesFieldGroup = document.getElementById('notesFieldGroup');
const folderInput = document.getElementById('folderInput');
const tagsInput = document.getElementById('tagsInput');
const favoriteInput = document.getElementById('favoriteInput');
const sharedVaultItemInput = document.getElementById('sharedVaultItemInput');
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
const healthPanel = document.getElementById('healthPanel');
const healthFilterBanner = document.getElementById('healthFilterBanner');
const healthFilterText = document.getElementById('healthFilterText');
const healthFilterClearBtn = document.getElementById('healthFilterClearBtn');
const healthInsights = document.getElementById('healthInsights');
const healthInsightsBody = document.getElementById('healthInsightsBody');
const sharedVaultForm = document.getElementById('sharedVaultForm');
const sharedVaultNameInput = document.getElementById('sharedVaultNameInput');
const sharedVaultError = document.getElementById('sharedVaultError');
const sharedVaultList = document.getElementById('sharedVaultList');
const sharedVaultEmpty = document.getElementById('sharedVaultEmpty');
const sharedInviteList = document.getElementById('sharedInviteList');
const sharedInviteEmpty = document.getElementById('sharedInviteEmpty');
const sharedVaultManageSelect = document.getElementById('sharedVaultManageSelect');
const loadSharedMembersBtn = document.getElementById('loadSharedMembersBtn');
const sharedInviteForm = document.getElementById('sharedInviteForm');
const sharedInviteEmailInput = document.getElementById('sharedInviteEmailInput');
const sharedInviteRoleSelect = document.getElementById('sharedInviteRoleSelect');
const sharedMemberError = document.getElementById('sharedMemberError');
const sharedMemberEmpty = document.getElementById('sharedMemberEmpty');
const sharedMemberList = document.getElementById('sharedMemberList');
const emergencyGrantForm = document.getElementById('emergencyGrantForm');
const emergencyGrantEmailInput = document.getElementById('emergencyGrantEmailInput');
const emergencyWaitHoursInput = document.getElementById('emergencyWaitHoursInput');
const emergencyError = document.getElementById('emergencyError');
const emergencyGivenEmpty = document.getElementById('emergencyGivenEmpty');
const emergencyGivenList = document.getElementById('emergencyGivenList');
const emergencyReceivedEmpty = document.getElementById('emergencyReceivedEmpty');
const emergencyReceivedList = document.getElementById('emergencyReceivedList');
const emergencyRequestsEmpty = document.getElementById('emergencyRequestsEmpty');
const emergencyRequestsList = document.getElementById('emergencyRequestsList');
const emergencyApprovedEmpty = document.getElementById('emergencyApprovedEmpty');
const emergencyApprovedList = document.getElementById('emergencyApprovedList');
const emergencySnapshotModal = document.getElementById('emergencySnapshotModal');
const emergencySnapshotMeta = document.getElementById('emergencySnapshotMeta');
const emergencySnapshotError = document.getElementById('emergencySnapshotError');
const emergencySnapshotList = document.getElementById('emergencySnapshotList');
const emergencySnapshotCloseBtn = document.getElementById('emergencySnapshotCloseBtn');

let items = [];
let healthFilterMode = 'all';
let networkBannerDismissed = false;
let historyItemId = 0;
let modalReturnFocus = null;
let historyReturnFocus = null;
let sessionsReturnFocus = null;
let backupReturnFocus = null;
let toastTimer = null;
let parsedCsvHeaders = [];
let parsedCsvRows = [];
let sessionPolicy = null;
let featureFlags = { zeroKnowledgeClientEncryption: false };
let zkPassphrase = '';
let zkKeyMaterialStatus = { loaded: false, available: false, has: false };
let sharedVaults = [];
let sharedVaultsAvailable = false;
let sharedInvitations = [];
let sharedMembers = [];
let selectedSharedVaultId = 0;
let currentUserId = 0;
let emergencyAccessAvailable = false;
let emergencyGrantsGiven = [];
let emergencyGrantsReceived = [];
let emergencyRequests = [];
let emergencyApproved = [];

const ZK_ENVELOPE_PREFIX = 'zkv1:';
const ZK_PASSPHRASE_SESSION_KEY = 'vaultpass_zk_passphrase';
const ZK_PBKDF2_ITERATIONS = 210000;

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

function renderNetworkBanner() {
  if (!networkBanner || !networkBannerText) return;

  if (networkBannerDismissed) {
    networkBanner.hidden = true;
    return;
  }

  const online = navigator.onLine;
  if (online) {
    networkBannerText.textContent = 'Online. Changes will sync normally.';
  } else {
    networkBannerText.textContent = 'Offline. VaultPass does not cache vault API responses offline for security.';
  }
  networkBanner.hidden = false;
}

function isZkEnvelope(value) {
  return String(value || '').startsWith(ZK_ENVELOPE_PREFIX);
}

function bytesToBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function base64ToBytes(base64) {
  const binary = window.atob(base64);
  const output = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i);
  }
  return output;
}

function joinBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const joined = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => {
    joined.set(part, offset);
    offset += part.length;
  });
  return joined;
}

async function deriveZkKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ZK_PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function loadZkPassphraseFromSession() {
  if (zkPassphrase) return zkPassphrase;
  const stored = window.sessionStorage.getItem(ZK_PASSPHRASE_SESSION_KEY) || '';
  zkPassphrase = stored.trim();
  return zkPassphrase;
}

function saveZkPassphraseToSession(passphrase) {
  zkPassphrase = String(passphrase || '').trim();
  if (zkPassphrase) {
    window.sessionStorage.setItem(ZK_PASSPHRASE_SESSION_KEY, zkPassphrase);
  } else {
    window.sessionStorage.removeItem(ZK_PASSPHRASE_SESSION_KEY);
  }
}

async function ensureZkPassphrase(interactive = false) {
  const existing = loadZkPassphraseFromSession();
  if (existing) {
    await syncZkKeyMaterial(existing, interactive);
    return existing;
  }
  if (!interactive) return '';

  const entered = window.prompt('Enter your Vault encryption passphrase for client-side encrypted entries:');
  const normalized = String(entered || '').trim();
  if (!normalized) return '';
  saveZkPassphraseToSession(normalized);
  await syncZkKeyMaterial(normalized, interactive);
  return normalized;
}

async function loadZkKeyMaterialStatus() {
  if (!featureFlags.zeroKnowledgeClientEncryption) {
    zkKeyMaterialStatus = { loaded: true, available: false, has: false };
    return zkKeyMaterialStatus;
  }
  if (zkKeyMaterialStatus.loaded) {
    return zkKeyMaterialStatus;
  }

  try {
    const data = await requestApi('../api/auth/key-material.php', 'GET');
    zkKeyMaterialStatus = {
      loaded: true,
      available: Boolean(data?.available),
      has: Boolean(data?.has_key_material),
    };
  } catch (_error) {
    zkKeyMaterialStatus = { loaded: true, available: false, has: false };
  }

  return zkKeyMaterialStatus;
}

async function syncZkKeyMaterial(passphrase, interactive) {
  if (!featureFlags.zeroKnowledgeClientEncryption) return;
  if (!passphrase) return;

  const status = await loadZkKeyMaterialStatus();
  if (!status.available || status.has || !interactive) return;

  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const dek = window.crypto.getRandomValues(new Uint8Array(32));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const kek = await deriveZkKey(passphrase, salt);
    const wrappedDekBuffer = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, kek, dek);
    const wrappedDek = joinBytes([iv, new Uint8Array(wrappedDekBuffer)]);

    await csrfReady;
    await requestApi('../api/auth/key-material-save.php', 'POST', {
      encrypted_dek_blob: bytesToBase64(wrappedDek),
      kdf_algorithm: 'PBKDF2',
      kdf_salt_b64: bytesToBase64(salt),
      kdf_iterations: ZK_PBKDF2_ITERATIONS,
      key_version: 1,
    });
    zkKeyMaterialStatus = { loaded: true, available: true, has: true };
  } catch (error) {
    showToast(error.message || 'Unable to initialize key material.', 'error');
  }
}

async function encryptClientValue(value, passphrase) {
  const plain = String(value || '');
  if (!plain) return plain;
  if (!window.crypto?.subtle) {
    throw new Error('WebCrypto API unavailable in this browser.');
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveZkKey(passphrase, salt);
  const encoded = new TextEncoder().encode(plain);
  const cipherBuffer = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const packed = joinBytes([salt, iv, new Uint8Array(cipherBuffer)]);
  return `${ZK_ENVELOPE_PREFIX}${bytesToBase64(packed)}`;
}

async function decryptClientValue(value, passphrase) {
  const input = String(value || '');
  if (!isZkEnvelope(input)) return input;
  if (!window.crypto?.subtle) {
    throw new Error('WebCrypto API unavailable in this browser.');
  }

  const encoded = input.slice(ZK_ENVELOPE_PREFIX.length);
  const packed = base64ToBytes(encoded);
  if (packed.length <= 28) {
    throw new Error('Invalid encrypted payload format.');
  }

  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const ciphertext = packed.slice(28);
  const key = await deriveZkKey(passphrase, salt);
  const plainBuffer = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuffer);
}

function itemContainsClientEncryptedData(item) {
  return isZkEnvelope(item?.username) || isZkEnvelope(item?.password) || isZkEnvelope(item?.notes);
}

async function decryptItemsIfNeeded(sourceItems) {
  const hasClientEncrypted = sourceItems.some(itemContainsClientEncryptedData);
  if (!hasClientEncrypted) return sourceItems;

  const passphrase = await ensureZkPassphrase(false);
  if (!passphrase) {
    showToast('Some entries are client-side encrypted. Open an encrypted entry and provide passphrase.', 'error');
    return sourceItems;
  }

  const decrypted = [];
  for (const item of sourceItems) {
    const next = { ...item };
    try {
      next.username = await decryptClientValue(item.username || '', passphrase);
      next.password = await decryptClientValue(item.password || '', passphrase);
      next.notes = await decryptClientValue(item.notes || '', passphrase);
      next.client_encrypted = itemContainsClientEncryptedData(item);
    } catch (_error) {
      showToast('Unable to decrypt some client-encrypted entries. Check passphrase.', 'error');
      return sourceItems;
    }
    decrypted.push(next);
  }

  return decrypted;
}

function normalizeItemType(value) {
  const raw = String(value || '').trim();
  if (raw === 'secure_note') return 'secure_note';
  if (raw === 'identity') return 'identity';
  if (raw === 'payment_card') return 'payment_card';
  return 'login';
}

function formatItemType(value) {
  const type = normalizeItemType(value);
  if (type === 'secure_note') return 'Secure Note';
  if (type === 'identity') return 'Identity';
  if (type === 'payment_card') return 'Payment Card';
  return 'Login';
}

function applyItemTypeUi(value) {
  const type = normalizeItemType(value);
  const isSecureNote = type === 'secure_note';
  const isIdentity = type === 'identity';
  const isPayment = type === 'payment_card';
  const isStructured = isIdentity || isPayment;

  if (siteInput) {
    siteInput.placeholder = isSecureNote ? 'Secure note title' : (isStructured ? 'Profile name' : 'example.com');
  }
  if (notesInput) {
    notesInput.placeholder = isSecureNote ? 'Write your secure note' : (isStructured ? 'Profile details' : 'Optional notes');
    notesInput.required = isSecureNote || isStructured;
  }
  if (identityFieldGroup) identityFieldGroup.hidden = !isIdentity;
  if (paymentFieldGroup) paymentFieldGroup.hidden = !isPayment;
  if (notesFieldGroup) notesFieldGroup.hidden = isStructured;
  if (usernameFieldGroup) {
    usernameFieldGroup.hidden = isSecureNote || isStructured;
  }
  if (passwordFieldGroup) {
    passwordFieldGroup.hidden = isSecureNote || isStructured;
  }
  if (generatorPanel) {
    generatorPanel.hidden = isSecureNote || isStructured;
  }
  if (usernameInput) {
    usernameInput.required = type === 'login';
  }
  if (passwordInput) {
    passwordInput.required = type === 'login';
  }
}

const HEALTH_WEAK_SCORE_THRESHOLD = 60;
const HEALTH_OLD_THRESHOLD_DAYS = 180;

function isLoginItem(item) {
  return normalizeItemType(item?.item_type) === 'login';
}

function buildPasswordCounts(sourceItems) {
  const passwordCounts = new Map();
  sourceItems.forEach((item) => {
    if (!isLoginItem(item)) return;
    const value = String(item.password || '');
    if (!value) return;
    passwordCounts.set(value, (passwordCounts.get(value) || 0) + 1);
  });
  return passwordCounts;
}

function isOldItem(item, thresholdDays = HEALTH_OLD_THRESHOLD_DAYS) {
  if (!isLoginItem(item)) return false;
  const updatedAt = new Date(item.updated_at).getTime();
  if (Number.isNaN(updatedAt)) return false;
  const ageDays = (Date.now() - updatedAt) / (1000 * 60 * 60 * 24);
  return ageDays >= thresholdDays;
}

function summarizeSites(sourceItems, maxItems = 4) {
  const output = [];
  for (const item of sourceItems) {
    const label = String(item?.site || '').trim();
    if (!label) continue;
    output.push(label);
    if (output.length >= maxItems) break;
  }
  return output;
}

function renderHealthInsights() {
  if (!healthInsights || !healthInsightsBody) return;

  const loginItems = items.filter((item) => isLoginItem(item));
  const weakItems = loginItems.filter((item) => scorePassword(item.password) < HEALTH_WEAK_SCORE_THRESHOLD);
  const oldItems = loginItems.filter((item) => isOldItem(item));

  const passwordCounts = buildPasswordCounts(loginItems);
  const reusedItems = loginItems.filter((item) => {
    const value = String(item.password || '');
    if (!value) return false;
    return (passwordCounts.get(value) || 0) > 1;
  });

  const insights = [
    {
      key: 'weak',
      title: 'Weak passwords',
      count: weakItems.length,
      tip: 'Open each entry and generate a stronger password (16+ chars recommended).',
      sites: summarizeSites(weakItems),
    },
    {
      key: 'reused',
      title: 'Reused passwords',
      count: reusedItems.length,
      tip: 'Change reused passwords on important sites first (email, banking, workplace).',
      sites: summarizeSites(reusedItems),
    },
    {
      key: 'old',
      title: `Old passwords (>${HEALTH_OLD_THRESHOLD_DAYS} days)`,
      count: oldItems.length,
      tip: 'Rotate passwords periodically, especially for high-value accounts.',
      sites: summarizeSites(oldItems),
    },
  ];

  const hasAny = insights.some((insight) => insight.count > 0);
  healthInsights.hidden = !hasAny;
  if (!hasAny) {
    healthInsightsBody.innerHTML = '';
    return;
  }

  healthInsightsBody.innerHTML = insights.map((insight) => {
    if (insight.count === 0) return '';
    const sitePills = insight.sites.map((site) => `<span class="health-site-pill">${escapeHtml(site)}</span>`).join('');
    return `
      <article class="health-insight-row">
        <div class="health-insight-title">
          <strong>${escapeHtml(insight.title)}</strong>
          <span class="health-site-pill">${insight.count} item${insight.count === 1 ? '' : 's'}</span>
        </div>
        <p class="health-insight-meta">${escapeHtml(insight.tip)}</p>
        ${sitePills ? `<div class="health-insight-sites" aria-label="Example sites">${sitePills}</div>` : ''}
        <div class="health-insight-actions">
          <button type="button" class="btn btn-primary" data-action="health-review" data-health-mode="${escapeHtml(insight.key)}">Review</button>
        </div>
      </article>
    `;
  }).join('');
}

function healthFilterLabel(mode) {
  if (mode === 'weak') return 'Weak passwords';
  if (mode === 'reused') return 'Reused passwords';
  if (mode === 'old') return `Old passwords (>${HEALTH_OLD_THRESHOLD_DAYS} days)`;
  return 'All entries';
}

function filteredItems() {
  const term = (searchInput?.value || '').toLowerCase().trim();
  const favoriteMode = favoriteFilter?.value || 'all';
  const folderMode = folderFilter?.value || 'all';
  const sortMode = sortFilter?.value || 'updated_desc';

  const passwordCounts = healthFilterMode === 'reused' ? buildPasswordCounts(items) : null;
  let filtered = items.filter((item) => {
    if (favoriteMode === 'favorites' && !item.is_favorite) return false;
    if (favoriteMode === 'non-favorites' && item.is_favorite) return false;
    if (folderMode !== 'all' && (item.folder || '') !== folderMode) return false;

    if (!term) return true;
    const tagsText = Array.isArray(item.tags) ? item.tags.join(' ') : '';
    const haystack = `${item.site} ${item.username} ${item.folder || ''} ${tagsText} ${item.notes || ''}`.toLowerCase();
    return haystack.includes(term);
  });

  if (healthFilterMode !== 'all') {
    filtered = filtered.filter((item) => {
      if (!isLoginItem(item)) return false;
      if (healthFilterMode === 'weak') {
        return scorePassword(item.password) < HEALTH_WEAK_SCORE_THRESHOLD;
      }
      if (healthFilterMode === 'reused') {
        const value = String(item.password || '');
        if (!value) return false;
        return (passwordCounts?.get(value) || 0) > 1;
      }
      if (healthFilterMode === 'old') {
        return isOldItem(item);
      }
      return true;
    });
  }

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

function roleForSharedVault(sharedVaultId) {
  const targetId = Number(sharedVaultId || 0);
  if (!targetId) return '';
  const vault = sharedVaults.find((row) => Number(row.id) === targetId);
  return String(vault?.role || '');
}

function canWriteSharedVault(sharedVaultId) {
  return ['owner', 'editor'].includes(roleForSharedVault(sharedVaultId));
}

function canWriteItem(item) {
  const sharedVaultId = Number(item?.shared_vault_id || 0);
  if (!sharedVaultId) return true;
  return canWriteSharedVault(sharedVaultId);
}

function sharedVaultLabel(sharedVaultId) {
  const targetId = Number(sharedVaultId || 0);
  if (!targetId) return 'Personal';
  const vault = sharedVaults.find((row) => Number(row.id) === targetId);
  return vault?.name ? `Shared: ${vault.name}` : `Shared Vault #${targetId}`;
}

function populateVaultTargetOptions() {
  if (!sharedVaultItemInput) return;
  const options = [
    '<option value="0">Personal Vault</option>',
    ...sharedVaults.map((vault) => {
      const writable = ['owner', 'editor'].includes(String(vault.role || ''));
      return `<option value="${vault.id}" ${writable ? '' : 'disabled'}>Shared: ${escapeHtml(vault.name)}${writable ? '' : ' (view only)'}</option>`;
    }),
  ];
  sharedVaultItemInput.innerHTML = options.join('');
}

function safeJsonParse(value) {
  try {
    return JSON.parse(String(value || ''));
  } catch (_error) {
    return null;
  }
}

function structuredDataForItem(item) {
  const type = normalizeItemType(item?.item_type);
  if (!['identity', 'payment_card'].includes(type)) return null;
  const parsed = safeJsonParse(item?.notes || '');
  if (!parsed || typeof parsed !== 'object') return null;
  const schema = String(parsed.schema || '');
  if (type === 'identity' && schema === 'vp_identity_v1') return parsed;
  if (type === 'payment_card' && schema === 'vp_payment_card_v1') return parsed;
  return null;
}

function identityNotesPayload() {
  return {
    schema: 'vp_identity_v1',
    full_name: String(identityFullName?.value || '').trim(),
    email: String(identityEmail?.value || '').trim(),
    phone: String(identityPhone?.value || '').trim(),
    company: String(identityCompany?.value || '').trim(),
    address1: String(identityAddress1?.value || '').trim(),
    address2: String(identityAddress2?.value || '').trim(),
    city: String(identityCity?.value || '').trim(),
    state: String(identityState?.value || '').trim(),
    zip: String(identityZip?.value || '').trim(),
    country: String(identityCountry?.value || '').trim(),
  };
}

function paymentNotesPayload() {
  return {
    schema: 'vp_payment_card_v1',
    cardholder: String(paymentCardholder?.value || '').trim(),
    number: String(paymentNumber?.value || '').trim().replace(/\s+/g, ''),
    exp_month: String(paymentExpMonth?.value || '').trim(),
    exp_year: String(paymentExpYear?.value || '').trim(),
    cvc: String(paymentCvc?.value || '').trim(),
    billing_zip: String(paymentZip?.value || '').trim(),
  };
}

function clearIdentityFields() {
  if (identityFullName) identityFullName.value = '';
  if (identityEmail) identityEmail.value = '';
  if (identityPhone) identityPhone.value = '';
  if (identityCompany) identityCompany.value = '';
  if (identityAddress1) identityAddress1.value = '';
  if (identityAddress2) identityAddress2.value = '';
  if (identityCity) identityCity.value = '';
  if (identityState) identityState.value = '';
  if (identityZip) identityZip.value = '';
  if (identityCountry) identityCountry.value = '';
}

function clearPaymentFields() {
  if (paymentCardholder) paymentCardholder.value = '';
  if (paymentNumber) paymentNumber.value = '';
  if (paymentExpMonth) paymentExpMonth.value = '';
  if (paymentExpYear) paymentExpYear.value = '';
  if (paymentCvc) paymentCvc.value = '';
  if (paymentZip) paymentZip.value = '';
}

function populateStructuredFields(type, notes) {
  const parsed = safeJsonParse(notes);
  if (!parsed || typeof parsed !== 'object') return;

  if (type === 'identity' && String(parsed.schema || '') === 'vp_identity_v1') {
    if (identityFullName) identityFullName.value = String(parsed.full_name || '');
    if (identityEmail) identityEmail.value = String(parsed.email || '');
    if (identityPhone) identityPhone.value = String(parsed.phone || '');
    if (identityCompany) identityCompany.value = String(parsed.company || '');
    if (identityAddress1) identityAddress1.value = String(parsed.address1 || '');
    if (identityAddress2) identityAddress2.value = String(parsed.address2 || '');
    if (identityCity) identityCity.value = String(parsed.city || '');
    if (identityState) identityState.value = String(parsed.state || '');
    if (identityZip) identityZip.value = String(parsed.zip || '');
    if (identityCountry) identityCountry.value = String(parsed.country || '');
  }

  if (type === 'payment_card' && String(parsed.schema || '') === 'vp_payment_card_v1') {
    if (paymentCardholder) paymentCardholder.value = String(parsed.cardholder || '');
    if (paymentNumber) paymentNumber.value = String(parsed.number || '');
    if (paymentExpMonth) paymentExpMonth.value = String(parsed.exp_month || '');
    if (paymentExpYear) paymentExpYear.value = String(parsed.exp_year || '');
    if (paymentCvc) paymentCvc.value = String(parsed.cvc || '');
    if (paymentZip) paymentZip.value = String(parsed.billing_zip || '');
  }
}

function hasAnyStructuredValue(payload) {
  return Object.entries(payload).some(([key, value]) => key !== 'schema' && String(value || '').trim() !== '');
}

function structuredCopyText(payload) {
  if (!payload || typeof payload !== 'object') return '';
  const lines = [];
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'schema') return;
    const text = String(value || '').trim();
    if (!text) return;
    lines.push(`${key.replaceAll('_', ' ')}: ${text}`);
  });
  return lines.join('\n');
}

function renderItemActions(item) {
  const type = normalizeItemType(item.item_type);
  const isSecureNote = type === 'secure_note';
  const isIdentity = type === 'identity';
  const isPayment = type === 'payment_card';
  const canWrite = canWriteItem(item);
  const siteLabel = escapeHtml(item.site);
  const copyButtons = isSecureNote
    ? ''
    : (isIdentity || isPayment)
      ? `
          <button type="button" data-action="copy-structured" data-id="${item.id}" class="action-secondary" aria-label="Copy profile details for ${siteLabel}">Copy Details</button>
        `
      : `
          <button type="button" data-action="copy-user" data-id="${item.id}" class="action-secondary" aria-label="Copy username for ${siteLabel}">Copy User</button>
          <button type="button" data-action="copy-pass" data-id="${item.id}" class="action-secondary" aria-label="Copy password for ${siteLabel}">Copy Pass</button>
          <button type="button" data-action="breach-check" data-id="${item.id}" class="action-neutral" aria-label="Check password breach status for ${siteLabel}">Breach</button>
        `;
  const writeButtons = canWrite
    ? `
        <button type="button" data-action="edit" data-id="${item.id}" aria-label="Edit ${siteLabel}">Edit</button>
        <button type="button" data-action="delete" data-id="${item.id}" class="action-danger" aria-label="Delete ${siteLabel}">Delete</button>
      `
    : '<button type="button" class="action-secondary" disabled title="Viewer access">View only</button>';
  return `
    ${copyButtons}
    ${writeButtons}
    <button type="button" data-action="history" data-id="${item.id}" class="action-neutral" aria-label="View history for ${siteLabel}">History</button>
  `;
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
  const loginItems = items.filter((item) => isLoginItem(item));
  const weak = loginItems.filter((item) => scorePassword(item.password) < HEALTH_WEAK_SCORE_THRESHOLD).length;

  const passwordCounts = buildPasswordCounts(loginItems);
  const reused = Array.from(passwordCounts.values()).filter((count) => count > 1).reduce((sum, count) => sum + count, 0);

  const old = loginItems.filter((item) => isOldItem(item)).length;

  if (healthTotal) healthTotal.textContent = String(total);
  if (healthWeak) healthWeak.textContent = String(weak);
  if (healthReused) healthReused.textContent = String(reused);
  if (healthOld) healthOld.textContent = String(old);
}

function renderHealthFilterUi(visibleCount = null) {
  if (healthPanel) {
    const buttons = Array.from(healthPanel.querySelectorAll('button[data-health-filter]'));
    buttons.forEach((button) => {
      const mode = String(button.dataset.healthFilter || 'all');
      button.setAttribute('aria-pressed', mode === healthFilterMode ? 'true' : 'false');
    });
  }

  if (!healthFilterBanner) return;
  if (healthFilterMode === 'all') {
    healthFilterBanner.hidden = true;
    return;
  }

  healthFilterBanner.hidden = false;
  if (!healthFilterText) return;
  const countSuffix = typeof visibleCount === 'number'
    ? ` (${visibleCount} match${visibleCount === 1 ? '' : 'es'})`
    : '';
  healthFilterText.textContent = `${healthFilterLabel(healthFilterMode)} filter active${countSuffix}.`;
}

function setHealthFilter(mode) {
  const next = ['all', 'weak', 'reused', 'old'].includes(String(mode || '')) ? String(mode) : 'all';
  if (next === healthFilterMode) return;
  healthFilterMode = next;
  renderTable();
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

function formatDuration(seconds) {
  const total = Math.max(0, Number(seconds || 0));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function renderSessionPolicy() {
  if (!sessionPolicyText) return;
  if (!sessionPolicy) {
    sessionPolicyText.textContent = 'Session timeout policy: unavailable';
    return;
  }

  const idle = formatDuration(sessionPolicy.idle_timeout_seconds);
  const absolute = formatDuration(sessionPolicy.absolute_timeout_seconds);
  sessionPolicyText.textContent = `Session timeout policy: idle ${idle}, absolute ${absolute}.`;
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
    const itemType = normalizeItemType(version.item_type);
    return `
      <article class="history-entry">
        <div class="history-entry-head">
          <p class="history-entry-time">${escapeHtml(formatDateTime(version.created_at))}</p>
          <p class="history-entry-source">${escapeHtml(version.source || 'update')}</p>
        </div>
        <p class="history-entry-meta">Type: ${escapeHtml(formatItemType(itemType))}</p>
        <p class="history-entry-meta">Username: ${escapeHtml(itemType === 'login' ? version.username : '—')}</p>
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
  renderHealthFilterUi(visible.length);

  if (visible.length === 0) {
    tableBody.innerHTML = '';
    cardsBody.innerHTML = '';

    if (items.length === 0) {
      emptyState.textContent = 'No saved passwords yet. Add your first credential to get started.';
    } else if (healthFilterMode !== 'all') {
      emptyState.textContent = `No matches found for ${healthFilterLabel(healthFilterMode)}. Clear the filter to view all entries.`;
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
          ${canWriteItem(item) ? '' : 'disabled'}
        >★</button>
      </td>
      <td>${escapeHtml(item.site)}</td>
      <td>${escapeHtml(sharedVaultLabel(item.shared_vault_id))}</td>
      <td>${escapeHtml(formatItemType(item.item_type))}</td>
      <td>${escapeHtml(item.folder || '—')}</td>
      <td>${renderTags(item.tags)}</td>
      <td>${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.username : '—')}</td>
      <td>${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.password : '—')}</td>
      <td>${escapeHtml(item.notes || '')}</td>
      <td class="actions">${renderItemActions(item)}</td>
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
              ${canWriteItem(item) ? '' : 'disabled'}
            >★</button>
          </dd>
        </div>
        <div>
          <dt>Vault</dt>
          <dd>${escapeHtml(sharedVaultLabel(item.shared_vault_id))}</dd>
        </div>
        <div>
          <dt>Type</dt>
          <dd>${escapeHtml(formatItemType(item.item_type))}</dd>
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
          <dd>${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.username : '—')}</dd>
        </div>
        <div>
          <dt>Password</dt>
          <dd>${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.password : '—')}</dd>
        </div>
        <div>
          <dt>Notes</dt>
          <dd>${escapeHtml(item.notes || '—')}</dd>
        </div>
      </dl>
      <div class="card-actions">${renderItemActions(item)}</div>
    </article>
  `).join('');
}

function openModal(item = null, triggerElement = null) {
  modalError.textContent = '';
  modalReturnFocus = triggerElement instanceof HTMLElement ? triggerElement : document.activeElement;
  const sharedInput = sharedVaultItemInput;

  if (!item) {
    modalTitle.textContent = 'Add Entry';
    vaultId.value = '';
    if (itemTypeInput) itemTypeInput.value = 'login';
    siteInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    notesInput.value = '';
    clearIdentityFields();
    clearPaymentFields();
    if (folderInput) folderInput.value = '';
    if (tagsInput) tagsInput.value = '';
    if (favoriteInput) favoriteInput.checked = false;
    if (sharedInput) {
      sharedInput.value = '0';
      sharedInput.disabled = false;
    }
    if (generatorLength) generatorLength.value = '16';
    if (generatorLengthValue) generatorLengthValue.textContent = '16';
    if (generatorUpper) generatorUpper.checked = true;
    if (generatorLower) generatorLower.checked = true;
    if (generatorNumbers) generatorNumbers.checked = true;
    if (generatorSymbols) generatorSymbols.checked = true;
  } else {
    modalTitle.textContent = 'Edit Entry';
    vaultId.value = item.id;
    if (itemTypeInput) itemTypeInput.value = normalizeItemType(item.item_type);
    siteInput.value = item.site;
    usernameInput.value = item.username;
    passwordInput.value = item.password;
    notesInput.value = item.notes || '';
    clearIdentityFields();
    clearPaymentFields();
    populateStructuredFields(normalizeItemType(item.item_type), item.notes || '');
    if (folderInput) folderInput.value = item.folder || '';
    if (tagsInput) tagsInput.value = Array.isArray(item.tags) ? item.tags.join(', ') : '';
    if (favoriteInput) favoriteInput.checked = Boolean(item.is_favorite);
    if (sharedInput) {
      sharedInput.value = String(Number(item.shared_vault_id || 0));
      sharedInput.disabled = true;
    }
  }

  applyItemTypeUi(itemTypeInput?.value || 'login');
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
  sessionPolicy = data?.session_policy || null;
  featureFlags = {
    zeroKnowledgeClientEncryption: Boolean(data?.feature_flags?.zero_knowledge_client_encryption),
  };
  zkKeyMaterialStatus = { loaded: false, available: false, has: false };
  await loadZkKeyMaterialStatus();
  renderSessionPolicy();

  if (!data?.authenticated) {
    window.location.href = '../pages/login.html';
    return false;
  }

  currentUserId = Number(data?.user?.id || 0);
  welcomeText.textContent = `Welcome, ${data.user?.name || 'User'}`;
  return true;
}

async function loadItems() {
  const data = await requestApi('../api/vault/list.php', 'GET');
  const incoming = Array.isArray(data.items) ? data.items : [];
  items = await decryptItemsIfNeeded(incoming);
  populateFolderFilter();
  renderHealthSummary();
  renderHealthInsights();
  renderTable();
}

function renderSharedVaults() {
  if (!sharedVaultList || !sharedVaultEmpty) return;

  if (!sharedVaultsAvailable) {
    sharedVaultList.innerHTML = '';
    sharedVaultEmpty.textContent = 'Shared vaults are unavailable until migration 008 is applied.';
    sharedVaultEmpty.style.display = 'block';
    return;
  }

  if (sharedVaults.length === 0) {
    sharedVaultList.innerHTML = '';
    sharedVaultEmpty.textContent = 'No shared vaults yet.';
    sharedVaultEmpty.style.display = 'block';
    return;
  }

  sharedVaultEmpty.style.display = 'none';
  sharedVaultList.innerHTML = sharedVaults.map((vault) => `
    <article class="shared-vault-row">
      <div>
        <p class="shared-vault-name">${escapeHtml(vault.name)}</p>
        <p class="shared-vault-meta">Role: ${escapeHtml(vault.role)} · Members: ${Number(vault.member_count || 0)}</p>
      </div>
      <div class="shared-vault-actions">
        <p class="shared-vault-meta">Updated ${new Date(vault.updated_at).toLocaleDateString()}</p>
        ${String(vault.role) === 'owner' ? `<button type="button" class="btn btn-ghost" data-action="shared-vault-rename" data-vault-id="${vault.id}">Rename</button>` : ''}
        ${String(vault.role) === 'owner' ? `<button type="button" class="btn btn-ghost danger" data-action="shared-vault-delete" data-vault-id="${vault.id}">Delete</button>` : ''}
      </div>
    </article>
  `).join('');
}

function renderSharedVaultSelector() {
  if (!sharedVaultManageSelect) return;

  if (!sharedVaultsAvailable || sharedVaults.length === 0) {
    sharedVaultManageSelect.innerHTML = '<option value="">No shared vaults</option>';
    selectedSharedVaultId = 0;
    return;
  }

  const previous = Number(sharedVaultManageSelect.value || selectedSharedVaultId || 0);
  sharedVaultManageSelect.innerHTML = sharedVaults
    .map((vault) => `<option value="${vault.id}">${escapeHtml(vault.name)} (${escapeHtml(vault.role)})</option>`)
    .join('');

  const hasPrevious = sharedVaults.some((vault) => Number(vault.id) === previous);
  selectedSharedVaultId = hasPrevious ? previous : Number(sharedVaults[0].id || 0);
  sharedVaultManageSelect.value = String(selectedSharedVaultId || '');

  const selected = sharedVaults.find((vault) => Number(vault.id) === selectedSharedVaultId);
  const canInvite = ['owner', 'editor'].includes(String(selected?.role || ''));
  const canAssignEditor = String(selected?.role || '') === 'owner';
  if (sharedInviteEmailInput) sharedInviteEmailInput.disabled = !canInvite;
  if (sharedInviteRoleSelect) {
    sharedInviteRoleSelect.disabled = !canInvite;
    sharedInviteRoleSelect.innerHTML = canAssignEditor
      ? '<option value="viewer">Viewer</option><option value="editor">Editor</option>'
      : '<option value="viewer">Viewer</option>';
  }
  const inviteButton = sharedInviteForm?.querySelector('button[type="submit"]');
  if (inviteButton instanceof HTMLButtonElement) inviteButton.disabled = !canInvite;
}

function renderSharedInvitations() {
  if (!sharedInviteList || !sharedInviteEmpty) return;

  if (!sharedVaultsAvailable) {
    sharedInviteList.innerHTML = '';
    sharedInviteEmpty.textContent = 'Shared vault invitations unavailable until migration 008 is applied.';
    sharedInviteEmpty.style.display = 'block';
    return;
  }

  if (sharedInvitations.length === 0) {
    sharedInviteList.innerHTML = '';
    sharedInviteEmpty.textContent = 'No pending shared-vault invitations.';
    sharedInviteEmpty.style.display = 'block';
    return;
  }

  sharedInviteEmpty.style.display = 'none';
  sharedInviteList.innerHTML = sharedInvitations.map((invite) => `
    <article class="shared-vault-row">
      <div>
        <p class="shared-vault-name">${escapeHtml(invite.vault_name)}</p>
        <p class="shared-vault-meta">Role: ${escapeHtml(invite.role)} · Invited by: ${escapeHtml(invite.invited_by_email || invite.invited_by_name || 'Unknown')}</p>
      </div>
      <div class="shared-vault-actions">
        <button type="button" class="btn btn-primary" data-action="shared-invite-accept" data-membership-id="${invite.membership_id}">Accept</button>
        <button type="button" class="btn btn-ghost danger" data-action="shared-invite-reject" data-membership-id="${invite.membership_id}">Reject</button>
      </div>
    </article>
  `).join('');
}

function renderSharedMembers() {
  if (!sharedMemberList || !sharedMemberEmpty) return;

  if (!selectedSharedVaultId) {
    sharedMemberList.innerHTML = '';
    sharedMemberEmpty.textContent = 'Load a shared vault to view members.';
    sharedMemberEmpty.style.display = 'block';
    return;
  }

  if (sharedMembers.length === 0) {
    sharedMemberList.innerHTML = '';
    sharedMemberEmpty.textContent = 'No members found for this shared vault.';
    sharedMemberEmpty.style.display = 'block';
    return;
  }

  const currentVault = sharedVaults.find((vault) => Number(vault.id) === Number(selectedSharedVaultId));
  const isOwner = String(currentVault?.role || '') === 'owner';

  sharedMemberEmpty.style.display = 'none';
  sharedMemberList.innerHTML = sharedMembers.map((member) => {
    const role = String(member.role || '');
    const canEditRole = isOwner && role !== 'owner';
    const isAccepted = String(member.invitation_status || '') === 'accepted';
    const isCurrentUser = Number(member.user_id) === currentUserId;
    const canRemove = isOwner ? role !== 'owner' : (isCurrentUser && role !== 'owner');
    const canTransferOwner = isOwner && !isCurrentUser && role !== 'owner' && isAccepted;
    const roleControl = canEditRole
      ? `
          <select data-action="shared-member-role-select" data-user-id="${member.user_id}">
            <option value="viewer" ${role === 'viewer' ? 'selected' : ''}>viewer</option>
            <option value="editor" ${role === 'editor' ? 'selected' : ''}>editor</option>
          </select>
          <button type="button" class="btn btn-ghost" data-action="shared-member-update-role" data-user-id="${member.user_id}">Update Role</button>
        `
      : (role === 'owner' ? '<p class="shared-vault-meta">Owner</p>' : '');
    const removeLabel = isCurrentUser ? 'Leave' : 'Remove';

    return `
      <article class="shared-vault-row">
        <div>
          <p class="shared-vault-name">${escapeHtml(member.name)} (${escapeHtml(member.email)})</p>
          <p class="shared-vault-meta">Role: ${escapeHtml(role)} · Status: ${escapeHtml(member.invitation_status)}</p>
        </div>
        <div class="shared-vault-actions">
          ${roleControl}
          ${canTransferOwner ? `<button type="button" class="btn btn-primary" data-action="shared-member-transfer-owner" data-user-id="${member.user_id}">Transfer Ownership</button>` : ''}
          ${canRemove ? `<button type="button" class="btn btn-ghost danger" data-action="shared-member-remove" data-user-id="${member.user_id}">${removeLabel}</button>` : ''}
        </div>
      </article>
    `;
  }).join('');
}

async function loadSharedVaults() {
  if (sharedVaultError) sharedVaultError.textContent = '';
  if (!sharedVaultList || !sharedVaultEmpty) return;

  const data = await requestApi('../api/shared-vault/list.php', 'GET');
  sharedVaultsAvailable = Boolean(data?.available);
  sharedVaults = Array.isArray(data?.shared_vaults) ? data.shared_vaults : [];
  renderSharedVaults();
  renderSharedVaultSelector();
  populateVaultTargetOptions();
  renderTable();
}

async function createSharedVault() {
  if (sharedVaultError) sharedVaultError.textContent = '';
  const name = String(sharedVaultNameInput?.value || '').trim();
  if (!name) {
    if (sharedVaultError) sharedVaultError.textContent = 'Shared vault name is required.';
    return;
  }

  await csrfReady;
  const created = await requestApi('../api/shared-vault/create.php', 'POST', { name });
  const createdId = Number(created?.shared_vault?.id || 0);
  if (createdId) {
    selectedSharedVaultId = createdId;
  }
  if (sharedVaultNameInput) sharedVaultNameInput.value = '';
  await loadSharedVaults();
  await loadSharedMembers();
  showToast('Shared vault created.');
}

async function renameSharedVault(vaultId) {
  if (!sharedVaultError) return;
  sharedVaultError.textContent = '';
  const current = sharedVaults.find((vault) => Number(vault.id) === Number(vaultId));
  const existingName = String(current?.name || '');
  const nextName = String(window.prompt('Rename shared vault:', existingName) || '').trim();
  if (!nextName || nextName === existingName) return;

  await csrfReady;
  await requestApi('../api/shared-vault/update.php', 'POST', {
    vault_id: vaultId,
    name: nextName,
  });
  await loadSharedVaults();
  showToast('Shared vault renamed.');
}

async function deleteSharedVault(vaultId) {
  if (!sharedVaultError) return;
  sharedVaultError.textContent = '';
  const current = sharedVaults.find((vault) => Number(vault.id) === Number(vaultId));
  const label = current?.name ? `"${current.name}"` : `#${vaultId}`;
  const confirmed = window.confirm(`Delete shared vault ${label}? Shared bindings on items will be removed.`);
  if (!confirmed) return;

  await csrfReady;
  await requestApi('../api/shared-vault/delete.php', 'POST', {
    vault_id: vaultId,
  });
  if (Number(selectedSharedVaultId || 0) === Number(vaultId)) {
    selectedSharedVaultId = 0;
  }
  await loadSharedVaults();
  await loadSharedMembers();
  showToast('Shared vault deleted.');
}

async function loadSharedInvitations() {
  const data = await requestApi('../api/shared-vault/invitations.php', 'GET');
  sharedInvitations = Array.isArray(data?.invitations) ? data.invitations : [];
  renderSharedInvitations();
}

async function respondSharedInvitation(membershipId, action) {
  await csrfReady;
  await requestApi('../api/shared-vault/respond-invite.php', 'POST', {
    membership_id: membershipId,
    action,
  });
  await loadSharedInvitations();
  await loadSharedVaults();
  showToast(action === 'accept' ? 'Invitation accepted.' : 'Invitation rejected.');
}

async function loadSharedMembers() {
  if (!sharedMemberError) return;
  sharedMemberError.textContent = '';
  selectedSharedVaultId = Number(sharedVaultManageSelect?.value || selectedSharedVaultId || 0);
  if (!selectedSharedVaultId) {
    sharedMembers = [];
    renderSharedMembers();
    return;
  }

  const data = await requestApi(`../api/shared-vault/members.php?vault_id=${selectedSharedVaultId}`, 'GET');
  sharedMembers = Array.isArray(data?.members) ? data.members : [];
  renderSharedMembers();
}

async function inviteSharedMember() {
  if (!sharedMemberError) return;
  sharedMemberError.textContent = '';
  const vaultId = Number(sharedVaultManageSelect?.value || selectedSharedVaultId || 0);
  const email = String(sharedInviteEmailInput?.value || '').trim();
  const role = String(sharedInviteRoleSelect?.value || 'viewer').trim();

  if (!vaultId) {
    sharedMemberError.textContent = 'Select a shared vault first.';
    return;
  }
  if (!email) {
    sharedMemberError.textContent = 'Invite email is required.';
    return;
  }

  await csrfReady;
  await requestApi('../api/shared-vault/invite.php', 'POST', { vault_id: vaultId, email, role });
  if (sharedInviteEmailInput) sharedInviteEmailInput.value = '';
  await loadSharedMembers();
  showToast('Invitation sent.');
}

function findSelectedRoleForMember(userId) {
  const selector = sharedMemberList?.querySelector(`select[data-action="shared-member-role-select"][data-user-id="${userId}"]`);
  if (!(selector instanceof HTMLSelectElement)) return '';
  return String(selector.value || '').trim();
}

async function updateSharedMemberRole(userId) {
  if (!sharedMemberError) return;
  sharedMemberError.textContent = '';
  const vaultId = Number(sharedVaultManageSelect?.value || selectedSharedVaultId || 0);
  const role = findSelectedRoleForMember(userId);
  if (!vaultId || !role) {
    sharedMemberError.textContent = 'Vault and role are required.';
    return;
  }

  await csrfReady;
  await requestApi('../api/shared-vault/update-member-role.php', 'POST', {
    vault_id: vaultId,
    member_user_id: userId,
    role,
  });
  await loadSharedMembers();
  showToast('Member role updated.');
}

async function removeSharedMember(userId) {
  if (!sharedMemberError) return;
  sharedMemberError.textContent = '';
  const vaultId = Number(sharedVaultManageSelect?.value || selectedSharedVaultId || 0);
  if (!vaultId) {
    sharedMemberError.textContent = 'Select a shared vault first.';
    return;
  }

  await csrfReady;
  await requestApi('../api/shared-vault/remove-member.php', 'POST', {
    vault_id: vaultId,
    member_user_id: userId,
  });
  await loadSharedMembers();
  await loadSharedVaults();
  showToast('Member removed.');
}

async function transferSharedVaultOwnership(newOwnerUserId) {
  if (!sharedMemberError) return;
  sharedMemberError.textContent = '';
  const vaultId = Number(sharedVaultManageSelect?.value || selectedSharedVaultId || 0);
  if (!vaultId) {
    sharedMemberError.textContent = 'Select a shared vault first.';
    return;
  }

  await csrfReady;
  await requestApi('../api/shared-vault/transfer-ownership.php', 'POST', {
    vault_id: vaultId,
    new_owner_user_id: newOwnerUserId,
  });
  await loadSharedVaults();
  await loadSharedMembers();
  showToast('Ownership transferred.');
}

function setEmergencyEmptyState(element, listElement, hasItems, emptyText) {
  if (!element || !listElement) return;
  if (hasItems) {
    element.style.display = 'none';
    return;
  }
  listElement.innerHTML = '';
  element.textContent = emptyText;
  element.style.display = 'block';
}

function emergencyStatusBadge(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'approved') return '<span class="status-pill is-approved">approved</span>';
  if (value === 'denied') return '<span class="status-pill is-denied">denied</span>';
  if (value === 'cancelled') return '<span class="status-pill is-disabled">cancelled</span>';
  return '<span class="status-pill is-pending">pending</span>';
}

function pendingRequestForGrant(grantId) {
  const id = Number(grantId || 0);
  if (!id) return false;
  return emergencyRequests.some((request) => Number(request.grant_id || 0) === id && String(request.status || '').toLowerCase() === 'pending');
}

function renderEmergencyAccess() {
  if (!emergencyGivenList || !emergencyReceivedList || !emergencyRequestsList || !emergencyApprovedList) return;

  if (!emergencyAccessAvailable) {
    setEmergencyEmptyState(emergencyGivenEmpty, emergencyGivenList, false, 'Emergency access unavailable until migration 010 is applied.');
    setEmergencyEmptyState(emergencyReceivedEmpty, emergencyReceivedList, false, 'Emergency access unavailable until migration 010 is applied.');
    setEmergencyEmptyState(emergencyRequestsEmpty, emergencyRequestsList, false, 'Emergency access unavailable until migration 010 is applied.');
    setEmergencyEmptyState(emergencyApprovedEmpty, emergencyApprovedList, false, 'Emergency access unavailable until migration 010 is applied.');
    return;
  }

  if (emergencyGrantsGiven.length > 0) {
    emergencyGivenEmpty.style.display = 'none';
    emergencyGivenList.innerHTML = emergencyGrantsGiven.map((grant) => `
      <article class="shared-vault-row">
        <div>
          <p class="shared-vault-name">${escapeHtml(grant.grantee_name)} (${escapeHtml(grant.grantee_email)})</p>
          <p class="shared-vault-meta">Wait: ${Number(grant.wait_period_hours)}h · ${grant.is_enabled ? '<span class="status-pill is-enabled">enabled</span>' : '<span class="status-pill is-disabled">revoked</span>'}</p>
        </div>
        <div class="shared-vault-actions">
          ${grant.is_enabled ? `<button type="button" class="btn btn-ghost danger" data-action="emergency-revoke-grant" data-grant-id="${grant.id}">Revoke</button>` : ''}
        </div>
      </article>
    `).join('');
  } else {
    setEmergencyEmptyState(emergencyGivenEmpty, emergencyGivenList, false, 'No emergency access grants configured.');
  }

  if (emergencyGrantsReceived.length > 0) {
    emergencyReceivedEmpty.style.display = 'none';
    emergencyReceivedList.innerHTML = emergencyGrantsReceived.map((grant) => `
      <article class="shared-vault-row">
        <div>
          <p class="shared-vault-name">${escapeHtml(grant.owner_name)} (${escapeHtml(grant.owner_email)})</p>
          <p class="shared-vault-meta">Wait: ${Number(grant.wait_period_hours)}h · ${grant.is_enabled ? '<span class="status-pill is-enabled">enabled</span>' : '<span class="status-pill is-disabled">disabled</span>'}</p>
        </div>
        <div class="shared-vault-actions">
          ${grant.is_enabled && !pendingRequestForGrant(grant.id) ? `<button type="button" class="btn btn-primary" data-action="emergency-request-access" data-grant-id="${grant.id}">Request Access</button>` : ''}
          ${grant.is_enabled && pendingRequestForGrant(grant.id) ? '<button type="button" class="btn btn-ghost" disabled>Pending Request</button>' : ''}
        </div>
      </article>
    `).join('');
  } else {
    setEmergencyEmptyState(emergencyReceivedEmpty, emergencyReceivedList, false, 'No emergency access grants available to request.');
  }

  if (emergencyRequests.length > 0) {
    emergencyRequestsEmpty.style.display = 'none';
    emergencyRequestsList.innerHTML = emergencyRequests.map((request) => {
      const status = String(request.status || '').toLowerCase();
      const isPending = status === 'pending';
      const availableAt = request.available_at ? ` · Activates: ${escapeHtml(formatDateTime(request.available_at))}` : '';
      const expiresAt = request.expires_at ? ` · Expires: ${escapeHtml(formatDateTime(request.expires_at))}` : '';
      const statusLine = status === 'approved' && request.available_at
        ? `Status: ${emergencyStatusBadge(status)}${request.is_active ? ' · Active' : ' · Waiting'}`
        : `Status: ${emergencyStatusBadge(status)}`;
      return `
        <article class="shared-vault-row">
          <div>
            <p class="shared-vault-name">${escapeHtml(request.owner_name)} ⇄ ${escapeHtml(request.requester_name)}</p>
            <p class="shared-vault-meta">
              ${statusLine} ·
              Requested: ${escapeHtml(formatDateTime(request.requested_at))}${availableAt}${expiresAt}
            </p>
          </div>
          <div class="shared-vault-actions">
            ${request.is_incoming_for_owner && isPending ? `<button type="button" class="btn btn-primary" data-action="emergency-approve-request" data-request-id="${request.id}">Approve</button>` : ''}
            ${request.is_incoming_for_owner && isPending ? `<button type="button" class="btn btn-ghost danger" data-action="emergency-deny-request" data-request-id="${request.id}">Deny</button>` : ''}
            ${request.is_outgoing_for_requester && isPending ? `<button type="button" class="btn btn-ghost danger" data-action="emergency-cancel-request" data-request-id="${request.id}">Cancel</button>` : ''}
          </div>
        </article>
      `;
    }).join('');
  } else {
    setEmergencyEmptyState(emergencyRequestsEmpty, emergencyRequestsList, false, 'No emergency access requests.');
  }

  if (emergencyApproved.length > 0) {
    emergencyApprovedEmpty.style.display = 'none';
    emergencyApprovedList.innerHTML = emergencyApproved.map((entry) => `
      <article class="shared-vault-row">
        <div>
          <p class="shared-vault-name">${escapeHtml(entry.owner_name)} (${escapeHtml(entry.owner_email)})</p>
          <p class="shared-vault-meta">Active · Expires: ${escapeHtml(formatDateTime(entry.expires_at || 'not set'))}</p>
        </div>
        <div class="shared-vault-actions">
          <button type="button" class="btn btn-primary" data-action="emergency-open-snapshot" data-request-id="${entry.request_id}">Open Snapshot</button>
        </div>
      </article>
    `).join('');
  } else {
    setEmergencyEmptyState(emergencyApprovedEmpty, emergencyApprovedList, false, 'No active approved access windows.');
  }
}

async function loadEmergencyAccess() {
  if (emergencyError) emergencyError.textContent = '';
  const data = await requestApi('../api/emergency-access/list.php', 'GET');
  emergencyAccessAvailable = Boolean(data?.available);
  emergencyGrantsGiven = Array.isArray(data?.grants_given) ? data.grants_given : [];
  emergencyGrantsReceived = Array.isArray(data?.grants_received) ? data.grants_received : [];
  emergencyRequests = Array.isArray(data?.requests) ? data.requests : [];
  if (emergencyAccessAvailable) {
    const approvedData = await requestApi('../api/emergency-access/approved.php', 'GET');
    emergencyApproved = Array.isArray(approvedData?.approved_access) ? approvedData.approved_access : [];
  } else {
    emergencyApproved = [];
  }
  renderEmergencyAccess();
}

async function openEmergencySnapshot(requestId) {
  if (!emergencySnapshotModal || !emergencySnapshotList || !emergencySnapshotMeta || !emergencySnapshotError) return;
  emergencySnapshotError.textContent = '';
  emergencySnapshotMeta.textContent = 'Loading snapshot...';
  emergencySnapshotList.innerHTML = '<p class="history-empty">Loading emergency snapshot...</p>';
  emergencySnapshotModal.showModal();

  try {
    const data = await requestApi(`../api/emergency-access/items.php?request_id=${requestId}`, 'GET');
    const request = data?.request || {};
    const items = Array.isArray(data?.items) ? data.items : [];
    const metaParts = [`${request.owner_name || 'Owner'}`];
    if (request.available_at) metaParts.push(`active since ${formatDateTime(request.available_at)}`);
    if (request.expires_at) metaParts.push(`expires ${formatDateTime(request.expires_at)}`);
    emergencySnapshotMeta.textContent = metaParts.join(' · ');

    if (items.length === 0) {
      emergencySnapshotList.innerHTML = '<p class="history-empty">No vault items available.</p>';
      return;
    }

    emergencySnapshotList.innerHTML = items.map((item) => `
      <article class="history-entry">
        <div class="history-entry-head">
          <p class="history-entry-time">${escapeHtml(item.site || 'Untitled')}</p>
          <p class="history-entry-source">${escapeHtml(formatItemType(item.item_type))}</p>
        </div>
        <p class="history-entry-meta">Username: ${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.username || '' : '—')}</p>
        <p class="history-entry-meta">Password: ${escapeHtml(normalizeItemType(item.item_type) === 'login' ? item.password || '' : '—')}</p>
        <p class="history-entry-meta">Notes: ${escapeHtml(item.notes || '')}</p>
      </article>
    `).join('');
  } catch (error) {
    if (error?.status === 425 && error?.payload?.available_at) {
      emergencySnapshotError.textContent = `Emergency access is not active yet. Available at ${formatDateTime(error.payload.available_at)}.`;
    } else {
      emergencySnapshotError.textContent = error.message || 'Unable to load emergency snapshot.';
    }
    emergencySnapshotList.innerHTML = '';
  }
}

async function createEmergencyGrant() {
  if (emergencyError) emergencyError.textContent = '';
  const email = String(emergencyGrantEmailInput?.value || '').trim();
  const waitPeriodHours = Number(emergencyWaitHoursInput?.value || 24);
  if (!email) {
    if (emergencyError) emergencyError.textContent = 'Emergency contact email is required.';
    return;
  }

  await csrfReady;
  await requestApi('../api/emergency-access/grant.php', 'POST', {
    email,
    wait_period_hours: waitPeriodHours,
  });
  if (emergencyGrantEmailInput) emergencyGrantEmailInput.value = '';
  await loadEmergencyAccess();
  showToast('Emergency access grant saved.');
}

async function revokeEmergencyGrant(grantId) {
  await csrfReady;
  await requestApi('../api/emergency-access/revoke.php', 'POST', { grant_id: grantId });
  await loadEmergencyAccess();
  showToast('Emergency grant revoked.');
}

async function requestEmergencyAccess(grantId) {
  await csrfReady;
  await requestApi('../api/emergency-access/request.php', 'POST', { grant_id: grantId });
  await loadEmergencyAccess();
  showToast('Emergency access requested.');
}

async function decideEmergencyRequest(requestId, action) {
  await csrfReady;
  await requestApi('../api/emergency-access/decide.php', 'POST', {
    request_id: requestId,
    action,
  });
  await loadEmergencyAccess();
  showToast(action === 'approve' ? 'Emergency request approved.' : 'Emergency request denied.');
}

async function cancelEmergencyRequest(requestId) {
  await csrfReady;
  await requestApi('../api/emergency-access/cancel-request.php', 'POST', {
    request_id: requestId,
  });
  await loadEmergencyAccess();
  showToast('Emergency request cancelled.');
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
emergencySnapshotCloseBtn?.addEventListener('click', () => {
  emergencySnapshotModal?.close();
});
searchInput?.addEventListener('input', renderTable);
favoriteFilter?.addEventListener('change', renderTable);
folderFilter?.addEventListener('change', renderTable);
sortFilter?.addEventListener('change', renderTable);
healthPanel?.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-health-filter]');
  if (!(button instanceof HTMLButtonElement)) return;
  setHealthFilter(button.dataset.healthFilter || 'all');
});
healthFilterClearBtn?.addEventListener('click', () => {
  setHealthFilter('all');
});
healthInsightsBody?.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action="health-review"]');
  if (!(button instanceof HTMLButtonElement)) return;
  const mode = String(button.dataset.healthMode || 'all');
  setHealthFilter(mode);
  window.setTimeout(() => {
    searchInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    searchInput?.focus();
  }, 0);
});
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  window.localStorage.setItem('vaultpass_theme', next);
});
passwordInput?.addEventListener('input', updatePasswordStrength);
itemTypeInput?.addEventListener('change', () => {
  const nextType = normalizeItemType(itemTypeInput.value);
  applyItemTypeUi(nextType);

  if (nextType === 'identity') {
    notesInput.value = '';
    clearPaymentFields();
    updatePasswordStrength();
    return;
  }
  if (nextType === 'payment_card') {
    notesInput.value = '';
    clearIdentityFields();
    updatePasswordStrength();
    return;
  }

  if (nextType === 'secure_note') {
    clearIdentityFields();
    clearPaymentFields();
    passwordStrengthLabel.textContent = 'Strength: —';
    passwordStrengthFill.style.width = '0%';
    passwordStrengthFill.style.background = '#c8ccd5';
  } else {
    updatePasswordStrength();
  }
});
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
sharedVaultForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await createSharedVault();
  } catch (error) {
    if (sharedVaultError) sharedVaultError.textContent = error.message || 'Unable to create shared vault.';
  }
});
emergencyGrantForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await createEmergencyGrant();
  } catch (error) {
    if (emergencyError) emergencyError.textContent = error.message || 'Unable to save emergency grant.';
  }
});
sharedInviteForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await inviteSharedMember();
  } catch (error) {
    if (sharedMemberError) sharedMemberError.textContent = error.message || 'Unable to invite member.';
  }
});
loadSharedMembersBtn?.addEventListener('click', async () => {
  try {
    await loadSharedMembers();
  } catch (error) {
    if (sharedMemberError) sharedMemberError.textContent = error.message || 'Unable to load members.';
  }
});
sharedVaultManageSelect?.addEventListener('change', async () => {
  try {
    selectedSharedVaultId = Number(sharedVaultManageSelect.value || 0);
    await loadSharedMembers();
  } catch (error) {
    if (sharedMemberError) sharedMemberError.textContent = error.message || 'Unable to load members.';
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

networkBannerDismissBtn?.addEventListener('click', () => {
  networkBannerDismissed = true;
  renderNetworkBanner();
});

window.addEventListener('online', renderNetworkBanner);
window.addEventListener('offline', renderNetworkBanner);

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
  if (sessionPolicyText) sessionPolicyText.textContent = 'Session timeout policy: loading…';
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

  const itemType = normalizeItemType(itemTypeInput?.value || 'login');
  let usernameValue = usernameInput.value.trim();
  let passwordValue = passwordInput.value;
  let notesValue = notesInput.value.trim();

  if (itemType === 'identity') {
    const identity = identityNotesPayload();
    if (!hasAnyStructuredValue(identity) || !identity.full_name) {
      modalError.textContent = 'Full name is required for identity profiles.';
      return;
    }
    usernameValue = '';
    passwordValue = '';
    notesValue = JSON.stringify(identity);
  } else if (itemType === 'payment_card') {
    const payment = paymentNotesPayload();
    const expMonth = String(payment.exp_month || '').padStart(2, '0');
    if (paymentExpMonth) paymentExpMonth.value = expMonth;
    payment.exp_month = expMonth;
    if (!hasAnyStructuredValue(payment) || !payment.number || !payment.exp_month || !payment.exp_year) {
      modalError.textContent = 'Card number and expiration are required for payment cards.';
      return;
    }
    usernameValue = '';
    passwordValue = '';
    notesValue = JSON.stringify(payment);
  }

  const payload = {
    site: siteInput.value.trim(),
    item_type: itemType,
    username: usernameValue,
    password: passwordValue,
    notes: notesValue,
    folder: folderInput?.value.trim() || '',
    tags: parseTagsInput(tagsInput?.value || ''),
    is_favorite: favoriteInput?.checked ? 1 : 0,
    shared_vault_id: Number(sharedVaultItemInput?.value || 0),
  };

  if (!payload.site) {
    modalError.textContent = 'Site is required.';
    return;
  }

  if (payload.item_type === 'login' && (!payload.username || !payload.password)) {
    modalError.textContent = 'Site, username, and password are required.';
    return;
  }

  if (payload.item_type === 'secure_note' && !payload.notes) {
    modalError.textContent = 'Secure note content is required.';
    return;
  }

  if ((payload.item_type === 'identity' || payload.item_type === 'payment_card') && !payload.notes) {
    modalError.textContent = 'Profile details are required.';
    return;
  }

  if (featureFlags.zeroKnowledgeClientEncryption) {
    try {
      const passphrase = await ensureZkPassphrase(true);
      if (!passphrase) {
        modalError.textContent = 'Encryption passphrase is required when zero-knowledge mode is enabled.';
        return;
      }

      payload.username = await encryptClientValue(payload.username, passphrase);
      payload.password = await encryptClientValue(payload.password, passphrase);
      payload.notes = await encryptClientValue(payload.notes, passphrase);
    } catch (error) {
      modalError.textContent = error.message || 'Unable to encrypt entry in browser.';
      return;
    }
  }

  try {
    await csrfReady;
    const isUpdate = Boolean(vaultId.value);

    if (isUpdate) {
      await requestApi('../api/vault/update.php', 'POST', {
        id: Number(vaultId.value),
        ...payload,
      });
      showToast('Entry updated.');
    } else {
      await requestApi('../api/vault/create.php', 'POST', payload);
      showToast('Entry added.');
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
    if (normalizeItemType(item.item_type) !== 'login') {
      showToast('This entry type does not have username/password fields.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(item.username);
      showToast(`Username copied for ${item.site}.`);
    } catch (_error) {
      showToast('Unable to copy username.', 'error');
    }
    return;
  }

  if (action === 'copy-pass') {
    if (normalizeItemType(item.item_type) !== 'login') {
      showToast('This entry type does not have username/password fields.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(item.password);
      showToast(`Password copied for ${item.site}.`);
    } catch (_error) {
      showToast('Unable to copy password.', 'error');
    }
    return;
  }

  if (action === 'copy-structured') {
    const structured = structuredDataForItem(item);
    if (!structured) {
      showToast('No structured profile details found.', 'error');
      return;
    }
    const text = structuredCopyText(structured);
    if (!text) {
      showToast('Profile details are empty.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Details copied for ${item.site}.`);
    } catch (_error) {
      showToast('Unable to copy details.', 'error');
    }
    return;
  }

  if (action === 'edit') {
    if (!canWriteItem(item)) {
      showToast('You have viewer access for this shared vault item.', 'error');
      return;
    }
    openModal(item, actionButton);
    return;
  }

  if (action === 'toggle-favorite') {
    if (!canWriteItem(item)) {
      showToast('You have viewer access for this shared vault item.', 'error');
      return;
    }
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
    if (!canWriteItem(item)) {
      showToast('You have viewer access for this shared vault item.', 'error');
      return;
    }
    const confirmed = window.confirm(`Delete saved password for ${item.site}?`);
    if (!confirmed) return;

    await csrfReady;
    await requestApi('../api/vault/delete.php', 'POST', { id });
    await loadItems();
    showToast(`Deleted entry for ${item.site}.`);
    return;
  }

  if (action === 'breach-check') {
    if (normalizeItemType(item.item_type) !== 'login') {
      showToast('Breach monitoring is only available for login entries.', 'error');
      return;
    }
    try {
      await csrfReady;
      const data = await requestApi('../api/breach/check-password.php', 'POST', { id });
      const count = Number(data?.pwned_count || 0);
      if (count > 0) {
        showToast(`Password appears in breaches (${count} times). Change it now.`, 'error');
      } else {
        showToast('No breach matches found for this password.');
      }
    } catch (error) {
      showToast(error.message || 'Unable to check breach status.', 'error');
    }
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

sharedInviteList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;

  const membershipId = Number(button.dataset.membershipId || 0);
  if (!membershipId) return;

  try {
    if (button.dataset.action === 'shared-invite-accept') {
      await respondSharedInvitation(membershipId, 'accept');
    } else if (button.dataset.action === 'shared-invite-reject') {
      await respondSharedInvitation(membershipId, 'reject');
    }
  } catch (error) {
    if (sharedMemberError) sharedMemberError.textContent = error.message || 'Unable to update invitation.';
  }
});

sharedVaultList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;

  const vaultId = Number(button.dataset.vaultId || 0);
  if (!vaultId) return;

  try {
    if (button.dataset.action === 'shared-vault-rename') {
      await renameSharedVault(vaultId);
      return;
    }
    if (button.dataset.action === 'shared-vault-delete') {
      await deleteSharedVault(vaultId);
    }
  } catch (error) {
    if (sharedVaultError) sharedVaultError.textContent = error.message || 'Unable to update shared vault.';
  }
});

emergencyGivenList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;
  if (button.dataset.action !== 'emergency-revoke-grant') return;

  const grantId = Number(button.dataset.grantId || 0);
  if (!grantId) return;

  try {
    const confirmed = window.confirm('Revoke this emergency access grant? Existing pending requests will no longer be actionable.');
    if (!confirmed) return;
    await revokeEmergencyGrant(grantId);
  } catch (error) {
    if (emergencyError) emergencyError.textContent = error.message || 'Unable to revoke grant.';
  }
});

emergencyReceivedList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;
  if (button.dataset.action !== 'emergency-request-access') return;

  const grantId = Number(button.dataset.grantId || 0);
  if (!grantId) return;

  try {
    const confirmed = window.confirm('Request emergency access now? The owner will need to approve this request.');
    if (!confirmed) return;
    await requestEmergencyAccess(grantId);
  } catch (error) {
    if (emergencyError) emergencyError.textContent = error.message || 'Unable to request emergency access.';
  }
});

emergencyRequestsList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;

  const requestId = Number(button.dataset.requestId || 0);
  if (!requestId) return;

  try {
    if (button.dataset.action === 'emergency-approve-request') {
      const confirmed = window.confirm('Approve this emergency access request? This will start the configured wait-period timer.');
      if (!confirmed) return;
      await decideEmergencyRequest(requestId, 'approve');
      return;
    }
    if (button.dataset.action === 'emergency-deny-request') {
      const confirmed = window.confirm('Deny this emergency access request? The requester will need to submit a new request.');
      if (!confirmed) return;
      await decideEmergencyRequest(requestId, 'deny');
      return;
    }
    if (button.dataset.action === 'emergency-cancel-request') {
      const confirmed = window.confirm('Cancel this emergency access request? You can submit a new request later.');
      if (!confirmed) return;
      await cancelEmergencyRequest(requestId);
    }
  } catch (error) {
    if (emergencyError) emergencyError.textContent = error.message || 'Unable to update emergency request.';
  }
});

emergencyApprovedList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;
  if (button.dataset.action !== 'emergency-open-snapshot') return;

  const requestId = Number(button.dataset.requestId || 0);
  if (!requestId) return;

  try {
    await openEmergencySnapshot(requestId);
  } catch (error) {
    if (emergencyError) emergencyError.textContent = error.message || 'Unable to open emergency snapshot.';
  }
});

sharedMemberList?.addEventListener('click', async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest('button[data-action]');
  if (!(button instanceof HTMLElement)) return;

  const userId = Number(button.dataset.userId || 0);
  if (!userId) return;

  try {
    if (button.dataset.action === 'shared-member-update-role') {
      await updateSharedMemberRole(userId);
      return;
    }

    if (button.dataset.action === 'shared-member-remove') {
      const isSelf = userId === currentUserId;
      const confirmed = window.confirm(isSelf ? 'Leave this shared vault?' : 'Remove this member from shared vault?');
      if (!confirmed) return;
      await removeSharedMember(userId);
      return;
    }

    if (button.dataset.action === 'shared-member-transfer-owner') {
      const confirmed = window.confirm('Transfer shared vault ownership to this member? You will become editor.');
      if (!confirmed) return;
      await transferSharedVaultOwnership(userId);
    }
  } catch (error) {
    if (sharedMemberError) sharedMemberError.textContent = error.message || 'Unable to update member.';
  }
});

(async function init() {
  try {
    initTheme();
    renderNetworkBanner();
    const ok = await loadSession();
    if (!ok) return;
    await loadItems();
    await loadSharedVaults();
    await loadSharedInvitations();
    await loadSharedMembers();
    await loadEmergencyAccess();
  } catch (_error) {
    showToast('Unable to load dashboard data.', 'error');
  }
})();
