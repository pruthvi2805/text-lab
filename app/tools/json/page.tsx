"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/json";

type JsonMode = "format" | "minify";

export default function JsonPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<JsonMode>("format");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    const validation = validateJson(input);
    if (!validation.valid) {
      return { output: "", error: validation.error || "Invalid JSON" };
    }

    try {
      if (mode === "minify") {
        return { output: minifyJson(input), error: null };
      }
      return { output: formatJson(input, { indent, sortKeys }), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Error processing JSON",
      };
    }
  }, [input, mode, indent, sortKeys]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const outputPlaceholder = mode === "format"
    ? "Formatted JSON will appear here..."
    : "Minified JSON will appear here...";

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder='Paste JSON here — use Format or Minify above. Example: {"key": "value"}'
      outputPlaceholder={mode === "format"
        ? "Formatted JSON with proper indentation appears here instantly"
        : "Compact single-line JSON appears here instantly"
      }
      error={error}
      options={
        <>
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "format" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("format")}
            >
              Format
            </Button>
            <Button
              variant={mode === "minify" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("minify")}
            >
              Minify
            </Button>
          </div>

          {mode === "format" && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs text-text-secondary">Indent:</label>
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="h-7 px-2 text-xs bg-bg-surface border border-border rounded text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 space</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-bg-surface text-accent focus:ring-accent"
                />
                Sort keys
              </label>
            </>
          )}
        </>
      }
    />
  );
}
