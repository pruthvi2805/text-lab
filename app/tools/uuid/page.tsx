"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  generateMultipleUUIDs,
  parseUUID,
  formatUUIDOutput,
  formatParseOutput,
  uuidVersions,
  UUIDVersion,
} from "@/lib/tools/uuid";

type Mode = "generate" | "validate";

export default function UUIDPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("generate");
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [count, setCount] = useState(1);

  const output = useMemo(() => {
    if (mode === "generate") {
      const results = generateMultipleUUIDs(count, version);
      return formatUUIDOutput(results);
    } else {
      if (!input.trim()) return "";
      const result = parseUUID(input);
      return formatParseOutput(result);
    }
  }, [mode, input, version, count]);

  const error = useMemo(() => {
    if (mode === "validate" && input.trim()) {
      const result = parseUUID(input);
      return result.valid ? null : result.error;
    }
    return null;
  }, [mode, input]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleGenerate = useCallback(() => {
    // Force re-render with new UUIDs
    setCount((c) => c);
    setInput("");
    setMode("generate");
  }, []);

  const handleGenerateMore = useCallback(() => {
    const newUUIDs = generateMultipleUUIDs(count, version);
    setInput((prev) => {
      if (!prev.trim()) return newUUIDs.map((u) => u.uuid).join("\n");
      return prev + "\n" + newUUIDs.map((u) => u.uuid).join("\n");
    });
  }, [count, version]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "validate"
          ? "Paste a UUID to validate and analyze..."
          : "Generated UUIDs will also appear here for batch generation..."
      }
      outputPlaceholder={
        mode === "validate"
          ? "UUID analysis will appear here..."
          : "Generated UUIDs will appear here..."
      }
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "generate" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("generate")}
            >
              Generate
            </Button>
            <Button
              variant={mode === "validate" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("validate")}
            >
              Validate
            </Button>
          </div>

          {mode === "generate" && (
            <>
              <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
                {uuidVersions.map((v) => (
                  <Button
                    key={v.value}
                    variant={version === v.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setVersion(v.value)}
                    title={v.description}
                  >
                    {v.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-text-muted">Count:</label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value={1}>1</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <Button variant="secondary" size="sm" onClick={handleGenerate}>
                New
              </Button>

              <Button variant="ghost" size="sm" onClick={handleGenerateMore}>
                + More
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}
