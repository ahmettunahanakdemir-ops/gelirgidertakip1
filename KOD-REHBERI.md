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
- `assets/css/23-compact-navigation.css`: iPhone icin tek sefer uygulanan guvenli alan ve azaltılmış ust/alt bosluklar; ayarlarin sabit baslikli gecis duzeni.
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
- `assets/js/16-assistant-microphone.js`: Mikrofon durumlari, canli metin, iptal ve gec gelen olay korumasi; Turkce ses secimi ve parcali yanit okuma.
- `assets/js/17-assistant-insights.js`: Adet/tarih cozumleme, kategori ve donem analizleri, borc/hesap/BES ayrimi, kayit kontrolu ve konuya uygun kullanim yanitlari.
- `ASISTAN-SORU-REHBERI.md`: Asistanin destekledigi soru ornekleri, devam/onay akislari ve veri/ses destegi sinirlari.

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
- v427: Acilis ekraninin eski tema renkleri korundu; v425'teki beyaz yazi ve koyu zemin zorlamalari kaldirildi. Tam ekran/status bar icin viewport-fit=cover ve black-translucent korunur; ilk yukleme kok zemini splash temasiyla eslesir. Eski iOS ana ekran kurulumunda metadata yenilenmesi gerekebilir; yerel verileri silmeden once yedek alinmalidir.
- Mobil asistan ekranin gorunur alanini doldurur; `visualViewport.height/offsetTop` klavye acilinca paneli kalan alana sigdirir. Arka sayfa kilitlenir, alt dock gizlenir, mesajlar kendi alaninda kayar, kapanista onceki sayfa konumu geri yuklenir. Gercek iPhone klavye/status bar gorunumu bu ortamda dogrulanmamistir.
- v428: Mesaj alani border-box ve otomatik yukseklik kullanir; uzun metin kesilmez, yerel textarea kaydirmasi korunur. Dinleyen mikrofon kirmizi yerine yesil golgeyle vurgulanir. Mobil asistanin tam ekran kurallari guclendirildi ve ana menu display:none ile gizlenir. iPhone visual viewport ve Android iki viewportun birlikte kuculmesi senaryolari test edildi.
- Genel dokunma geri bildirimi pointerdown aninda baslar; click/kayit/senkronizasyon davranisi degismez. Mobil pencere blur maliyeti azaltildi, buton gecisleri 80 ms ve modal gecisleri 120 ms olarak kisaltildi. Gizli ana sayfa paneli diger ekranlarda yeniden olusturulmaz. Asistan mesaj kaydirmalari kare basina birlestirilir. Gercek cihazda dokunma gecikmesi olcumu yapilmamistir.
- v429: Metinli dugmeler ortak yuvarlak koseler kullanir. Ust arac cubuklarinin ikon dugmeleri 44x44, ikonlari 20x20 olarak standartlastirildi. Uzun mobil pencere basliklari ayri satira alindi; tema/donem/islem tipi ve kategori secicileri, ice aktarma menusu ve koyu tema renk secicisi duzeltildi.
- Mobil hesap kartlarinda alt aksiyon dugmeleri yerine kart adiyla hizali seffaf uc nokta menusu vardir: Kayitlar, Duzenle, Sil. Guncelle dugmesi hesap kartlarindan ve kayit penceresinden kaldirildi; otomatik bakiye hesaplamasi korunur.
- Kayitlar, varliklar, BES, borc/alacak ve taksit kartlari ortak uc nokta menusunu kullanir. Tamamlandi/Geri Ac ve mevcut odeme/tahsilat islemleri korunur. Kart govdesi salt-okunur detay penceresini acar. Bu alanlarda HTML yerine textContent kullanilir.
- Asistan mobil acilista mesaja odaklanmaz. Kategori eslestirmesi dinamik aktif adlarda ve/ile/bolu farklarini normalleştirir. Bitir/Konusmak istemiyorum/Gorusmeyi bitir vedayi gosterir ve destek varsa seslendirir; 3 saniye sonra kapanir. Yeni mesaj kapanma zamanlayicisini iptal eder.
- Ayarlar > Yardim bolumunde 11 konu icin aciklamalar ve ipuclari vardir. Ilk bulut yuklemesi tamamlanana kadar toplam alanlarinda yukleme gostergesi; verisiz hata durumunda bilinmeyen deger gostergesi kullanilir. Yerel veri varsa hata halinde korunur.
- Asistan PNG kaynagi 1199x1312, uygulama ikonu 512x512 ve arayuz ikonlari SVG'dir. iOS ikon kaynagi 512'lik dosyaya yonlendirildi. Chrome'da yayindaki v428 icin 320/430/1440 genislikler incelendi; v429 henuz yayina alinmadigindan yeni gorunumun canli Chrome ve gercek iPhone/Android dogrulamasi tamamlanmadi.
- v430: Kullanici istegiyle v429 ortak gorunum kurallari mobile sinirlandi. Masaustunde mevcut metinli kart aksiyonlari ve canli sitedeki duzenleme penceresinin alt Kaydet duzeni korunur. Mobilde eski aksiyon dugmeleri yuksek oncelikli gorunum kurallariyla gizlenir; ekran genisleyince geri gelir.
- Ay secicisi arac cubugunun ortasinda, ayarlar ve diger ikonlar 44x44 boyutundadir. Tasarruf yuzdesi tek satirda tutulur ve metin uzunluguna gore yazisi sigdirilir. Kart menusu basligin sag ustunde seffaf cercevelidir.
- Mobil islem duzenlemede Iptal/baslik/Kaydet ayni ust satirdadir. Form disina tasinan Kaydet butonunun form baglantisi korunur. Salt-okunur detaylar eski unified header kurallarindan bagimsiz, kendi sabit baslik ve kaydirilabilir govdesini kullanir.
- `16-assistant-microphone.js`: 350 ms ve uzeri basili tutmada birakinca gonderir; kisa dokunma dinlemeyi baslatir, ikinci dokunma bitirip gonderir. Son ses/metin etkinliginden 5 saniye sonra otomatik gonderir; basili tutulurken zamanlayici gondermez. Ara sonuclar tek metinde guncellenir; mobil motorun erken biten bolumleri birlestirilir. Kapatma/iptal sonuc gondermez, gec gelen olaylar mukerrer mesaja neden olmaz. Gercek cihaz/API destegi ve mikrofon izni gereklidir.
- `legacy/app.original.js` ve `legacy/style.original.css` eski tek dosya halleridir; uygulama tarafindan yuklenmez.
- v431: Yardim rehberi her ekranda ikonlu, acilir konu satirlarini kullanir. Mobil ayarlarda ust arac cubugu gizlenir; Kapat ve ortalanmis Ayarlar ayni ust satirdadir. Ayarlar satirlari 52px, arac ve kart menu ikonlari 44px standart olcudededir.
- Mobil islem/BES/taksit basliklari menu alanini ayirir; aciklamalar bu satirin altinda tam genisligi kullanir. Banka kartlarindaki eski sag aksiyon boslugu kaldirildi; bilgiler yayildi, menu kartin sag ustune sabitlendi. Masaustunde otomatik taksit aksiyonlari esnek genislikte, tasmasiz kalir; diger masaustu duzenleri korunur.
- v435: Asistan sorgulari en yüksek/en düşük tutarlı işlemleri bu ay, tek gün, tarih aralığı veya tüm zamanlar kapsamıyla listeler; açıkça birden fazla tür istenirse gelir, gider ve transferleri ayrı alt toplamlarla gösterir. Genel tür adları kategori filtresi sayılmaz; gün/tarih bağlaçları arama sözcüğü olarak eşleşmeyi daraltmaz.
- Ana sayfadaki Son İşlemler artık seçili aydan bağımsız olarak eklenme/güncellenme zamanına göre en yeni beş aktif gelir, gider ve transferi gösterir; aylık toplamlar seçili aya bağlı kalır. Mobil üst çubukta çıkış oku, ayarlar ile aynı ikon düğmesi ölçülerini ve stilini kullanır.
- Kart şablonlarına dokununca görünen geçici çerçeve kaldırıldı; fare odağı için gereksiz çerçeve bastırılırken klavye ile gezinmede belirgin odak halkası korunur. v435 regresyon kontrolleri güncel kaynakta çalıştırıldı; canlı sunucu ve fiziksel telefonlarda doğrulama yapılmadı.
- v431 dogrulamasi: Tum kaynak JS sozdizimi ve onceki sekiz islev test paketi gecti. Chrome headless, tum uygulama CSS'leriyle bagimsiz temsili DOM orneklerinde 320/393/768/1440px yerlesim, ikon, rehber acma/kapama, koyu tema, buton ve menu sinirlari kontrol edildi. Canli siteye dagitim yapilmadi; gercek cihaz ve kullanici verileriyle tam uygulama testi yapilmadi.
- v432: Ev/is adresleri yerelde degisim zamani ve bekleyen esitleme bilgisiyle kaydedilir. Bekleyen kayit ve duzenlenmekte olan form eski bulut yanitlariyla ezilmez; yeni cihaz girisinde adresler ilk profil yazimindan once okunur. Adres degisikligi gereksiz Auth reload ve finansal kayit esitlemesi baslatmaz. Baglanti yoksa yerel kayit korunur ve yeniden esitleme bekler.
- Ust arac cubugunda ayarlar, yenileme, ekleme ve diger ikon aksiyonlari ayni 44x44 boyut, sinir ve ic boslugu kullanir. v432 adres testi Firebase taklidiyle kaydetme/yeniden acma, taslak koruma, kisitli profil yaniti, cevrimdisi yeniden deneme, yeni cihaz, alan temizleme, depolama hatasi ve eszamanli kaydi dogruladi. Onceki islev ve 320/393/768/1440px yerlesim testleri tekrar gecti; canli Firebase'e yazilmadi.
- v433: Mobil BES, kart/hesap, borc/taksit, birikim ekleme/duzenleme, hesap kayitlari ve son kayitlar basliklari tam genislikli ust serit kullanir. Iptal/Kapat, ortalanmis baslik ve Kaydet ayni satirdadir. Kapatma aksiyonlari diger form basliklariyla ayni 72x42 olcudedir. Koyu modda ust serit kenarlara kadar uzanir; eski icte kalan dikdortgen kaldirildi.
- Ice aktarma menusu ikon ve metni yan yana iki kolonda hizalar. Son kayitlarin uc nokta menusu pencerenin kendi katmaninda olusur; Duzenle/Sil tiklanabilir ve pencere kapanirken menu temizlenir. Metin/ikonlar uc nokta sablonuna sigar.
- Yazi ve boyut sayfasinda Varsayilana don ust basliktan kaldirildi; kontrollerin altina mevcut reset islevini koruyan ikonlu satir olarak tasindi. Mobil Yardim, sabit ust baslik ve bagimsiz kaydirilan govde kullanir; her acilista liste en ustten baslar.
- v433 tarayici kontrolu: Uygulamanin gercek HTML parcasi ve pencere/ayar kurulum fonksiyonlari tum CSS ile Chrome headless ortaminda 320/393/768px acik/koyu temalarda kontrol edildi. Modal baslik sinirlari/hizasi, Son Kayitlar menusunun ust katmanda tiklanabilirligi, Duzenle/Sil yonlendirmesi, ice aktarma menu satirlari, reset dugmesinin yeri/islevi ve Yardim basliginin kaydirmada sabit kalmasi gecti. Auth ve finansal islemler canli hizmet yerine test baglantilaridir; gercek telefonda dogrulama ve yayinlama yapilmadi.
- v434: Koyu kategori kayitlarinda toplam, kapsam, tarih, hesap ve aciklama yazilari beyazdir; gider/gelir tutarlarinin anlamli renkleri ve acik tema korunur. Mobil islem duzenleme basligi da tam genislikli ust serit kullanir.
- Islem duzenleme Kaydet dugmesi mobilde alt ayaktan ust saga tasinir; Iptal ve ortalanmis baslikla ayni satirdadir. Pencere acilirken ve ekran genisligi degisince konum yenilenir, masaustunde alt ayak korunur. Form baglantisi ve tek submit dugmesi garanti edilir; dugme zaten dogru yerdeyse tekrar DOM'a eklenmez.
- v434 kontrolu: Chrome headless ortaminda gercek HTML ile 1440->393->320->768->1440->393 genislik gecisleri, ust serit sinirlari/hizasi, Kaydet'in tekil olmasi ve yerel form submit olayinin bir kez olusmasi dogrulandi. Koyu kategori metinleri beyaz; renkli tutarlar ve acik tema korundu. Canli veri yazilmadi ve fiziksel cihaz testi yapilmadi.
- v436: Mobil cikis ve ayarlar dugmeleri ayni yatay hesap-islemleri grubunda; ay secicisi genis ekranda ortali kalir, 340 px ve altinda ikinci satira iner.
- Son Kayitlar acilisinda tekrar sunucu listesi cekilmez; uygulamanin normal senkronize islem listesi aninda gosterilir. Kayitlar degismediyse acik uc nokta menusu ve satir DOM'u korunur; yeni/degisen kayitlarda liste yeniden cizilir.
- v436 kontrolu: Asistanin standart islem formuyla ekledigi gider 3 gunluk listeye eklenme zamanina gore girer. Son kayit penceresinin senkron acilma/menuyu koruma davranisi ve mobil arac cubugu 320/360/390/768 px, masaustu 1280 px testlerinden gecti; 320/393/768/1440 px arayuz regresyonu da gecti. Canli Firebase ve fiziksel cihaz test edilmedi.
- v437: Asistanin en cok harcama yapilan kategori raporu, sayi belirtilmezse ilk 3 kategoriyi; rakamla veya yazi ile sayi istenirse belirtilen adet kadar kategoriyi gosterir. Mevcut kategori sayisi daha azsa hepsini listeler. v437 hedefli sorgu testleri ve onceki dil/yonlendirme regresyonlari gecti.
- v438: Ayarlar ekrani ve tum alt sayfalari acikken asistan baslaticisi, asistan paneli ve mobil alt gezinme cubugu gizlenir. Acik asistan Ayarlara geciste kapatilir ve mobil kaydirma serbest birakilir; ana ekrana donunce gezinme ve asistan geri gorunur. Mobil 393/320 px ve masaustu 1280 px Chrome kontrolleri gecti.
