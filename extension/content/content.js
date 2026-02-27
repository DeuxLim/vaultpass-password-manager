const formsBound = new WeakSet();
const formSaveState = new WeakMap();
let matchedCredentials = [];
let promptElement = null;
let statusElement = null;
let selectElement = null;
let lastInteractedForm = null;

function isVisibleField(input) {
  if (!(input instanceof HTMLElement)) return false;
  if (input.disabled || input.readOnly) return false;
  if (input.offsetParent === null && getComputedStyle(input).position !== 'fixed') return false;
  return true;
}

function isUsernameInput(input) {
  if (!(input instanceof HTMLInputElement)) return false;
  const type = (input.type || 'text').toLowerCase();
  if (!['text', 'email', 'tel'].includes(type)) return false;
  const hint = inputHint(input);
  if (/(search|query|filter)/.test(hint)) return false;
  return /(user|email|login|account|identifier|phone)/.test(hint) || type === 'email';
}

function inputHint(input) {
  const labels = Array.from(input.labels || [])
    .map((label) => label.textContent || '')
    .join(' ');
  return `${input.name || ''} ${input.id || ''} ${input.autocomplete || ''} ${input.placeholder || ''} ${labels}`.toLowerCase();
}

function detectPasswordInput(form) {
  const candidates = Array.from(form.querySelectorAll('input[type="password"]')).filter(isVisibleField);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const preferred = candidates.find((input) => {
    const autocomplete = String(input.autocomplete || '').toLowerCase();
    if (autocomplete === 'new-password') return false;
    const hint = inputHint(input);
    return /(pass|login|signin|current)/.test(hint);
  });

  return preferred || candidates[0];
}

function usernameScore(input) {
  if (!(input instanceof HTMLInputElement)) return -1;
  if (!isVisibleField(input)) return -1;
  const type = (input.type || '').toLowerCase();
  if (!['text', 'email', 'tel'].includes(type)) return -1;

  const hint = inputHint(input);
  if (/(search|query|filter)/.test(hint)) return -1;

  let score = 0;
  if (type === 'email') score += 6;
  if (String(input.autocomplete || '').toLowerCase() === 'username' || /\busername\b/.test(hint)) score += 6;
  if (/(email|login|user|account|identifier)/.test(hint)) score += 4;
  if (/(phone|tel)/.test(hint)) score += 2;
  if (input.autocomplete === 'off') score -= 1;
  return score;
}

function detectLoginFormFields(form) {
  const password = detectPasswordInput(form);
  if (!password) return null;

  const allInputs = Array.from(form.querySelectorAll('input'));
  const usernameCandidates = allInputs.filter((input) => input !== password && isVisibleField(input));
  const scored = usernameCandidates
    .map((input) => ({ input, score: usernameScore(input) }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score);

  const username = scored[0]?.input || usernameCandidates.find(isUsernameInput) || null;

  return { username, password };
}

function loginFieldsForForm(form) {
  if (!(form instanceof HTMLFormElement)) return null;
  const fields = detectLoginFormFields(form);
  if (!fields || !fields.password) return null;
  return fields;
}

function findPreferredForm() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    const activeForm = active.closest('form');
    const activeFields = loginFieldsForForm(activeForm);
    if (activeFields) {
      return { form: activeForm, fields: activeFields };
    }
  }

  if (lastInteractedForm instanceof HTMLFormElement && document.contains(lastInteractedForm)) {
    const rememberedFields = loginFieldsForForm(lastInteractedForm);
    if (rememberedFields) {
      return { form: lastInteractedForm, fields: rememberedFields };
    }
  }

  const forms = Array.from(document.forms);
  for (const form of forms) {
    const fields = loginFieldsForForm(form);
    if (fields) {
      return { form, fields };
    }
  }

  return null;
}

function fireInputEvents(input) {
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function fillCredential(credential) {
  const candidate = findPreferredForm();
  if (candidate?.fields) {
    const { form, fields } = candidate;
    if (fields.username) {
      fields.username.focus();
      fields.username.value = credential.username;
      fireInputEvents(fields.username);
    }
    fields.password.focus();
    fields.password.value = credential.password;
    fireInputEvents(fields.password);
    lastInteractedForm = form;
    setStatus(`Filled ${credential.site}`);
    return true;
  }

  setStatus('No login form found to fill');
  return false;
}

function setStatus(message) {
  if (!statusElement) return;
  statusElement.textContent = String(message || '').trim();
}

function ensurePrompt() {
  if (promptElement) return promptElement;

  const root = document.createElement('div');
  root.id = 'vaultpass-ext-prompt';
  root.style.position = 'fixed';
  root.style.right = '14px';
  root.style.bottom = '14px';
  root.style.zIndex = '2147483647';
  root.style.width = 'min(340px, calc(100vw - 24px))';
  root.style.border = '1px solid rgba(16,24,40,0.15)';
  root.style.background = '#ffffff';
  root.style.color = '#101828';
  root.style.borderRadius = '12px';
  root.style.boxShadow = '0 16px 40px rgba(16,24,40,0.16)';
  root.style.padding = '10px';
  root.style.fontFamily = 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  root.style.display = 'grid';
  root.style.gap = '8px';

  const title = document.createElement('div');
  title.textContent = 'VaultPass Autofill';
  title.style.fontSize = '12px';
  title.style.fontWeight = '700';
  title.style.letterSpacing = '0.02em';
  title.style.textTransform = 'uppercase';
  title.style.color = '#475467';

  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr auto';
  row.style.gap = '8px';

  const select = document.createElement('select');
  select.style.minHeight = '34px';
  select.style.border = '1px solid #d0d5dd';
  select.style.borderRadius = '8px';
  select.style.padding = '6px 8px';
  select.style.background = '#f9fafb';
  select.style.color = '#101828';
  select.style.fontSize = '13px';
  selectElement = select;

  const fillBtn = document.createElement('button');
  fillBtn.type = 'button';
  fillBtn.textContent = 'Fill';
  fillBtn.style.minHeight = '34px';
  fillBtn.style.borderRadius = '8px';
  fillBtn.style.border = '1px solid transparent';
  fillBtn.style.padding = '0 12px';
  fillBtn.style.background = '#175cd3';
  fillBtn.style.color = '#fff';
  fillBtn.style.fontSize = '13px';
  fillBtn.style.fontWeight = '600';
  fillBtn.style.cursor = 'pointer';

  fillBtn.addEventListener('click', () => {
    const selectedId = Number(select.value || 0);
    const credential = matchedCredentials.find((item) => Number(item.id) === selectedId);
    if (!credential) {
      setStatus('Select an entry first');
      return;
    }
    fillCredential(credential);
  });

  const status = document.createElement('p');
  status.style.margin = '0';
  status.style.fontSize = '12px';
  status.style.color = '#667085';
  statusElement = status;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = 'Dismiss';
  closeBtn.style.minHeight = '30px';
  closeBtn.style.justifySelf = 'end';
  closeBtn.style.border = '1px solid #d0d5dd';
  closeBtn.style.borderRadius = '8px';
  closeBtn.style.background = '#fff';
  closeBtn.style.color = '#344054';
  closeBtn.style.padding = '0 10px';
  closeBtn.style.fontSize = '12px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => {
    root.remove();
    promptElement = null;
  });

  row.append(select, fillBtn);
  root.append(title, row, status, closeBtn);
  document.documentElement.appendChild(root);
  promptElement = root;
  return root;
}

