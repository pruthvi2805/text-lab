"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  convert,
  autoConvert,
  formatConversionOutput,
  conversionDirections,
  ConversionDirection,
} from "@/lib/tools/yaml";

export default function YAMLPage() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<ConversionDirection | "auto">("auto");

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      let result;
      if (direction === "auto") {
        result = autoConvert(input);
      } else {
        result = convert(input, direction);
      }
      return { output: formatConversionOutput(result), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Conversion error",
      };
    }
  }, [input, direction]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleSample = useCallback((type: "yaml" | "json") => {
    if (type === "yaml") {
      setInput(`# Example YAML
name: Text Lab
version: 1.0.0
features:
  - JSON formatting
  - Base64 encoding
  - Hash generation
settings:
  theme: dark
  autosave: true
  indent: 2`);
      setDirection("yaml-to-json");
    } else {
      setInput(`{
  "name": "Text Lab",
  "version": "1.0.0",
  "features": [
    "JSON formatting",
    "Base64 encoding",
    "Hash generation"
  ],
  "settings": {
    "theme": "dark",
    "autosave": true,
    "indent": 2
  }
}`);
      setDirection("json-to-yaml");
    }
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste YAML or JSON here..."
      outputPlaceholder="Converted output will appear here..."
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={direction === "auto" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setDirection("auto")}
            >
              Auto
            </Button>
            {conversionDirections.map((d) => (
              <Button
                key={d.value}
                variant={direction === d.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setDirection(d.value)}
              >
                {d.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-text-muted">Sample:</span>
            <Button variant="ghost" size="sm" onClick={() => handleSample("yaml")}>
              YAML
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleSample("json")}>
              JSON
            </Button>
          </div>
        </div>
      }
    />
  );
}
