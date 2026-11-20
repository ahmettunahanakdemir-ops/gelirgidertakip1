# v494 — Rapor AI ve çoklu cihaz düzeltmeleri

## Rapor AI (eski asistanın yerine)

Sağ alttaki maskotlu sohbet asistanı (Luna) tamamen kaldırıldı. Yerine uygulamanın kendi
sayfası olan **Rapor AI** geldi. Alt menünün ortasındaki parlak düğmeden ve masaüstünde sol
menüden açılır.

- **Tamamen yapay zekâ cevaplı sohbet:** Her soru `/.netlify/functions/report-chat`
  üzerinden modele gider. Uygulamada hazır/yerel cevap yoktur. Bağlantı yoksa hata
  kartı ve "Yeniden dene" düğmesi gösterilir; uydurma cevap verilmez.
- **Veriye hakimiyet:** Her istekle birlikte uygulamanın hesapladığı kesin özet
  (`overview`) gider: son 12 ayın gelir/gider/transfer/net toplamları, bu ay ve geçen
  ay kategori toplamları, hesap ve kartlar, borç/alacak, varlık ve BES toplamları.
  Model daha fazla ayrıntıya ihtiyaç duyarsa salt-okunur sorgular ister (kayıtlar,
  hesaplar, borçlar, varlıklar, BES; filtre, sıralama, toplam, kategori ve aylık
  gruplama). Toplamlar uygulamada hesaplanır; model elle toplama yapmaz.
  En çok 6 okuma turu, tur başına 4 sorgu, sayfa başına 40 satır.
- **Rapor biçimi:** Başlık, dönem, özet cümlesi, 2–6 gösterge kartı (gelir yeşil,
  gider kırmızı), bölümler: açıklama, madde listesi, tablo ve grafik
  (çubuk, yatay çubuk, çizgi, halka). Grafikler SVG'dir, her palet ve açık/koyu
  modda temaya uyar. Sonunda 2–4 devam sorusu düğmesi.
- **Hazır raporlar:** Bu ayın raporu, Geçen ayla karşılaştır, Son 6 ay trendi,
  Kategori dağılımı, Kart ve hesaplar, Borç ve alacak, Varlık ve BES, Tasarruf önerileri.
- **Rapor işlemleri:** Metni kopyala, Excel/CSV indir (Türkçe Excel için `;`
  ayraçlı, UTF-8 BOM), Yazdır / PDF, Paylaş (destekleyen cihazlarda), Kaydet.
  Kaydedilen raporlar "Kayıtlı" düğmesinden açılır (cihazda, kullanıcıya özel,
  en çok 30 rapor).
- **Güvenlik:** Rapor AI yalnızca okur; kayıt ekleme, değiştirme, silme yapamaz.
  İstenirse bunu kibarca söyleyip ilgili ekranı tarif eder. Oturum değişince
  sohbet temizlenir. API anahtarı tarayıcıya gelmez; Firebase oturum jetonu
  sunucuda doğrulanır. Yanıtlar `store:false` ile istenir.
- **Mobil:** Yazma kutusu alt menünün hemen üstünde durur; klavye açılınca alt menü
  gizlenir ve kutu klavyenin üstüne taşınır (visualViewport). Alanlar 16 px; iOS
  odaklanınca yakınlaştırmaz.

### Model ayarı (Netlify ortam değişkenleri)

`OPENAI_API_KEY` zorunlu. Model sırası: `OPENAI_REPORT_MODEL` → `OPENAI_ASSISTANT_MODEL`
→ `OPENAI_MODEL` → `gpt-6-luna`. Yapılandırılmış JSON şeması (strict) kullanır.

### Kaldırılanlar

Yüklenmeyen ve pakete girmeyen dosyalar: `12-budget-assistant.js`,
`16-assistant-microphone.js`, `17-assistant-insights.js`, `18-assistant-logs.js`,
`19-assistant-ai.js`, `20-assistant-images.js`, `22-luna-tools.js`,
`16-budget-assistant.css`, `25-assistant-logs.css`, `26-assistant-images.css`,
`budget-assistant-mascot.png`, `netlify/functions/assistant-chat.js`,
`netlify/functions/transcribe.js` ve eski Luna testleri. Ayarlar'daki
"Asistan soru kayıtları" ve "Asistan bilgi havuzu" bölümleri kaldırıldı.
Bu dosyalar kaynak klasöründe kullanılmadan duruyorsa güvenle silinebilir.

## Çoklu cihaz düzeltmeleri (32-device-polish.css)

Denetim: iPhone SE (375), iPhone 15 (393), Android 360 ve 412, iPad dikey (820) ve
yatay (1180), dizüstü (1366), masaüstü (1920); açık ve koyu mod; giriş ekranı ve
tüm sayfalar. Kontroller: yatay taşma, ekrandan taşan öğeler, kesilen yazılar,
üst üste binen düğmeler, alt menünün altında kalan içerik, küçük dokunma alanları,
iOS'ta 16 px altı form alanları.

- Kayıt, birikim ve BES kartlarında uzun başlıklar "…" düğmesinin altına girmiyor.
- Kart/hesap kartlarında uzun ad ve türler alt harflerden kesilmiyor (2 satır).
- Ayarlar: satır yazıları simgenin yanında sola hizalı, grup başlıkları arasında
  boşluk var; geniş ekranda ayarlar ortalı ve okunur genişlikte.
- iPad ve Android tabletlerde form alanları 16 px (Safari yakınlaştırmaz).
- Alt menü 8 düğmeye göre bölünür.

PWA önbelleği `akis-butce-v494`. Netlify Functions dahil tam paketle yeniden yayınlanmalı.
