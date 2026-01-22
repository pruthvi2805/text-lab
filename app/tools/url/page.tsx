"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  parseUrl,
  formatParsedUrl,
  encodeUrl,
  decodeUrl,
  UrlMode,
} from "@/lib/tools/url";

export default function UrlPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<UrlMode>("parse");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      switch (mode) {
        case "parse":
          return { output: formatParsedUrl(parseUrl(input)), error: null };
        case "encode":
          return { output: encodeUrl(input), error: null };
        case "decode":
          return { output: decodeUrl(input), error: null };
        default:
          return { output: "", error: null };
      }
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Error processing URL",
      };
    }
  }, [input, mode]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const outputPlaceholder =
    mode === "parse"
      ? "URL components and query parameters will appear here..."
      : mode === "encode"
      ? "URL-encoded string will appear here..."
      : "Decoded text will appear here...";

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "parse"
          ? "Paste URL to parse"
          : mode === "encode"
          ? "Paste text to encode"
          : "Paste encoded URL to decode"
      }
      outputPlaceholder={
        mode === "parse"
          ? "→ Protocol, host, path, query params"
          : mode === "encode"
          ? "→ hello%20world (URL encoded)"
          : "→ Decoded text"
      }
      error={error}
      options={
        <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
          <Button
            variant={mode === "parse" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode("parse")}
          >
            Parse URL
          </Button>
          <Button
            variant={mode === "encode" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>
      }
    />
  );
}
