const crypto = require("crypto");

const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const RESEND_FROM = String(process.env.RESEND_FROM || "Akış Bütçe <onboarding@resend.dev>").trim();
const DELETE_CODE_SECRET = String(process.env.DELETE_CODE_SECRET || RESEND_API_KEY || "").trim();
const CODE_TTL_MS = 10 * 60 * 1000;
const VERIFIED_TTL_MS = 5 * 60 * 1000;

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return jsonResponse(204, {});
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Sadece POST isteği desteklenir." });

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Geçersiz istek gövdesi." });
  }

  const action = String(payload.action || "").trim().toLowerCase();
  const email = normalizeEmail(payload.email);
  const uid = String(payload.uid || "").trim();

  if (!email || !isValidEmail(email) || !uid) {
    return jsonResponse(400, { error: "Kullanıcı e-posta bilgisi doğrulanamadı." });
  }

  if (!DELETE_CODE_SECRET) {
    return jsonResponse(500, { error: "E-posta doğrulaması için DELETE_CODE_SECRET veya RESEND_API_KEY ayarlanmamış." });
  }

  if (action === "request") return requestCode(email, uid);
  if (action === "verify") return verifyCode(email, uid, payload);
  return jsonResponse(400, { error: "Desteklenmeyen doğrulama işlemi." });
};

async function requestCode(email, uid) {
  if (!RESEND_API_KEY) {
    return jsonResponse(500, { error: "Doğrulama kodu göndermek için Netlify ortamına RESEND_API_KEY eklenmeli." });
  }

  const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
  const nonce = crypto.randomBytes(18).toString("base64url");
  const exp = Date.now() + CODE_TTL_MS;
  const codeHash = sha256(`${code}|${email}|${uid}|${nonce}|${exp}`);
  const challenge = signPayload({ type: "delete-code", email, uid, nonce, exp, codeHash });

  const mailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: "Akış Bütçe hesap silme doğrulama kodu",
      text: `Akış Bütçe hesap silme doğrulama kodun: ${code}\n\nBu kod 10 dakika geçerlidir. Bu işlemi sen başlatmadıysan kodu kimseyle paylaşma.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#162625">
          <h2 style="margin:0 0 16px">Hesap silme doğrulaması</h2>
          <p>Akış Bütçe hesabını silme işlemini doğrulamak için aşağıdaki kodu kullan:</p>
          <div style="font-size:32px;font-weight:800;letter-spacing:8px;padding:18px 20px;background:#f2f6f6;border-radius:14px;text-align:center;margin:22px 0">${code}</div>
          <p style="color:#677575">Kod 10 dakika geçerlidir. Bu işlemi sen başlatmadıysan kodu kimseyle paylaşma.</p>
        </div>`,
    }),
  });

  const mailData = await mailResponse.json().catch(() => ({}));
  if (!mailResponse.ok) {
    return jsonResponse(mailResponse.status || 500, {
      error: mailData?.message || mailData?.error?.message || "Doğrulama e-postası gönderilemedi.",
    });
  }

  return jsonResponse(200, { ok: true, challenge, expiresIn: 600 });
}

async function verifyCode(email, uid, payload) {
  const code = String(payload.code || "").replace(/\D/g, "").slice(0, 6);
  const challenge = String(payload.challenge || "").trim();
  if (code.length !== 6 || !challenge) {
    return jsonResponse(400, { error: "6 haneli doğrulama kodunu gir." });
  }

  const parsed = verifySignedPayload(challenge);
  if (!parsed || parsed.type !== "delete-code") {
    return jsonResponse(400, { error: "Doğrulama isteği geçersiz. Yeni kod iste." });
  }
  if (parsed.email !== email || parsed.uid !== uid) {
    return jsonResponse(403, { error: "Doğrulama kodu bu hesaba ait değil." });
  }
  if (!Number.isFinite(parsed.exp) || Date.now() > parsed.exp) {
    return jsonResponse(410, { error: "Doğrulama kodunun süresi doldu. Yeni kod iste." });
  }

  const expectedHash = sha256(`${code}|${email}|${uid}|${parsed.nonce}|${parsed.exp}`);
  if (!safeEqual(expectedHash, parsed.codeHash)) {
    return jsonResponse(401, { error: "Doğrulama kodu yanlış." });
  }

  const verifiedToken = signPayload({
    type: "delete-verified",
    email,
    uid,
    exp: Date.now() + VERIFIED_TTL_MS,
    nonce: crypto.randomBytes(16).toString("base64url"),
  });
  return jsonResponse(200, { verified: true, verifiedToken, expiresIn: 300 });
}

function signPayload(payload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", DELETE_CODE_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySignedPayload(token) {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", DELETE_CODE_SECRET).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 254);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: statusCode === 204 ? "" : JSON.stringify(body),
  };
}
