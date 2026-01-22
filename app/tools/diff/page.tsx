"use client";

import { useState, useCallback, useMemo } from "react";
import { Shell } from "@/components/layout";
import { CodeEditor } from "@/components/editor";
import { Button } from "@/components/ui/Button";
import { CopyIcon, CheckIcon, TrashIcon } from "@/components/ui/icons";
import {
  computeDiff,
  formatDiffResult,
  diffModes,
  DiffMode,
} from "@/lib/tools/diff";

export default function DiffPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [mode, setMode] = useState<DiffMode>("line");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!original && !modified) return null;
    return computeDiff(original, modified, mode);
  }, [original, modified, mode]);

  const output = useMemo(() => {
    if (!result) return "";
    return formatDiffResult(result, mode);
  }, [result, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setOriginal("");
    setModified("");
  }, []);

  const handleSwap = useCallback(() => {
    setOriginal(modified);
    setModified(original);
  }, [original, modified]);

  return (
    <Shell inputLength={original.length + modified.length} outputLength={output.length}>
      <div className="flex flex-col h-full">
        {/* Options bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-panel border-b border-border overflow-x-auto">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {diffModes.map((m) => (
              <Button
                key={m.value}
                variant={mode === m.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setMode(m.value)}
                title={m.description}
              >
                {m.label}
              </Button>
            ))}
          </div>

          <Button variant="secondary" size="sm" onClick={handleSwap}>
            Swap
          </Button>

          <Button variant="ghost" size="sm" onClick={handleClear}>
            <TrashIcon size={14} />
            <span className="ml-1">Clear All</span>
          </Button>
        </div>

        {/* Main content area - 3 columns on desktop */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Original text panel */}
          <div className="flex-1 flex flex-col min-h-0 lg:border-r border-border">
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <span className="text-xs text-text-muted uppercase tracking-wide">Original</span>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={original}
                onChange={setOriginal}
                placeholder="Paste the original/old version here"
              />
            </div>
          </div>

          {/* Modified text panel */}
          <div className="flex-1 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-r border-border">
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <span className="text-xs text-text-muted uppercase tracking-wide">Modified</span>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={modified}
                onChange={setModified}
                placeholder="Paste the new/modified version here"
              />
            </div>
          </div>

          {/* Diff output panel */}
          <div className="flex-1 flex flex-col min-h-0 border-t lg:border-t-0 border-border">
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted uppercase tracking-wide">Diff</span>
                {result && (
                  <span className="text-xs text-text-muted">
                    <span className="text-success">+{result.stats.additions}</span>
                    {" / "}
                    <span className="text-error">-{result.stats.deletions}</span>
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={output}
                readOnly
                placeholder="Differences shown here: + added, - removed. Use Line/Word/Char mode above."
              />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
