# Luna v492

## Degisiklik

- Asistanin yerel anahtar kelime yonlendiricisi, hazir finans yanitlari ve yerel kayit diyalogu kaldirildi. Her mesaj OpenAI Responses API uzerinden modele gider. Eski `17-assistant-insights.js` artik yuklenmez.
- Model birlesik `reply`, `read`, `stage`, `pick_image` semasiyla calisir. Uygulama kodu yalniz izinli veri sorgulari, sayisal toplamlar, form dogrulamasi ve kullanici onayini saglar. Finans hesaplamalari ve mevcut Firebase esitlemesi kaldirilmadi.
- Tum donemlerdeki yuklu kayitlar, nakit/banka/kartlar, borclar/alacaklar/taksitler, altin ve diger varliklar, BES sorgulanabilir. Her sorgu 40 satir sayfalanir; sayfadan bagimsiz toplam ve gruplar tum eslesmelerden hesaplanir. En fazla 8 okuma turu, tur basina 4 sorgu vardir; bu sinir sinirsiz erisim iddiasi degildir.
- Her modulde ekleme/duzenleme/silme mevcut uygulama formuna aktarilir. Borc/alacak icin odeme/tahsilat formu da desteklenir. Kullanici panel icindeki Kaydet/Sil dugmesine basmadan veri degismez. Sohbette "evet" yazilmasi onay degildir. Bagli hareketi olan kayitlarin zincirleme silmesi asistanda reddedilir; Kayitlar ekraninda incelenmelidir.
- Okunmamis, bulunamamis veya degismis bir hedef degistirilemez. Oturum/kayit durumu form onayindan once tekrar kontrol edilir. Hesap degisiminde sohbet ve gozlemlenen hedef kimlikleri temizlenir. Baska uygulama kullanicilarinin verilerine erisim verilmez.
- Yapistirilan, secilen veya suruklenen en fazla 4 fotograf ayni Luna akisinda incelenir. Okuma, yeni taslak veya mevcut kaydi degistirme istegi model tarafindan yorumlanir. Gorselden coklu hareketler tek tek ve ayri onayla islenir. Dusuk netlikteki bilgi uydurulmamalidir. Foto yayinlamaz, bankada gercek para islemi yapmaz.
- Bu islem model agirliklarini egitmez; uygulama semasi, guncel sorgu araclari ve oturum gecmisi ile baglam saglar. Modelin her olasi soruda hatasiz olacagi garanti edilmez.

## Yayin

`Canli-Surum` ve aktif kaynak birlikte guncellenir. Netlify Functions dahil yeniden deploy gereklidir; yalniz ortam degiskenini degistirmek yeterli degildir.

- Mevcut `OPENAI_API_KEY` kullanilir; yeni anahtar gerektirmez ve anahtar tarayiciya aktarilmaz.
- Model sirasi: `OPENAI_ASSISTANT_MODEL`, yoksa `OPENAI_MODEL`, yoksa `gpt-6-luna`. Secilen modelin API projesinde erisilebilir olmasi gerekir. Model adi tek basina yetki saglamaz.
- API basarisizsa yerel hazir cevapla taklit edilmez; kullaniciya hata gosterilir. Yanitlar `store:false` ile istenir. Ilgili veriler ve gorseller kullanicinin daha once verdigi izinle API'ye iletilir.
- PWA onbellegi ve degisen dosya URL'leri v492 olarak birlikte guncellendi.

## Dogrulama

`node tests/luna-agent.test.cjs`: 29 sentetik arac, veri, onay, oturum, API semasi ve hata kontrolu.

`node tests/luna-browser.test.cjs`: 12 yerel Edge kontrolu; gercek uygulama formlarinda varlik/kayit/hesap/BES/alacak kaydetme, tahsilat, hesaplar arasi transfer, silme, fotograf iletimi, veri okuma, eski taslagi engelleme ve mobil/masaustu panel sinirlari. Firebase/OpenAI ve tum dis ag istekleri testte engellenir; yanitlar taklittir. Playwright yolu bu bilgisayarin paketli calisma ortamina aittir.

Gercek API model davranisi, canli Netlify deploy'u, gercek hesap verileriyle degisiklikler ve fiziksel iPhone bu surumde dogrulanmadi. Yerelde API anahtari bulunmadigi icin gercek model testi yapilmadi. Kullanici hesabinda finansal veri degistirilmedi.
