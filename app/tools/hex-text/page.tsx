"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Mode = "text-to-hex" | "hex-to-text";
type HexFormat = "lowercase" | "uppercase";
type Separator = "space" | "none" | "colon" | "0x";

function textToHex(text: string, format: HexFormat, separator: Separator): string {
  if (!text) return "";

  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  let hex = Array.from(bytes)
    .map((b) => {
      const h = b.toString(16).padStart(2, "0");
      return format === "uppercase" ? h.toUpperCase() : h;
    });

  switch (separator) {
    case "space":
      return hex.join(" ");
    case "colon":
      return hex.join(":");
    case "0x":
      return hex.map((h) => "0x" + h).join(" ");
    default:
      return hex.join("");
  }
}

function hexToText(hex: string): { text: string; error: string | null } {
  if (!hex.trim()) return { text: "", error: null };

  // Clean up input - remove common prefixes and separators
  let cleaned = hex
    .replace(/0x/gi, "")
    .replace(/\\x/gi, "")
    .replace(/[:\s,]/g, "")
    .trim();

  // Validate hex string
  if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
    return { text: "", error: "Invalid hex characters detected" };
  }

  if (cleaned.length % 2 !== 0) {
    return { text: "", error: "Hex string must have even number of characters" };
  }

  if (cleaned.length === 0) {
    return { text: "", error: null };
  }

  try {
    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
    }

    const decoder = new TextDecoder("utf-8", { fatal: false });
    const text = decoder.decode(bytes);
    return { text, error: null };
  } catch (e) {
    return { text: "", error: "Failed to decode hex to text" };
  }
}

function detectMode(input: string): Mode {
  const trimmed = input.trim();
  // If it looks like hex (only hex chars, spaces, colons, 0x prefixes), assume hex-to-text
  const hexPattern = /^(0x)?[0-9a-fA-F]+([\s:,]+(0x)?[0-9a-fA-F]+)*$/;
  if (hexPattern.test(trimmed) && trimmed.length >= 2) {
    return "hex-to-text";
  }
  return "text-to-hex";
}

export default function HexTextPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("text-to-hex");
  const [format, setFormat] = useState<HexFormat>("lowercase");
  const [separator, setSeparator] = useState<Separator>("space");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    if (mode === "text-to-hex") {
      return { output: textToHex(input, format, separator), error: null };
    } else {
      const result = hexToText(input);
      return { output: result.text, error: result.error };
    }
  }, [input, mode, format, separator]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      // Auto-detect on paste
      if (value.length > 2 && !input) {
        setMode(detectMode(value));
      }
    },
    [input]
  );

  const stats = useMemo(() => {
    if (!input.trim()) return null;

    if (mode === "text-to-hex") {
      const bytes = new TextEncoder().encode(input).length;
      return { inputChars: input.length, bytes };
    } else {
      const hexBytes =
        input
          .replace(/0x/gi, "")
          .replace(/\\x/gi, "")
          .replace(/[:\s,]/g, "").length / 2;
      return { hexBytes: Math.floor(hexBytes), outputChars: output.length };
    }
  }, [input, output, mode]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "text-to-hex"
          ? "Enter text to convert to hex..."
          : "Enter hex bytes (48 65 6c 6c 6f)..."
      }
      outputPlaceholder={
        mode === "text-to-hex" ? "→ Hexadecimal bytes" : "→ Decoded text"
      }
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "text-to-hex" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("text-to-hex")}
            >
              Text → Hex
            </Button>
            <Button
              variant={mode === "hex-to-text" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("hex-to-text")}
            >
              Hex → Text
            </Button>
          </div>

          {mode === "text-to-hex" && (
            <>
              <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
                <Button
                  variant={format === "lowercase" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFormat("lowercase")}
                >
                  abc
                </Button>
                <Button
                  variant={format === "uppercase" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setFormat("uppercase")}
                >
                  ABC
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-text-muted">Separator:</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value as Separator)}
                  className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="space">Space (48 65)</option>
                  <option value="none">None (4865)</option>
                  <option value="colon">Colon (48:65)</option>
                  <option value="0x">0x prefix (0x48 0x65)</option>
                </select>
              </div>
            </>
          )}

          {stats && (
            <span className="text-xs text-text-muted">
              {mode === "text-to-hex"
                ? `${stats.inputChars} chars → ${stats.bytes} bytes`
                : `${stats.hexBytes} bytes → ${stats.outputChars} chars`}
            </span>
          )}
        </div>
      }
    />
  );
}
