# iPhone için PWA Yayınlama

Bu uygulama artık iPhone ana ekranına eklenebilir PWA olarak hazır.

## En hızlı yöntem: Netlify Drop

1. Safari veya bilgisayarda [Netlify Drop](https://app.netlify.com/drop) sayfasını aç.
2. Bu klasördeki dosyaları zipleyip ya da topluca sürükleyip bırak:
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
   - `service-worker.js`
   - `icon.svg`
   - `icon-180.png`
   - `icon-512.png`
   - `netlify.toml`
3. Netlify sana `https://...netlify.app` adresi verecek.

## iPhone'a kurma

1. iPhone'da verilen `https://...netlify.app` adresini Safari ile aç.
2. Paylaş tuşuna dokun.
3. `Ana Ekrana Ekle` seç.
4. Uygulamayı ana ekrandan tam ekran gibi kullan.

## Önemli not

- `file://` ile açılan yerel dosya PWA olarak kurulmaz.
- iPhone tarafında kurulum için mutlaka `https` adresi gerekir.
- Uygulama verileri her cihazda kendi tarayıcı depolamasında saklanır.
