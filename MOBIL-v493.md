# v493 - Mobil Acilis, Filtre ve Klavye Duzenlemeleri

- Kayitli palet ve acik/koyu mod, head icinde ilk tema rengi olusturulmadan once okunur. UI ayarlarindaki tema onceliklidir. Varsayilan mint theme-color etiketiyle baslayip daha sonra degisme akisi kaldirildi. Baslangic zemini tema rengiyle ayni tutulur; ayarlara girip cikmak gerekmez.
- Kayit arama penceresindeki dort ozel filtre tekrar etkinlestirildi. Secenekler ortali, sabit minimum satir boyunda ve kendi kaydirma alanindadir. Popover destegi olan tarayicilarda ust katmana alinir; pencere efektlerinin konumu kaydirmasi engellenir. Menu yukari/asagi mevcut alana gore acilir. Klavye ok tuslari, Home/End, Escape ve aria-expanded desteklenir.
- Yerel select acilir listelerinin yuksekligi destekleyen tarayicilarda gorunur ekrana gore sinirlanir. iOS'un sistem secicisinin gorunumu tarayici tarafindan belirlenir.
- Mobil pencereler visualViewport yukseklik ve ust kaymasina uyar. Odaklanan alanin klavye altinda kalmamasi icin once pencere ici kaydirma kaplari kaydirilir; arkadaki sayfa hedeflenmez.
- Banka hareketi onizlemesi mobilde mevcut gorunur alani kaplar. Satir duzenlerken klavye aciksa ustteki hesap secimleri ve ozet gecici olarak gizlenir; klavye kapaninca geri gelir. Iptal/Ekle basligi kalir, satir listesi bagimsiz kayar. Veri/parsing/kaydetme fonksiyonlari degistirilmedi.
- Luna'nin panel ici onay formlari ayni alan gorunurlugu kontrolunden yararlanir. Finansal islem onayi korunur.

## Kontroller

- `node tests/mobile-viewport.test.cjs`: 54 sentetik Edge kontrolu. 9 ana gorunum, 24 pencere kabugu, 50+ secenekli filtrede kaydirma ve son secenek secimi, 6 duzenleme formunda klavye benzetimi, banka gorsel onizlemesi, Luna panel ici formu, dort palet/acik-koyu ilk yukleme.
- `node tests/luna-browser.test.cjs`: onceki 12 yerel tarayici kontrolu gecti.
- `node tests/luna-agent.test.cjs`: onceki 29 arac/API kontrolu gecti.
- Dis ag/Firebase/OpenAI istekleri tarayici testlerinde kapali; veriler sentetiktir. Gercek kullanici kaydi degistirilmedi.
- Pencere kabugu kontrolleri butun is akislarinin uctan uca testi anlamina gelmez. Klavye gorunur ekran kuculmesiyle benzetildi; fiziksel iPhone/Safari durum cubugu ve klavye dogrulamasi yapilmadi. Canli Netlify yayini yapilmadi.

PWA onbellegi v493; degisen dosya referanslari birlikte guncellendi. Netlify Functions iceren tam paketle yeniden deploy edilmelidir. Luna v492 altyapisi korunur.
