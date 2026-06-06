# Firebase Kurallarını Güncelleme

Bu sürümde ekleme, düzenleme ve silme işlemlerinin başka cihazlarda görünmesi için Firestore güvenlik kuralları ve senkron yapısı güncellendi.

Canlı projede sadece Netlify ZIP yüklemek yeterli olmayabilir. Firebase Console üzerinden şu adımları yap:

1. Firebase Console'a gir.
2. Projeni aç.
3. Firestore Database > Rules sekmesine gir.
4. Bu ZIP içindeki `firestore.rules` dosyasının tamamını kopyala.
5. Rules alanına yapıştır.
6. Publish / Yayınla butonuna bas.

Kullanılması gereken ana veri yolu:

```text
users/{uid}
users/{uid}/transactions/{transactionId}
users/{uid}/backups/{backupId}
```

`users/{uid}` dokümanı profil, kart/hesap, varlık, BES, kategori ve silme işaretlerini tutar. Gelir/gider kayıtlarının ana kaynağı `users/{uid}/transactions/{transactionId}` alt koleksiyonudur.

v208 ile kayıtlar önce `users/{uid}/transactions/{transactionId}` alt koleksiyonuna yazılır. `users/{uid}` profil dokümanındaki eski `transactionsBackup` alanı Firestore doküman limitine yaklaşırsa otomatik temizlenir ve ana kaynak alt koleksiyon olur.

v209 ile giriş sırasında tüm geçmişi her seferinde yeniden yazan tam senkron kaldırıldı. Sadece bu cihazda bekleyen yerel değişiklik varsa transactions yazımı yapılır; takılan Firebase yazımlarına da zaman aşımı eklenmiştir.

v210 ile normal ekleme, düzenleme, silme, kart ödeme ve banka içe aktarma işlemleri delta senkrona geçirildi. Artık tek kayıt değiştiğinde tüm geçmiş yeniden yazılmaz; sadece değişen işlem dokümanı yazılır veya silinir.

v211 ile eski cihaz önbelleğinde kalmış "buluta yazılmadı" bayrakları da delta onarıma alındı. Girişte veya tekrar denemede uygulama önce Firebase `transactions` alt koleksiyonunu okur, sonra sadece bulutta eksik/eski olan yerel kayıtları yazar ve sadece silinmesi gereken dokümanları siler. Böylece eski lokal veri yüzünden 200+ kayıt her açılışta yeniden yazılmaz.

v212 ile mobil kart işlem butonları kartın alt bölümüne taşındı ve üç sütunlu sabit düzene geçirildi. Kart ekleme/düzenleme formunda toplam borç ve aktif dönem borcu ayrı alanlar olarak yönetilir; eski kart değerleri ilk geçişte korunur.

v214 ile kredi kartı ödemesi önce önceki dönem borcunu kapatır; ödeme arttığında kalan tutar aktif dönem borcunu da azaltır. Aktif dönem borcu hiçbir zaman toplam borçtan büyük tutulmaz. Kart kayıtları penceresi mobilde kaydırılabilir bir liste alanı kullanır ve ilk açılışta tüm dönemleri gösterir.

v215 ile kredi kartı toplam borcu yalnızca karta bağlı görünür hareketlerin netinden hesaplanır. Kredi kartı giderleri ve karttan çıkan transferler borcu artırır; iadeler, gelirler ve karta gelen transferler borcu azaltır. Eski gizli açılış borcu değerleri sıfırlanır. Öde düğmesi seçilen banka/nakit hesabından kredi kartına tek bir hesaplar arası transfer kaydı oluşturur; kaynak bakiyesi ve kart borcu aynı kayıt üzerinden güncellenir.
