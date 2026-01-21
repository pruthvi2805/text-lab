"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  parseTimestamp,
  getCurrentTimestamp,
  formatTimestampOutput,
  TimestampUnit,
} from "@/lib/tools/timestamp";

export default function TimestampPage() {
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      const result = parseTimestamp(input, unit);
      return { output: formatTimestampOutput(result), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Error parsing timestamp",
      };
    }
  }, [input, unit]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleNow = useCallback(() => {
    const now = getCurrentTimestamp();
    setInput(unit === "seconds" ? now.unix.toString() : now.unixMs.toString());
  }, [unit]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter a Unix timestamp or date string... e.g. 1609459200 or 2021-01-01"
      outputPlaceholder="Converted timestamps and formatted dates will appear here..."
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={unit === "seconds" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setUnit("seconds")}
            >
              Seconds
            </Button>
            <Button
              variant={unit === "milliseconds" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setUnit("milliseconds")}
            >
              Milliseconds
            </Button>
          </div>

          <Button variant="secondary" size="sm" onClick={handleNow}>
            Now
          </Button>
        </div>
      }
    />
  );
}
