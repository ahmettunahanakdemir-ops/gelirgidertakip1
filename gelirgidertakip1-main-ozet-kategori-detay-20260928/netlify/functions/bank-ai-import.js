// ACIKLAMA NOTU: Bu dosyada kod bloklarinin yaninda ne ise yaradiklarini anlatan yorumlar vardir.
// ACIKLAMA: Netlify ortaminda hangi AI saglayicisinin secildigini okur.
const AI_PROVIDER = String(process.env.AI_PROVIDER || "").trim().toLowerCase();

// ACIKLAMA: AI isteginde kullanilacak model adini tutar.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
// ACIKLAMA: Sunucu ortam degiskeninden API anahtarini okur; istemciye gonderilmez.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
// ACIKLAMA: D?? servis isteginin gidecegi API adresini tutar.
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ACIKLAMA: AI isteginde kullanilacak model adini tutar.
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
// ACIKLAMA: Sunucu ortam degiskeninden API anahtarini okur; istemciye gonderilmez.
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
// ACIKLAMA: D?? servis isteginin gidecegi API adresini tutar.
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

// ACIKLAMA: AI cevabinin beklenen JSON yapisini tanimlar.
const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    movements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceName: { type: "string" },
          pageIndex: { type: "integer" },
          rowIndex: { type: "integer" },
          date: { type: "string", description: "ISO date, yyyy-mm-dd" },
          time: { type: "string", description: "HH:mm if visible, empty string otherwise" },
          title: { type: "string" },
          description: { type: "string" },
          type: { type: "string", enum: ["income", "expense"] },
          amount: { type: "number" },
          amountText: { type: "string" },
          currency: { type: "string" },
          balanceText: { type: "string" },
          rawText: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["sourceName", "date", "title", "type", "amount", "rawText"],
      },
    },
    warning: { type: "string" },
  },
  required: ["movements"],
  additionalProperties: false,
};

// ACIKLAMA: Netlify function giris noktasi; HTTP istegini alir, dogrular ve yaniti dondurur.
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Sadece POST istegi desteklenir." });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Gecersiz istek govdesi." });
  }

  // ACIKLAMA: files degiskeninin Turkce karsiligi "dosyalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const files = Array.isArray(payload.files) ? payload.files.slice(0, 12) : [];

  if (!files.length) {
    return jsonResponse(400, { error: "AI okuma icin dosya veya metin bulunamadi." });
  }

  // ACIKLAMA: provider degiskeninin Turkce karsiligi "saglayici"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const provider = resolveProvider();

  if (provider === "openai") {
    return runOpenAi(files, payload);
  }

  if (provider === "gemini") {
    return runGemini(files, payload);
  }

  return jsonResponse(500, {
    error: "AI saglayicisi hazir degil. Netlify Environment Variables icine OPENAI_API_KEY veya GEMINI_API_KEY ekle.",
  });
};

// ACIKLAMA: resolveProvider fonksiyonunun Turkce karsiligi "AI saglayicisini belirle"; ilgili uygulama islemini calistirir.
function resolveProvider() {
  if (AI_PROVIDER === "openai" || AI_PROVIDER === "chatgpt") {
    return OPENAI_API_KEY ? "openai" : "missing";
  }

  if (AI_PROVIDER === "gemini" || AI_PROVIDER === "google") {
    return GEMINI_API_KEY ? "gemini" : "missing";
  }

  if (OPENAI_API_KEY) {
    return "openai";
  }

  if (GEMINI_API_KEY) {
    return "gemini";
  }

  return "missing";
}

