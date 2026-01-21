export type Base64Mode = "encode" | "decode";
export type Base64Variant = "standard" | "url-safe";

export function encodeBase64(input: string, variant: Base64Variant = "standard"): string {
  if (!input) return "";

  // Encode to Base64
  const encoded = btoa(
    encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );

  if (variant === "url-safe") {
    return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  return encoded;
}

export function decodeBase64(input: string, variant: Base64Variant = "standard"): string {
  if (!input) return "";

  let base64 = input.trim();

  if (variant === "url-safe") {
    // Convert URL-safe characters back
    base64 = base64.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    const padding = base64.length % 4;
    if (padding) {
      base64 += "=".repeat(4 - padding);
    }
  }

  // Decode from Base64
  const decoded = atob(base64);

  // Handle UTF-8
  return decodeURIComponent(
    decoded
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

export function processBase64(
  input: string,
  mode: Base64Mode,
  variant: Base64Variant
): string {
  if (!input.trim()) return "";

  if (mode === "encode") {
    return encodeBase64(input, variant);
  } else {
    return decodeBase64(input, variant);
  }
}

export function isValidBase64(input: string): boolean {
  if (!input.trim()) return true;

  // Standard Base64
  const standardRegex = /^[A-Za-z0-9+/]*={0,2}$/;
  // URL-safe Base64
  const urlSafeRegex = /^[A-Za-z0-9_-]*$/;

  const trimmed = input.trim();
  return standardRegex.test(trimmed) || urlSafeRegex.test(trimmed);
}
