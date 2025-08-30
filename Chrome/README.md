# 🚫 ShortBlocker - Chrome Versiyonu

YouTube Shorts ve Instagram Reels sayfalarını engelleyen ve bu platformlardaki Shorts/Reels butonlarını otomatik olarak kaldıran Chrome eklentisi.

## ✨ Özellikler

- **YouTube Shorts Engelleme**: YouTube Shorts sayfalarına erişimi engeller
- **Instagram Reels Engelleme**: Instagram Reels sayfalarına erişimi engeller
- **Buton Kaldırma**: Shorts ve Reels butonlarını otomatik olarak gizler
- **Kullanıcı Dostu Arayüz**: Modern popup arayüzü ile kolay kontrol
- **Ayarlanabilir**: Her özelliği ayrı ayrı açıp kapatabilme

## 🚀 Kurulum (Chrome)

### Geliştirici Modunda Yükleme

1. Bu klasörü bilgisayarınıza indirin
2. Chrome tarayıcınızı açın
3. Adres çubuğuna `chrome://extensions/` yazın
4. Sağ üst köşedeki "Geliştirici modu"nu açın
5. "Paketlenmemiş öğe yükle" butonuna tıklayın
6. İndirdiğiniz **Chrome** klasörünü seçin

## 📋 Kullanım

1. Eklentiyi yükledikten sonra Chrome araç çubuğunda ShortBlocker ikonunu göreceksiniz
2. İkona tıklayarak ayarlar panelini açın
3. İstediğiniz özellikleri açıp kapatın:
   - **YouTube Shorts engelleme**: Shorts sayfalarına erişimi engeller
   - **Shorts buton kaldırma**: YouTube'daki Shorts butonlarını gizler
   - **Instagram Reels engelleme**: Reels sayfalarına erişimi engeller
   - **Reels buton kaldırma**: Instagram'daki Reels butonlarını gizler

## 🛠️ Teknik Detaylar

### Dosya Yapısı

```
Chrome/
├── manifest.json          # Eklenti manifest dosyası (Manifest V3)
├── background.js          # Background service worker
├── content.js            # Content script (sayfa manipülasyonu)
├── popup.html            # Popup arayüzü
├── popup.js              # Popup JavaScript
├── icons/                # Eklenti ikonları
└── README.md             # Bu dosya
```

### Çalışma Prensibi

1. **Background Script**: Tab güncellemelerini dinler ve Shorts/Reels sayfalarını engeller
2. **Content Script**: Sayfa içeriğini manipüle ederek butonları gizler
3. **Popup**: Kullanıcı ayarlarını yönetir

### Desteklenen Platformlar

- YouTube (youtube.com, www.youtube.com)
- Instagram (instagram.com, www.instagram.com)

## 🔧 Geliştirme

### Gereksinimler

- Chrome tarayıcısı (Manifest V3 desteği)
- Modern web tarayıcısı

### Test Etme

1. Eklentiyi geliştirici modunda yükleyin
2. YouTube veya Instagram'a gidin
3. Shorts/Reels butonlarının gizlendiğini kontrol edin
4. Shorts/Reels sayfalarına gitmeye çalışın ve engellendiğini kontrol edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 🐛 Bilinen Sorunlar

- YouTube ve Instagram'ın sürekli güncellenen arayüzü nedeniyle bazı butonlar geçici olarak görünebilir
- SPA (Single Page Application) yapısı nedeniyle sayfa yenileme gerekebilir

## 📞 Destek

Herhangi bir sorun yaşarsanız veya öneriniz varsa, lütfen GitHub Issues bölümünde bildirin.

## 🔄 Firefox Versiyonu

Firefox için ayrı bir versiyon da mevcuttur. `../Firefox/` klasörüne bakın.
