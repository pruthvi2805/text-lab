export type UUIDVersion = "v4" | "v7" | "nil";

export interface UUIDResult {
  uuid: string;
  version: UUIDVersion;
  uppercase: string;
  noDashes: string;
  urn: string;
}

/**
 * Generate a UUID based on the specified version
 */
export function generateUUID(version: UUIDVersion = "v4"): UUIDResult {
  let uuid: string;

  switch (version) {
    case "v4":
      uuid = generateUUIDv4();
      break;
    case "v7":
      uuid = generateUUIDv7();
      break;
    case "nil":
      uuid = "00000000-0000-0000-0000-000000000000";
      break;
    default:
      uuid = generateUUIDv4();
  }

  return {
    uuid,
    version,
    uppercase: uuid.toUpperCase(),
    noDashes: uuid.replace(/-/g, ""),
    urn: `urn:uuid:${uuid}`,
  };
}

/**
 * Generate multiple UUIDs at once
 */
export function generateMultipleUUIDs(
  count: number,
  version: UUIDVersion = "v4"
): UUIDResult[] {
  if (count < 1) count = 1;
  if (count > 1000) count = 1000; // Reasonable limit

  const results: UUIDResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateUUID(version));
  }
  return results;
}

/**
 * Validate a UUID string
 */
