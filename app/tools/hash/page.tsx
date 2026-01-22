"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  generateHash,
  generateAllHashes,
  formatHashResults,
  hashAlgorithms,
  HashAlgorithm,
} from "@/lib/tools/hash";

export default function HashPage() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm | "all">("all");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setOutput("");
    setError(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!input.trim()) {
      setError("Please enter text to hash");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (algorithm === "all") {
        const results = await generateAllHashes(input);
        setOutput(formatHashResults(results));
      } else {
        const result = await generateHash(input, algorithm);
        setOutput(formatHashResults([result]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating hash");
    } finally {
      setIsProcessing(false);
    }
  }, [input, algorithm]);

  // Auto-generate on input change (debounced effect would be better for large inputs)
  useMemo(() => {
    if (input.trim()) {
      handleGenerate();
    }
  }, [input, algorithm]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Type or paste any text — hash values update as you type. Select algorithm above or use All."
      outputPlaceholder={algorithm === "all"
        ? "MD5, SHA-1, SHA-256, and SHA-512 hashes appear here"
        : `${algorithm.toUpperCase()} hash appears here`
      }
      error={error}
      isProcessing={isProcessing}
      options={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={algorithm === "all" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setAlgorithm("all")}
            >
              All
            </Button>
            {hashAlgorithms.map((algo) => (
              <Button
                key={algo.value}
                variant={algorithm === algo.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setAlgorithm(algo.value)}
              >
                {algo.label}
              </Button>
            ))}
          </div>
        </div>
      }
    />
  );
}
