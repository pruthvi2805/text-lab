"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  generateLorem,
  formatLoremOutput,
  loremUnits,
  loremPresets,
  LoremUnit,
} from "@/lib/tools/lorem";

export default function LoremPage() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [regenerateKey, setRegenerateKey] = useState(0);

  const result = useMemo(() => {
    // Include regenerateKey in deps to force regeneration
    void regenerateKey;
    return generateLorem({ count, unit, startWithLorem });
  }, [count, unit, startWithLorem, regenerateKey]);

  const output = useMemo(() => {
    return formatLoremOutput(result);
  }, [result]);

  const handleInputChange = useCallback(() => {
    // Input is not used in generator mode
  }, []);

  const handleRegenerate = useCallback(() => {
    setRegenerateKey((k) => k + 1);
  }, []);

  const handlePreset = useCallback((preset: typeof loremPresets[0]) => {
    setCount(preset.count);
    setUnit(preset.unit);
    setRegenerateKey((k) => k + 1);
  }, []);

  return (
    <ToolLayout
      input=""
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="This tool generates text — no input needed. Adjust count and type above."
      outputPlaceholder={`${count} ${unit} of Lorem Ipsum text — click Regenerate for new random text`}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Count:</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
              className="w-16 bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {loremUnits.map((u) => (
              <Button
                key={u.value}
                variant={unit === u.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setUnit(u.value)}
              >
                {u.label}
              </Button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-border bg-bg-surface text-accent focus:ring-accent focus:ring-offset-0"
            />
            Start with "Lorem ipsum..."
          </label>

          <Button variant="secondary" size="sm" onClick={handleRegenerate}>
            Regenerate
          </Button>
        </div>
      }
      actions={
        <div className="flex flex-wrap gap-1">
          {loremPresets.slice(0, 4).map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      }
    />
  );
}
