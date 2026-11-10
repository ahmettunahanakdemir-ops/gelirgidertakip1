# Sesli giriş — kayıt tabanlı sürüm

> v456 (2026-11-09): Canli ses artik mevcut OPENAI_API_KEY ile OpenAI Audio Transcriptions kullanir; SPEECH_ENDPOINT ve SPEECH_SERVICE_TOKEN gerekmez. Asagidaki harici servis talimatlari eski v455 icindir. Guncel kurulum: proje kokundeki ORTAK-API-VE-OGRENME.md. Varsayilan ses modeli gpt-4o-mini-transcribe; ucretli kullanimdir.

Eski SpeechRecognition akışı kaldırıldı. Düğme ile yeni kayıt başlar; ikinci dokunuş veya 5 saniye düşük ses seviyesi kaydı bitirir. Metin alanda bekler. Sayılar bütçe anlamında korunur; EGO durak dönüşümü uygulanmaz.

Netlify işlevi Firebase oturumunu doğrular. `SPEECH_ENDPOINT` ortam değişkenine kuruma ait HTTPS çözümleme servisi eklenmelidir. Servis ham audio/webm, audio/mp4, audio/ogg kabul ederek `{text}` döndürmelidir. Gerekirse sunucu sırrı `SPEECH_SERVICE_TOKEN` ile iletilir. Anahtar tarayıcıya gönderilmez. Netlify sitesinin URL'si kendi başına bir ses çözümleme servisi değildir.

Servis kurulmadan mikrofon kaydı alınabilir ancak metne dönüştürme yapılandırma hatası döndürür. Canlı Netlify dağıtımı bu değişiklikle yapılmadı. Python modelini statik Netlify klasörüne yüklemek çalıştırmaz.

Ses uygulama tarafından dosyaya veya günlüğe yazılmaz; işlem bitince bellek referansları bırakılır. Harici servisin ses saklamaması ayrıca yapılandırılmalıdır. Ağ/işlev sınırları için kayıt en fazla 90 saniye ve istek 4 MiB'dir. Gerçek iPad/PC ses doğruluğu ayrıca test edilmelidir.
