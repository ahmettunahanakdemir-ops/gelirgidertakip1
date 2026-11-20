# v495 — Bütçe AI: ses, fotoğraf ve kayıt açma geri geldi

- **Ad:** Rapor AI'nin adı **Bütçe AI** oldu (alt menü, sol menü, sayfa başlığı, yardım).
- **Mikrofon:** Yazma kutusunun yanındaki mikrofon düğmesi. Konuşma bitince (ya da 5 sn sessizlikte) ses
  `netlify/functions/transcribe.js` ile yazıya çevrilir ve kutuya eklenir; göndermeden önce düzeltebilirsin.
  `OPENAI_TRANSCRIBE_MODEL` (varsayılan `gpt-4o-mini-transcribe`).
- **Fotoğraf:** Kamera düğmesi ya da "Fişten kayıt" kısayolu. En çok 4 görsel (her biri ≤10 MB, gönderirken
  1400 px JPEG'e küçültülür). Yapıştırma ve sürükle-bırak da çalışır. Fiş/fatura/dekont/ekran görüntüsü okunur;
  istenirse kayıt taslağı açılır.
- **Kayıt açma:** "Bugün markete 450 TL nakit ödedim", "Ahmet'ten 2.000 TL tahsil ettim", "şu kaydı sil" gibi
  isteklerde yapay zekâ uygulamanın KENDİ formunu (gelir/gider, hesap, varlık, BES, borç/alacak, ödeme) doldurulmuş
  açar. Sen kontrol edip **Kaydet/Sil** ile onaylarsın; yapay zekâ hiçbir şeyi kendisi kaydetmez. Bu arada veri ya
  da oturum değişirse form kaydetmeyi reddeder. Aynı anda tek taslak.
  Kod: `22-luna-tools.js` (form doldurma + koruma; artık eski panel gerekmeden çalışır),
  `24-report-center.js` (stage akışı), `report-chat.js` (kind: read | report | stage | pick_image).
- **Yazma kutusu:** Kutuya dokununca artık aşağı kaymıyor. Alt menü yalnızca gerçek ekran klavyesi açıldığında
  gizlenir ve kutu klavyenin üstüne taşınır.
- **Alacak fazla tahsilat:** Alacaklarım'da kişi kalan alacaktan fazla gönderebilir. Tahsilat penceresinde
  sınır kalktı; alacak kapanır, fazlası kartta "Fazla tahsilat" olarak görünür, gelir kaydına tutarın tamamı
  ve "Fazla tahsilat ₺…" notu yazılır. Borçlarda ödeme yine kalan tutarı aşamaz. Bağlı gelir kaydıyla
  yapılan tahsilatta da aynı kural geçerli.
- Tahsilat/ödeme penceresindeki kaydet düğmesi telefonda kesiliyordu; "Kaydet" olarak kısaltıldı.
- Önbellek `akis-butce-v495`.
