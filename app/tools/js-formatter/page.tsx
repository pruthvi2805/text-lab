"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Language = "javascript" | "css";
type Mode = "beautify" | "minify";
type IndentStyle = "2" | "4" | "tab";

// Simple JavaScript beautifier
function beautifyJS(code: string, indentStyle: IndentStyle): string {
  if (!code.trim()) return "";

  const indent = indentStyle === "tab" ? "\t" : " ".repeat(parseInt(indentStyle));
  let result = "";
  let indentLevel = 0;
  let inString: string | null = null;
  let inComment = false;
  let inMultiComment = false;
  let prevChar = "";

  // Normalize line endings and trim
  code = code.replace(/\r\n/g, "\n").trim();

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1] || "";

    // Handle strings
    if (!inComment && !inMultiComment) {
      if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
        if (inString === char) {
          inString = null;
        } else if (!inString) {
          inString = char;
        }
      }
    }

    // Handle comments
    if (!inString) {
      if (char === "/" && nextChar === "/" && !inMultiComment) {
        inComment = true;
      }
      if (char === "/" && nextChar === "*" && !inComment) {
        inMultiComment = true;
      }
      if (char === "*" && nextChar === "/" && inMultiComment) {
        result += "*/";
        inMultiComment = false;
        i++;
        prevChar = "/";
        continue;
      }
      if (char === "\n" && inComment) {
        inComment = false;
      }
    }

    // Format if not in string or comment
    if (!inString && !inComment && !inMultiComment) {
      if (char === "{") {
        result += " {\n" + indent.repeat(++indentLevel);
        prevChar = char;
        continue;
      }
      if (char === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
        result = result.trimEnd() + "\n" + indent.repeat(indentLevel) + "}";
        if (nextChar !== "," && nextChar !== ";" && nextChar !== ")" && nextChar !== "}") {
          result += "\n" + indent.repeat(indentLevel);
        }
        prevChar = char;
        continue;
      }
      if (char === ";") {
        result += ";\n" + indent.repeat(indentLevel);
        prevChar = char;
        continue;
      }
      if (char === ",") {
        result += ",\n" + indent.repeat(indentLevel);
        prevChar = char;
        continue;
      }
      if (char === "\n") {
        if (prevChar !== "\n" && prevChar !== "{" && prevChar !== ";") {
          result += "\n" + indent.repeat(indentLevel);
        }
        prevChar = char;
        continue;
      }
      // Skip extra spaces
      if (char === " " && (prevChar === " " || prevChar === "\n" || prevChar === "{")) {
        continue;
      }
    }

    result += char;
    prevChar = char;
  }

  // Clean up extra newlines
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/{\s*\n\s*\n/g, "{\n");

  return result.trim();
}

// Simple CSS beautifier
function beautifyCSS(code: string, indentStyle: IndentStyle): string {
  if (!code.trim()) return "";

  const indent = indentStyle === "tab" ? "\t" : " ".repeat(parseInt(indentStyle));
  let result = "";
  let indentLevel = 0;

  // Normalize and prepare
  code = code.replace(/\r\n/g, "\n").trim();

  // Add newlines around braces and semicolons
  code = code.replace(/\{/g, " {\n");
  code = code.replace(/\}/g, "\n}\n");
  code = code.replace(/;/g, ";\n");

  const lines = code.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed === "}") {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    result += indent.repeat(indentLevel) + trimmed + "\n";

    if (trimmed.endsWith("{")) {
      indentLevel++;
    }
  }

  // Clean up
  result = result.replace(/\n{3,}/g, "\n\n");
  result = result.replace(/\{\s*\n\s*\n/g, "{\n");

  return result.trim();
}

