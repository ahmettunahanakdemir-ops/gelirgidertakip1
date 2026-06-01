const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Sadece POST isteği desteklenir." });
  }

  if (!GEMINI_API_KEY) {
    return jsonResponse(500, {
      error: "Gemini API anahtarı eksik. Netlify Environment Variables içine GEMINI_API_KEY ekle.",
    });
  }

  let payload;

  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Geçersiz istek gövdesi." });
  }

  const files = Array.isArray(payload.files) ? payload.files.slice(0, 12) : [];

  if (!files.length) {
    return jsonResponse(400, { error: "AI okuma için dosya veya metin bulunamadı." });
  }

  const parts = buildGeminiParts(files, payload);
  const requestBody = {
    contents: [
      {
        role: "user",
        parts,
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
        error: getGeminiErrorMessage(data) || "Gemini API isteği başarısız oldu.",
      });
    }

    const modelText = extractGeminiText(data);
    const parsed = parseModelJson(modelText);
    const movements = normalizeModelMovements(parsed.movements);

    return jsonResponse(200, {
      model: GEMINI_MODEL,
      movements,
      warning: parsed.warning || "",
    });
  } catch (error) {
    return jsonResponse(500, {
      error: error && error.message ? error.message : "AI okuma sırasında hata oluştu.",
    });
  }
};

function buildGeminiParts(files, payload) {
  const prompt = [
    "Sen bir banka hareketleri ekran görüntüsü ve ekstre okuma motorusun.",
    `Bugünün tarihi: ${payload.today || ""}. Yerel saat dilimi: ${payload.timezone || "Europe/Istanbul"}.`,
    "Görev: Her kaynakta görünen gerçek işlem satırlarını çıkar ve yalnızca JSON üret.",
    "Kurallar:",
    "- Her gerçek işlem satırı bir hareket olmalı. Sayfada 4 hareket görünüyorsa 4 hareket döndür; fazla veya eksik döndürme.",
    "- Başlık, filtre, tab bar, kullanılabilir bakiye, kalan bakiye, işlem sonu bakiye, toplam, limit, hesap numarası ve kart numarasını hareket sayma.",
    "- 'Kalan Bakiye' veya 'İşlem Sonu Bakiye' tutarları hareket tutarı değildir.",
    "- Alt kısımda kesilmiş ve tutarı/başlığı tam görünmeyen satırı dahil etme.",
    "- Pozitif tutar, GELEN FAST, alacak, iade, mevduat/faiz gelen hareketleri income yap.",
    "- Negatif tutar, GİDEN FAST, ödeme, para çekme, komisyon, BSMV, ücret, kesinti hareketleri expense yap.",
    "- Tutarı sayı olarak pozitif yaz; gelir/gider bilgisini type alanında belirt.",
    "- Tarihi yyyy-mm-dd formatında, saati HH:mm formatında döndür. Yıl görünmüyorsa ekrandaki bağlamı veya bugünün yılını kullan.",
    "- rawText alanına ilgili satırın kısa ham metnini yaz.",
  ].join("\n");
  const parts = [{ text: prompt }];

  files.forEach((file, index) => {
    const sourceName = cleanSourceName(file.name || `Kaynak ${index + 1}`);
    parts.push({
      text: `Kaynak ${index + 1}: ${sourceName}. Dosya türü: ${file.mimeType || file.kind || "bilinmiyor"}.`,
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
