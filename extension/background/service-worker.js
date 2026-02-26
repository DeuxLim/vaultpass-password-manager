chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['vaultpass_base_url']).then((data) => {
    if (!data.vaultpass_base_url) {
      chrome.storage.sync.set({ vaultpass_base_url: 'http://localhost:8000' });
    }
  });
});
