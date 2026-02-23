const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const requestApi = window.VaultApi.apiRequest;
const initCsrfApi = window.VaultApi.initCsrf;
const csrfReady = initCsrfApi('../api/auth/csrf.php');

function setLoginError(message) {
  const emailError = document.getElementById('log-error-email');
  const passwordError = document.getElementById('log-error-password');
  if (emailError) emailError.textContent = '';
  if (passwordError) passwordError.textContent = message;
}

function setRegisterError(message) {
  const regError = document.getElementById('reg-error');
  if (!regError) return;
  regError.style.display = message ? 'block' : 'none';
  regError.textContent = message;
}

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  setLoginError('');

  const email = document.getElementById('log-email')?.value.trim() || '';
  const password = document.getElementById('log-pass')?.value || '';

  try {
    await csrfReady;
    await requestApi('../api/auth/login.php', 'POST', { email, password });
    window.location.href = '../dashboard/dashboard.html';
  } catch (error) {
    if (error?.status === 429) {
      const retryAfter = Number(error?.payload?.retry_after || 0);
      if (retryAfter > 0) {
        setLoginError(`Too many attempts. Try again in ${retryAfter} seconds.`);
        return;
      }
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
