"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";
import {
  encodeEntities,
  decodeEntities,
  encodeMinimal,
  entityModes,
  entityFormats,
  EntityMode,
  EntityFormat,
} from "@/lib/tools/html-entities";

type EncodeMode = "full" | "minimal";

export default function HTMLEntitiesPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EntityMode>("encode");
  const [format, setFormat] = useState<EntityFormat>("named");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("full");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null };

    try {
      let result;
      if (mode === "decode") {
        result = decodeEntities(input);
      } else if (encodeMode === "minimal") {
        result = encodeMinimal(input);
      } else {
        result = encodeEntities(input, format);
      }

      const lines = [result.output];
      if (result.stats.processed > 0) {
        lines.push("");
        lines.push("---");
        lines.push(`${result.stats.processed} characters ${mode === "encode" ? "encoded" : "decoded"}`);
      }

      return { output: lines.join("\n"), error: null };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Error processing entities",
      };
    }
  }, [input, mode, format, encodeMode]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleSample = useCallback(() => {
    if (mode === "encode") {
      setInput(`Hello <World> & "Friends"!
Special chars: © ® ™ € £ ¥
Arrows: ← → ↑ ↓
Math: ± × ÷ ≠ ≤ ≥
Quotes: "smart" 'quotes' — dash…`);
    } else {
      setInput(`Hello &lt;World&gt; &amp; &quot;Friends&quot;!
Special chars: &copy; &reg; &trade; &euro; &pound; &yen;
Arrows: &larr; &rarr; &uarr; &darr;
Math: &plusmn; &times; &divide; &ne; &le; &ge;
Numeric: &#60; &#x3E; &#38;`);
    }
  }, [mode]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={
        mode === "encode"
          ? "Paste text with <, >, & symbols"
          : "Paste text with &lt; &amp; entities"
      }
      outputPlaceholder={
        mode === "encode"
          ? `→ ${encodeMode === "minimal" ? "Minimal" : format === "named" ? "&amp; &lt;" : format === "numeric" ? "&#38; &#60;" : "&#x26; &#x3C;"}`
          : "→ Decoded < > & text"
      }
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {entityModes.map((m) => (
              <Button
                key={m.value}
                variant={mode === m.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setMode(m.value)}
              >
                {m.label}
              </Button>
            ))}
          </div>

          {mode === "encode" && (
            <>
              <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
                <Button
                  variant={encodeMode === "full" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setEncodeMode("full")}
                  title="Encode all special characters"
                >
                  Full
                </Button>
                <Button
                  variant={encodeMode === "minimal" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setEncodeMode("minimal")}
                  title="Only encode &lt;&gt;&quot;&amp;'"
                >
                  Minimal
                </Button>
              </div>

              {encodeMode === "full" && (
                <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
                  {entityFormats.map((f) => (
                    <Button
                      key={f.value}
                      variant={format === f.value ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setFormat(f.value)}
                      title={f.description}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}

          <Button variant="ghost" size="sm" onClick={handleSample}>
            Sample
          </Button>
        </div>
      }
    />
  );
}
