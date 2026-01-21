export interface MarkdownResult {
  html: string;
  plainText: string;
  wordCount: number;
  charCount: number;
  lineCount: number;
}

/**
 * Parse Markdown and convert to HTML
 * Pure client-side implementation without external dependencies
 */
export function parseMarkdown(input: string): MarkdownResult {
  if (!input) {
    return {
      html: "",
      plainText: "",
      wordCount: 0,
      charCount: 0,
      lineCount: 0,
    };
  }

  const html = markdownToHTML(input);
  const plainText = stripHTML(html);

  return {
    html,
    plainText,
    wordCount: countWords(plainText),
    charCount: input.length,
    lineCount: input.split("\n").length,
  };
}

/**
 * Convert Markdown to HTML
 * Supports: headings, bold, italic, strikethrough, code, links, images,
 * lists, blockquotes, horizontal rules, tables, and code blocks
 */
function markdownToHTML(md: string): string {
  let html = md;

  // Escape HTML entities first (but preserve our markdown)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : "";
    return `<pre><code${langClass}>${code.trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Images (before links to avoid conflicts)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Auto-link URLs
  html = html.replace(
    /(?<!["\(])(https?:\/\/[^\s<]+[^\s<.,;:!?\)])/g,
    '<a href="$1">$1</a>'
  );

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Alternative headers (underline style)
  html = html.replace(/^(.+)\n={2,}$/gm, "<h1>$1</h1>");
  html = html.replace(/^(.+)\n-{2,}$/gm, "<h2>$1</h2>");

  // Bold and italic combinations
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/___([^_]+)___/g, "<strong><em>$1</em></strong>");

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // Horizontal rules
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "<hr />");

  // Blockquotes
  html = html.replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>");
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Tables
  html = processMarkdownTables(html);

  // Lists
  html = processMarkdownLists(html);

  // Paragraphs (wrap remaining text blocks)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Don't wrap block elements
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<p")
      ) {
        return trimmed;
      }
      // Wrap in paragraph
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, "\n\n");

  return html.trim();
}

/**
 * Process Markdown tables
 */
function processMarkdownTables(html: string): string {
  const lines = html.split("\n");
  const result: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if line is a table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(trimmed);
    } else {
      if (inTable) {
        result.push(buildTable(tableLines));
        inTable = false;
        tableLines = [];
      }
      result.push(line);
    }
  }

  if (inTable) {
    result.push(buildTable(tableLines));
  }

  return result.join("\n");
}

function buildTable(lines: string[]): string {
  if (lines.length < 2) return lines.join("\n");

  const rows = lines.map((line) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  // Check if second row is separator
  const isSeparator = rows[1]?.every((cell) => /^:?-+:?$/.test(cell));

  let html = "<table>\n";

  if (isSeparator) {
    // Header row
    html += "<thead>\n<tr>\n";
    for (const cell of rows[0]) {
      html += `<th>${cell}</th>\n`;
    }
    html += "</tr>\n</thead>\n";

    // Body rows
    if (rows.length > 2) {
      html += "<tbody>\n";
      for (let i = 2; i < rows.length; i++) {
        html += "<tr>\n";
        for (const cell of rows[i]) {
          html += `<td>${cell}</td>\n`;
        }
        html += "</tr>\n";
      }
      html += "</tbody>\n";
    }
  } else {
    // No header, all body
    html += "<tbody>\n";
    for (const row of rows) {
      html += "<tr>\n";
      for (const cell of row) {
        html += `<td>${cell}</td>\n`;
      }
      html += "</tr>\n";
    }
    html += "</tbody>\n";
  }

  html += "</table>";
  return html;
}

/**
 * Process Markdown lists
 */
function processMarkdownLists(html: string): string {
  const lines = html.split("\n");
  const result: string[] = [];
  let listStack: { type: "ul" | "ol"; indent: number }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

    if (unorderedMatch) {
      const indent = unorderedMatch[1].length;
      const content = unorderedMatch[2];
      handleListItem(result, listStack, "ul", indent, content);
    } else if (orderedMatch) {
      const indent = orderedMatch[1].length;
      const content = orderedMatch[3];
      handleListItem(result, listStack, "ol", indent, content);
    } else {
      // Close any open lists
      while (listStack.length > 0) {
        const list = listStack.pop()!;
        result.push(`</${list.type}>`);
      }
      result.push(line);
    }
  }

  // Close remaining lists
  while (listStack.length > 0) {
    const list = listStack.pop()!;
    result.push(`</${list.type}>`);
  }

  return result.join("\n");
}

function handleListItem(
  result: string[],
  listStack: { type: "ul" | "ol"; indent: number }[],
  type: "ul" | "ol",
  indent: number,
  content: string
): void {
  // Close lists with greater indent
  while (
    listStack.length > 0 &&
    listStack[listStack.length - 1].indent > indent
  ) {
    const list = listStack.pop()!;
    result.push(`</${list.type}>`);
  }

  // Check if we need to start a new list or change list type
  const currentList = listStack[listStack.length - 1];
  if (!currentList || currentList.indent < indent) {
    listStack.push({ type, indent });
    result.push(`<${type}>`);
  } else if (currentList.type !== type) {
    // Change list type
    result.push(`</${currentList.type}>`);
    currentList.type = type;
    result.push(`<${type}>`);
  }

  result.push(`<li>${content}</li>`);
}

/**
 * Strip HTML tags to get plain text
 */
function stripHTML(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Format stats for display
 */
export function formatMarkdownStats(result: MarkdownResult): string {
  return [
    `Words: ${result.wordCount}`,
    `Characters: ${result.charCount}`,
    `Lines: ${result.lineCount}`,
  ].join(" | ");
}

/**
 * Get CSS styles for the HTML preview
 */
export function getPreviewStyles(): string {
  return `
    .markdown-preview {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: inherit;
    }
    .markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
    .markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
      margin: 1.5em 0 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }
    .markdown-preview h1 { font-size: 2em; border-bottom: 1px solid var(--border, #30363d); padding-bottom: 0.3em; }
    .markdown-preview h2 { font-size: 1.5em; border-bottom: 1px solid var(--border, #30363d); padding-bottom: 0.3em; }
    .markdown-preview h3 { font-size: 1.25em; }
    .markdown-preview h4 { font-size: 1em; }
    .markdown-preview h5 { font-size: 0.875em; }
    .markdown-preview h6 { font-size: 0.85em; opacity: 0.8; }
    .markdown-preview p { margin: 1em 0; }
    .markdown-preview a { color: var(--accent, #58a6ff); text-decoration: none; }
    .markdown-preview a:hover { text-decoration: underline; }
    .markdown-preview code {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      background: var(--bg-surface, #21262d);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.875em;
    }
    .markdown-preview pre {
      background: var(--bg-surface, #21262d);
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1em 0;
    }
    .markdown-preview pre code {
      background: none;
      padding: 0;
    }
    .markdown-preview blockquote {
      border-left: 4px solid var(--accent, #58a6ff);
      margin: 1em 0;
      padding-left: 1em;
      opacity: 0.85;
    }
    .markdown-preview ul, .markdown-preview ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    .markdown-preview li { margin: 0.25em 0; }
    .markdown-preview hr {
      border: none;
      border-top: 1px solid var(--border, #30363d);
      margin: 2em 0;
    }
    .markdown-preview table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    .markdown-preview th, .markdown-preview td {
      border: 1px solid var(--border, #30363d);
      padding: 0.5em 1em;
      text-align: left;
    }
    .markdown-preview th {
      background: var(--bg-surface, #21262d);
      font-weight: 600;
    }
    .markdown-preview img {
      max-width: 100%;
      height: auto;
    }
    .markdown-preview del {
      opacity: 0.6;
    }
  `;
}
