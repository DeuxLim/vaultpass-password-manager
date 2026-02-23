const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const requestApi = window.VaultApi.apiRequest;

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
    await requestApi('../api/auth/login.php', 'POST', { email, password });
    window.location.href = '../dashboard/dashboard.html';
  } catch (error) {
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
    await requestApi('../api/auth/register.php', 'POST', { name, email, password });
    window.location.href = '../dashboard/dashboard.html';
  } catch (error) {
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