// ACIKLAMA: runGemini fonksiyonunun Turkce karsiligi "Gemini istegini calistir"; AI destekli okuma veya API istegi akisini calistirir.
async function runGemini(files, payload) {
  if (!GEMINI_API_KEY) {
    return jsonResponse(500, {
      error: "Gemini API anahtari eksik. Netlify Environment Variables icine GEMINI_API_KEY ekle.",
    });
  }

  // ACIKLAMA: requestBody degiskeninin Turkce karsiligi "istek govdesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: buildGeminiParts(files, payload),
      },
    ],
    generationConfig: {
      temperature: 0.05,
      responseMimeType: "application/json",
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  };

  try {
    // ACIKLAMA: response degiskeninin Turkce karsiligi "yanit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: getGeminiErrorMessage(data) || "Gemini API istegi basarisiz oldu.",
      });
    }

    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = parseModelJson(extractGeminiText(data));
    return jsonResponse(200, {
      provider: "gemini",
      model: GEMINI_MODEL,
      movements: normalizeModelMovements(parsed.movements),
      warning: parsed.warning || "",
    });
  } catch (error) {
    return jsonResponse(500, {
      error: error && error.message ? error.message : "Gemini ile AI okuma sirasinda hata olustu.",
    });
  }
}

// ACIKLAMA: runOpenAi fonksiyonunun Turkce karsiligi "OpenAI istegini calistir"; AI destekli okuma veya API istegi akisini calistirir.
async function runOpenAi(files, payload) {
  if (!OPENAI_API_KEY) {
    return jsonResponse(500, {
      error: "OpenAI API anahtari eksik. Netlify Environment Variables icine OPENAI_API_KEY ekle.",
    });
  }

  // ACIKLAMA: requestBody degiskeninin Turkce karsiligi "istek govdesi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const requestBody = {
    model: OPENAI_MODEL,
    temperature: 0.05,
    input: [
      {
        role: "user",
        content: buildOpenAiContent(files, payload),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bank_movements",
        schema: RESPONSE_SCHEMA,
        strict: false,
      },
    },
  };

  try {
    // ACIKLAMA: response degiskeninin Turkce karsiligi "yanit"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    // ACIKLAMA: data degiskeninin Turkce karsiligi "veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: getOpenAiErrorMessage(data) || "OpenAI API istegi basarisiz oldu.",
      });
    }

    // ACIKLAMA: parsed degiskeninin Turkce karsiligi "cozumlenen veri"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const parsed = parseModelJson(extractOpenAiText(data));
    return jsonResponse(200, {
      provider: "openai",
      model: OPENAI_MODEL,
      movements: normalizeModelMovements(parsed.movements),
      warning: parsed.warning || "",
    });
  } catch (error) {
    return jsonResponse(500, {
      error: error && error.message ? error.message : "OpenAI ile AI okuma sirasinda hata olustu.",
    });
  }
}

// ACIKLAMA: buildPrompt fonksiyonunun Turkce karsiligi "komut metni olustur"; AI isteginde modele gonderilecek talimat metnini olusturur.
function buildPrompt(files, payload) {
  return [
    "Sen bir banka hareketleri ekran goruntusu ve ekstre okuma motorusun.",
    `Bugunun tarihi: ${payload.today || ""}. Yerel saat dilimi: ${payload.timezone || "Europe/Istanbul"}.`,
    `Kaynak sayisi: ${files.length}.`,
    "Gorev: Her kaynakta gorunen gercek islem satirlarini cikar ve yalnizca JSON uret.",
    "JSON bicimi: {\"movements\":[...],\"warning\":\"\"}.",
    "Kurallar:",
    "- Her gercek islem satiri bir hareket olmali. Sayfada 4 hareket gorunuyorsa 4 hareket dondur; fazla veya eksik dondurme.",
    "- Baslik, filtre, tab bar, kullanilabilir bakiye, kalan bakiye, islem sonu bakiye, toplam, limit, hesap numarasi ve kart numarasini hareket sayma.",
    "- 'Kalan Bakiye' veya 'Islem Sonu Bakiye' tutarlari hareket tutari degildir.",
    "- Alt kisimda kesilmis ve tutari/basligi tam gorunmeyen satiri dahil etme.",
    "- Pozitif tutar, GELEN FAST, alacak, iade, mevduat/faiz gelen hareketleri income yap.",
    "- Negatif tutar, GIDEN FAST, odeme, para cekme, komisyon, BSMV, ucret, kesinti hareketleri expense yap.",
    "- Tutar alanini her zaman pozitif sayi yaz; gelir/gider bilgisini type alaninda belirt.",
    "- Tarihi yyyy-mm-dd formatinda, saati HH:mm formatinda dondur. Yil gorunmuyorsa ekrandaki baglami veya bugunun yilini kullan.",
    "- sourceName alanina dosya adini yaz.",
    "- rawText alanina ilgili satirin kisa ham metnini yaz.",
  ].join("\n");
}

