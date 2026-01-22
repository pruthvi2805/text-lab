import {
  JsonIcon,
  CaseIcon,
  KeyIcon,
  LinkIcon,
  ListIcon,
  RegexIcon,
  ClockIcon,
  BinaryIcon,
  HashIcon,
  DiffIcon,
  UuidIcon,
  YamlIcon,
  MarkdownIcon,
  HtmlIcon,
  ColorIcon,
  LoremIcon,
} from "@/components/ui/icons";
import { ComponentType, SVGProps } from "react";

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  keywords: string[];
}

export const tools: ToolDefinition[] = [
  // Ordered by popularity/frequency of use
  {
    id: "json",
    name: "JSON Formatter",
    shortName: "JSON",
    description: "Format, minify, and validate JSON instantly",
    longDescription:
      "Validate JSON syntax, pretty-print with customizable indentation, or minify for production. Highlights errors with line numbers.",
    path: "/tools/json",
    icon: JsonIcon,
    keywords: ["json", "format", "validate", "minify", "prettify", "parse"],
  },
  {
    id: "base64",
    name: "Base64 Encoder",
    shortName: "Base64",
    description: "Encode or decode Base64 with URL-safe option",
    longDescription:
      "Encode text to Base64 or decode Base64 back to text. Supports standard and URL-safe Base64 variants.",
    path: "/tools/base64",
    icon: BinaryIcon,
    keywords: ["base64", "encode", "decode", "binary", "text"],
  },
  {
    id: "url",
    name: "URL Parser",
    shortName: "URL",
    description: "Parse URLs and encode/decode components",
    longDescription:
      "Parse URLs into components (protocol, host, path, query parameters). Encode and decode URL components and query strings.",
    path: "/tools/url",
    icon: LinkIcon,
    keywords: ["url", "uri", "encode", "decode", "parse", "query", "parameter"],
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    shortName: "JWT",
    description: "Decode and inspect JWT token claims",
    longDescription:
      "Decode JSON Web Tokens to inspect header and payload claims. Shows expiration status and formatted timestamps. Does not verify signatures.",
    path: "/tools/jwt",
    icon: KeyIcon,
    keywords: ["jwt", "token", "decode", "json web token", "auth", "bearer"],
  },
  {
    id: "hash",
    name: "Hash Generator",
    shortName: "Hash",
    description: "MD5, SHA-1, SHA-256, SHA-512 hashes",
    longDescription:
      "Generate cryptographic hashes using MD5, SHA-1, SHA-256, or SHA-512 algorithms. Secure client-side hashing with no server processing.",
    path: "/tools/hash",
    icon: HashIcon,
    keywords: ["hash", "md5", "sha1", "sha256", "sha512", "checksum", "digest"],
  },
  {
    id: "uuid",
    name: "UUID Generator",
    shortName: "UUID",
    description: "Generate v4/v7 UUIDs and validate existing ones",
    longDescription:
      "Generate UUIDs in v4 (random) or v7 (timestamp-based) format. Validate existing UUIDs and view their components.",
    path: "/tools/uuid",
    icon: UuidIcon,
    keywords: ["uuid", "guid", "unique id", "identifier", "random"],
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    shortName: "Time",
    description: "Unix timestamps ↔ human-readable dates",
    longDescription:
      "Convert between Unix timestamps (seconds/milliseconds) and human-readable dates. Get current timestamp, parse date strings.",
    path: "/tools/timestamp",
    icon: ClockIcon,
    keywords: ["timestamp", "unix", "epoch", "date", "time", "convert"],
  },
  {
    id: "yaml",
    name: "YAML ↔ JSON",
    shortName: "YAML",
    description: "Convert between YAML and JSON formats",
    longDescription:
      "Convert YAML to JSON or JSON to YAML. Auto-detect input format with pure client-side processing.",
    path: "/tools/yaml",
    icon: YamlIcon,
    keywords: ["yaml", "json", "convert", "transform", "config"],
  },
  {
    id: "case-converter",
    name: "Case Converter",
    shortName: "Case",
    description: "camelCase, snake_case, PascalCase & more",
    longDescription:
      "Transform text between camelCase, snake_case, kebab-case, PascalCase, UPPER CASE, lower case, Title Case, and more.",
    path: "/tools/case-converter",
    icon: CaseIcon,
    keywords: ["case", "camel", "snake", "kebab", "pascal", "upper", "lower", "title"],
  },
  {
    id: "regex",
    name: "Regex Tester",
    shortName: "Regex",
    description: "Test patterns with live match highlighting",
    longDescription:
      "Test regular expressions against sample text with live highlighting. Shows all matches, capture groups, and match indices.",
    path: "/tools/regex",
    icon: RegexIcon,
    keywords: ["regex", "regexp", "regular expression", "pattern", "match", "test"],
  },
  {
    id: "diff",
    name: "Text Diff",
    shortName: "Diff",
    description: "Compare texts line-by-line or word-by-word",
    longDescription:
      "Compare two texts and highlight the differences. Supports line-by-line, word-by-word, or character-by-character comparison using Myers diff algorithm.",
    path: "/tools/diff",
    icon: DiffIcon,
    keywords: ["diff", "compare", "difference", "text comparison", "merge"],
  },
  {
    id: "markdown",
    name: "Markdown Preview",
    shortName: "Markdown",
    description: "Live preview with HTML source view",
    longDescription:
      "Write Markdown and see live HTML preview. View the generated HTML source. Supports tables, code blocks, and more.",
    path: "/tools/markdown",
    icon: MarkdownIcon,
    keywords: ["markdown", "preview", "html", "render", "md"],
  },
  {
    id: "html-entities",
    name: "HTML Entities",
    shortName: "HTML",
    description: "Encode and decode HTML special characters",
    longDescription:
      "Encode special characters to HTML entities or decode entities back to characters. Supports named, numeric, and hex formats.",
    path: "/tools/html-entities",
    icon: HtmlIcon,
    keywords: ["html", "entities", "encode", "decode", "escape", "special characters"],
  },
  {
    id: "color",
    name: "Color Converter",
    shortName: "Color",
    description: "HEX, RGB, HSL, and more with preview",
    longDescription:
      "Convert colors between HEX, RGB, HSL, HWB, and CMYK formats. Parse CSS named colors with live preview.",
    path: "/tools/color",
    icon: ColorIcon,
    keywords: ["color", "hex", "rgb", "hsl", "convert", "picker"],
  },
  {
    id: "list",
    name: "List Utilities",
    shortName: "List",
    description: "Sort, dedupe, reverse, shuffle lines",
    longDescription:
      "Process line-separated lists: sort alphabetically or numerically, remove duplicates, reverse order, shuffle randomly, add prefix/suffix to each line.",
    path: "/tools/list",
    icon: ListIcon,
    keywords: ["list", "sort", "unique", "dedupe", "reverse", "shuffle", "lines"],
  },
  {
    id: "lorem",
    name: "Lorem Ipsum",
    shortName: "Lorem",
    description: "Generate placeholder text by length",
    longDescription:
      "Generate Lorem Ipsum placeholder text. Customize the amount of words, sentences, or paragraphs.",
    path: "/tools/lorem",
    icon: LoremIcon,
    keywords: ["lorem", "ipsum", "placeholder", "dummy", "text", "filler"],
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolByPath(path: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.path === path);
}