function renderPrompt(credentials) {
  matchedCredentials = credentials;
  if (!matchedCredentials.length) return;

  ensurePrompt();
  selectElement.innerHTML = matchedCredentials
    .map((item) => `<option value="${item.id}">${item.site} | ${item.username}</option>`)
    .join('');
  setStatus(`${matchedCredentials.length} match${matchedCredentials.length === 1 ? '' : 'es'} found`);
}

function shouldProcessSubmit(form, username, password) {
  const existing = formSaveState.get(form) || {
    inFlight: false,
    fingerprint: '',
    timestamp: 0,
  };
  const now = Date.now();
  const fingerprint = `${username}\u0000${password}`;
  const duplicateWindowMs = 2500;

  if (existing.inFlight && existing.fingerprint === fingerprint) return false;
  if (existing.fingerprint === fingerprint && now - existing.timestamp < duplicateWindowMs) return false;

  formSaveState.set(form, {
    inFlight: true,
    fingerprint,
    timestamp: now,
  });
  return true;
}

function releaseSubmitLock(form, { keepFingerprint = true } = {}) {
  const existing = formSaveState.get(form);
  if (!existing) return;

  formSaveState.set(form, {
    inFlight: false,
    fingerprint: keepFingerprint ? existing.fingerprint : '',
    timestamp: keepFingerprint ? existing.timestamp : 0,
  });
}

function formSubmitHandler(form) {
  return () => {
    const fields = detectLoginFormFields(form);
    if (!fields) return;

    const username = String(fields.username?.value || '').trim();
    const password = String(fields.password?.value || '');
    if (!username || !password) return;
    if (!shouldProcessSubmit(form, username, password)) return;

    const siteLabel = window.location.hostname || 'this site';
    const shouldSave = window.confirm(`Save this login to VaultPass for ${siteLabel}?`);
    if (!shouldSave) {
      releaseSubmitLock(form, { keepFingerprint: false });
      return;
    }

    chrome.runtime.sendMessage({
      type: 'EXT_SAVE_SUBMITTED_LOGIN',
      payload: {
        url: window.location.href,
        username,
        password,
      },
    }, (response) => {
      try {
        if (chrome.runtime.lastError) return;
        if (!response?.ok) return;
        if (response.mode === 'created') {
          setStatus('Saved as new VaultPass item');
        } else if (response.mode === 'updated') {
          setStatus('Updated existing VaultPass item');
        } else if (response.mode === 'deduped') {
          setStatus('Save already processed');
        }
      } finally {
        releaseSubmitLock(form);
      }
    });
  };
}

function bindForms(root = document) {
  const forms = root instanceof HTMLFormElement ? [root] : Array.from(root.querySelectorAll('form'));
  forms.forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;
    if (formsBound.has(form)) return;
    if (!detectLoginFormFields(form)) return;
    formsBound.add(form);
    form.addEventListener('focusin', () => {
      lastInteractedForm = form;
    });
    form.addEventListener('submit', formSubmitHandler(form));
  });
}

function watchDomForForms() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === 'FORM') {
          bindForms(node);
          return;
        }
        bindForms(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'EXT_FILL_CREDENTIAL') {
    const credential = message.credential || {};
    const ok = fillCredential({
      id: Number(credential.id || 0),
      site: String(credential.site || ''),
      username: String(credential.username || ''),
      password: String(credential.password || ''),
    });
    sendResponse({ ok });
    return true;
  }

  return false;
});

function init() {
  bindForms(document);
  watchDomForForms();
  chrome.runtime.sendMessage(
    {
      type: 'EXT_GET_MATCHED_CREDENTIALS',
      url: window.location.href,
    },
    (response) => {
      if (chrome.runtime.lastError) return;
      if (!response?.ok || !Array.isArray(response.items) || response.items.length === 0) return;
      renderPrompt(response.items);
    }
  );
}

init();
