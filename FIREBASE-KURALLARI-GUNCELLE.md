# Firebase Kurallarını Güncelleme

Bu sürümde ekleme ve düzenleme işlemlerinin başka cihazlarda görünmesi için Firestore güvenlik kuralları güncellendi.

Canlı projede sadece Netlify ZIP yüklemek yeterli olmayabilir. Firebase Console üzerinden şu adımları yap:

1. Firebase Console'a gir.
2. Projeni aç.
3. Firestore Database > Rules sekmesine gir.
4. Bu ZIP içindeki `firestore.rules` dosyasının tamamını kopyala.
5. Rules alanına yapıştır.
6. Publish / Yayınla butonuna bas.

Eski kural sadece bazı kayıt tiplerine veya alanlarına izin verdiği için yeni eklenen alanlar ve `transfer` kayıtları Firebase yazımını engelleyebiliyordu. Batch içinde tek bir kayıt reddedilince ekleme/düzenleme yazımı komple başarısız olabiliyordu.

v208 ile kayıtlar önce `users/{uid}/transactions/{transactionId}` alt koleksiyonuna yazılır. `users/{uid}` profil dokümanındaki eski `transactionsBackup` alanı Firestore doküman limitine yaklaşırsa otomatik temizlenir ve ana kaynak alt koleksiyon olur.
