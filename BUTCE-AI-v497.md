# Bütçe AI v497 — sohbet hafızası ve toplu kayıt taslakları

- **Sohbet hafızası:** Model artık önceki yanıtların tamamını görür (özet yanında listeler, tablolar ve gösterilen taslaklar; son 14 mesaj, mesaj başına en çok 6000 karakter). Son gönderilen fotoğraflar sonraki 3 mesajda da otomatik yeniden gönderilir (`previousImages: true`). Böylece "hepsini", "ikincisini", "aynı hesaba" gibi cevaplar önceki ekran görüntüsüne göre çözülür.
- **Toplu kayıt (kind="drafts"):** Yeni gelir/gider/transfer kayıtları (bir ya da en çok 40 tane) sohbet içinde düzenlenebilir form kartları olarak gelir. Her kartta Düzenle (tür, açıklama, tutar, tarih, kategori, ödeme yöntemi, kart/hesap, karşı hesap, not) ve Sil vardır. En alttaki **Kaydet (n)** hepsini birlikte ekler. Uygulamanın kendi formu açılmaz.
- Kaydetme, uygulamanın normal giriş formuyla aynı adımları izler: `createEntryTransaction` → `validateTransactionPayment` → `applyTransactionPaymentEffect` → `persistPaymentAccounts` → `persistTransactions({ cloudUpserts })` → `render()`.
- Eksik/yanlış alanı olan taslak (açıklama, tutar, tarih, transferde iki farklı hesap, kredi kartında kart) kırmızı uyarıyla otomatik düzenleme modunda açılır; düzeltilmeden kaydedilmez. Aynı tarih/tutar/türde mevcut kayıt varsa "zaten var" uyarısı gösterilir.
- Mevcut kaydı düzenleme/silme, borç-alacak ödemesi ve hesap/varlık/BES gibi diğer işlemler eskisi gibi `kind="stage"` ile uygulamanın kendi formunda açılır.
- **Masaüstü:** Bütçe AI sayfası artık 1100 px ile sınırlı değil; içerik alanının tamamını kullanır (≥981 px).
- Değişen dosyalar: `assets/js/24-report-center.js`, `assets/css/31-report-center.css`, `netlify/functions/report-chat.js`, `index.html`, `service-worker.js` (önbellek `akis-butce-v497`).
