// Popup JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Ayarları yükle
  loadSettings();
  
  // Toggle switch'leri dinle
  setupToggleListeners();
});

function loadSettings() {
  try {
    chrome.storage.sync.get([
      'blockYouTubeShorts',
      'blockInstagramReels',
      'removeShortsButtons',
      'removeReelsButtons'
    ], (settings) => {
      // Toggle switch'leri güncelle
      updateToggle('blockYouTubeShorts', settings.blockYouTubeShorts);
      updateToggle('blockInstagramReels', settings.blockInstagramReels);
      updateToggle('removeShortsButtons', settings.removeShortsButtons);
      updateToggle('removeReelsButtons', settings.removeReelsButtons);
      
      // Durum mesajını güncelle
      updateStatus(settings);
    });
  } catch (e) {
    console.error('ShortBlocker: Ayarlar yüklenemedi:', e);
    // Hata durumunda varsayılan ayarları kullan
    const defaultSettings = {
      blockYouTubeShorts: true,
      blockInstagramReels: true,
      removeShortsButtons: true,
      removeReelsButtons: true
    };
    updateToggle('blockYouTubeShorts', defaultSettings.blockYouTubeShorts);
    updateToggle('blockInstagramReels', defaultSettings.blockInstagramReels);
    updateToggle('removeShortsButtons', defaultSettings.removeShortsButtons);
    updateToggle('removeReelsButtons', defaultSettings.removeReelsButtons);
    updateStatus(defaultSettings);
  }
}

function setupToggleListeners() {
  const toggles = [
    'blockYouTubeShorts',
    'blockInstagramReels',
    'removeShortsButtons',
    'removeReelsButtons'
  ];
  
  toggles.forEach(toggleId => {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      toggle.addEventListener('click', () => {
        toggleSetting(toggleId);
      });
    }
  });
}

function updateToggle(toggleId, isActive) {
  const toggle = document.getElementById(toggleId);
  if (toggle) {
    if (isActive) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }
}

function toggleSetting(settingId) {
  try {
    chrome.storage.sync.get([settingId], (result) => {
      const newValue = !result[settingId];
      
      chrome.storage.sync.set({ [settingId]: newValue }, () => {
        updateToggle(settingId, newValue);
        
        // Tüm ayarları yeniden yükle ve durumu güncelle
        chrome.storage.sync.get([
          'blockYouTubeShorts',
          'blockInstagramReels',
          'removeShortsButtons',
          'removeReelsButtons'
        ], (settings) => {
          updateStatus(settings);
          
          // Aktif tab'ı yenile
          refreshActiveTab();
        });
      });
    });
  } catch (e) {
    console.error('ShortBlocker: Ayar değiştirilemedi:', e);
    // Hata durumunda toggle'ı geri al
    updateToggle(settingId, !document.getElementById(settingId).classList.contains('active'));
  }
}

function updateStatus(settings) {
  const statusElement = document.getElementById('status');
  let statusText = '';
  
  const activeFeatures = [];
  
  if (settings.blockYouTubeShorts) {
    activeFeatures.push('YouTube Shorts engelleme');
  }
  if (settings.blockInstagramReels) {
    activeFeatures.push('Instagram Reels engelleme');
  }
  if (settings.removeShortsButtons) {
    activeFeatures.push('Shorts buton kaldırma');
  }
  if (settings.removeReelsButtons) {
    activeFeatures.push('Reels buton kaldırma');
  }
  
  if (activeFeatures.length > 0) {
    statusText = `✅ Aktif: ${activeFeatures.join(', ')}`;
  } else {
    statusText = '⚠️ Hiçbir özellik aktif değil';
  }
  
  statusElement.textContent = statusText;
}

function refreshActiveTab() {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url && (url.includes('youtube.com') || url.includes('instagram.com'))) {
          chrome.tabs.reload(tabs[0].id);
        }
      }
    });
  } catch (e) {
    console.error('ShortBlocker: Tab yenilenemedi:', e);
  }
}
