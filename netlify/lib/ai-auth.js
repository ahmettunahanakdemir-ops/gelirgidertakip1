const { verify } = require("node:crypto");
let certificates = null;
let expiresAt = 0;
const project = "gelirgideruygulamasi-8c121";

async function authenticate(event) {
  try {
    const parts = String(event.headers?.authorization || event.headers?.Authorization || "").replace(/^Bearer /, "").split(".");
    if (parts.length !== 3) return null;
    const header = JSON.parse(Buffer.from(parts[0], "base64url"));
    const claims = JSON.parse(Buffer.from(parts[1], "base64url"));
    const now = Date.now() / 1000;
    if (header.alg !== "RS256" || typeof header.kid !== "string" ||
        claims.aud !== project || claims.iss !== `https://securetoken.google.com/${project}` ||
        typeof claims.sub !== "string" || !claims.sub || claims.sub.length > 128 ||
        !Number.isFinite(claims.exp) || claims.exp <= now ||
        !Number.isFinite(claims.iat) || claims.iat > now + 60) return null;
    if (!certificates || Date.now() >= expiresAt) {
      const response = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", { signal: AbortSignal.timeout(8000) });
      if (!response.ok) return null;
      certificates = await response.json();
      expiresAt = Date.now() + 300000;
    }
    const cert = Object.hasOwn(certificates, header.kid) && certificates[header.kid];
    return cert && verify("RSA-SHA256", Buffer.from(parts.slice(0, 2).join(".")), cert, Buffer.from(parts[2], "base64url")) ? claims.sub : null;
  } catch { return null; }
}
const reply = (statusCode, data) => ({ statusCode, headers: {
  "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store",
}, body: JSON.stringify(data) });
module.exports = { authenticate, reply };
