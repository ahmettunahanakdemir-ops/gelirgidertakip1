# OpenAI / ChatGPT banka okuma kurulumu

Bu surumde banka hareketi okuma fonksiyonu Gemini ve OpenAI destekler.

## Netlify ortam degiskenleri

Netlify panelinde sitenin ayarlarindan su degiskenleri ekle:

```text
AI_PROVIDER=openai
OPENAI_API_KEY=OpenAI platformundan aldigin API anahtari
OPENAI_MODEL=gpt-4.1-mini
```

`AI_PROVIDER=openai` yazarsan uygulama Gemini yerine OpenAI kullanir.

## Gemini'ye geri donmek istersen

```text
AI_PROVIDER=gemini
GEMINI_API_KEY=Google AI Studio anahtarin
GEMINI_MODEL=gemini-2.5-flash-lite
```

## Not

ChatGPT Plus aboneligi API anahtari yerine gecmez. Uygulamada kullanmak icin OpenAI Platform uzerinden API key olusturman ve hesapta API kredisi/billing bulunmasi gerekir.
