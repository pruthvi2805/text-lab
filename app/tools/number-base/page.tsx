"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Base = "decimal" | "hex" | "octal" | "binary";

const BASES: { value: Base; label: string; prefix: string; radix: number }[] = [
  { value: "decimal", label: "Decimal", prefix: "", radix: 10 },
  { value: "hex", label: "Hex", prefix: "0x", radix: 16 },
  { value: "octal", label: "Octal", prefix: "0o", radix: 8 },
  { value: "binary", label: "Binary", prefix: "0b", radix: 2 },
];

function parseInput(input: string, base: Base): bigint | null {
  const cleaned = input.trim().toLowerCase();
  if (!cleaned) return null;

  // Remove common prefixes
  let value = cleaned;
  if (value.startsWith("0x")) value = value.slice(2);
  else if (value.startsWith("0b")) value = value.slice(2);
  else if (value.startsWith("0o")) value = value.slice(2);

  // Remove spaces and underscores (common separators)
  value = value.replace(/[\s_]/g, "");

  if (!value) return null;

  const baseInfo = BASES.find((b) => b.value === base);
  if (!baseInfo) return null;

  try {
    // Validate characters for the base
    const validChars = "0123456789abcdef".slice(0, baseInfo.radix);
    if (!value.split("").every((c) => validChars.includes(c))) {
      return null;
    }
    return BigInt(`0x${value}`.replace("0x", base === "hex" ? "0x" : "")) ||
           (base === "decimal" ? BigInt(value) : BigInt(parseInt(value, baseInfo.radix)));
  } catch {
    return null;
  }
}

function convertNumber(value: bigint): Record<Base, string> {
  const decimal = value.toString(10);
  const hex = value.toString(16).toUpperCase();
  const octal = value.toString(8);
  const binary = value.toString(2);

  return { decimal, hex, octal, binary };
}

function formatBinary(binary: string): string {
  // Group binary digits in 8-bit chunks for readability
  const padded = binary.padStart(Math.ceil(binary.length / 8) * 8, "0");
  return padded.match(/.{1,8}/g)?.join(" ") || binary;
}

function formatHex(hex: string): string {
  // Group hex digits in pairs
  if (hex.length <= 2) return hex;
  const padded = hex.length % 2 === 0 ? hex : "0" + hex;
  return padded.match(/.{1,2}/g)?.join(" ") || hex;
}

export default function NumberBasePage() {
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState<Base>("decimal");

  const result = useMemo(() => {
    if (!input.trim()) return null;

    // Try to parse with selected base
    let value: bigint | null = null;

    if (inputBase === "decimal") {
      try {
        const cleaned = input.trim().replace(/[\s_,]/g, "");
        if (/^-?\d+$/.test(cleaned)) {
          value = BigInt(cleaned);
        }
      } catch {
        value = null;
      }
    } else if (inputBase === "hex") {
      try {
        const cleaned = input.trim().toLowerCase().replace(/^0x/, "").replace(/[\s_]/g, "");
        if (/^[0-9a-f]+$/i.test(cleaned)) {
          value = BigInt("0x" + cleaned);
        }
      } catch {
        value = null;
      }
    } else if (inputBase === "octal") {
      try {
        const cleaned = input.trim().replace(/^0o/, "").replace(/[\s_]/g, "");
        if (/^[0-7]+$/.test(cleaned)) {
          value = BigInt("0o" + cleaned);
        }
      } catch {
        value = null;
      }
    } else if (inputBase === "binary") {
      try {
        const cleaned = input.trim().replace(/^0b/, "").replace(/[\s_]/g, "");
        if (/^[01]+$/.test(cleaned)) {
          value = BigInt("0b" + cleaned);
        }
      } catch {
        value = null;
      }
    }

    if (value === null) return null;

    return convertNumber(value);
  }, [input, inputBase]);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (!result) return "Invalid number for selected base";

    const lines: string[] = [
      `Decimal:  ${result.decimal}`,
      `Hex:      0x${result.hex} (${formatHex(result.hex)})`,
      `Octal:    0o${result.octal}`,
      `Binary:   0b${result.binary}`,
      ``,
      `Formatted Binary:`,
      formatBinary(result.binary),
    ];

    // Add bit information
    const bitLength = result.binary.length;
    lines.push(``);
    lines.push(`Bit length: ${bitLength}`);
    lines.push(`Byte length: ${Math.ceil(bitLength / 8)}`);

    return lines.join("\n");
  }, [input, result]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const error = useMemo(() => {
    if (!input.trim()) return null;
    if (!result) return "Invalid number for the selected base";
    return null;
  }, [input, result]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={`Enter a ${inputBase} number (e.g., ${
        inputBase === "decimal" ? "255" :
        inputBase === "hex" ? "0xFF or FF" :
        inputBase === "octal" ? "0o377 or 377" :
        "0b11111111 or 11111111"
      })`}
      outputPlaceholder="→ Converted values in all bases"
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">Input base:</span>
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {BASES.map((base) => (
              <Button
                key={base.value}
                variant={inputBase === base.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setInputBase(base.value)}
              >
                {base.label}
              </Button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
            <span>Supports:</span>
            <code className="px-1 bg-bg-surface rounded">0x</code>
            <code className="px-1 bg-bg-surface rounded">0o</code>
            <code className="px-1 bg-bg-surface rounded">0b</code>
            <span>prefixes</span>
          </div>
        </div>
      }
    />
  );
}
