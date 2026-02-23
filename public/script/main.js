const container = document.querySelector('.container');
const signUp = document.querySelector('.signup-link');
const login = document.querySelector('.login-link');

signUp?.addEventListener('click', (e) => {
  e.preventDefault();
  container?.classList.add('active');
});

login?.addEventListener('click', (e) => {
  e.preventDefault();
  container?.classList.remove('active');
});
