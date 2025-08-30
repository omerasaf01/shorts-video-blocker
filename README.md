# 🚫 ShortBlocker

YouTube Shorts ve Instagram Reels sayfalarını engelleyen ve bu platformlardaki Shorts/Reels butonlarını otomatik olarak kaldıran tarayıcı eklentisi.

**Chrome ve Firefox için ayrı versiyonlar mevcuttur!**

## 📁 Proje Yapısı

```
ShortBlocker/
├── Chrome/               # Chrome eklentisi (Manifest V3)
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── icons/
│   └── README.md
├── Firefox/              # Firefox eklentisi (Manifest V2)
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   ├── icons/
│   └── README.md
├── test.html             # Test sayfası
└── README.md             # Bu dosya
```

## ✨ Özellikler

- **YouTube Shorts Engelleme**: YouTube Shorts sayfalarına erişimi engeller
- **Instagram Reels Engelleme**: Instagram Reels sayfalarına erişimi engeller
- **Buton Kaldırma**: Shorts ve Reels butonlarını otomatik olarak gizler
- **Kullanıcı Dostu Arayüz**: Modern popup arayüzü ile kolay kontrol
- **Ayarlanabilir**: Her özelliği ayrı ayrı açıp kapatabilme
- **Çoklu Tarayıcı Desteği**: Chrome ve Firefox için ayrı versiyonlar

## 🚀 Kurulum

### Chrome Versiyonu

1. `Chrome/` klasörünü bilgisayarınıza indirin
2. Chrome tarayıcınızı açın
3. Adres çubuğuna `chrome://extensions/` yazın
4. Sağ üst köşedeki "Geliştirici modu"nu açın
5. "Paketlenmemiş öğe yükle" butonuna tıklayın
6. İndirdiğiniz **Chrome** klasörünü seçin

### Firefox Versiyonu

1. `Firefox/` klasörünü bilgisayarınıza indirin
2. Firefox tarayıcınızı açın
3. Adres çubuğuna `about:debugging` yazın
4. "This Firefox" sekmesine tıklayın
5. "Load Temporary Add-on" butonuna tıklayın
6. İndirdiğiniz **Firefox** klasöründeki `manifest.json` dosyasını seçin

**Kalıcı kurulum için:** `about:addons` → Dişli ikonu → "Install Add-on From File" → `manifest.json` seçin

## 📋 Kullanım

1. Eklentiyi yükledikten sonra tarayıcı araç çubuğunda ShortBlocker ikonunu göreceksiniz
2. İkona tıklayarak ayarlar panelini açın
3. İstediğiniz özellikleri açıp kapatın:
   - **YouTube Shorts engelleme**: Shorts sayfalarına erişimi engeller
   - **Shorts buton kaldırma**: YouTube'daki Shorts butonlarını gizler
   - **Instagram Reels engelleme**: Reels sayfalarına erişimi engeller
   - **Reels buton kaldırma**: Instagram'daki Reels butonlarını gizler

## 🛠️ Teknik Detaylar

### Chrome Versiyonu
- **Manifest V3**: Modern Chrome eklenti standardı
- **Service Worker**: Background script olarak çalışır
- **Chrome API**: `chrome.*` API'leri kullanır

### Firefox Versiyonu
- **Manifest V2**: Firefox WebExtensions standardı
- **Background Script**: Persistent background script
- **Browser API**: `browser.*` API'leri kullanır (Promise-based)

### Ortak Özellikler
- **Content Script**: Sayfa içeriği manipülasyonu
- **Storage API**: Ayarları senkronize eder
- **MutationObserver**: Dinamik içerik takibi

### Desteklenen Platformlar
- YouTube (youtube.com, www.youtube.com)
- Instagram (instagram.com, www.instagram.com)

## 🔧 Geliştirme

### Gereksinimler

**Chrome:**
- Chrome tarayıcısı (Manifest V3 desteği)

**Firefox:**
- Firefox tarayıcısı (57.0 veya üzeri)
- WebExtensions API desteği

### Test Etme

1. İlgili klasördeki eklentiyi geliştirici modunda yükleyin
2. YouTube veya Instagram'a gidin
3. Shorts/Reels butonlarının gizlendiğini kontrol edin
4. Shorts/Reels sayfalarına gitmeye çalışın ve engellendiğini kontrol edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 🐛 Bilinen Sorunlar

- YouTube ve Instagram'ın sürekli güncellenen arayüzü nedeniyle bazı butonlar geçici olarak görünebilir
- SPA (Single Page Application) yapısı nedeniyle sayfa yenileme gerekebilir
- Firefox'ta geçici eklenti yükleme her tarayıcı yeniden başlatıldığında tekrarlanmalıdır

## 📞 Destek

Herhangi bir sorun yaşarsanız veya öneriniz varsa, lütfen GitHub Issues bölümünde bildirin.

## 🔄 Versiyon Farklılıkları

| Özellik | Chrome | Firefox |
|---------|--------|---------|
| Manifest Versiyonu | V3 | V2 |
| Background Script | Service Worker | Persistent Script |
| API | chrome.* | browser.* |
| Promise Support | Callback | Native |
| Kurulum | Geliştirici Modu | Geçici/Kalıcı |

## 🎯 Önerilen Kullanım

- **Chrome kullanıcıları**: `Chrome/` klasörünü kullanın
- **Firefox kullanıcıları**: `Firefox/` klasörünü kullanın
- **Geliştiriciler**: Her iki versiyonu da test edin
