"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type IndentStyle = "2" | "4" | "tab";

// SQL keywords for formatting
const KEYWORDS_NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "ORDER BY", "GROUP BY", "HAVING",
  "LIMIT", "OFFSET", "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN",
  "OUTER JOIN", "FULL JOIN", "CROSS JOIN", "ON", "SET", "VALUES",
  "INSERT INTO", "UPDATE", "DELETE FROM", "CREATE TABLE", "ALTER TABLE",
  "DROP TABLE", "CREATE INDEX", "UNION", "UNION ALL", "EXCEPT", "INTERSECT",
  "CASE", "WHEN", "THEN", "ELSE", "END", "WITH",
];

const KEYWORDS_UPPERCASE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "LIKE", "BETWEEN", "EXISTS", "ORDER", "BY", "GROUP", "HAVING",
  "LIMIT", "OFFSET", "ASC", "DESC", "AS", "ON", "JOIN", "LEFT", "RIGHT",
  "INNER", "OUTER", "FULL", "CROSS", "INSERT", "INTO", "VALUES", "UPDATE",
  "SET", "DELETE", "CREATE", "TABLE", "INDEX", "DROP", "ALTER", "ADD",
  "COLUMN", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE",
  "DEFAULT", "CONSTRAINT", "CHECK", "UNION", "ALL", "EXCEPT", "INTERSECT",
  "CASE", "WHEN", "THEN", "ELSE", "END", "DISTINCT", "TOP", "WITH",
  "TRUE", "FALSE", "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE",
  "NULLIF", "CAST", "CONVERT", "OVER", "PARTITION", "ROW_NUMBER", "RANK",
];

function formatSQL(sql: string, indentStyle: IndentStyle, uppercase: boolean): string {
  if (!sql.trim()) return "";

  const indent = indentStyle === "tab" ? "\t" : " ".repeat(parseInt(indentStyle));

  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, " ").trim();

  // Handle string literals - temporarily replace them
  const strings: string[] = [];
  formatted = formatted.replace(/'([^']*(?:''[^']*)*)'/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // Uppercase keywords if requested
  if (uppercase) {
    KEYWORDS_UPPERCASE.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      formatted = formatted.replace(regex, keyword);
    });
  }

  // Add newlines before major keywords
  KEYWORDS_NEWLINE_BEFORE.forEach((keyword) => {
    const regex = new RegExp(`\\s+${keyword.replace(/ /g, "\\s+")}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${uppercase ? keyword : keyword.toLowerCase()}`);
  });

  // Handle opening parentheses - add newline and indent
  formatted = formatted.replace(/\(\s*/g, "(\n" + indent);

  // Handle closing parentheses
  formatted = formatted.replace(/\s*\)/g, "\n)");

  // Handle commas in SELECT list - add newline
  let inSelect = false;
  let parenDepth = 0;
  const chars = formatted.split("");
  const result: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (formatted.slice(i, i + 6).toUpperCase() === "SELECT") {
      inSelect = true;
    } else if (formatted.slice(i, i + 4).toUpperCase() === "FROM") {
      inSelect = false;
    }

    if (char === "(") parenDepth++;
    if (char === ")") parenDepth--;

    if (char === "," && inSelect && parenDepth === 0) {
      result.push(",\n" + indent);
      // Skip any following whitespace
      while (chars[i + 1] === " ") i++;
    } else {
      result.push(char);
    }
  }

  formatted = result.join("");

  // Clean up multiple newlines
  formatted = formatted.replace(/\n\s*\n/g, "\n");

  // Add proper indentation for nested clauses
  const lines = formatted.split("\n");
  const indentedLines: string[] = [];
  let currentIndent = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Decrease indent for closing paren or END
    if (trimmed === ")" || trimmed.toUpperCase() === "END") {
      currentIndent = Math.max(0, currentIndent - 1);
    }

    indentedLines.push(indent.repeat(currentIndent) + trimmed);

    // Increase indent after opening paren or CASE
    if (trimmed.endsWith("(") || trimmed.toUpperCase() === "CASE") {
      currentIndent++;
    }
  });

  formatted = indentedLines.join("\n");

  // Restore string literals
  strings.forEach((str, i) => {
    formatted = formatted.replace(`__STRING_${i}__`, str);
  });

  return formatted;
}

function minifySQL(sql: string): string {
  if (!sql.trim()) return "";

  // Handle string literals
  const strings: string[] = [];
  let result = sql.replace(/'([^']*(?:''[^']*)*)'/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // Collapse whitespace
  result = result.replace(/\s+/g, " ").trim();

  // Restore string literals
  strings.forEach((str, i) => {
    result = result.replace(`__STRING_${i}__`, str);
  });

  return result;
}

export default function SQLPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [indentStyle, setIndentStyle] = useState<IndentStyle>("2");
  const [uppercase, setUppercase] = useState(true);

  const output = useMemo(() => {
    if (!input.trim()) return "";

    if (mode === "minify") {
      return minifySQL(input);
    }

    return formatSQL(input, indentStyle, uppercase);
  }, [input, mode, indentStyle, uppercase]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Paste your SQL query..."
      outputPlaceholder="→ Formatted SQL"
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "format" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("format")}
            >
              Format
            </Button>
            <Button
              variant={mode === "minify" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("minify")}
            >
              Minify
            </Button>
          </div>

          {mode === "format" && (
            <>
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

              <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded border-border"
                />
                <span>Uppercase keywords</span>
              </label>
            </>
          )}
        </div>
      }
    />
  );
}
