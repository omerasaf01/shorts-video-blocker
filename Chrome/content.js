// Content script - Sayfa içeriğini manipüle eder
(function() {
  'use strict';

  // Chrome API'sinin mevcut olup olmadığını kontrol et
  function isExtensionContextValid() {
    try {
      return typeof chrome !== 'undefined' && 
             chrome.runtime && 
             chrome.runtime.id &&
             chrome.storage;
    } catch (e) {
      return false;
    }
  }

  // Güvenli ayar alma fonksiyonu
  function getSettings(callback) {
    if (!isExtensionContextValid()) {
      // Eklenti context'i geçersizse varsayılan ayarları kullan
      callback({
        blockYouTubeShorts: true,
        blockInstagramReels: true,
        removeShortsButtons: true,
        removeReelsButtons: true
      });
      return;
    }

    try {
      chrome.storage.sync.get([
        'blockYouTubeShorts',
        'blockInstagramReels',
        'removeShortsButtons',
        'removeReelsButtons'
      ], (settings) => {
        callback(settings);
      });
    } catch (e) {
      console.warn('ShortBlocker: Ayarlar alınamadı, varsayılan ayarlar kullanılıyor');
      callback({
        blockYouTubeShorts: true,
        blockInstagramReels: true,
        removeShortsButtons: true,
        removeReelsButtons: true
      });
    }
  }

  // Ayarları al ve işle
  getSettings((settings) => {
    const currentUrl = window.location.href;
    
    // YouTube için
    if (currentUrl.includes('youtube.com')) {
      handleYouTube(settings);
    }
    
    // Instagram için
    if (currentUrl.includes('instagram.com')) {
      handleInstagram(settings);
    }
  });

  function handleYouTube(settings) {
    if (settings.removeShortsButtons) {
      // YouTube Shorts butonlarını kaldır
      removeShortsButtons();
      
      // Sayfa değişikliklerini dinle (SPA için)
      const observer = new MutationObserver(() => {
        removeShortsButtons();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  function handleInstagram(settings) {
    if (settings.removeReelsButtons) {
      // Instagram Reels butonlarını kaldır
      removeReelsButtons();
      
      // Sayfa değişikliklerini dinle (SPA için)
      const observer = new MutationObserver(() => {
        removeReelsButtons();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  function removeShortsButtons() {
    // YouTube sol menüdeki Shorts butonlarını kaldır - daha kapsamlı seçiciler
    const navigationShortsSelectors = [
      // Ana navigasyon menüsü
      'ytd-guide-entry-renderer[title*="Shorts"]',
      'ytd-mini-guide-entry-renderer[title*="Shorts"]',
      'ytd-guide-entry-renderer[aria-label*="Shorts"]',
      'ytd-mini-guide-entry-renderer[aria-label*="Shorts"]',
      'ytd-guide-entry-renderer a[href*="/shorts/"]',
      'ytd-mini-guide-entry-renderer a[href*="/shorts/"]',
      
      // Daha genel seçiciler
      'a[href*="/shorts/"]',
      'a[href*="/shorts"]',
      'ytd-guide-entry-renderer:has(a[href*="/shorts/"])',
      'ytd-mini-guide-entry-renderer:has(a[href*="/shorts/"])',
      
      // Text içeriğine göre seçiciler
      'ytd-guide-entry-renderer:has(#title-text:contains("Shorts"))',
      'ytd-mini-guide-entry-renderer:has(#title-text:contains("Shorts"))',
      
      // ID ve class bazlı seçiciler
      'ytd-guide-entry-renderer[data-title*="Shorts"]',
      'ytd-mini-guide-entry-renderer[data-title*="Shorts"]',
      
      // Daha spesifik seçiciler
      'ytd-guide-entry-renderer ytd-guide-entry-renderer a[href*="/shorts/"]',
      'ytd-mini-guide-entry-renderer ytd-mini-guide-entry-renderer a[href*="/shorts/"]'
    ];

    navigationShortsSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.hasAttribute('data-shortblocker-hidden')) {
            // Shorts butonunu gizle
            element.style.display = 'none';
            element.setAttribute('data-shortblocker-hidden', 'true');
          }
        });
      } catch (e) {
        // CSS selector hatası durumunda sessizce devam et
      }
    });

    // Text içeriğine göre manuel kontrol
    const allGuideEntries = document.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
    allGuideEntries.forEach(entry => {
      if (!entry.hasAttribute('data-shortblocker-hidden')) {
        const titleElement = entry.querySelector('#title-text, .title-text, span, a');
        if (titleElement && titleElement.textContent.toLowerCase().includes('shorts')) {
          entry.style.display = 'none';
          entry.setAttribute('data-shortblocker-hidden', 'true');
        }
      }
    });

    // Link içeriğine göre manuel kontrol
    const allLinks = document.querySelectorAll('a[href*="/shorts/"]');
    allLinks.forEach(link => {
      const parentEntry = link.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
      if (parentEntry && !parentEntry.hasAttribute('data-shortblocker-hidden')) {
        parentEntry.style.display = 'none';
        parentEntry.setAttribute('data-shortblocker-hidden', 'true');
      }
    });

    // YouTube sol menüsündeki tüm elementleri kontrol et
    const guideSection = document.querySelector('#guide-content, ytd-guide-renderer');
    if (guideSection) {
      const allGuideItems = guideSection.querySelectorAll('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer');
      allGuideItems.forEach(item => {
        if (!item.hasAttribute('data-shortblocker-hidden')) {
          // Text içeriğini kontrol et
          const textElements = item.querySelectorAll('span, a, #title-text, .title-text');
          let hasShortsText = false;
          
          textElements.forEach(textEl => {
            if (textEl.textContent && textEl.textContent.toLowerCase().includes('shorts')) {
              hasShortsText = true;
            }
          });
          
          // Link içeriğini kontrol et
          const links = item.querySelectorAll('a');
          let hasShortsLink = false;
          
          links.forEach(link => {
            if (link.href && link.href.includes('/shorts/')) {
              hasShortsLink = true;
            }
          });
          
          // Shorts içeriyorsa gizle
          if (hasShortsText || hasShortsLink) {
            item.style.display = 'none';
            item.setAttribute('data-shortblocker-hidden', 'true');
          }
        }
      });
    }

    // Sadece Shorts özel bölümlerini kaldır (tüm section'ı değil)
    const shortsSections = document.querySelectorAll('ytd-rich-section-renderer');
    shortsSections.forEach(section => {
      // Section başlığında "Shorts" geçiyorsa tüm section'ı kaldır
      const sectionTitle = section.querySelector('#title-text, .title-text, h3, .section-title');
      if (sectionTitle && sectionTitle.textContent.toLowerCase().includes('shorts')) {
        if (!section.hasAttribute('data-shortblocker-hidden')) {
          section.style.display = 'none';
          section.setAttribute('data-shortblocker-hidden', 'true');
        }
      } else {
        // Section başlığında Shorts yoksa, sadece Shorts linklerini içeren kartları kaldır
        const shortsCards = section.querySelectorAll('ytd-rich-item-renderer');
        shortsCards.forEach(card => {
          const shortsLink = card.querySelector('a[href*="/shorts/"]');
          if (shortsLink && !card.hasAttribute('data-shortblocker-hidden')) {
            card.style.display = 'none';
            card.setAttribute('data-shortblocker-hidden', 'true');
          }
        });
      }
    });

    // Ana sayfa grid'inde sadece Shorts kartlarını kaldır
    const mainGrid = document.querySelector('ytd-rich-grid-renderer');
    if (mainGrid) {
      const shortsCards = mainGrid.querySelectorAll('ytd-rich-item-renderer');
      shortsCards.forEach(card => {
        const shortsLink = card.querySelector('a[href*="/shorts/"]');
        if (shortsLink && !card.hasAttribute('data-shortblocker-hidden')) {
          card.style.display = 'none';
          card.setAttribute('data-shortblocker-hidden', 'true');
        }
      });
    }
  }

  function removeReelsButtons() {
    // Instagram Reels butonlarını bul ve kaldır
    const reelsSelectors = [
      'a[href*="/reels/"]',
      '[aria-label*="Reels"]',
      '[title*="Reels"]',
      'nav a[href*="/reels/"]',
      'div[role="tablist"] a[href*="/reels/"]',
      'a[href*="/reels/"]',
      'nav a[href*="/reels/"]',
      'div[role="tablist"] a[href*="/reels/"]',
      'a[data-testid*="reels"]',
      'nav a[data-testid*="reels"]'
    ];

    reelsSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!element.hasAttribute('data-shortblocker-hidden')) {
            // Reels butonunu gizle
            element.style.display = 'none';
            element.setAttribute('data-shortblocker-hidden', 'true');
          }
        });
      } catch (e) {
        // CSS selector hatası durumunda sessizce devam et
      }
    });

    // Reels önerilerini kaldır
    const reelsSections = document.querySelectorAll('div[role="main"], main, article');
    reelsSections.forEach(section => {
      const reelsLinks = section.querySelectorAll('a[href*="/reels/"]');
      reelsLinks.forEach(link => {
        const parentElement = link.closest('div[role="article"]') || 
                             link.closest('article') || 
                             link.parentElement;
        if (parentElement && !parentElement.hasAttribute('data-shortblocker-hidden')) {
          parentElement.style.display = 'none';
          parentElement.setAttribute('data-shortblocker-hidden', 'true');
        }
      });
    });

    // Reels video kartlarını kaldır
    const videoCards = document.querySelectorAll('div[role="article"], article');
    videoCards.forEach(card => {
      const reelsLink = card.querySelector('a[href*="/reels/"]');
      if (reelsLink && !card.hasAttribute('data-shortblocker-hidden')) {
        card.style.display = 'none';
        card.setAttribute('data-shortblocker-hidden', 'true');
      }
    });
  }

  // Sayfa yüklendiğinde çalıştır
  function initializeBlocker() {
    getSettings((settings) => {
      if (window.location.href.includes('youtube.com') && settings.removeShortsButtons) {
        removeShortsButtons();
      }
      if (window.location.href.includes('instagram.com') && settings.removeReelsButtons) {
        removeReelsButtons();
      }
    });
  }

  // YouTube için özel olarak daha sık kontrol
  function initializeYouTubeBlocker() {
    getSettings((settings) => {
      if (window.location.href.includes('youtube.com') && settings.removeShortsButtons) {
        removeShortsButtons();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initializeBlocker, 1000);
      
      // YouTube için daha sık kontrol (1 saniyede bir)
      if (window.location.href.includes('youtube.com')) {
        setInterval(initializeYouTubeBlocker, 1000);
      }
      
      // Genel kontrol için interval
      setInterval(initializeBlocker, 3000);
    });
  } else {
    setTimeout(initializeBlocker, 1000);
    
    // YouTube için daha sık kontrol (1 saniyede bir)
    if (window.location.href.includes('youtube.com')) {
      setInterval(initializeYouTubeBlocker, 1000);
    }
    
    // Genel kontrol için interval
    setInterval(initializeBlocker, 3000);
  }
})();
