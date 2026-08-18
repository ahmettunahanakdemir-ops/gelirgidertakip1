# Kod Rehberi - Varlik Butce Takip

Bu proje tek buyuk `app.js` ve `style.css` dosyasindan, yukleme sirasi belli olan kucuk ve anlasilir dosyalara ayrildi. Eski tek dosyalar `legacy/` klasorunde yedek olarak durur; uygulama artik `index.html` icindeki `assets/css` ve `assets/js` dosyalarini kullanir.

## HTML

- `index.html`: Uygulamanin tum ekran iskeleti. Login, ana panel, modallar, formlar ve tekrar eden HTML sablonlari burada durur. CSS ve JS dosyalari bu dosyada numarali sira ile yuklenir.
- `manifest.json`: PWA uygulama adi, ikonlari ve kurulum ayarlari.
- `service-worker.js`: Uygulamanin offline/cache davranisi. Yeni parcalanmis CSS/JS dosyalari cache listesine eklendi.

## CSS Dosyalari

- `assets/css/01-base.css`: Kok degiskenler, global sayfa zemini ve temel form/button ayarlari.
- `assets/css/02-auth-forms.css`: Giris/kayit/parola ekranlari, ortak formlar, butonlar ve tehlikeli islem alanlari.
- `assets/css/03-shell-navigation.css`: Uygulama iskeleti, sidebar, topbar, ekran bolumleri ve ana grid duzeni.
- `assets/css/04-dashboard-history-export.css`: Ana sayfa ozetleri, PDF/print onizleme, kayit gecmisi, banka import temel kartlari ve sayfalama.
- `assets/css/05-modals-payment-splash.css`: Modallar, odeme kartlari, acilis ekrani ve ilk responsive kart kurallari.
- `assets/css/06-mobile-payment-assets.css`: Splash animasyonlari, odeme kartlari, varlik/BES ekranlari ve mobil iyilestirmeler.
- `assets/css/07-theme-settings.css`: Tema degiskenleri, acik/koyu tema, ayarlar ekrani ve genel kontrol gorselleri.
- `assets/css/08-modal-filters-home.css`: Modal alt aksiyonlari, filtreler, ana sayfa mini listeleri ve bank-import modal duzeni.
- `assets/css/09-bank-import-filters-wide.css`: Banka import ayrintilari, odeme hesabi filtreleri, genis ekran ve arama duzenleri.
- `assets/css/10-responsive-pwa-overrides.css`: Mobil/PWA, yedekleme, auth, kart ve form responsive duzeltmeleri.
- `assets/css/11-bulk-recent-final.css`: Coklu gelir/gider modali, son kayitlar penceresi ve son katman mobil duzeltmeleri.
- `assets/css/12-debts-receivables.css`: Borc/alacak ozetleri, filtreler, kayit satirlari, modal ve mobil yerlesim.

## JS Dosyalari

- `assets/js/00-theme-preload.js`: CSS yuklenmeden once kayitli acik/koyu tema tercihini HTML kokune uygular.
- `assets/js/01-config-dom.js`: Sabitler, varsayilan veriler ve HTML elemanlarinin DOM referanslari.
- `assets/js/02-ui-preferences-reminders.js`: Tema, yazi tipi, kart odeme hatirlaticilari, genel onay penceresi ve mobil kaydirma yardimcilari.
- `assets/js/03-init-entry-forms.js`: Uygulama baslatma fonksiyonu, olay baglantilari, gelir/gider ve coklu kayit formlari.
- `assets/js/04-storage-home-render.js`: Yerel depolama, silinmis kayit izleri, kategori listeleri ve ana sayfa render islemleri.
- `assets/js/05-assets-payments-bes-market.js`: Varliklar, odeme hesaplari, kredi karti borclari, BES hesaplari ve piyasa fiyatlari.
- `assets/js/06-summary-history-categories-navigation.js`: Ozet kategori dagilimi, kayit gecmisi, filtreler, kategori yonetimi, ekran gecisi ve yan menu.
- `assets/js/07-backup-export-import-sync.js`: Yedekleme, PDF/Excel disari aktarma, dosyadan ice aktarma ve paylasim kodu islemleri.
- `assets/js/08-auth-firebase-cloud.js`: Firebase giris/kayit, profil yonetimi, bulut yedek ve Firestore esitleme akislarini yonetir.
- `assets/js/09-bank-import-ocr-parsers.js`: Banka hareketi ice aktarma, AI/OCR dosya okuma ve metinden hareket ayrisitirma fonksiyonlari.
- `assets/js/10-debts-receivables.js`: Borc/alacak veri modeli, yerel kayit, ekran islemleri, filtreler ve ilgili gelir/gider hareketleri.
- `assets/js/10-startup-pwa.js`: Acilis ekrani ve service worker kaydi yardimcilari.
- `assets/js/11-state-startup.js`: Uygulama durum degiskenlerini yukler ve tum dosyalar hazir olduktan sonra uygulamayi baslatir. En son yuklenmelidir.

## Diger JS Dosyalari

- `firebase-config.js`: Firebase proje anahtarlari ve proje ayarlari.
- `netlify/functions/bank-ai-import.js`: Banka hareketlerini AI ile okumak icin Netlify backend fonksiyonu.

## Calisma Notlari

- CSS ve JS dosya adlarindaki numaralar yukleme sirasini gosterir. Bu sira korunmalidir.
- `assets/js/11-state-startup.js` en son yuklenir; localStorage verilerini okur ve `init()` ile uygulamayi baslatir.
- `legacy/app.original.js` ve `legacy/style.original.css` eski tek dosya halleridir; uygulama tarafindan yuklenmez.
