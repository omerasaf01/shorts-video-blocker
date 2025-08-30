# 🚫 ShortBlocker - Firefox Versiyonu

YouTube Shorts ve Instagram Reels sayfalarını engelleyen ve bu platformlardaki Shorts/Reels butonlarını otomatik olarak kaldıran Firefox eklentisi.

## ✨ Özellikler

- **YouTube Shorts Engelleme**: YouTube Shorts sayfalarına erişimi engeller
- **Instagram Reels Engelleme**: Instagram Reels sayfalarına erişimi engeller
- **Buton Kaldırma**: Shorts ve Reels butonlarını otomatik olarak gizler
- **Kullanıcı Dostu Arayüz**: Modern popup arayüzü ile kolay kontrol
- **Ayarlanabilir**: Her özelliği ayrı ayrı açıp kapatabilme

## 🚀 Kurulum (Firefox)

### Geliştirici Modunda Yükleme

1. Bu klasörü bilgisayarınıza indirin
2. Firefox tarayıcınızı açın
3. Adres çubuğuna `about:debugging` yazın
4. "This Firefox" sekmesine tıklayın
5. "Load Temporary Add-on" butonuna tıklayın
6. İndirdiğiniz **Firefox** klasöründeki `manifest.json` dosyasını seçin

### Kalıcı Kurulum (Önerilen)

1. Bu klasörü bilgisayarınıza indirin
2. Firefox tarayıcınızı açın
3. Adres çubuğuna `about:addons` yazın
4. Dişli ikonuna tıklayın ve "Install Add-on From File" seçin
5. İndirdiğiniz **Firefox** klasöründeki `manifest.json` dosyasını seçin

## 📋 Kullanım

1. Eklentiyi yükledikten sonra Firefox araç çubuğunda ShortBlocker ikonunu göreceksiniz
2. İkona tıklayarak ayarlar panelini açın
3. İstediğiniz özellikleri açıp kapatın:
   - **YouTube Shorts engelleme**: Shorts sayfalarına erişimi engeller
   - **Shorts buton kaldırma**: YouTube'daki Shorts butonlarını gizler
   - **Instagram Reels engelleme**: Reels sayfalarına erişimi engeller
   - **Reels buton kaldırma**: Instagram'daki Reels butonlarını gizler

## 🛠️ Teknik Detaylar

### Dosya Yapısı

```
Firefox/
├── manifest.json          # Eklenti manifest dosyası (Manifest V2)
├── background.js          # Background script
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

- Firefox tarayıcısı (57.0 veya üzeri)
- WebExtensions API desteği

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

## 🔄 Chrome Versiyonu

Chrome için ayrı bir versiyon da mevcuttur. `../Chrome/` klasörüne bakın.

## 🔧 Firefox Özel Notları

- **Manifest V2**: Firefox henüz Manifest V3'ü tam olarak desteklemediği için Manifest V2 kullanılmıştır
- **browser API**: Chrome'un `chrome` API'si yerine Firefox'un `browser` API'si kullanılmıştır
- **Promise-based**: Firefox API'leri Promise tabanlıdır, callback yerine `.then()` kullanılır
- **Gecko ID**: Eklenti için benzersiz bir Gecko ID tanımlanmıştır
