export type UrlMode = "parse" | "encode" | "decode";

export interface ParsedUrl {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  searchParams: Record<string, string>;
}

export function parseUrl(input: string): ParsedUrl {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Please enter a URL");
  }

  // Add protocol if missing
  let urlString = trimmed;
  if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
    urlString = "https://" + urlString;
  }

  const url = new URL(urlString);

  const searchParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    searchParams[key] = value;
  });

  return {
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    origin: url.origin,
    searchParams,
  };
}

export function formatParsedUrl(parsed: ParsedUrl): string {
  const lines: string[] = [];

  lines.push("=== URL COMPONENTS ===");
  lines.push(`Full URL:   ${parsed.href}`);
  lines.push(`Protocol:   ${parsed.protocol}`);
  lines.push(`Origin:     ${parsed.origin}`);
  lines.push(`Host:       ${parsed.host}`);
  lines.push(`Hostname:   ${parsed.hostname}`);
  if (parsed.port) lines.push(`Port:       ${parsed.port}`);
  lines.push(`Pathname:   ${parsed.pathname}`);
  if (parsed.search) lines.push(`Search:     ${parsed.search}`);
  if (parsed.hash) lines.push(`Hash:       ${parsed.hash}`);

  const paramKeys = Object.keys(parsed.searchParams);
  if (paramKeys.length > 0) {
    lines.push("");
    lines.push("=== QUERY PARAMETERS ===");
    for (const key of paramKeys) {
      lines.push(`${key}: ${parsed.searchParams[key]}`);
    }
  }

  return lines.join("\n");
}

export function encodeUrl(input: string): string {
  if (!input.trim()) return "";
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  if (!input.trim()) return "";
  return decodeURIComponent(input);
}

export function encodeUrlFull(input: string): string {
  if (!input.trim()) return "";
  return encodeURI(input);
}

export function decodeUrlFull(input: string): string {
  if (!input.trim()) return "";
  return decodeURI(input);
}
