export type EntityMode = "encode" | "decode";
export type EntityFormat = "named" | "numeric" | "hex";

export interface EntityResult {
  output: string;
  mode: EntityMode;
  format?: EntityFormat;
  stats: {
    processed: number;
    unchanged: number;
  };
}

// Common HTML entities mapping
const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;", // &apos; is not universally supported
  " ": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "¼": "&frac14;",
  "½": "&frac12;",
  "¾": "&frac34;",
  "²": "&sup2;",
  "³": "&sup3;",
  "¹": "&sup1;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "↔": "&harr;",
  "•": "&bull;",
  "…": "&hellip;",
  "—": "&mdash;",
  "–": "&ndash;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "¶": "&para;",
  "†": "&dagger;",
  "‡": "&Dagger;",
  "∞": "&infin;",
  "≠": "&ne;",
  "≤": "&le;",
  "≥": "&ge;",
  "≈": "&asymp;",
  "√": "&radic;",
  "∑": "&sum;",
  "∏": "&prod;",
  "∫": "&int;",
  "π": "&pi;",
  "Ω": "&Omega;",
  "α": "&alpha;",
  "β": "&beta;",
  "γ": "&gamma;",
  "δ": "&delta;",
  "ε": "&epsilon;",
  "θ": "&theta;",
  "λ": "&lambda;",
  "μ": "&mu;",
  "σ": "&sigma;",
  "φ": "&phi;",
  "ω": "&omega;",
};

// Build reverse mapping for decoding
const ENTITY_TO_CHAR: Record<string, string> = {};
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) {
  ENTITY_TO_CHAR[entity.toLowerCase()] = char;
}
// Add some additional entities for decoding
ENTITY_TO_CHAR["&apos;"] = "'";
ENTITY_TO_CHAR["&nbsp;"] = " ";

/**
 * Encode text to HTML entities
 */
export function encodeEntities(
  input: string,
  format: EntityFormat = "named"
): EntityResult {
  if (!input) {
    return {
      output: "",
      mode: "encode",
      format,
      stats: { processed: 0, unchanged: 0 },
    };
  }

  let processed = 0;
  let unchanged = 0;

  const output = Array.from(input)
    .map((char) => {
      const code = char.charCodeAt(0);

      // Always encode basic HTML chars
      if (char === "&" || char === "<" || char === ">" || char === '"') {
        processed++;
        switch (format) {
          case "named":
            return NAMED_ENTITIES[char];
          case "numeric":
            return `&#${code};`;
          case "hex":
            return `&#x${code.toString(16).toUpperCase()};`;
        }
      }

      // Check if char is in our named entities
      if (format === "named" && NAMED_ENTITIES[char]) {
        processed++;
        return NAMED_ENTITIES[char];
      }

      // For non-ASCII characters
      if (code > 127) {
        processed++;
        switch (format) {
          case "named":
            // Fall back to numeric if no named entity
            return NAMED_ENTITIES[char] || `&#${code};`;
          case "numeric":
            return `&#${code};`;
          case "hex":
            return `&#x${code.toString(16).toUpperCase()};`;
        }
      }

      unchanged++;
      return char;
    })
    .join("");

  return {
    output,
    mode: "encode",
    format,
    stats: { processed, unchanged },
  };
}

/**
 * Decode HTML entities to text
 */
export function decodeEntities(input: string): EntityResult {
  if (!input) {
    return {
      output: "",
      mode: "decode",
      stats: { processed: 0, unchanged: 0 },
    };
  }

  let processed = 0;

  // Decode named entities
  let output = input.replace(/&[a-zA-Z]+;/g, (entity) => {
    const lower = entity.toLowerCase();
    if (ENTITY_TO_CHAR[lower]) {
      processed++;
      return ENTITY_TO_CHAR[lower];
    }
    return entity;
  });

  // Decode numeric entities (decimal)
  output = output.replace(/&#(\d+);/g, (_, code) => {
    processed++;
    return String.fromCharCode(parseInt(code, 10));
  });

  // Decode hex entities
  output = output.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    processed++;
    return String.fromCharCode(parseInt(hex, 16));
  });

  return {
    output,
    mode: "decode",
    stats: {
      processed,
      unchanged: input.length - processed,
    },
  };
}

