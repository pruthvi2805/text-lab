"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  processLines,
  listOperations,
  ListOperation,
  countLines,
  countUniqueLines,
} from "@/lib/tools/list";

export default function ListPage() {
  const [input, setInput] = useState("");
  const [operation, setOperation] = useState<ListOperation>("sort");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const output = useMemo(() => {
    return processLines(input, { operation, prefix, suffix });
  }, [input, operation, prefix, suffix]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const stats = useMemo(() => {
    if (!input.trim()) return null;
    return {
      total: countLines(input),
      unique: countUniqueLines(input),
    };
  }, [input]);

  const selectedOp = listOperations.find((o) => o.value === operation);
  const outputPlaceholder = selectedOp
    ? `${selectedOp.description}...`
    : "Processed list will appear here...";

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste list (one item per line)"
      outputPlaceholder={`→ ${selectedOp?.label || 'Processed'} output`}
      options={
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as ListOperation)}
            className="h-8 px-2 text-sm bg-bg-surface border border-border rounded text-text-primary focus:outline-none focus:border-accent"
          >
            {listOperations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>

          {operation === "prefix" && (
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Prefix text..."
              className="h-8 px-2 text-sm bg-bg-surface border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent w-32"
            />
          )}

          {operation === "suffix" && (
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="Suffix text..."
              className="h-8 px-2 text-sm bg-bg-surface border border-border rounded text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent w-32"
            />
          )}

          {stats && (
            <span className="text-xs text-text-muted ml-auto">
              {stats.total} lines • {stats.unique} unique
            </span>
          )}
        </div>
      }
    />
  );
}
