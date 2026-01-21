"use client";

import { ReactNode, useState, useCallback, useMemo } from "react";
import { Shell } from "@/components/layout";
import { CodeEditor } from "@/components/editor";
import { Button } from "@/components/ui/Button";
import { CopyIcon, CheckIcon, TrashIcon } from "@/components/ui/icons";

const LARGE_INPUT_THRESHOLD = 100000; // 100KB

interface ToolLayoutProps {
  children?: ReactNode;
  input: string;
  output: string;
  onInputChange: (value: string) => void;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  actions?: ReactNode;
  options?: ReactNode;
  error?: string | null;
  isProcessing?: boolean;
}

export function ToolLayout({
  input,
  output,
  onInputChange,
  inputPlaceholder = "Paste or type your input here...",
  outputPlaceholder = "Output will appear here...",
  actions,
  options,
  error,
  isProcessing = false,
}: ToolLayoutProps) {
  const [copied, setCopied] = useState(false);

  const isLargeInput = useMemo(() => input.length > LARGE_INPUT_THRESHOLD, [input.length]);

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
    onInputChange("");
  }, [onInputChange]);

  return (
    <Shell inputLength={input.length} outputLength={output.length}>
      <div className="flex flex-col h-full">
        {/* Options bar */}
        {options && (
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-panel border-b border-border overflow-x-auto">
            {options}
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Input panel */}
          <div className="flex-1 flex flex-col min-h-0 md:border-r border-border">
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <span className="text-xs text-text-muted uppercase tracking-wide">Input</span>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
                <TrashIcon size={14} />
                <span className="ml-1">Clear</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={input}
                onChange={onInputChange}
                placeholder={inputPlaceholder}
              />
            </div>
          </div>

          {/* Output panel */}
          <div className="flex-1 flex flex-col min-h-0 border-t md:border-t-0 border-border">
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted uppercase tracking-wide">Output</span>
                {isProcessing && (
                  <div className="flex items-center gap-1.5 text-xs text-accent">
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output || isProcessing}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span className="ml-1">{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0 relative">
              {isLargeInput && (
                <div className="absolute top-2 left-2 right-2 z-10">
                  <div className="text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-md">
                    Large input detected ({(input.length / 1000).toFixed(0)}KB). Processing may be slower.
                  </div>
                </div>
              )}
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-error text-sm bg-error/10 px-4 py-3 rounded-md max-w-md text-center">
                    {error}
                  </div>
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  readOnly
                  placeholder={outputPlaceholder}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile action bar */}
        {actions && (
          <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-bg-panel border-t border-border">
            {actions}
          </div>
        )}
      </div>
    </Shell>
  );
}
