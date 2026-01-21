export type DiffMode = "line" | "word" | "character";

export interface DiffChange {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineNumber?: number;
}

export interface DiffResult {
  changes: DiffChange[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

/**
 * Compare two texts and return the differences
 * Uses Myers diff algorithm for optimal results
 */
export function computeDiff(
  original: string,
  modified: string,
  mode: DiffMode = "line"
): DiffResult {
  // Handle empty inputs
  if (!original && !modified) {
    return { changes: [], stats: { additions: 0, deletions: 0, unchanged: 0 } };
  }

  if (!original) {
    const changes = splitByMode(modified, mode).map((value) => ({
      type: "added" as const,
      value,
    }));
    return {
      changes,
      stats: { additions: changes.length, deletions: 0, unchanged: 0 },
    };
  }

  if (!modified) {
    const changes = splitByMode(original, mode).map((value) => ({
      type: "removed" as const,
      value,
    }));
    return {
      changes,
      stats: { additions: 0, deletions: changes.length, unchanged: 0 },
    };
  }

  const originalParts = splitByMode(original, mode);
  const modifiedParts = splitByMode(modified, mode);

  const changes = myersDiff(originalParts, modifiedParts);

  const stats = {
    additions: changes.filter((c) => c.type === "added").length,
    deletions: changes.filter((c) => c.type === "removed").length,
    unchanged: changes.filter((c) => c.type === "unchanged").length,
  };

  return { changes, stats };
}

/**
 * Split text based on diff mode
 */
function splitByMode(text: string, mode: DiffMode): string[] {
  switch (mode) {
    case "line":
      return text.split(/\n/);
    case "word":
      return text.split(/(\s+)/).filter((s) => s.length > 0);
    case "character":
      return text.split("");
    default:
      return text.split(/\n/);
  }
}

/**
 * Myers diff algorithm - finds the shortest edit script
 * Reference: http://www.xmailserver.org/diff2.pdf
 */
function myersDiff(original: string[], modified: string[]): DiffChange[] {
  const N = original.length;
  const M = modified.length;
  const MAX = N + M;

  if (MAX === 0) {
    return [];
  }

  // Optimization for identical strings
  if (N === M && original.every((v, i) => v === modified[i])) {
    return original.map((value) => ({ type: "unchanged" as const, value }));
  }

  const V: Map<number, number> = new Map();
  V.set(1, 0);

  const trace: Map<number, number>[] = [];

  // Find shortest edit script
  outer: for (let D = 0; D <= MAX; D++) {
    const newV: Map<number, number> = new Map();

    for (let k = -D; k <= D; k += 2) {
      let x: number;

      if (k === -D || (k !== D && (V.get(k - 1) ?? 0) < (V.get(k + 1) ?? 0))) {
        x = V.get(k + 1) ?? 0;
      } else {
        x = (V.get(k - 1) ?? 0) + 1;
      }

      let y = x - k;

      // Follow diagonal
      while (x < N && y < M && original[x] === modified[y]) {
        x++;
        y++;
      }

      newV.set(k, x);

      if (x >= N && y >= M) {
        trace.push(new Map(newV));
        break outer;
      }
    }

    trace.push(new Map(newV));
    V.clear();
    for (const [key, value] of newV) {
      V.set(key, value);
    }
  }

  // Backtrack to build the diff
  const changes: DiffChange[] = [];
  let x = N;
  let y = M;

  for (let D = trace.length - 1; D >= 0; D--) {
    const currentV = trace[D];
    const k = x - y;

    let prevK: number;
    if (k === -D || (k !== D && (currentV.get(k - 1) ?? 0) < (currentV.get(k + 1) ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = currentV.get(prevK) ?? 0;
    const prevY = prevX - prevK;

    // Add unchanged (diagonal moves)
    while (x > prevX && y > prevY) {
      x--;
      y--;
      changes.unshift({ type: "unchanged", value: original[x] });
    }

    if (D > 0) {
      if (x > prevX) {
        x--;
        changes.unshift({ type: "removed", value: original[x] });
      } else if (y > prevY) {
        y--;
        changes.unshift({ type: "added", value: modified[y] });
      }
    }
  }

  return changes;
}

/**
 * Format diff result for display
 */
export function formatDiffResult(result: DiffResult, mode: DiffMode): string {
  if (result.changes.length === 0) {
    return "Both texts are empty.";
  }

  const lines: string[] = [];

  // Stats header
  lines.push(`=== DIFF SUMMARY ===`);
  lines.push(`Additions: +${result.stats.additions}`);
  lines.push(`Deletions: -${result.stats.deletions}`);
  lines.push(`Unchanged: ${result.stats.unchanged}`);
  lines.push("");
  lines.push(`=== CHANGES ===`);

  if (mode === "line") {
    let lineNum = 1;
    for (const change of result.changes) {
      const prefix =
        change.type === "added" ? "+ " :
        change.type === "removed" ? "- " : "  ";
      lines.push(`${prefix}${change.value}`);
      if (change.type !== "removed") lineNum++;
    }
  } else {
    // For word/character mode, show inline
    let currentLine = "";
    for (const change of result.changes) {
      if (change.type === "added") {
        currentLine += `[+${change.value}]`;
      } else if (change.type === "removed") {
        currentLine += `[-${change.value}]`;
      } else {
        currentLine += change.value;
      }
    }
    lines.push(currentLine);
  }

  return lines.join("\n");
}

export const diffModes: { value: DiffMode; label: string; description: string }[] = [
  { value: "line", label: "Line", description: "Compare line by line" },
  { value: "word", label: "Word", description: "Compare word by word" },
  { value: "character", label: "Character", description: "Compare character by character" },
];