// Simple minifier for JS
function minifyJS(code: string): string {
  if (!code.trim()) return "";

  let result = "";
  let inString: string | null = null;
  let inComment = false;
  let inMultiComment = false;
  let prevChar = "";
  let prevNonSpace = "";

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1] || "";

    // Handle strings
    if (!inComment && !inMultiComment) {
      if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
        if (inString === char) {
          inString = null;
        } else if (!inString) {
          inString = char;
        }
      }
    }

    // Handle comments
    if (!inString) {
      if (char === "/" && nextChar === "/") {
        inComment = true;
        continue;
      }
      if (char === "/" && nextChar === "*") {
        inMultiComment = true;
        i++;
        continue;
      }
      if (char === "*" && nextChar === "/" && inMultiComment) {
        inMultiComment = false;
        i++;
        continue;
      }
      if (char === "\n") {
        if (inComment) {
          inComment = false;
        }
        if (!inMultiComment) {
          // Add newline only if needed for ASI
          const needsNewline = /[a-zA-Z0-9_$)\]"'`]/.test(prevNonSpace);
          if (needsNewline && result.slice(-1) !== ";") {
            result += "\n";
          }
        }
        continue;
      }
    }

    if (inComment || inMultiComment) continue;

    // Skip extra whitespace
    if (/\s/.test(char)) {
      if (inString) {
        result += char;
      } else if (/[a-zA-Z0-9_$]/.test(prevNonSpace) && /[a-zA-Z0-9_$]/.test(nextChar)) {
        result += " ";
      }
      continue;
    }

    result += char;
    prevChar = char;
    prevNonSpace = char;
  }

  return result.trim();
}

// Simple minifier for CSS
function minifyCSS(code: string): string {
  if (!code.trim()) return "";

  // Remove comments
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "");

  // Remove newlines and extra spaces
  result = result.replace(/\s+/g, " ");

  // Remove spaces around special characters
  result = result.replace(/\s*([{};:,>~+])\s*/g, "$1");

  // Remove trailing semicolons before closing braces
  result = result.replace(/;}/g, "}");

  return result.trim();
}

export default function JSFormatterPage() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [mode, setMode] = useState<Mode>("beautify");
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("2");

  const output = useMemo(() => {
    if (!input.trim()) return "";

    if (mode === "minify") {
      return language === "javascript" ? minifyJS(input) : minifyCSS(input);
    }

    return language === "javascript"
      ? beautifyJS(input, indentStyle)
      : beautifyCSS(input, indentStyle);
  }, [input, language, mode, indentStyle]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const stats = useMemo(() => {
    if (!input.trim() || !output) return null;
    const inputSize = new Blob([input]).size;
    const outputSize = new Blob([output]).size;
    const diff = inputSize - outputSize;
    const percent = inputSize > 0 ? Math.abs((diff / inputSize) * 100).toFixed(1) : 0;
    return {
      inputSize,
      outputSize,
      diff,
      percent,
      reduced: diff > 0,
    };
  }, [input, output]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={`Paste your ${language === "javascript" ? "JavaScript" : "CSS"} code...`}
      outputPlaceholder={`→ ${mode === "beautify" ? "Formatted" : "Minified"} ${language === "javascript" ? "JS" : "CSS"}`}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={language === "javascript" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("javascript")}
            >
              JavaScript
            </Button>
            <Button
              variant={language === "css" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setLanguage("css")}
            >
              CSS
            </Button>
          </div>

          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "beautify" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("beautify")}
            >
              Beautify
            </Button>
            <Button
              variant={mode === "minify" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("minify")}
            >
              Minify
            </Button>
          </div>

          {mode === "beautify" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-text-muted">Indent:</label>
              <select
                value={indentStyle}
                onChange={(e) => setIndentStyle(e.target.value as IndentStyle)}
                className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="tab">Tab</option>
              </select>
            </div>
          )}

          {stats && mode === "minify" && (
            <span className="text-xs text-text-muted">
              {stats.inputSize.toLocaleString()}B → {stats.outputSize.toLocaleString()}B
              {stats.reduced && (
                <span className="text-success ml-1">(-{stats.percent}%)</span>
              )}
            </span>
          )}
        </div>
      }
    />
  );
}
