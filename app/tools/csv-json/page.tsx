"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Mode = "csv-to-json" | "json-to-csv";

function parseCSV(csv: string, delimiter: string = ","): Record<string, string>[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return [];

  // Parse a CSV line handling quoted fields
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const data: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    data.push(row);
  }

  return data;
}

function jsonToCSV(data: unknown[], delimiter: string = ","): string {
  if (!Array.isArray(data) || data.length === 0) return "";

  // Get all unique keys
  const headers = new Set<string>();
  data.forEach((item) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((key) => headers.add(key));
    }
  });

  const headerArray = Array.from(headers);

  // Escape field for CSV
  const escapeField = (value: unknown): string => {
    const str = value === null || value === undefined ? "" : String(value);
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headerArray.map(escapeField).join(delimiter),
    ...data.map((row) =>
      headerArray
        .map((header) => escapeField((row as Record<string, unknown>)[header]))
        .join(delimiter)
    ),
  ];

  return lines.join("\n");
}

function detectFormat(input: string): Mode | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try JSON first
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    try {
      JSON.parse(trimmed);
      return "json-to-csv";
    } catch {
      // Not valid JSON
    }
  }

  // Assume CSV
  return "csv-to-json";
}

export default function CsvJsonPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [delimiter, setDelimiter] = useState(",");
  const [prettyPrint, setPrettyPrint] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      if (mode === "csv-to-json") {
        const data = parseCSV(input, delimiter);
        if (data.length === 0) {
          return { output: "[]", error: null };
        }
        return {
          output: prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data),
          error: null,
        };
      } else {
        const parsed = JSON.parse(input);
        const data = Array.isArray(parsed) ? parsed : [parsed];
        const csv = jsonToCSV(data, delimiter);
        return { output: csv, error: null };
      }
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Conversion failed",
      };
    }
  }, [input, mode, delimiter, prettyPrint]);

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
      // Auto-detect format on paste
      const detected = detectFormat(value);
      if (detected && value.length > 10) {
        setMode(detected);
      }
    },
    []
  );

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "csv-to-json"
          ? "Paste CSV data (first row = headers)..."
          : "Paste JSON array..."
      }
      outputPlaceholder={mode === "csv-to-json" ? "→ JSON array" : "→ CSV data"}
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "csv-to-json" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("csv-to-json")}
            >
              CSV → JSON
            </Button>
            <Button
              variant={mode === "json-to-csv" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("json-to-csv")}
            >
              JSON → CSV
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Delimiter:</label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>

          {mode === "csv-to-json" && (
            <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={prettyPrint}
                onChange={(e) => setPrettyPrint(e.target.checked)}
                className="rounded border-border"
              />
              <span>Pretty print</span>
            </label>
          )}
        </div>
      }
    />
  );
}
