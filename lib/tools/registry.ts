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
  CalculatorIcon,
  EscapeIcon,
  TableIcon,
  HexIcon,
  DatabaseIcon,
  CodeIcon,
  XmlIcon,
  LockIcon,
  CalendarIcon,
  UserIcon,
  QrIcon,
  FingerprintIcon,
  ChartIcon,
  SlugIcon,
  PathIcon,
  PermissionIcon,
  CsvIcon,
} from "@/components/ui/icons";
import { ComponentType, SVGProps } from "react";

export type ToolCategory = "formatting" | "encoding" | "generators" | "text";

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  description: string;
}

export const categories: CategoryDefinition[] = [
  { id: "formatting", name: "Formatting", description: "Format and structure data" },
  { id: "encoding", name: "Encoding", description: "Encode, decode, and parse" },
  { id: "generators", name: "Generators", description: "Generate hashes, IDs, and text" },
  { id: "text", name: "Text Tools", description: "Transform and compare text" },
];

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  path: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  keywords: string[];
  category: ToolCategory;
  relatedTools?: string[]; // IDs of related tools for internal linking
}

export const tools: ToolDefinition[] = [
  // Tools organized by category
  // Formatting
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
    category: "formatting",
    relatedTools: ["yaml", "json-path", "xml-json", "csv-json"],
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
    category: "formatting",
    relatedTools: ["json", "xml-json", "csv-json"],
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
    category: "formatting",
  },
  {
    id: "sql",
    name: "SQL Formatter",
    shortName: "SQL",
    description: "Format and beautify SQL queries",
    longDescription:
      "Format SQL queries with proper indentation and styling. Supports SELECT, INSERT, UPDATE, DELETE statements and common SQL dialects.",
    path: "/tools/sql",
    icon: DatabaseIcon,
    keywords: ["sql", "format", "beautify", "query", "database", "mysql", "postgresql"],
    category: "formatting",
    relatedTools: ["json", "js-formatter"],
  },
  {
    id: "js-formatter",
    name: "JS/CSS Formatter",
    shortName: "JS/CSS",
    description: "Beautify or minify JavaScript and CSS",
    longDescription:
      "Format JavaScript or CSS code with customizable indentation. Minify for production or beautify for readability.",
    path: "/tools/js-formatter",
    icon: CodeIcon,
    keywords: ["javascript", "css", "format", "beautify", "minify", "prettify", "js"],
    category: "formatting",
  },
  {
    id: "xml-json",
    name: "XML ↔ JSON",
    shortName: "XML",
    description: "Convert between XML and JSON formats",
    longDescription:
      "Convert XML to JSON or JSON to XML. Handles attributes, nested elements, and preserves data structure.",
    path: "/tools/xml-json",
    icon: XmlIcon,
    keywords: ["xml", "json", "convert", "transform", "data", "api"],
    category: "formatting",
    relatedTools: ["json", "yaml", "csv-json"],
  },
  {
    id: "csv-json",
    name: "CSV ↔ JSON",
    shortName: "CSV",
    description: "Convert between CSV and JSON formats",
    longDescription:
      "Convert CSV to JSON array or JSON to CSV. Auto-detects headers, handles quoted fields and different delimiters.",
    path: "/tools/csv-json",
    icon: CsvIcon,
    keywords: ["csv", "json", "convert", "spreadsheet", "excel", "data", "table"],
    category: "formatting",
    relatedTools: ["json", "yaml", "xml-json"],
  },
  // Encoding
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
    category: "encoding",
    relatedTools: ["hex-text", "url", "jwt"],
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
    category: "encoding",
    relatedTools: ["base64", "html-entities", "string-escape"],
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
    category: "encoding",
    relatedTools: ["base64", "hash", "hmac"],
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
    category: "encoding",
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    shortName: "Base",
    description: "Convert between decimal, hex, octal, binary",
    longDescription:
      "Convert numbers between decimal, hexadecimal, octal, and binary bases. Supports large numbers and shows bit patterns.",
    path: "/tools/number-base",
    icon: CalculatorIcon,
    keywords: ["number", "base", "decimal", "hex", "hexadecimal", "octal", "binary", "convert"],
    category: "encoding",
  },
  {
    id: "string-escape",
    name: "String Escape Tool",
    shortName: "Escape",
    description: "Escape/unescape strings for multiple languages",
    longDescription:
      "Escape or unescape strings for JavaScript, JSON, Python, SQL, XML, CSV, and regular expressions. Handles special characters safely.",
    path: "/tools/string-escape",
    icon: EscapeIcon,
    keywords: ["escape", "unescape", "string", "quote", "javascript", "python", "sql", "json"],
    category: "encoding",
  },
  {
    id: "ascii-unicode",
    name: "ASCII/Unicode Lookup",
    shortName: "ASCII",
    description: "Browse ASCII table and search Unicode characters",
    longDescription:
      "Browse the complete ASCII table, search Unicode characters by name or code point, and view character details.",
    path: "/tools/ascii-unicode",
    icon: TableIcon,
    keywords: ["ascii", "unicode", "character", "code", "point", "lookup", "table", "utf8"],
    category: "encoding",
  },
  {
    id: "hex-text",
    name: "Hex ↔ Text",
    shortName: "Hex",
    description: "Convert between text and hexadecimal bytes",
    longDescription:
      "Convert plain text to hexadecimal representation or hex bytes back to text. Useful for debugging and binary data inspection.",
    path: "/tools/hex-text",
    icon: HexIcon,
    keywords: ["hex", "hexadecimal", "text", "bytes", "binary", "convert", "encode", "decode"],
    category: "encoding",
    relatedTools: ["base64", "number-base"],
  },
  // Generators
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
    category: "generators",
    relatedTools: ["hmac", "password", "jwt"],
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
    category: "generators",
    relatedTools: ["password", "hash"],
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
    category: "generators",
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
    category: "generators",
  },
  {
    id: "password",
    name: "Password Generator",
    shortName: "Password",
    description: "Generate secure passwords with custom rules",
    longDescription:
      "Generate cryptographically secure passwords. Customize length, character types, and exclude ambiguous characters.",
    path: "/tools/password",
    icon: LockIcon,
    keywords: ["password", "generate", "secure", "random", "strong", "security"],
    category: "generators",
    relatedTools: ["hash", "uuid"],
  },
  {
    id: "cron",
    name: "Cron Expression Builder",
    shortName: "Cron",
    description: "Build and explain cron expressions visually",
    longDescription:
      "Build cron expressions with a visual interface. Get human-readable explanations and see next scheduled runs.",
    path: "/tools/cron",
    icon: CalendarIcon,
    keywords: ["cron", "schedule", "job", "timer", "expression", "unix", "crontab"],
    category: "generators",
  },
  {
    id: "fake-data",
    name: "Fake Data Generator",
    shortName: "Faker",
    description: "Generate fake names, emails, addresses for testing",
    longDescription:
      "Generate realistic fake data for testing. Create names, emails, addresses, phone numbers, and more.",
    path: "/tools/fake-data",
    icon: UserIcon,
    keywords: ["fake", "data", "mock", "test", "name", "email", "address", "phone", "faker"],
    category: "generators",
  },
  {
    id: "qr-code",
    name: "QR Code Generator",
    shortName: "QR",
    description: "Generate QR codes from text or URLs",
    longDescription:
      "Generate QR codes from text, URLs, WiFi credentials, or contact info. Download as PNG or SVG.",
    path: "/tools/qr-code",
    icon: QrIcon,
    keywords: ["qr", "code", "barcode", "generate", "scan", "url", "wifi"],
    category: "generators",
  },
  {
    id: "hmac",
    name: "HMAC Generator",
    shortName: "HMAC",
    description: "Generate HMAC signatures with various algorithms",
    longDescription:
      "Generate HMAC (Hash-based Message Authentication Code) signatures using SHA-256, SHA-512, and other algorithms.",
    path: "/tools/hmac",
    icon: FingerprintIcon,
    keywords: ["hmac", "hash", "signature", "mac", "authentication", "sha256", "sha512"],
    category: "generators",
    relatedTools: ["hash", "jwt"],
  },
  // Text Tools
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
    category: "text",
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
    category: "text",
    relatedTools: ["diff", "list", "string-escape"],
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
    category: "text",
    relatedTools: ["regex", "list"],
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
    category: "text",
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
    category: "text",
    relatedTools: ["regex", "case-converter", "text-stats", "diff"],
  },
  {
    id: "text-stats",
    name: "Text Statistics",
    shortName: "Stats",
    description: "Word count, reading time, and text analysis",
    longDescription:
      "Analyze text with detailed statistics: word count, character count, sentence count, paragraph count, reading time, and keyword density.",
    path: "/tools/text-stats",
    icon: ChartIcon,
    keywords: ["word", "count", "character", "statistics", "reading", "time", "analysis"],
    category: "text",
  },
  {
    id: "slug",
    name: "Slug Generator",
    shortName: "Slug",
    description: "Convert text to URL-friendly slugs",
    longDescription:
      "Convert any text to URL-friendly slugs. Choose from multiple styles: lowercase, kebab-case, snake_case, and more.",
    path: "/tools/slug",
    icon: SlugIcon,
    keywords: ["slug", "url", "seo", "friendly", "permalink", "kebab", "snake"],
    category: "text",
  },
  {
    id: "json-path",
    name: "JSON Path Evaluator",
    shortName: "JSONPath",
    description: "Test JSONPath expressions against JSON data",
    longDescription:
      "Evaluate JSONPath expressions against JSON data. Test queries, extract nested values, and filter arrays.",
    path: "/tools/json-path",
    icon: PathIcon,
    keywords: ["json", "path", "jsonpath", "query", "filter", "extract", "jmespath"],
    category: "text",
    relatedTools: ["json", "regex"],
  },
  {
    id: "chmod",
    name: "chmod Calculator",
    shortName: "chmod",
    description: "Calculate Unix file permissions",
    longDescription:
      "Calculate Unix file permissions. Convert between symbolic (rwxr-xr-x) and numeric (755) notation.",
    path: "/tools/chmod",
    icon: PermissionIcon,
    keywords: ["chmod", "permission", "unix", "linux", "file", "rwx", "octal"],
    category: "text",
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getToolByPath(path: string): ToolDefinition | undefined {
  // Normalize path by removing trailing slash for comparison
  const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
  return tools.find((tool) => tool.path === normalizedPath);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter((tool) => tool.category === category);
}

export function getCategoryById(id: ToolCategory): CategoryDefinition | undefined {
  return categories.find((cat) => cat.id === id);
}
