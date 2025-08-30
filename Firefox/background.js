// Background script for Firefox
browser.runtime.onInstalled.addListener(() => {
  console.log('ShortBlocker eklentisi yüklendi!');
  
  // Varsayılan ayarları kaydet
  try {
    browser.storage.sync.set({
      blockYouTubeShorts: true,
      blockInstagramReels: true,
      removeShortsButtons: true,
      removeReelsButtons: true
    });
  } catch (e) {
    console.error('ShortBlocker: Varsayılan ayarlar kaydedilemedi:', e);
  }
});

// Tab güncellemelerini dinle
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'complete' && tab.url) {
      const url = new URL(tab.url);
      
      // YouTube Shorts sayfalarını kontrol et
      if (url.hostname.includes('youtube.com') && url.pathname.includes('/shorts/')) {
        browser.storage.sync.get(['blockYouTubeShorts']).then((result) => {
          if (result.blockYouTubeShorts) {
            browser.tabs.update(tabId, { url: 'https://www.youtube.com' });
          }
        });
      }
      
      // Instagram Reels sayfalarını kontrol et
      if (url.hostname.includes('instagram.com') && url.pathname.includes('/reels/')) {
        browser.storage.sync.get(['blockInstagramReels']).then((result) => {
          if (result.blockInstagramReels) {
            browser.tabs.update(tabId, { url: 'https://www.instagram.com' });
          }
        });
      }
    }
  } catch (e) {
    console.error('ShortBlocker: Tab güncelleme hatası:', e);
  }
});
