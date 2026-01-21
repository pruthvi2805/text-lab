"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { decodeJwt, formatJwtOutput } from "@/lib/tools/jwt";

export default function JwtPage() {
  const [input, setInput] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      const parts = decodeJwt(input);
      return { output: formatJwtOutput(parts), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Error decoding JWT",
      };
    }
  }, [input]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste your JWT token here... (eyJhbGciOiJIUzI1NiIs...)"
      outputPlaceholder="Decoded header, payload, and expiration info will appear here..."
      error={error}
      options={
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="px-2 py-1 bg-warning/10 text-warning rounded">
            Decode only — signatures are not verified
          </span>
        </div>
      }
    />
  );
}
