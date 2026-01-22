"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  parseColor,
  formatColorOutput,
  colorFormats,
} from "@/lib/tools/color";

export default function ColorPage() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    return parseColor(input);
  }, [input]);

  const output = useMemo(() => {
    if (!result) return "";
    return formatColorOutput(result);
  }, [result]);

  const error = useMemo(() => {
    if (!input.trim()) return null;
    if (result && !result.valid) return result.error;
    return null;
  }, [input, result]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleSample = useCallback((format: string) => {
    const samples: Record<string, string> = {
      hex: "#58a6ff",
      rgb: "rgb(88, 166, 255)",
      hsl: "hsl(212, 100%, 67%)",
      hwb: "hwb(212 35% 0%)",
      cmyk: "cmyk(65, 35, 0, 0)",
      named: "steelblue",
    };
    setInput(samples[format] || samples.hex);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter color (#hex, rgb, hsl, name)"
      outputPlaceholder="→ All formats: HEX, RGB, HSL, CMYK"
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">Try:</span>
          {colorFormats.map((f) => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => handleSample(f.value)}
              title={f.example}
            >
              {f.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSample("named")}
            title="CSS named colors like 'steelblue'"
          >
            Named
          </Button>

          {result?.valid && result.color && (
            <div className="flex items-center gap-2 ml-auto">
              <div
                className="w-8 h-8 rounded border border-border shadow-inner"
                style={{ backgroundColor: result.color.hex }}
                title={result.color.hex}
              />
              <span className="text-sm font-mono text-text-muted">
                {result.color.hex}
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}
