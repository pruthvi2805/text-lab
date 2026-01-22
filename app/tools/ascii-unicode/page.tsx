"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Mode = "table" | "lookup" | "convert";

// ASCII control character names
const CONTROL_CHARS: Record<number, string> = {
  0: "NUL (Null)",
  1: "SOH (Start of Heading)",
  2: "STX (Start of Text)",
  3: "ETX (End of Text)",
  4: "EOT (End of Transmission)",
  5: "ENQ (Enquiry)",
  6: "ACK (Acknowledge)",
  7: "BEL (Bell)",
  8: "BS (Backspace)",
  9: "HT (Horizontal Tab)",
  10: "LF (Line Feed)",
  11: "VT (Vertical Tab)",
  12: "FF (Form Feed)",
  13: "CR (Carriage Return)",
  14: "SO (Shift Out)",
  15: "SI (Shift In)",
  16: "DLE (Data Link Escape)",
  17: "DC1 (Device Control 1)",
  18: "DC2 (Device Control 2)",
  19: "DC3 (Device Control 3)",
  20: "DC4 (Device Control 4)",
  21: "NAK (Negative Acknowledge)",
  22: "SYN (Synchronous Idle)",
  23: "ETB (End of Trans. Block)",
  24: "CAN (Cancel)",
  25: "EM (End of Medium)",
  26: "SUB (Substitute)",
  27: "ESC (Escape)",
  28: "FS (File Separator)",
  29: "GS (Group Separator)",
  30: "RS (Record Separator)",
  31: "US (Unit Separator)",
  32: "SP (Space)",
  127: "DEL (Delete)",
};

function getCharInfo(codePoint: number): {
  char: string;
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  html: string;
  utf8: string;
  name: string;
} {
  const char = codePoint < 32 || codePoint === 127 ? "" : String.fromCodePoint(codePoint);
  const hex = codePoint.toString(16).toUpperCase().padStart(2, "0");
  const oct = codePoint.toString(8).padStart(3, "0");
  const bin = codePoint.toString(2).padStart(8, "0");
  const html = `&#${codePoint};`;

  // Calculate UTF-8 bytes
  let utf8: string;
  if (codePoint < 0x80) {
    utf8 = hex;
  } else if (codePoint < 0x800) {
    const b1 = 0xc0 | (codePoint >> 6);
    const b2 = 0x80 | (codePoint & 0x3f);
    utf8 = `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()}`;
  } else if (codePoint < 0x10000) {
    const b1 = 0xe0 | (codePoint >> 12);
    const b2 = 0x80 | ((codePoint >> 6) & 0x3f);
    const b3 = 0x80 | (codePoint & 0x3f);
    utf8 = `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()} ${b3.toString(16).toUpperCase()}`;
  } else {
    const b1 = 0xf0 | (codePoint >> 18);
    const b2 = 0x80 | ((codePoint >> 12) & 0x3f);
    const b3 = 0x80 | ((codePoint >> 6) & 0x3f);
    const b4 = 0x80 | (codePoint & 0x3f);
    utf8 = `${b1.toString(16).toUpperCase()} ${b2.toString(16).toUpperCase()} ${b3.toString(16).toUpperCase()} ${b4.toString(16).toUpperCase()}`;
  }

  const name = CONTROL_CHARS[codePoint] || char || `U+${hex}`;

  return { char, dec: codePoint, hex, oct, bin, html, utf8, name };
}

function generateAsciiTable(): string {
  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════════════════",
    "                            ASCII TABLE (0-127)",
    "═══════════════════════════════════════════════════════════════════════════",
    "",
    "DEC  HEX   OCT    BIN        CHAR   DESCRIPTION",
    "───  ────  ────   ────────   ────   ────────────────────",
  ];

  for (let i = 0; i <= 127; i++) {
    const info = getCharInfo(i);
    const charDisplay = i < 32 || i === 127 ? "    " : ` ${info.char}  `;
    lines.push(
      `${info.dec.toString().padStart(3)}  0x${info.hex}  ${info.oct}    ${info.bin}   ${charDisplay}  ${info.name}`
    );
  }

  return lines.join("\n");
}

function lookupCharacter(input: string): string {
  if (!input.trim()) return "";

  const lines: string[] = [];
  const chars = [...input]; // Properly handle multi-byte characters

  chars.forEach((char, index) => {
    const codePoint = char.codePointAt(0) || 0;
    const info = getCharInfo(codePoint);

    if (index > 0) lines.push("");

    lines.push(`Character: ${char}`);
    lines.push(`─────────────────────────`);
    lines.push(`Decimal:    ${info.dec}`);
    lines.push(`Hex:        U+${info.hex.padStart(4, "0")} (0x${info.hex})`);
    lines.push(`Octal:      ${info.oct}`);
    lines.push(`Binary:     ${info.bin}`);
    lines.push(`HTML:       ${info.html}`);
    lines.push(`UTF-8:      ${info.utf8}`);

    if (codePoint > 127) {
      lines.push(`UTF-16:     0x${codePoint.toString(16).toUpperCase()}`);
    }
  });

  return lines.join("\n");
}

function convertText(input: string, toFormat: string): string {
  if (!input.trim()) return "";

  const chars = [...input];
  const results: string[] = [];

  switch (toFormat) {
    case "decimal":
      results.push(chars.map((c) => c.codePointAt(0)).join(" "));
      break;
    case "hex":
      results.push(
        chars.map((c) => "0x" + (c.codePointAt(0) || 0).toString(16).toUpperCase()).join(" ")
      );
      break;
    case "unicode":
      results.push(
        chars
          .map((c) => "U+" + (c.codePointAt(0) || 0).toString(16).toUpperCase().padStart(4, "0"))
          .join(" ")
      );
      break;
    case "html":
      results.push(chars.map((c) => `&#${c.codePointAt(0)};`).join(""));
      break;
    case "htmlHex":
      results.push(
        chars.map((c) => `&#x${(c.codePointAt(0) || 0).toString(16).toUpperCase()};`).join("")
      );
      break;
  }

  return results.join("\n");
}

export default function AsciiUnicodePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("lookup");
  const [convertFormat, setConvertFormat] = useState("unicode");

  const output = useMemo(() => {
    if (mode === "table") {
      return generateAsciiTable();
    }

    if (!input.trim()) return "";

    if (mode === "lookup") {
      return lookupCharacter(input);
    }

    return convertText(input, convertFormat);
  }, [input, mode, convertFormat]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "table"
          ? "ASCII table shown on the right →"
          : mode === "lookup"
          ? "Enter characters to lookup..."
          : "Enter text to convert..."
      }
      outputPlaceholder={
        mode === "table"
          ? "→ Full ASCII table"
          : mode === "lookup"
          ? "→ Character details"
          : "→ Converted codes"
      }
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "lookup" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("lookup")}
            >
              Lookup
            </Button>
            <Button
              variant={mode === "convert" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("convert")}
            >
              Convert
            </Button>
            <Button
              variant={mode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("table")}
            >
              ASCII Table
            </Button>
          </div>

          {mode === "convert" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-muted">To:</label>
              <select
                value={convertFormat}
                onChange={(e) => setConvertFormat(e.target.value)}
                className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="unicode">Unicode (U+XXXX)</option>
                <option value="hex">Hex (0xXX)</option>
                <option value="decimal">Decimal</option>
                <option value="html">HTML Decimal (&#NNN;)</option>
                <option value="htmlHex">HTML Hex (&#xXX;)</option>
              </select>
            </div>
          )}
        </div>
      }
    />
  );
}