/**
 * Encode only the essential HTML characters
 * Used for safe HTML content embedding
 */
export function encodeMinimal(input: string): EntityResult {
  if (!input) {
    return {
      output: "",
      mode: "encode",
      stats: { processed: 0, unchanged: 0 },
    };
  }

  let processed = 0;

  const output = input.replace(/[&<>"']/g, (char) => {
    processed++;
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });

  return {
    output,
    mode: "encode",
    stats: {
      processed,
      unchanged: input.length - processed,
    },
  };
}

/**
 * Encode all non-ASCII characters
 */
export function encodeAllNonASCII(
  input: string,
  format: EntityFormat = "numeric"
): EntityResult {
  if (!input) {
    return {
      output: "",
      mode: "encode",
      format,
      stats: { processed: 0, unchanged: 0 },
    };
  }

  let processed = 0;
  let unchanged = 0;

  const output = Array.from(input)
    .map((char) => {
      const code = char.charCodeAt(0);

      // Encode if non-ASCII or special HTML char
      if (code > 127 || char === "&" || char === "<" || char === ">" || char === '"') {
        processed++;
        if (format === "hex") {
          return `&#x${code.toString(16).toUpperCase()};`;
        }
        return `&#${code};`;
      }

      unchanged++;
      return char;
    })
    .join("");

  return {
    output,
    mode: "encode",
    format,
    stats: { processed, unchanged },
  };
}

/**
 * Format result for display
 */
export function formatEntityOutput(result: EntityResult): string {
  const lines = [result.output];

  if (result.stats.processed > 0 || result.stats.unchanged > 0) {
    lines.push("");
    lines.push("---");
    lines.push(`Mode: ${result.mode === "encode" ? "Encode" : "Decode"}`);
    if (result.format) {
      lines.push(`Format: ${result.format}`);
    }
    lines.push(`Processed: ${result.stats.processed} characters`);
    lines.push(`Unchanged: ${result.stats.unchanged} characters`);
  }

  return lines.join("\n");
}

export const entityModes: { value: EntityMode; label: string }[] = [
  { value: "encode", label: "Encode" },
  { value: "decode", label: "Decode" },
];

export const entityFormats: { value: EntityFormat; label: string; description: string }[] = [
  { value: "named", label: "Named", description: "&amp; &copy; &euro;" },
  { value: "numeric", label: "Numeric", description: "&#38; &#169; &#8364;" },
  { value: "hex", label: "Hexadecimal", description: "&#x26; &#xA9; &#x20AC;" },
];

export const commonEntities: { char: string; named: string; code: number; description: string }[] = [
  { char: "&", named: "&amp;", code: 38, description: "Ampersand" },
  { char: "<", named: "&lt;", code: 60, description: "Less than" },
  { char: ">", named: "&gt;", code: 62, description: "Greater than" },
  { char: '"', named: "&quot;", code: 34, description: "Double quote" },
  { char: "'", named: "&#39;", code: 39, description: "Single quote" },
  { char: " ", named: "&nbsp;", code: 160, description: "Non-breaking space" },
  { char: "©", named: "&copy;", code: 169, description: "Copyright" },
  { char: "®", named: "&reg;", code: 174, description: "Registered" },
  { char: "™", named: "&trade;", code: 8482, description: "Trademark" },
  { char: "€", named: "&euro;", code: 8364, description: "Euro" },
  { char: "£", named: "&pound;", code: 163, description: "Pound" },
  { char: "—", named: "&mdash;", code: 8212, description: "Em dash" },
  { char: "–", named: "&ndash;", code: 8211, description: "En dash" },
  { char: "…", named: "&hellip;", code: 8230, description: "Ellipsis" },
];
