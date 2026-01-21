"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { testRegex, formatRegexResult, RegexFlags, defaultFlags } from "@/lib/tools/regex";

export default function RegexPage() {
  const [testString, setTestString] = useState("");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<RegexFlags>(defaultFlags);

  const result = useMemo(() => {
    return testRegex(pattern, testString, flags);
  }, [pattern, testString, flags]);

  const output = useMemo(() => {
    return formatRegexResult(result);
  }, [result]);

  const handleInputChange = useCallback((value: string) => {
    setTestString(value);
  }, []);

  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <ToolLayout
      input={testString}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter test string to match against..."
      error={!result.isValid ? result.error : null}
      options={
        <div className="flex flex-wrap items-center gap-3">
          {/* Pattern input */}
          <div className="flex items-center gap-2">
            <span className="text-text-muted">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="pattern"
              className="h-8 px-2 text-sm bg-bg-surface border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent font-mono min-w-[200px]"
            />
            <span className="text-text-muted">/</span>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-1">
            {(
              [
                { key: "global", label: "g", title: "Global" },
                { key: "ignoreCase", label: "i", title: "Ignore Case" },
                { key: "multiline", label: "m", title: "Multiline" },
                { key: "dotAll", label: "s", title: "Dot All" },
                { key: "unicode", label: "u", title: "Unicode" },
              ] as const
            ).map((flag) => (
              <button
                key={flag.key}
                onClick={() => toggleFlag(flag.key)}
                title={flag.title}
                className={`w-7 h-7 text-sm font-mono rounded transition-colors ${
                  flags[flag.key]
                    ? "bg-accent text-bg-darkest"
                    : "bg-bg-surface text-text-secondary hover:text-text-primary"
                }`}
              >
                {flag.label}
              </button>
            ))}
          </div>

          {/* Match count */}
          {result.isValid && pattern && (
            <span className="text-xs text-text-muted ml-auto">
              {result.count} match{result.count !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      }
    />
  );
}
