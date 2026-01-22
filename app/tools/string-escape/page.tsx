"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type EscapeMode = "escape" | "unescape";
type EscapeFormat =
  | "javascript"
  | "json"
  | "python"
  | "sql"
  | "html"
  | "xml"
  | "csv"
  | "regex"
  | "url";

interface FormatInfo {
  id: EscapeFormat;
  name: string;
  escape: (s: string) => string;
  unescape: (s: string) => string;
}

const FORMATS: FormatInfo[] = [
  {
    id: "javascript",
    name: "JavaScript",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/\f/g, "\\f")
        .replace(/\v/g, "\\v")
        .replace(/\0/g, "\\0"),
    unescape: (s) =>
      s
        .replace(/\\0/g, "\0")
        .replace(/\\v/g, "\v")
        .replace(/\\f/g, "\f")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\"),
  },
  {
    id: "json",
    name: "JSON",
    escape: (s) => JSON.stringify(s).slice(1, -1),
    unescape: (s) => {
      try {
        return JSON.parse(`"${s}"`);
      } catch {
        return s;
      }
    },
  },
  {
    id: "python",
    name: "Python",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t"),
    unescape: (s) =>
      s
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\"),
  },
  {
    id: "sql",
    name: "SQL",
    escape: (s) => s.replace(/'/g, "''").replace(/\\/g, "\\\\"),
    unescape: (s) => s.replace(/''/g, "'").replace(/\\\\/g, "\\"),
  },
  {
    id: "html",
    name: "HTML",
    escape: (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;"),
    unescape: (s) =>
      s
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&"),
  },
  {
    id: "xml",
    name: "XML",
    escape: (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;"),
    unescape: (s) =>
      s
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&amp;/g, "&"),
  },
  {
    id: "csv",
    name: "CSV",
    escape: (s) => {
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    },
    unescape: (s) => {
      if (s.startsWith('"') && s.endsWith('"')) {
        return s.slice(1, -1).replace(/""/g, '"');
      }
      return s;
    },
  },
  {
    id: "regex",
    name: "Regex",
    escape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    unescape: (s) => s.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"),
  },
  {
    id: "url",
    name: "URL",
    escape: (s) => encodeURIComponent(s),
    unescape: (s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    },
  },
];

export default function StringEscapePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("escape");
  const [format, setFormat] = useState<EscapeFormat>("javascript");

  const formatInfo = useMemo(() => FORMATS.find((f) => f.id === format)!, [format]);

  const output = useMemo(() => {
    if (!input) return "";

    try {
      if (mode === "escape") {
        return formatInfo.escape(input);
      } else {
        return formatInfo.unescape(input);
      }
    } catch {
      return "Error processing string";
    }
  }, [input, mode, formatInfo]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "escape"
          ? "Enter text to escape..."
          : "Enter escaped text to unescape..."
      }
      outputPlaceholder={
        mode === "escape"
          ? `→ ${formatInfo.name}-escaped string`
          : `→ Unescaped string`
      }
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "escape" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("escape")}
            >
              Escape
            </Button>
            <Button
              variant={mode === "unescape" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("unescape")}
            >
              Unescape
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Format:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as EscapeFormat)}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-text-muted hidden md:inline">
            {format === "javascript" && "Escapes quotes, newlines, tabs"}
            {format === "json" && "JSON string escaping (RFC 8259)"}
            {format === "python" && "Python string literal escaping"}
            {format === "sql" && "Single quotes doubled for SQL"}
            {format === "html" && "HTML entity encoding"}
            {format === "xml" && "XML entity encoding"}
            {format === "csv" && "Quotes fields with special chars"}
            {format === "regex" && "Escapes regex metacharacters"}
            {format === "url" && "URL percent encoding"}
          </span>
        </div>
      }
    />
  );
}
