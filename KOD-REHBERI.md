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
- `assets/css/16-budget-assistant.css`: Akış Bütçe Asistanı sohbet paneli, sürüklenebilir robot düğmesi, marka renkleri, koyu tema ve mobil güvenli alan.
- `assets/images/budget-assistant-mascot.png`: Asistan başlığı, mesaj avatarları ve açma düğmesindeki özgün Akış Bütçe robotu.

## JS Dosyalari

- `assets/js/00-theme-preload.js`: CSS yuklenmeden once kayitli acik/koyu tema tercihini HTML kokune uygular.
- `assets/js/01-config-dom.js`: Sabitler, varsayilan veriler ve HTML elemanlarinin DOM referanslari.
- `assets/js/02-ui-preferences-reminders.js`: Tema, yazi tipi, kart odeme hatirlaticilari, genel onay penceresi ve mobil kaydirma yardimcilari.
- `assets/js/03-init-entry-forms.js`: Uygulama baslatma fonksiyonu, olay baglantilari, gelir/gider ve coklu kayit formlari.
- `assets/js/04-storage-home-render.js`: Yerel depolama, silinmis kayit izleri, kategori listeleri ve ana sayfa render islemleri.
- `assets/js/05-assets-payments-bes-market.js`: Varliklar, odeme hesaplari, kredi karti borclari, BES hesaplari ve piyasa fiyatlari.
- `assets/js/06-summary-history-categories-navigation.js`: Ozet kategori dagilimi, kayit gecmisi, filtreler, kategori yonetimi, ekran gecisi ve yan menu.
- `assets/js/07-backup-export-import-sync.js`: Yedekleme, PDF/Excel disari aktarma, dosyadan ice aktarma ve paylasim kodu islemleri.
- `assets/js/08-auth-firebase-cloud.js`: Firebase giris/kayit, profil yonetimi, bulut yedek ve Firestore esitleme akislarini yonetir. Basarili giristen sonra kullanici adi-gercek e-posta eslesmesi bu cihazda saklanir; parola saklanmaz. Parola sifirlaninca kullanici adi ayni Firebase hesabina yonlendirilir.
- `assets/js/09-bank-import-ocr-parsers.js`: Banka hareketi ice aktarma, AI/OCR dosya okuma ve metinden hareket ayrisitirma fonksiyonlari.
- `assets/js/10-debts-receivables.js`: Borc/alacak veri modeli, yerel kayit, ekran islemleri, filtreler ve ilgili gelir/gider hareketleri.
- `assets/js/10-startup-pwa.js`: Acilis ekrani ve service worker kaydi yardimcilari.
- `assets/js/11-state-startup.js`: Uygulama durum degiskenlerini yukler ve tum dosyalar hazir olduktan sonra uygulamayi baslatir. En son yuklenmelidir.
- `assets/js/12-budget-assistant.js`: Serbest doğal dilde gelir/gider/transfer kaydı, eksik alanlar için adım adım soru, dönem/kategori/işyeri/hesap filtreli hareket arama, borç/taksit/varlık/BES/kart yanıtları ve Türkçe sayı okuyan durdurulabilir sesli yanıt.

## Diger JS Dosyalari

- `firebase-config.js`: Firebase proje anahtarlari ve proje ayarlari.
- `netlify/functions/bank-ai-import.js`: Banka hareketlerini AI ile okumak icin Netlify backend fonksiyonu.

## Calisma Notlari

- CSS ve JS dosya adlarindaki numaralar yukleme sirasini gosterir. Bu sira korunmalidir.
- `assets/js/11-state-startup.js` uygulama durumunu yükleyip `init()` çağrısını yapar; `12-budget-assistant.js` bu başlangıçtan sonra çalışarak asistanı oturum açılmış uygulamaya bağlar.
- Eski hesaplarda veya yeni bir cihazda kullanici adi eslesmesi yoksa bir kez e-posta ile giris gerekir. Eslesme basarili giris/kayit, mevcut oturum veya profil guncellemesiyle kurulur; eski `.local` e-posta hesaplarinin girisi korunur.
- Asistanin "bu ayki taksitler" sorgusu takvim ayini, "yakin taksitler" sorgusu onumuzdeki 30 gunu, donemsiz taksit sorgusu tum acik taksitleri kullanir. Tamamlanmis taksitler acik taksit listesine dahil edilmez.
- Asistan "300 liralik krem aldim" ve "25 TL'ye simit aldim" gibi satin alma cumlelerinden gider tutarini ve urun basligini alir; eksik kategori/odeme/tarih alanlarini sorar. Kategori secenekleri islem turundeki tum aktif kategorilerdir.
- "Son 10 gundeki kayitlar" bugun dahil 10 takvim gunundeki hareketleri; "son 10 kayit" ise donem belirtilmemisse tum kayitlar arasindaki en yeni 10 hareketi listeler. Belirtilen kategori/hesap/donem filtreleri kayit sayisi sinirindan once uygulanir.
- v425: "310 TL 50 kurus" ve "310,50 lira" tek tutar olarak 310,50 TL islenir. "700 TL'ye tras oldum" hizmet gideri olarak taninir; turu belirsiz parasal ifadelerde gelir/gider/transfer secimi sorulur. Rapor sorulari islem taslagina donusturulmez.
- "Gorusmeyi sonlandir" her adimda paneli kapatir, mikrofon ve seslendirmeyi durdurur, onaylanmamis taslagi ve bekleyen sorulari temizler; mevcut kayitlara dokunmaz.
- "Toplam birikimim" yaniti ve ana sayfadaki dagilim grafigi ortak `getHomeWealthSegments` hesabini kullanir: pozitif guncel bakiye, pozitif varlik degerleri ve BES. Bakiye ana sayfanin aktif tarih filtresine uyar; varliklar ve BES guncel degerleriyle dahil edilir.
- "Son 10 kayit nr" ifadesindeki nr baslik filtresi degildir. "Yakin tarihli/tarihteki kayitlar" eklenme zamani (`createdAt`) veya kayitta secilen islem tarihi (`date`) siralamasini sorar. Acik bir donem belirtilmemisse tum zamanlarin en yeni 10 kaydi listelenir; donem varsa secilen tarih turune gore filtrelenir. Eklenme tarihi olmayan eski kayitlar bu siralamada sona gelir ve bilinmiyor olarak etiketlenir.
- `assets/css/17-mobile-viewport.css`: Mobil/kurulu uygulama acilis ekraninin kenardan kenara yerlesimi, iOS seffaf durum cubugu ve guvenli alan bosluklari. Gercek iPhone PWA gorunumu cihazda dogrulanmalidir.
- v426: "Yakin kayitlari goster" ve "yakin islemleri goster" kisa ifadeleri de tarih turu secimini sorar ve varsayilan olarak en yeni 10 kaydi getirir; aylik tum kayitlar listesine dusmez. Eklenme zamani acikca belirtilmisse yeniden soru sorulmaz.
- `legacy/app.original.js` ve `legacy/style.original.css` eski tek dosya halleridir; uygulama tarafindan yuklenmez.
