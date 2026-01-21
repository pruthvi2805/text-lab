export interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
}

export interface RegexMatch {
  match: string;
  index: number;
  groups: Record<string, string> | null;
  captures: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  count: number;
  isValid: boolean;
  error?: string;
}

export function testRegex(
  pattern: string,
  testString: string,
  flags: RegexFlags
): RegexResult {
  if (!pattern) {
    return { matches: [], count: 0, isValid: true };
  }

  let flagString = "";
  if (flags.global) flagString += "g";
  if (flags.ignoreCase) flagString += "i";
  if (flags.multiline) flagString += "m";
  if (flags.dotAll) flagString += "s";
  if (flags.unicode) flagString += "u";

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flagString);
  } catch (err) {
    return {
      matches: [],
      count: 0,
      isValid: false,
      error: err instanceof Error ? err.message : "Invalid regex",
    };
  }

  const matches: RegexMatch[] = [];

  if (flags.global) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(testString)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.groups || null,
        captures: match.slice(1),
      });

      // Prevent infinite loop on zero-width matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  } else {
    const match = regex.exec(testString);
    if (match) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.groups || null,
        captures: match.slice(1),
      });
    }
  }

  return {
    matches,
    count: matches.length,
    isValid: true,
  };
}

export function formatRegexResult(result: RegexResult): string {
  if (!result.isValid) {
    return `Error: ${result.error}`;
  }

  if (result.count === 0) {
    return "No matches found";
  }

  const lines: string[] = [];
  lines.push(`Found ${result.count} match${result.count === 1 ? "" : "es"}:`);
  lines.push("");

  result.matches.forEach((match, i) => {
    lines.push(`--- Match ${i + 1} ---`);
    lines.push(`Value:    "${match.match}"`);
    lines.push(`Position: ${match.index}`);

    if (match.captures.length > 0) {
      lines.push("Captures:");
      match.captures.forEach((cap, j) => {
        lines.push(`  $${j + 1}: "${cap}"`);
      });
    }

    if (match.groups && Object.keys(match.groups).length > 0) {
      lines.push("Named groups:");
      for (const [name, value] of Object.entries(match.groups)) {
        lines.push(`  ${name}: "${value}"`);
      }
    }

    lines.push("");
  });

  return lines.join("\n");
}

export const defaultFlags: RegexFlags = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  unicode: false,
};
