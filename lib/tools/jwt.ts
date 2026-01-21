export interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

export function decodeJwt(token: string): JwtParts {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new Error("Please enter a JWT token");
  }

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
  }

  const [headerB64, payloadB64, signature] = parts;

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(headerB64));
  } catch {
    throw new Error("Failed to decode JWT header. Invalid Base64 or JSON.");
  }

  try {
    payload = JSON.parse(base64UrlDecode(payloadB64));
  } catch {
    throw new Error("Failed to decode JWT payload. Invalid Base64 or JSON.");
  }

  const result: JwtParts = {
    header,
    payload,
    signature,
  };

  // Check expiration
  if (typeof payload.exp === "number") {
    result.expiresAt = new Date(payload.exp * 1000);
    result.isExpired = Date.now() > payload.exp * 1000;
  }

  // Check issued at
  if (typeof payload.iat === "number") {
    result.issuedAt = new Date(payload.iat * 1000);
  }

  return result;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  // Decode
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function formatJwtOutput(parts: JwtParts): string {
  const lines: string[] = [];

  lines.push("=== HEADER ===");
  lines.push(JSON.stringify(parts.header, null, 2));
  lines.push("");
  lines.push("=== PAYLOAD ===");
  lines.push(JSON.stringify(parts.payload, null, 2));
  lines.push("");

  if (parts.expiresAt) {
    lines.push("=== EXPIRATION ===");
    lines.push(`Expires: ${parts.expiresAt.toISOString()}`);
    lines.push(`Status: ${parts.isExpired ? "EXPIRED" : "Valid"}`);
    lines.push("");
  }

  if (parts.issuedAt) {
    lines.push("=== ISSUED ===");
    lines.push(`Issued At: ${parts.issuedAt.toISOString()}`);
    lines.push("");
  }

  lines.push("=== SIGNATURE ===");
  lines.push(parts.signature);
  lines.push("");
  lines.push("Note: This decoder does not verify the signature.");

  return lines.join("\n");
}
