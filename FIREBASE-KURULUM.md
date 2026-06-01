# Firebase Kurulumu

Bu PWA, e-posta/şifre girişi için Firebase Authentication ve kullanıcıya özel kayıtlar için Cloud Firestore kullanır.

1. Firebase Console'da yeni bir proje oluştur.
2. Authentication bölümünde Sign-in method sekmesinden Email/Password sağlayıcısını etkinleştir.
3. Firestore Database oluştur ve üretim modunu seç.
4. Project settings > Your apps bölümünden Web app ekle.
5. Firebase'in verdiği `firebaseConfig` değerlerini `firebase-config.js` dosyasındaki alanlara yaz.
6. Firestore Rules ekranına `firestore.rules` dosyasındaki kuralları yapıştırıp yayınla.
7. Siteyi Netlify veya benzeri HTTPS bir adrese yükle. iPhone PWA ve Firebase Auth için yayınlı HTTPS adresi önerilir.

Veri yolu:

```text
users/{uid}/transactions/{transactionId}
```

Her kullanıcı yalnızca kendi `uid` klasöründeki gelir-gider kayıtlarını okuyabilir ve yazabilir.