// ACIKLAMA: buildGeminiParts fonksiyonunun Turkce karsiligi "Gemini parcalarini olustur"; Gemini istegine eklenecek metin ve dosya parcalarini hazirlar.
function buildGeminiParts(files, payload) {
  // ACIKLAMA: parts degiskeninin Turkce karsiligi "parcalar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const parts = [{ text: buildPrompt(files, payload) }];

  files.forEach((file, index) => {
    // ACIKLAMA: sourceName degiskeninin Turkce karsiligi "kaynak adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const sourceName = cleanSourceName(file.name || `Kaynak ${index + 1}`);
    parts.push({
      text: `Kaynak ${index + 1}: ${sourceName}. Dosya turu: ${file.mimeType || file.kind || "bilinmiyor"}.`,
    });

    if (file.text) {
      parts.push({ text: `Kaynak ${index + 1} metni:\n${String(file.text).slice(0, 70000)}` });
    }

    if (file.data && file.mimeType) {
      parts.push({
        inline_data: {
          mime_type: file.mimeType,
          data: file.data,
        },
      });
    }
  });

  return parts;
}

// ACIKLAMA: buildOpenAiContent fonksiyonunun Turkce karsiligi "OpenAI icerigini olustur"; OpenAI istegine eklenecek metin ve gorsel icerikleri hazirlar.
function buildOpenAiContent(files, payload) {
  // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const content = [{ type: "input_text", text: buildPrompt(files, payload) }];

  files.forEach((file, index) => {
    // ACIKLAMA: sourceName degiskeninin Turkce karsiligi "kaynak adi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const sourceName = cleanSourceName(file.name || `Kaynak ${index + 1}`);
    content.push({
      type: "input_text",
      text: `Kaynak ${index + 1}: ${sourceName}. Dosya turu: ${file.mimeType || file.kind || "bilinmiyor"}.`,
    });

    if (file.text) {
      content.push({ type: "input_text", text: `Kaynak ${index + 1} metni:\n${String(file.text).slice(0, 70000)}` });
    }

    if (file.data && file.mimeType && String(file.mimeType).startsWith("image/")) {
      content.push({
        type: "input_image",
        image_url: `data:${file.mimeType};base64,${file.data}`,
        detail: "high",
      });
    }
  });

  return content;
}

// ACIKLAMA: normalizeModelMovements fonksiyonunun Turkce karsiligi "model hareketlerini standartlastir"; AI modelinden gelen hareketleri uygulamanin bekledigi formata cevirir.
function normalizeModelMovements(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      // ACIKLAMA: amount degiskeninin Turkce karsiligi "tutar"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const amount = Math.abs(Number(item.amount));
      // ACIKLAMA: type degiskeninin Turkce karsiligi "tur"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const type = String(item.type || "").toLowerCase() === "income" ? "income" : "expense";
      // ACIKLAMA: date degiskeninin Turkce karsiligi "tarih"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const date = String(item.date || "").trim();
      // ACIKLAMA: title degiskeninin Turkce karsiligi "baslik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const title = String(item.title || item.description || "").trim();

      if (!date || !title || !Number.isFinite(amount) || amount <= 0) {
        return null;
      }

      return {
        sourceName: cleanSourceName(item.sourceName || "AI"),
        pageIndex: Number.isFinite(Number(item.pageIndex)) ? Number(item.pageIndex) : 1,
        rowIndex: Number.isFinite(Number(item.rowIndex)) ? Number(item.rowIndex) : 0,
        date,
        time: String(item.time || "").trim(),
        title,
        description: String(item.description || "").trim(),
        type,
        amount,
        amountText: String(item.amountText || item.amount || "").trim(),
        currency: String(item.currency || "TRY").trim(),
        balanceText: String(item.balanceText || "").trim(),
        rawText: String(item.rawText || title).trim(),
        confidence: Number.isFinite(Number(item.confidence)) ? Number(item.confidence) : 0.75,
      };
    })
    .filter(Boolean);
}

