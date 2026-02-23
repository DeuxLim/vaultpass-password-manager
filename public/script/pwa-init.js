(() => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isSecure = window.isSecureContext || isLocalhost;
  if (!isSecure) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    } catch (_error) {
      // no-op: PWA registration is optional
    }
  });
})();
