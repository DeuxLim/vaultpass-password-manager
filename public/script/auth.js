const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const login2faField = document.getElementById('login-2fa-field');
const login2faToken = document.getElementById('log-2fa-token');
const loginSubmit = document.getElementById('mainlogin');

const requestApi = window.VaultApi.apiRequest;
const initCsrfApi = window.VaultApi.initCsrf;
const csrfReady = initCsrfApi('../api/auth/csrf.php');

let loginChallengeActive = false;

function setLoginError(message) {
  const emailError = document.getElementById('log-error-email');
  const passwordError = document.getElementById('log-error-password');
  const tokenError = document.getElementById('log-error-2fa');
  if (emailError) emailError.textContent = '';
  if (passwordError) passwordError.textContent = '';
  if (tokenError) tokenError.textContent = '';

  if (!message) return;

  if (loginChallengeActive) {
    if (tokenError) tokenError.textContent = message;
  } else if (passwordError) {
    passwordError.textContent = message;
  }
}

function setRegisterError(message) {
  const regError = document.getElementById('reg-error');
  if (!regError) return;
  regError.style.display = message ? 'block' : 'none';
  regError.textContent = message;
}

function setLoginChallengeMode(active) {
  loginChallengeActive = active;
  if (login2faField) login2faField.hidden = !active;

  const emailInput = document.getElementById('log-email');
  const passwordInput = document.getElementById('log-pass');

  if (emailInput) emailInput.disabled = active;
  if (passwordInput) passwordInput.disabled = active;

  if (loginSubmit) {
    loginSubmit.value = active ? 'Verify 2FA' : 'Login';
  }

  if (!active && login2faToken) {
    login2faToken.value = '';
  }

  if (active && login2faToken) {
    window.setTimeout(() => login2faToken.focus(), 0);
  }
}

document.querySelector('.signup-link')?.addEventListener('click', () => {
  setLoginChallengeMode(false);
  setLoginError('');
});

document.querySelector('.login-link')?.addEventListener('click', () => {
  setLoginError('');
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoginError('');

  const email = document.getElementById('log-email')?.value.trim() || '';
  const password = document.getElementById('log-pass')?.value || '';
  const token = login2faToken?.value.trim() || '';

  try {
    await csrfReady;

    if (!loginChallengeActive) {
      const loginData = await requestApi('../api/auth/login.php', 'POST', { email, password });
      if (loginData?.requires_2fa) {
        setLoginChallengeMode(true);
        return;
      }

      window.location.href = '../dashboard/dashboard.html';
      return;
    }

    if (!token) {
      setLoginError('Enter your authenticator code or recovery code.');
      return;
    }

    await requestApi('../api/auth/2fa-verify-login.php', 'POST', { token });
    window.location.href = '../dashboard/dashboard.html';
  } catch (error) {
    if (error?.status === 429) {
      const retryAfter = Number(error?.payload?.retry_after || 0);
      if (retryAfter > 0) {
        setLoginError(`Too many attempts. Try again in ${retryAfter} seconds.`);
        return;
      }
    }

    if (loginChallengeActive && error?.status === 401 && String(error?.message || '').toLowerCase().includes('expired')) {
      setLoginChallengeMode(false);
    }

    setLoginError(error.message);
  }
});

registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setRegisterError('');

  const name = document.getElementById('reg-name')?.value.trim() || '';
  const email = document.getElementById('reg-email')?.value.trim() || '';
  const password = document.getElementById('reg-pass')?.value || '';
  const confirmPassword = document.getElementById('reg-cpass')?.value || '';

  if (password !== confirmPassword) {
    setRegisterError('Passwords do not match');
    return;
  }

  try {
    await csrfReady;
    await requestApi('../api/auth/register.php', 'POST', { name, email, password });
    window.location.href = '../dashboard/dashboard.html';
  } catch (error) {
    if (error?.status === 429) {
      const retryAfter = Number(error?.payload?.retry_after || 0);
      if (retryAfter > 0) {
        setRegisterError(`Too many attempts. Try again in ${retryAfter} seconds.`);
        return;
      }
    }
    setRegisterError(error.message);
  }
});

(async function checkSessionOnLoad() {
  try {
    const res = await fetch('../api/auth/session.php', { credentials: 'same-origin' });
    const data = await res.json();
    if (data?.authenticated) {
      window.location.href = '../dashboard/dashboard.html';
    }
  } catch (_error) {
    // Ignore session check failures on first load.
  }
})();
