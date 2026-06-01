# Gemini AI banka okuma kurulumu

Bu sürümde banka hareketleri içe aktarma akışı AI merkezlidir. `AI Önizle / Onaya Hazırla` butonu PDF, CSV, TXT, dijital slip ve ekran görüntülerini Netlify Function üzerinden Gemini'ye gönderir.

## Netlify ortam değişkeni

Netlify panelinde sitenin ayarlarından şu değişkeni ekle:

```text
GEMINI_API_KEY=Google AI Studio'dan aldığın API anahtarı
```

İstersen model adını da değiştirebilirsin:

```text
GEMINI_MODEL=gemini-2.5-flash
```

## Kullanım

1. Gelir/gider ekranında kart veya hesap seç.
2. PDF, CSV, TXT veya birden fazla ekran görüntüsü yükle.
3. `AI Önizle / Onaya Hazırla` butonuna bas.
4. Açılan önizleme penceresinde kayıtları düzenle.
5. Eklemek istemediklerinin kutusunu kaldır.
6. `Seçilenleri Ekle` butonuna bas.

Kart / hesap seçmezsen hareketler sadece kayıt listesine eklenir, kart veya hesap bakiyesi değişmez.

## Gizlilik notu

Ücretsiz Gemini API katmanında gönderilen içeriklerin servis iyileştirme amacıyla kullanılabileceğini varsay. Banka ekranında hassas bilgi varsa önce hesap/kart numarası gibi alanları kapatman daha güvenlidir.
