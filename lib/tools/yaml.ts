export type ConversionDirection = "yaml-to-json" | "json-to-yaml";

export interface ConversionResult {
  output: string;
  direction: ConversionDirection;
  inputFormat: "YAML" | "JSON";
  outputFormat: "YAML" | "JSON";
}

/**
 * Convert between YAML and JSON formats
 * Pure client-side implementation without external dependencies
 */
export function convert(
  input: string,
  direction: ConversionDirection
): ConversionResult {
  if (!input.trim()) {
    throw new Error("Please enter YAML or JSON to convert");
  }

  if (direction === "yaml-to-json") {
    const parsed = parseYAML(input);
    const output = JSON.stringify(parsed, null, 2);
    return {
      output,
      direction,
      inputFormat: "YAML",
      outputFormat: "JSON",
    };
  } else {
    const parsed = JSON.parse(input);
    const output = stringifyYAML(parsed);
    return {
      output,
      direction,
      inputFormat: "JSON",
      outputFormat: "YAML",
    };
  }
}

/**
 * Auto-detect format and convert to the other
 */
export function autoConvert(input: string): ConversionResult {
  if (!input.trim()) {
    throw new Error("Please enter YAML or JSON to convert");
  }

  // Try JSON first (stricter format)
  try {
    JSON.parse(input);
    // If it parses as JSON, convert to YAML
    return convert(input, "json-to-yaml");
  } catch {
    // Not JSON, try YAML
    try {
      parseYAML(input);
      return convert(input, "yaml-to-json");
    } catch (yamlError) {
      throw new Error(
        `Could not parse input as JSON or YAML: ${yamlError instanceof Error ? yamlError.message : "Unknown error"}`
      );
    }
  }
}

/**
 * Simple YAML parser - handles common YAML features
 * Supports: objects, arrays, strings, numbers, booleans, null, multiline strings
 */
function parseYAML(yaml: string): unknown {
  const lines = yaml.split("\n");
  let index = 0;

  function getIndent(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  function parseLine(line: string): { key: string | null; value: string; isArrayItem: boolean } {
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      const rest = trimmed.slice(2);
      const colonIndex = rest.indexOf(": ");
      if (colonIndex > 0 && !rest.startsWith('"') && !rest.startsWith("'")) {
        return { key: rest.slice(0, colonIndex), value: rest.slice(colonIndex + 2), isArrayItem: true };
      }
      return { key: null, value: rest, isArrayItem: true };
    }

    // Key-value pair
    const colonIndex = trimmed.indexOf(": ");
    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex);
      const value = trimmed.slice(colonIndex + 2);
      return { key, value, isArrayItem: false };
    }

    // Just a key with no value (nested object)
    if (trimmed.endsWith(":")) {
      return { key: trimmed.slice(0, -1), value: "", isArrayItem: false };
    }

    return { key: null, value: trimmed, isArrayItem: false };
  }

  function parseValue(value: string): unknown {
    const trimmed = value.trim();

    // Empty
    if (trimmed === "" || trimmed === "~") return null;

    // Null
    if (trimmed === "null" || trimmed === "Null" || trimmed === "NULL") return null;

    // Boolean
    if (trimmed === "true" || trimmed === "True" || trimmed === "TRUE") return true;
    if (trimmed === "false" || trimmed === "False" || trimmed === "FALSE") return false;

    // Quoted string
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }

    // Number
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if (/^-?\d+\.?\d*e[+-]?\d+$/i.test(trimmed)) return parseFloat(trimmed);

    // Inline array [a, b, c]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1);
      if (inner.trim() === "") return [];
      return inner.split(",").map((item) => parseValue(item.trim()));
    }

    // Inline object {a: 1, b: 2}
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const inner = trimmed.slice(1, -1);
      if (inner.trim() === "") return {};
      const obj: Record<string, unknown> = {};
      const pairs = inner.split(",");
      for (const pair of pairs) {
        const colonIdx = pair.indexOf(":");
        if (colonIdx > 0) {
          const key = pair.slice(0, colonIdx).trim();
          const val = pair.slice(colonIdx + 1).trim();
          obj[key] = parseValue(val);
        }
      }
      return obj;
    }

    // Plain string
    return trimmed;
  }

  function parseBlock(baseIndent: number): unknown {
    // Skip empty lines and comments
    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();
      if (trimmed === "" || trimmed.startsWith("#")) {
        index++;
        continue;
      }
      break;
    }

    if (index >= lines.length) return null;

    const firstLine = lines[index];
    const firstTrimmed = firstLine.trim();

    // Check if it's an array
    if (firstTrimmed.startsWith("- ")) {
      const arr: unknown[] = [];

      while (index < lines.length) {
        const line = lines[index];
        const trimmed = line.trim();

        if (trimmed === "" || trimmed.startsWith("#")) {
          index++;
          continue;
        }

        const indent = getIndent(line);
        if (indent < baseIndent) break;

        if (!trimmed.startsWith("- ")) {
          break;
        }

        index++;
        const { key, value, isArrayItem } = parseLine(trimmed);

        if (isArrayItem && key !== null) {
          // Array item is an object: - key: value
          const obj: Record<string, unknown> = {};
          obj[key] = value === "" ? parseBlock(indent + 2) : parseValue(value);

          // Check for more keys at the same level
          while (index < lines.length) {
            const nextLine = lines[index];
            const nextTrimmed = nextLine.trim();
            if (nextTrimmed === "" || nextTrimmed.startsWith("#")) {
              index++;
              continue;
            }
            const nextIndent = getIndent(nextLine);
            if (nextIndent <= indent || nextTrimmed.startsWith("- ")) break;

            const { key: nextKey, value: nextValue } = parseLine(nextTrimmed);
            if (nextKey) {
              obj[nextKey] = nextValue === "" ? parseBlock(nextIndent + 2) : parseValue(nextValue);
            }
            index++;
          }

          arr.push(obj);
        } else {
          // Simple array item
          if (value === "") {
            arr.push(parseBlock(indent + 2));
          } else {
            arr.push(parseValue(value));
          }
        }
      }

      return arr;
    }

    // It's an object
    const obj: Record<string, unknown> = {};

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (trimmed === "" || trimmed.startsWith("#")) {
        index++;
        continue;
      }

      const indent = getIndent(line);
      if (indent < baseIndent) break;

      const { key, value } = parseLine(trimmed);
      if (key === null) {
        index++;
        continue;
      }

      index++;

      if (value === "") {
        // Nested value
        obj[key] = parseBlock(indent + 2);
      } else {
        obj[key] = parseValue(value);
      }
    }

    return obj;
  }

  const result = parseBlock(0);

  // If result is empty object but input looks like simple value, parse as value
  if (result !== null && typeof result === "object" && Object.keys(result as object).length === 0) {
    const trimmed = yaml.trim();
    if (!trimmed.includes(":") && !trimmed.startsWith("-")) {
      return parseValue(trimmed);
    }
  }

  return result;
}

