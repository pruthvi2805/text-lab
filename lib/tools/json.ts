export interface JsonFormatOptions {
  indent: number;
  sortKeys: boolean;
}

export function formatJson(
  input: string,
  options: JsonFormatOptions = { indent: 2, sortKeys: false }
): string {
  if (!input.trim()) return "";

  const parsed = JSON.parse(input);

  if (options.sortKeys) {
    return JSON.stringify(sortObjectKeys(parsed), null, options.indent);
  }

  return JSON.stringify(parsed, null, options.indent);
}

export function minifyJson(input: string): string {
  if (!input.trim()) return "";
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

export function validateJson(input: string): { valid: boolean; error?: string } {
  if (!input.trim()) return { valid: true };

  try {
    JSON.parse(input);
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Invalid JSON",
    };
  }
}

function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }

  return obj;
}
