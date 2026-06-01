const AI_PROVIDER = String(process.env.AI_PROVIDER || "").trim().toLowerCase();

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

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

  const files = Array.isArray(payload.files) ? payload.files.slice(0, 12) : [];

  if (!files.length) {
    return jsonResponse(400, { error: "AI okuma icin dosya veya metin bulunamadi." });
  }

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

async function runGemini(files, payload) {
  if (!GEMINI_API_KEY) {
    return jsonResponse(500, {
      error: "Gemini API anahtari eksik. Netlify Environment Variables icine GEMINI_API_KEY ekle.",
    });
  }

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
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: getGeminiErrorMessage(data) || "Gemini API istegi basarisiz oldu.",
      });
    }

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

async function runOpenAi(files, payload) {
  if (!OPENAI_API_KEY) {
    return jsonResponse(500, {
      error: "OpenAI API anahtari eksik. Netlify Environment Variables icine OPENAI_API_KEY ekle.",
    });
  }

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
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: getOpenAiErrorMessage(data) || "OpenAI API istegi basarisiz oldu.",
      });
    }

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

function buildGeminiParts(files, payload) {
  const parts = [{ text: buildPrompt(files, payload) }];

  files.forEach((file, index) => {
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

function buildOpenAiContent(files, payload) {
  const content = [{ type: "input_text", text: buildPrompt(files, payload) }];

  files.forEach((file, index) => {
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

function normalizeModelMovements(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const amount = Math.abs(Number(item.amount));
      const type = String(item.type || "").toLowerCase() === "income" ? "income" : "expense";
      const date = String(item.date || "").trim();
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

function extractGeminiText(data) {
  return String(
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("") || ""
  ).trim();
}

function extractOpenAiText(data) {
  if (data?.output_text) {
    return String(data.output_text).trim();
  }

  const chunks = [];
  const output = Array.isArray(data?.output) ? data.output : [];

  output.forEach((item) => {
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

function parseModelJson(text) {
  const raw = String(text || "").trim();

  if (!raw) {
    return { movements: [] };
  }

  try {
    return JSON.parse(raw);
  } catch {
    const stripped = raw
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const start = stripped.indexOf("{");
    const end = stripped.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return JSON.parse(stripped.slice(start, end + 1));
    }
  }

  return { movements: [] };
}

function getGeminiErrorMessage(data) {
  return data?.error?.message || data?.message || "";
}

function getOpenAiErrorMessage(data) {
  return data?.error?.message || data?.message || "";
}

function cleanSourceName(value) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .slice(0, 80);
}

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
