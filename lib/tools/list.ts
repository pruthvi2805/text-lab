export type ListOperation =
  | "sort"
  | "sort-desc"
  | "sort-numeric"
  | "sort-numeric-desc"
  | "reverse"
  | "shuffle"
  | "unique"
  | "trim"
  | "remove-empty"
  | "prefix"
  | "suffix"
  | "number";

export interface ListOptions {
  operation: ListOperation;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

export function processLines(input: string, options: ListOptions): string {
  if (!input.trim()) return "";

  const separator = options.separator || "\n";
  let lines = input.split(separator);

  switch (options.operation) {
    case "sort":
      lines = lines.slice().sort((a, b) => a.localeCompare(b));
      break;

    case "sort-desc":
      lines = lines.slice().sort((a, b) => b.localeCompare(a));
      break;

    case "sort-numeric":
      lines = lines.slice().sort((a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numA - numB;
      });
      break;

    case "sort-numeric-desc":
      lines = lines.slice().sort((a, b) => {
        const numA = parseFloat(a) || 0;
        const numB = parseFloat(b) || 0;
        return numB - numA;
      });
      break;

    case "reverse":
      lines = lines.slice().reverse();
      break;

    case "shuffle":
      lines = shuffleArray(lines.slice());
      break;

    case "unique":
      lines = [...new Set(lines)];
      break;

    case "trim":
      lines = lines.map((line) => line.trim());
      break;

    case "remove-empty":
      lines = lines.filter((line) => line.trim() !== "");
      break;

    case "prefix":
      lines = lines.map((line) => (options.prefix || "") + line);
      break;

    case "suffix":
      lines = lines.map((line) => line + (options.suffix || ""));
      break;

    case "number":
      lines = lines.map((line, i) => `${i + 1}. ${line}`);
      break;
  }

  return lines.join(separator);
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function countLines(input: string): number {
  if (!input.trim()) return 0;
  return input.split("\n").length;
}

export function countUniqueLines(input: string): number {
  if (!input.trim()) return 0;
  return new Set(input.split("\n")).size;
}

export const listOperations: { value: ListOperation; label: string; description: string }[] = [
  { value: "sort", label: "Sort A-Z", description: "Sort lines alphabetically" },
  { value: "sort-desc", label: "Sort Z-A", description: "Sort lines in reverse alphabetical order" },
  { value: "sort-numeric", label: "Sort 0-9", description: "Sort lines numerically (ascending)" },
  { value: "sort-numeric-desc", label: "Sort 9-0", description: "Sort lines numerically (descending)" },
  { value: "reverse", label: "Reverse", description: "Reverse the order of lines" },
  { value: "shuffle", label: "Shuffle", description: "Randomly shuffle lines" },
  { value: "unique", label: "Remove Duplicates", description: "Keep only unique lines" },
  { value: "trim", label: "Trim", description: "Remove leading/trailing whitespace from each line" },
  { value: "remove-empty", label: "Remove Empty", description: "Remove empty lines" },
  { value: "prefix", label: "Add Prefix", description: "Add text to the start of each line" },
  { value: "suffix", label: "Add Suffix", description: "Add text to the end of each line" },
  { value: "number", label: "Number Lines", description: "Add line numbers" },
];
