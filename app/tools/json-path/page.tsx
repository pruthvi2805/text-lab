"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

// Simple JSONPath evaluator
function evaluateJSONPath(data: unknown, path: string): { result: unknown; error: string | null } {
  if (!path.trim()) return { result: data, error: null };

  try {
    // Normalize path
    let normalizedPath = path.trim();

    // Handle root reference
    if (normalizedPath === "$") return { result: data, error: null };

    // Remove leading $ if present
    if (normalizedPath.startsWith("$.")) {
      normalizedPath = normalizedPath.slice(2);
    } else if (normalizedPath.startsWith("$[")) {
      normalizedPath = normalizedPath.slice(1);
    } else if (normalizedPath.startsWith("$")) {
      normalizedPath = normalizedPath.slice(1);
    }

    // Parse and evaluate path segments
    let current: unknown = data;
    let remaining = normalizedPath;

    while (remaining.length > 0) {
      // Skip leading dots
      if (remaining.startsWith(".")) {
        remaining = remaining.slice(1);
        continue;
      }

      // Handle array index: [0] or [*]
      if (remaining.startsWith("[")) {
        const closeIndex = remaining.indexOf("]");
        if (closeIndex === -1) {
          return { result: null, error: "Unclosed bracket in path" };
        }

        const indexStr = remaining.slice(1, closeIndex);
        remaining = remaining.slice(closeIndex + 1);

        if (!Array.isArray(current)) {
          return { result: null, error: `Cannot index non-array at [${indexStr}]` };
        }

        if (indexStr === "*") {
          // Wildcard - return all elements
          current = current;
        } else if (indexStr.includes(":")) {
          // Slice notation [start:end]
          const [start, end] = indexStr.split(":").map((s) => (s ? parseInt(s) : undefined));
          current = current.slice(start, end);
        } else {
          const index = parseInt(indexStr);
          if (isNaN(index)) {
            return { result: null, error: `Invalid array index: ${indexStr}` };
          }
          current = current[index < 0 ? current.length + index : index];
        }
        continue;
      }

      // Handle property name (with optional quotes)
      let propName: string;
      if (remaining.startsWith("'") || remaining.startsWith('"')) {
        const quote = remaining[0];
        const endQuote = remaining.indexOf(quote, 1);
        if (endQuote === -1) {
          return { result: null, error: "Unclosed quote in property name" };
        }
        propName = remaining.slice(1, endQuote);
        remaining = remaining.slice(endQuote + 1);
      } else {
        // Find end of property name
        const match = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (!match) {
          return { result: null, error: `Invalid property name at: ${remaining.slice(0, 10)}...` };
        }
        propName = match[1];
        remaining = remaining.slice(propName.length);
      }

      // Handle wildcard
      if (propName === "*") {
        if (typeof current === "object" && current !== null) {
          current = Object.values(current);
        } else {
          return { result: null, error: "Cannot use wildcard on non-object" };
        }
        continue;
      }

      // Access property
      if (typeof current !== "object" || current === null) {
        return { result: null, error: `Cannot access property '${propName}' on non-object` };
      }

      if (Array.isArray(current)) {
        // Map over array elements
        current = current.map((item) => {
          if (typeof item === "object" && item !== null) {
            return (item as Record<string, unknown>)[propName];
          }
          return undefined;
        }).filter((v) => v !== undefined);
      } else {
        current = (current as Record<string, unknown>)[propName];
      }
    }

    return { result: current, error: null };
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : "Evaluation error" };
  }
}

const EXAMPLE_JSON = `{
  "store": {
    "name": "Book Store",
    "books": [
      { "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 10.99 },
      { "title": "1984", "author": "George Orwell", "price": 8.99 },
      { "title": "To Kill a Mockingbird", "author": "Harper Lee", "price": 12.99 }
    ],
    "location": {
      "city": "New York",
      "country": "USA"
    }
  }
}`;

const EXAMPLE_PATHS = [
  { path: "$", desc: "Root element" },
  { path: "$.store.name", desc: "Store name" },
  { path: "$.store.books[0]", desc: "First book" },
  { path: "$.store.books[*].title", desc: "All book titles" },
  { path: "$.store.books[-1]", desc: "Last book" },
  { path: "$.store.books[0:2]", desc: "First two books" },
  { path: "$.store.location.city", desc: "City" },
];

export default function JSONPathPage() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [path, setPath] = useState("$.store.books[*].title");

  const { parsedJSON, parseError } = useMemo(() => {
    if (!input.trim()) return { parsedJSON: null, parseError: null };
    try {
      return { parsedJSON: JSON.parse(input), parseError: null };
    } catch (e) {
      return { parsedJSON: null, parseError: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input]);

  const { result, evalError } = useMemo(() => {
    if (!parsedJSON || !path.trim()) return { result: null, evalError: null };
    const { result, error } = evaluateJSONPath(parsedJSON, path);
    return { result, evalError: error };
  }, [parsedJSON, path]);

  const output = useMemo(() => {
    if (parseError) return `JSON Parse Error: ${parseError}`;
    if (!parsedJSON) return "";
    if (!path.trim()) return "Enter a JSONPath expression";
    if (evalError) return `JSONPath Error: ${evalError}`;

    const lines = [
      "═══════════════════════════════════════════════════════════════════",
      "                     JSONPATH EVALUATION RESULT",
      "═══════════════════════════════════════════════════════════════════",
      "",
      `Path: ${path}`,
      `Type: ${Array.isArray(result) ? "array" : typeof result}`,
      result !== null && typeof result === "object"
        ? `Count: ${Array.isArray(result) ? result.length : Object.keys(result).length} items`
        : "",
      "",
      "───────────────────────────────────────────────────────────────────",
      "",
      JSON.stringify(result, null, 2),
      "",
      "═══════════════════════════════════════════════════════════════════",
    ];

    return lines.filter(Boolean).join("\n");
  }, [parsedJSON, path, result, parseError, evalError]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const applyExample = (examplePath: string) => {
    setPath(examplePath);
  };

  const loadExample = () => {
    setInput(EXAMPLE_JSON);
    setPath("$.store.books[*].title");
  };

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste JSON data..."
      outputPlaceholder="→ Query result"
      error={parseError || evalError}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <label className="text-xs text-text-muted whitespace-nowrap">Path:</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="$.path.to.value"
              className="flex-1 bg-bg-surface border border-border rounded px-2 py-1 text-sm font-mono text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Examples:</label>
            <select
              value=""
              onChange={(e) => e.target.value && applyExample(e.target.value)}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select...</option>
              {EXAMPLE_PATHS.map((ex) => (
                <option key={ex.path} value={ex.path}>
                  {ex.desc}
                </option>
              ))}
            </select>
          </div>

          <Button variant="ghost" size="sm" onClick={loadExample}>
            Load Example
          </Button>
        </div>
      }
    />
  );
}
