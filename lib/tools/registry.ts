import {
  JsonIcon,
  CaseIcon,
  KeyIcon,
  LinkIcon,
  ListIcon,
  RegexIcon,
  ClockIcon,
  BinaryIcon,
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
  {
    id: "json",
    name: "JSON Formatter",
    shortName: "JSON",
    description: "Format, validate, and minify JSON",
    longDescription:
      "Validate JSON syntax, pretty-print with customizable indentation, or minify for production. Highlights errors with line numbers.",
    path: "/tools/json",
    icon: JsonIcon,
    keywords: ["json", "format", "validate", "minify", "prettify", "parse"],
  },
  {
    id: "case-converter",
    name: "Case Converter",
    shortName: "Case",
    description: "Convert text between cases",
    longDescription:
      "Transform text between camelCase, snake_case, kebab-case, PascalCase, UPPER CASE, lower case, Title Case, and more.",
    path: "/tools/case-converter",
    icon: CaseIcon,
    keywords: ["case", "camel", "snake", "kebab", "pascal", "upper", "lower", "title"],
  },
  {
    id: "jwt",
    name: "JWT Decoder",
    shortName: "JWT",
    description: "Decode JWT tokens",
    longDescription:
      "Decode JSON Web Tokens to inspect header and payload claims. Shows expiration status and formatted timestamps. Does not verify signatures.",
    path: "/tools/jwt",
    icon: KeyIcon,
    keywords: ["jwt", "token", "decode", "json web token", "auth", "bearer"],
  },
  {
    id: "url",
    name: "URL Parser",
    shortName: "URL",
    description: "Parse and encode URLs",
    longDescription:
      "Parse URLs into components (protocol, host, path, query parameters). Encode and decode URL components and query strings.",
    path: "/tools/url",
    icon: LinkIcon,
    keywords: ["url", "uri", "encode", "decode", "parse", "query", "parameter"],
  },
  {
    id: "list",
    name: "List Utilities",
    shortName: "List",
    description: "Sort, dedupe, and transform lists",
    longDescription:
      "Process line-separated lists: sort alphabetically or numerically, remove duplicates, reverse order, shuffle randomly, add prefix/suffix to each line.",
    path: "/tools/list",
    icon: ListIcon,
    keywords: ["list", "sort", "unique", "dedupe", "reverse", "shuffle", "lines"],
  },
  {
    id: "regex",
    name: "Regex Tester",
    shortName: "Regex",
    description: "Test JavaScript regular expressions",
    longDescription:
      "Test regular expressions against sample text with live highlighting. Shows all matches, capture groups, and match indices.",
    path: "/tools/regex",
    icon: RegexIcon,
    keywords: ["regex", "regexp", "regular expression", "pattern", "match", "test"],
  },
  {
    id: "timestamp",
    name: "Timestamp Converter",
    shortName: "Time",
    description: "Convert Unix timestamps",
    longDescription:
      "Convert between Unix timestamps (seconds/milliseconds) and human-readable dates. Get current timestamp, parse date strings.",
    path: "/tools/timestamp",
    icon: ClockIcon,
    keywords: ["timestamp", "unix", "epoch", "date", "time", "convert"],
  },
  {
    id: "base64",
    name: "Base64 Encoder",
    shortName: "Base64",
    description: "Encode and decode Base64",
    longDescription:
      "Encode text to Base64 or decode Base64 back to text. Supports standard and URL-safe Base64 variants.",
    path: "/tools/base64",
    icon: BinaryIcon,
    keywords: ["base64", "encode", "decode", "binary", "text"],
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolByPath(path: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.path === path);
}
