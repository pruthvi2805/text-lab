export type CaseType =
  | "lower"
  | "upper"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot";

export function convertCase(input: string, caseType: CaseType): string {
  if (!input) return "";

  switch (caseType) {
    case "lower":
      return input.toLowerCase();
    case "upper":
      return input.toUpperCase();
    case "title":
      return toTitleCase(input);
    case "sentence":
      return toSentenceCase(input);
    case "camel":
      return toCamelCase(input);
    case "pascal":
      return toPascalCase(input);
    case "snake":
      return toSnakeCase(input);
    case "kebab":
      return toKebabCase(input);
    case "constant":
      return toConstantCase(input);
    case "dot":
      return toDotCase(input);
    default:
      return input;
  }
}

function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

function toSentenceCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function getWords(str: string): string[] {
  // Handle camelCase, PascalCase, snake_case, kebab-case, and spaces
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase -> camel Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // XMLParser -> XML Parser
    .replace(/[_\-./]/g, " ") // Replace separators with space
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(str: string): string {
  const words = getWords(str);
  return words
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}

function toPascalCase(str: string): string {
  const words = getWords(str);
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
}

function toSnakeCase(str: string): string {
  return getWords(str).join("_");
}

function toKebabCase(str: string): string {
  return getWords(str).join("-");
}

function toConstantCase(str: string): string {
  return getWords(str).join("_").toUpperCase();
}

function toDotCase(str: string): string {
  return getWords(str).join(".");
}

export const caseOptions: { value: CaseType; label: string; example: string }[] = [
  { value: "lower", label: "lowercase", example: "hello world" },
  { value: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { value: "title", label: "Title Case", example: "Hello World" },
  { value: "sentence", label: "Sentence case", example: "Hello world" },
  { value: "camel", label: "camelCase", example: "helloWorld" },
  { value: "pascal", label: "PascalCase", example: "HelloWorld" },
  { value: "snake", label: "snake_case", example: "hello_world" },
  { value: "kebab", label: "kebab-case", example: "hello-world" },
  { value: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { value: "dot", label: "dot.case", example: "hello.world" },
];
