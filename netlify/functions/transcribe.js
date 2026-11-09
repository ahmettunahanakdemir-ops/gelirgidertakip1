const { authenticate, reply } = require("../lib/ai-auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return reply(405, { error: "Yalniz POST desteklenir." });
  if (!await authenticate(event)) return reply(401, { error: "Yeniden oturum aciniz." });
  const key = process.env.OPENAI_API_KEY;
  if (!key) return reply(503, { error: "Mevcut OpenAI API anahtari yapilandirilmamis." });
  const mime = String(event.headers?.["content-type"] || "").toLowerCase();
  const match = mime.match(/^audio\/(webm|mp4|ogg)(;|$)/);
  if (!match) return reply(415, { error: "Ses bicimi desteklenmiyor." });
  if (!event.isBase64Encoded) return reply(400, { error: "Ses verisi gecersiz." });
  if (String(event.body || "").length > 5592408) return reply(413, { error: "Ses kaydi cok buyuk." });
  let audio = Buffer.from(event.body || "", "base64");
  try {
    if (!audio.length || audio.length > 4 * 1024 * 1024) return reply(413, { error: "Ses kaydi bos veya cok buyuk." });
    const form = new FormData();
    form.append("file", new Blob([audio], { type: mime.split(";")[0] }), `recording.${match[1]}`);
    form.append("model", process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe");
    form.append("language", "tr");
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form,
      signal: AbortSignal.timeout(45000),
    });
    if (!response.ok) return reply(response.status === 429 ? 429 : 503, { error: "Ses hizmeti kullanilamiyor. API bakiyesini ve erisimini kontrol edin." });
    const result = await response.json();
    if (typeof result.text !== "string") throw new Error("Invalid transcription");
    return reply(200, { text: result.text.slice(0, 12000) });
  } catch { return reply(503, { error: "Ses cozumleme tamamlanamadi. Yeniden deneyebilirsiniz." }); }
  finally { audio.fill(0); audio = null; event.body = ""; }
};
