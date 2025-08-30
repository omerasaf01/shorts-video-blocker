// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('ShortBlocker eklentisi yüklendi!');
  
  // Varsayılan ayarları kaydet
  try {
    chrome.storage.sync.set({
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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'complete' && tab.url) {
      const url = new URL(tab.url);
      
      // YouTube Shorts sayfalarını kontrol et
      if (url.hostname.includes('youtube.com') && url.pathname.includes('/shorts/')) {
        chrome.storage.sync.get(['blockYouTubeShorts'], (result) => {
          if (result.blockYouTubeShorts) {
            chrome.tabs.update(tabId, { url: 'https://www.youtube.com' });
          }
        });
      }
      
      // Instagram Reels sayfalarını kontrol et
      if (url.hostname.includes('instagram.com') && url.pathname.includes('/reels/')) {
        chrome.storage.sync.get(['blockInstagramReels'], (result) => {
          if (result.blockInstagramReels) {
            chrome.tabs.update(tabId, { url: 'https://www.instagram.com' });
          }
        });
      }
    }
  } catch (e) {
    console.error('ShortBlocker: Tab güncelleme hatası:', e);
  }
});
