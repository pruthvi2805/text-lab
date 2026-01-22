"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import { processBase64, Base64Mode, Base64Variant } from "@/lib/tools/base64";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Base64Mode>("encode");
  const [variant, setVariant] = useState<Base64Variant>("standard");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      return { output: processBase64(input, mode, variant), error: null };
    } catch (err) {
      const message =
        mode === "decode"
          ? "Invalid Base64 string"
          : "Error encoding to Base64";
      return { output: "", error: message };
    }
  }, [input, mode, variant]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const outputPlaceholder = mode === "encode"
    ? "Base64 encoded string will appear here..."
    : "Decoded text will appear here...";

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "encode"
          ? "Paste any text here — it will be encoded to Base64 instantly"
          : "Paste Base64 string here (e.g., SGVsbG8gV29ybGQ=) — decoded text appears instantly"
      }
      outputPlaceholder={
        mode === "encode"
          ? "Base64 encoded result appears here — ready to copy"
          : "Decoded plain text appears here — ready to copy"
      }
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
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

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-secondary">Variant:</label>
            <select
              value={variant}
              onChange={(e) => setVariant(e.target.value as Base64Variant)}
              className="h-7 px-2 text-xs bg-bg-surface border border-border rounded text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="standard">Standard</option>
              <option value="url-safe">URL-safe</option>
            </select>
          </div>
        </div>
      }
    />
  );
}
