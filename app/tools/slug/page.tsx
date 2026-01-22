"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type SlugStyle = "kebab" | "snake" | "dot" | "camel" | "pascal";

const STYLES: { value: SlugStyle; label: string; example: string }[] = [
  { value: "kebab", label: "kebab-case", example: "hello-world" },
  { value: "snake", label: "snake_case", example: "hello_world" },
  { value: "dot", label: "dot.case", example: "hello.world" },
  { value: "camel", label: "camelCase", example: "helloWorld" },
  { value: "pascal", label: "PascalCase", example: "HelloWorld" },
];

function slugify(text: string, style: SlugStyle, lowercase: boolean, maxLength: number): string {
  if (!text.trim()) return "";

  // Normalize unicode characters (é -> e, etc.)
  let slug = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Replace special characters with spaces
  slug = slug.replace(/[^\w\s-]/g, " ");

  // Replace multiple spaces/hyphens with single space
  slug = slug.replace(/[\s_-]+/g, " ").trim();

  // Split into words
  const words = slug.split(" ").filter(Boolean);

  if (words.length === 0) return "";

  // Apply style
  switch (style) {
    case "kebab":
      slug = words.join("-");
      break;
    case "snake":
      slug = words.join("_");
      break;
    case "dot":
      slug = words.join(".");
      break;
    case "camel":
      slug = words
        .map((word, i) =>
          i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
      break;
    case "pascal":
      slug = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
      break;
  }

  // Apply lowercase (except for camel/pascal)
  if (lowercase && style !== "camel" && style !== "pascal") {
    slug = slug.toLowerCase();
  }

  // Trim to max length (at word boundary if possible)
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    // Remove trailing separator
    slug = slug.replace(/[-_.]$/, "");
  }

  return slug;
}

export default function SlugPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<SlugStyle>("kebab");
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);

  const output = useMemo(() => {
    if (!input.trim()) return "";

    // Process each line separately
    const lines = input.split("\n");
    const results = lines.map((line) => slugify(line, style, lowercase, maxLength));

    return results.join("\n");
  }, [input, style, lowercase, maxLength]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const allStyles = useMemo(() => {
    if (!input.trim()) return "";
    const firstLine = input.split("\n")[0];
    return STYLES.map(
      (s) => `${s.label}: ${slugify(firstLine, s.value, lowercase, maxLength)}`
    ).join("\n");
  }, [input, lowercase, maxLength]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter text to convert to slug(s)..."
      outputPlaceholder="→ URL-friendly slugs"
      options={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">Style:</span>
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            {STYLES.map((s) => (
              <Button
                key={s.value}
                variant={style === s.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setStyle(s.value)}
                title={s.example}
              >
                {s.label}
              </Button>
            ))}
          </div>

          {style !== "camel" && style !== "pascal" && (
            <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="rounded border-border"
              />
              <span>Lowercase</span>
            </label>
          )}

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Max length:</label>
            <input
              type="number"
              min={0}
              max={500}
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value, 10) || 0)}
              placeholder="0 = no limit"
              className="w-20 bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      }
      actions={
        input.trim() && (
          <div className="text-xs text-text-muted">
            <details>
              <summary className="cursor-pointer hover:text-text-secondary">
                Show all styles
              </summary>
              <pre className="mt-2 p-2 bg-bg-surface rounded text-text-secondary whitespace-pre-wrap">
                {allStyles}
              </pre>
            </details>
          </div>
        )
      }
    />
  );
}