// ACIKLAMA: extractGeminiText fonksiyonunun Turkce karsiligi "Gemini metnini ayikla"; Gemini cevabindan JSON metnini cikarir.
function extractGeminiText(data) {
  return String(
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || ""
  ).trim();
}

// ACIKLAMA: extractOpenAiText fonksiyonunun Turkce karsiligi "OpenAI metnini ayikla"; OpenAI cevabindan JSON metnini cikarir.
function extractOpenAiText(data) {
  if (data?.output_text) {
    return String(data.output_text).trim();
  }

  // ACIKLAMA: chunks degiskeninin Turkce karsiligi "metin parcalari"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const chunks = [];
  // ACIKLAMA: output degiskeninin Turkce karsiligi "cikti"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const output = Array.isArray(data?.output) ? data.output : [];

  output.forEach((item) => {
    // ACIKLAMA: content degiskeninin Turkce karsiligi "icerik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const content = Array.isArray(item?.content) ? item.content : [];
    content.forEach((part) => {
      if (part?.text) {
        chunks.push(part.text);
      }
      if (part?.type === "output_text" && part?.text) {
        chunks.push(part.text);
      }
    });
  });

  return chunks.join("").trim();
}

// ACIKLAMA: parseModelJson fonksiyonunun Turkce karsiligi "model JSON cevabini cozumle"; modelden gelen JSON metnini guvenli sekilde nesneye cevirir.
function parseModelJson(text) {
  // ACIKLAMA: raw degiskeninin Turkce karsiligi "ham metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const raw = String(text || "").trim();

  if (!raw) {
    return { movements: [] };
  }

  // ACIKLAMA: candidates degiskeninin Turkce karsiligi "aday metinler"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const candidates = [
    raw,
    raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim(),
  ];

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      // ACIKLAMA: objectText degiskeninin Turkce karsiligi "nesne metni"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
      const objectText = extractFirstJsonObject(candidate);
      if (objectText) {
        try {
          return JSON.parse(objectText);
        } catch {
          // Try the next candidate.
        }
      }
    }
  }

  return { movements: [] };
}

// ACIKLAMA: extractFirstJsonObject fonksiyonunun Turkce karsiligi "ilk JSON nesnesini ayikla"; metin icindeki ilk JSON nesnesini bulur.
function extractFirstJsonObject(value) {
  // ACIKLAMA: text degiskeninin Turkce karsiligi "metin"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const text = String(value || "");
  // ACIKLAMA: start degiskeninin Turkce karsiligi "baslangic"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  const start = text.indexOf("{");

  if (start < 0) {
    return "";
  }

  // ACIKLAMA: depth degiskeninin Turkce karsiligi "derinlik"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let depth = 0;
  // ACIKLAMA: inString degiskeninin Turkce karsiligi "metin icinde mi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let inString = false;
  // ACIKLAMA: escaped degiskeninin Turkce karsiligi "kacis karakteri kullanildi mi"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    // ACIKLAMA: char degiskeninin Turkce karsiligi "karakter"; bu bilgiyi saklamak veya ilgili islemi desteklemek icin kullanilir.
    const char = text[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return "";
}

// ACIKLAMA: getGeminiErrorMessage fonksiyonunun Turkce karsiligi "Gemini hata mesajini al"; Gemini hata cevabindan okunabilir hata mesajini alir.
function getGeminiErrorMessage(data) {
  return data?.error?.message || data?.message || "";
}

// ACIKLAMA: getOpenAiErrorMessage fonksiyonunun Turkce karsiligi "OpenAI hata mesajini al"; OpenAI hata cevabindan okunabilir hata mesajini alir.
function getOpenAiErrorMessage(data) {
  return data?.error?.message || data?.message || "";
}

// ACIKLAMA: cleanSourceName fonksiyonunun Turkce karsiligi "kaynak adini temizle"; ilgili uygulama islemini calistirir.
function cleanSourceName(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .slice(0, 80);
}

// ACIKLAMA: jsonResponse fonksiyonunun Turkce karsiligi "JSON yaniti olustur"; ilgili uygulama islemini calistirir.
function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: statusCode === 204 ? "" : JSON.stringify(body),
  };
}