/**
 * Convert JavaScript value to YAML string
 */
function stringifyYAML(value: unknown, indent: number = 0): string {
  const prefix = "  ".repeat(indent);

  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    // Check if string needs quoting
    if (
      value === "" ||
      value === "null" ||
      value === "true" ||
      value === "false" ||
      /^[\d.-]/.test(value) ||
      /[:#\[\]{}|>&*!?]/.test(value) ||
      value.includes("\n")
    ) {
      // Use double quotes and escape
      return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const lines: string[] = [];
    for (const item of value) {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        // Object in array
        const objLines = stringifyYAML(item, 0).split("\n");
        lines.push(`- ${objLines[0]}`);
        for (let i = 1; i < objLines.length; i++) {
          lines.push(`  ${objLines[i]}`);
        }
      } else {
        const itemStr = stringifyYAML(item, indent + 1);
        if (itemStr.includes("\n")) {
          lines.push(`-\n${itemStr.split("\n").map(l => prefix + "  " + l).join("\n")}`);
        } else {
          lines.push(`- ${itemStr}`);
        }
      }
    }
    return lines.join("\n");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);

    if (keys.length === 0) {
      return "{}";
    }

    const lines: string[] = [];
    for (const key of keys) {
      const val = obj[key];
      const valStr = stringifyYAML(val, indent + 1);

      // Quote key if needed
      const safeKey = /[:#\[\]{}|>&*!?]/.test(key) ? `"${key}"` : key;

      if (val !== null && typeof val === "object" && !Array.isArray(val) && Object.keys(val as object).length > 0) {
        lines.push(`${safeKey}:`);
        lines.push(...valStr.split("\n").map((l) => `  ${l}`));
      } else if (Array.isArray(val) && val.length > 0) {
        lines.push(`${safeKey}:`);
        lines.push(...valStr.split("\n").map((l) => `  ${l}`));
      } else if (valStr.includes("\n")) {
        lines.push(`${safeKey}:`);
        lines.push(...valStr.split("\n").map((l) => `  ${l}`));
      } else {
        lines.push(`${safeKey}: ${valStr}`);
      }
    }
    return lines.join("\n");
  }

  return String(value);
}

/**
 * Format conversion result for display
 */
export function formatConversionOutput(result: ConversionResult): string {
  return result.output;
}

export const conversionDirections: { value: ConversionDirection; label: string }[] = [
  { value: "yaml-to-json", label: "YAML → JSON" },
  { value: "json-to-yaml", label: "JSON → YAML" },
];