export function validateUUID(input: string): {
  valid: boolean;
  version: string | null;
  error: string | null;
} {
  const trimmed = input.trim().toLowerCase();

  // Remove URN prefix if present
  const uuid = trimmed.replace(/^urn:uuid:/i, "");

  // Standard UUID regex
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // No-dash format
  const noDashRegex = /^[0-9a-f]{32}$/i;

  let normalizedUUID = uuid;

  if (noDashRegex.test(uuid)) {
    // Convert no-dash format to standard format
    normalizedUUID = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
  }

  if (!uuidRegex.test(normalizedUUID)) {
    return {
      valid: false,
      version: null,
      error: "Invalid UUID format. Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    };
  }

  // Determine version from the version nibble (13th character, after removing dashes)
  const versionChar = normalizedUUID.charAt(14);
  let version: string;

  switch (versionChar) {
    case "1":
      version = "Version 1 (time-based)";
      break;
    case "2":
      version = "Version 2 (DCE security)";
      break;
    case "3":
      version = "Version 3 (MD5 hash)";
      break;
    case "4":
      version = "Version 4 (random)";
      break;
    case "5":
      version = "Version 5 (SHA-1 hash)";
      break;
    case "6":
      version = "Version 6 (reordered time-based)";
      break;
    case "7":
      version = "Version 7 (Unix timestamp)";
      break;
    case "8":
      version = "Version 8 (custom)";
      break;
    case "0":
      if (normalizedUUID === "00000000-0000-0000-0000-000000000000") {
        version = "Nil UUID";
      } else {
        version = "Unknown version";
      }
      break;
    default:
      version = "Unknown version";
  }

  // Check variant (17th character position after removing dashes)
  const variantChar = normalizedUUID.charAt(19);
  const variantValue = parseInt(variantChar, 16);

  let variantInfo = "";
  if ((variantValue & 0x8) === 0) {
    variantInfo = " (NCS backward compatibility)";
  } else if ((variantValue & 0xc) === 0x8) {
    variantInfo = " (RFC 4122/9562)";
  } else if ((variantValue & 0xe) === 0xc) {
    variantInfo = " (Microsoft GUID)";
  } else {
    variantInfo = " (Reserved)";
  }

  return {
    valid: true,
    version: version + variantInfo,
    error: null,
  };
}

/**
 * Parse a UUID and extract components
 */
export function parseUUID(input: string): {
  valid: boolean;
  normalized: string;
  version: string | null;
  timestamp: Date | null;
  error: string | null;
} {
  const validation = validateUUID(input);

  if (!validation.valid) {
    return {
      valid: false,
      normalized: "",
      version: null,
      timestamp: null,
      error: validation.error,
    };
  }

  const trimmed = input.trim().toLowerCase().replace(/^urn:uuid:/i, "");
  let normalized = trimmed;

  // Convert no-dash to standard format
  if (/^[0-9a-f]{32}$/i.test(trimmed)) {
    normalized = `${trimmed.slice(0, 8)}-${trimmed.slice(8, 12)}-${trimmed.slice(12, 16)}-${trimmed.slice(16, 20)}-${trimmed.slice(20)}`;
  }

  // Try to extract timestamp from v1, v6, or v7 UUIDs
  let timestamp: Date | null = null;
  const versionChar = normalized.charAt(14);

  if (versionChar === "7") {
    // UUID v7: first 48 bits are Unix timestamp in milliseconds
    const hexTimestamp = normalized.replace(/-/g, "").slice(0, 12);
    const ms = parseInt(hexTimestamp, 16);
    timestamp = new Date(ms);
  } else if (versionChar === "1") {
    // UUID v1: time is split across first three sections
    const timeLow = normalized.slice(0, 8);
    const timeMid = normalized.slice(9, 13);
    const timeHigh = normalized.slice(15, 19);
    const timestamp100ns = BigInt(`0x${timeHigh}${timeMid}${timeLow}`);
    // Convert from 100-nanosecond intervals since Oct 15, 1582 to milliseconds since Jan 1, 1970
    const epochDiff = BigInt("122192928000000000"); // 100-ns intervals between 1582-10-15 and 1970-01-01
    const ms = Number((timestamp100ns - epochDiff) / BigInt(10000));
    if (ms > 0 && ms < Date.now() + 315360000000) {
      // Sanity check: within reasonable range
      timestamp = new Date(ms);
    }
  }

  return {
    valid: true,
    normalized,
    version: validation.version,
    timestamp,
    error: null,
  };
}

/**
 * Format UUID results for display
 */
export function formatUUIDOutput(results: UUIDResult[]): string {
  if (results.length === 1) {
    const r = results[0];
    const lines = [
      `=== UUID ${r.version.toUpperCase()} ===`,
      "",
      `Standard:   ${r.uuid}`,
      `Uppercase:  ${r.uppercase}`,
      `No dashes:  ${r.noDashes}`,
      `URN:        ${r.urn}`,
    ];
    return lines.join("\n");
  }

  // Multiple UUIDs - just list them
  return results.map((r) => r.uuid).join("\n");
}

/**
 * Format validation/parse result for display
 */
export function formatParseOutput(result: ReturnType<typeof parseUUID>): string {
  if (!result.valid) {
    return `Error: ${result.error}`;
  }

  const lines = [
    `=== UUID ANALYSIS ===`,
    "",
    `Valid:      Yes`,
    `Normalized: ${result.normalized}`,
    `Version:    ${result.version}`,
  ];

  if (result.timestamp) {
    lines.push(`Timestamp:  ${result.timestamp.toISOString()}`);
    lines.push(`            ${result.timestamp.toLocaleString()}`);
  }

  return lines.join("\n");
}

// === Internal helper functions ===

/**
 * Generate a random UUID v4
 */
function generateUUIDv4(): string {
  // Use crypto.getRandomValues for cryptographically secure random numbers
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version (4) in the 7th byte
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // Set variant (10xx) in the 9th byte
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatBytes(bytes);
}

/**
 * Generate a UUID v7 (Unix timestamp-based)
 */
function generateUUIDv7(): string {
  const bytes = new Uint8Array(16);
  const now = Date.now();

  // First 48 bits: Unix timestamp in milliseconds
  bytes[0] = (now / 0x10000000000) & 0xff;
  bytes[1] = (now / 0x100000000) & 0xff;
  bytes[2] = (now / 0x1000000) & 0xff;
  bytes[3] = (now / 0x10000) & 0xff;
  bytes[4] = (now / 0x100) & 0xff;
  bytes[5] = now & 0xff;

  // Random bytes for the rest
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  bytes.set(randomBytes, 6);

  // Set version (7) in the 7th byte
  bytes[6] = (bytes[6] & 0x0f) | 0x70;

  // Set variant (10xx) in the 9th byte
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return formatBytes(bytes);
}

/**
 * Format byte array as UUID string
 */
function formatBytes(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const uuidVersions: { value: UUIDVersion; label: string; description: string }[] = [
  { value: "v4", label: "v4 (Random)", description: "Randomly generated - most common" },
  { value: "v7", label: "v7 (Timestamp)", description: "Unix timestamp + random - sortable" },
  { value: "nil", label: "Nil", description: "All zeros - special null value" },
];
