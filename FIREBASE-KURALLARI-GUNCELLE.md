# Firebase Kurallarını Güncelleme

Bu sürümde ekleme ve düzenleme işlemlerinin başka cihazlarda görünmesi için Firestore güvenlik kuralları güncellendi.

Canlı projede sadece Netlify ZIP yüklemek yeterli olmayabilir. Firebase Console üzerinden şu adımları yap:

1. Firebase Console'a gir.
2. Projeni aç.
3. Firestore Database > Rules sekmesine gir.
4. Bu ZIP içindeki `firestore.rules` dosyasının tamamını kopyala.
5. Rules alanına yapıştır.
6. Publish / Yayınla butonuna bas.

Eski kural sadece `income` ve `expense` kayıtlarına izin verdiği için `transfer` kayıtları batch yazımını engelleyebiliyordu. Batch içinde bir transfer kaydı reddedilince ekleme/düzenleme yazımı komple başarısız olabiliyordu.
