"use client";

import { useState, useCallback, useMemo } from "react";
import { Shell } from "@/components/layout";
import { CodeEditor } from "@/components/editor";
import { Button } from "@/components/ui/Button";
import { CopyIcon, CheckIcon, TrashIcon } from "@/components/ui/icons";
import {
  parseMarkdown,
  formatMarkdownStats,
  getPreviewStyles,
} from "@/lib/tools/markdown";

type ViewMode = "preview" | "html" | "split";

export default function MarkdownPage() {
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return parseMarkdown(input);
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!result.html) return;
    try {
      await navigator.clipboard.writeText(result.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [result.html]);

  const handleClear = useCallback(() => {
    setInput("");
  }, []);

  const handleSample = useCallback(() => {
    setInput(`# Welcome to Markdown Preview

This is a **bold** and *italic* text example.

## Features

- Headings (h1-h6)
- **Bold** and *italic* text
- ~~Strikethrough~~
- Links: [Text Lab](https://text.kpruthvi.com)
- Images and more!

### Code Examples

Inline \`code\` looks like this.

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

### Blockquote

> This is a blockquote.
> It can span multiple lines.

### Table

| Feature | Status |
|---------|--------|
| Parsing | ✓ |
| Preview | ✓ |
| Export | ✓ |

---

Made with ❤️ using Text Lab`);
  }, []);

  return (
    <Shell inputLength={input.length} outputLength={result.html.length}>
      <style dangerouslySetInnerHTML={{ __html: getPreviewStyles() }} />
      <div className="flex flex-col h-full">
        {/* Options bar */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-bg-panel border-b border-border overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
              <Button
                variant={viewMode === "split" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("split")}
              >
                Split
              </Button>
              <Button
                variant={viewMode === "preview" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("preview")}
              >
                Preview
              </Button>
              <Button
                variant={viewMode === "html" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("html")}
              >
                HTML
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={handleSample}>
              Sample
            </Button>

            <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input}>
              <TrashIcon size={14} />
              <span className="ml-1">Clear</span>
            </Button>
          </div>

          {result.wordCount > 0 && (
            <span className="text-xs text-text-muted hidden sm:block">
              {formatMarkdownStats(result)}
            </span>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Input panel */}
          {(viewMode === "split" || viewMode === "html") && (
            <div className={`flex flex-col min-h-0 ${viewMode === "split" ? "flex-1 md:border-r border-border" : "flex-1"}`}>
              <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
                <span className="text-xs text-text-muted uppercase tracking-wide">Markdown</span>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={input}
                  onChange={setInput}
                  placeholder="Type Markdown here — # headings, **bold**, *italic*, - lists, ```code```. Live preview on right."
                />
              </div>
            </div>
          )}

          {/* Preview/HTML panel */}
          <div className={`flex flex-col min-h-0 ${viewMode === "split" ? "flex-1" : "flex-1"} ${viewMode !== "html" || "hidden"} border-t md:border-t-0 border-border`}>
            <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
              <span className="text-xs text-text-muted uppercase tracking-wide">
                {viewMode === "html" ? "HTML Output" : "Preview"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!result.html}
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span className="ml-1">{copied ? "Copied!" : "Copy HTML"}</span>
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {viewMode === "html" ? (
                <CodeEditor
                  value={result.html}
                  readOnly
                  placeholder="Generated HTML source code appears here — copy for use in web pages"
                />
              ) : (
                <div
                  className="markdown-preview p-4"
                  dangerouslySetInnerHTML={{ __html: result.html || '<p class="text-text-muted">Preview will appear here...</p>' }}
                />
              )}
            </div>
          </div>

          {/* HTML panel in split mode - hidden on mobile */}
          {viewMode === "split" && (
            <div className="hidden lg:flex flex-1 flex-col min-h-0 border-l border-border">
              <div className="flex items-center justify-between px-3 py-1.5 bg-bg-surface border-b border-border">
                <span className="text-xs text-text-muted uppercase tracking-wide">HTML</span>
              </div>
              <div className="flex-1 min-h-0">
                <CodeEditor
                  value={result.html}
                  readOnly
                  placeholder="HTML source code"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
