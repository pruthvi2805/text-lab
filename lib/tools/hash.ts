export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

export interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
  hashUppercase: string;
}

/**
 * Generate hash of input text using Web Crypto API
 * Note: MD5 is not supported by Web Crypto API, so we implement it manually
 */
export async function generateHash(
  input: string,
  algorithm: HashAlgorithm
): Promise<HashResult> {
  if (!input) {
    throw new Error("Please enter text to hash");
  }

  let hashHex: string;

  if (algorithm === "MD5") {
    hashHex = md5(input);
  } else {
    // Use Web Crypto API for SHA algorithms
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const cryptoAlgorithm = algorithm.replace("-", ""); // "SHA-256" -> "SHA256"
    const hashBuffer = await crypto.subtle.digest(cryptoAlgorithm, data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return {
    algorithm,
    hash: hashHex.toLowerCase(),
    hashUppercase: hashHex.toUpperCase(),
  };
}

/**
 * Generate all hashes at once
 */
export async function generateAllHashes(input: string): Promise<HashResult[]> {
  if (!input) {
    throw new Error("Please enter text to hash");
  }

  const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];
  const results = await Promise.all(
    algorithms.map((algo) => generateHash(input, algo))
  );

  return results;
}

/**
 * Format hash results for display
 */
export function formatHashResults(results: HashResult[]): string {
  const lines: string[] = [];

  for (const result of results) {
    lines.push(`=== ${result.algorithm} ===`);
    lines.push(result.hash);
    lines.push("");
  }

  return lines.join("\n").trim();
}

// MD5 implementation (Web Crypto doesn't support MD5)
// Based on RFC 1321 - https://www.ietf.org/rfc/rfc1321.txt
function md5(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  // Convert to word array
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(
      (bytes[i] || 0) |
        ((bytes[i + 1] || 0) << 8) |
        ((bytes[i + 2] || 0) << 16) |
        ((bytes[i + 3] || 0) << 24)
    );
  }

  // Padding
  const bitLength = bytes.length * 8;
  words[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);

  const paddedLength = ((bytes.length + 8) >> 6) + 1;
  while (words.length < paddedLength * 16 - 2) {
    words.push(0);
  }
  words.push(bitLength >>> 0);
  words.push(Math.floor(bitLength / 0x100000000));

  // Constants
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const K: number[] = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }

  // Initial hash values
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  // Process each 512-bit chunk
  for (let chunk = 0; chunk < words.length; chunk += 16) {
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number;
      let g: number;

      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      F = (F + A + K[i] + words[chunk + g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + ((F << S[i]) | (F >>> (32 - S[i])))) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  // Convert to hex string
  const toHex = (n: number) =>
    [0, 8, 16, 24]
      .map((s) => ((n >>> s) & 0xff).toString(16).padStart(2, "0"))
      .join("");

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export const hashAlgorithms: { value: HashAlgorithm; label: string; bits: number }[] = [
  { value: "MD5", label: "MD5", bits: 128 },
  { value: "SHA-1", label: "SHA-1", bits: 160 },
  { value: "SHA-256", label: "SHA-256", bits: 256 },
  { value: "SHA-512", label: "SHA-512", bits: 512 },
];
