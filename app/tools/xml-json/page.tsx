"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

type Mode = "xml-to-json" | "json-to-xml";

// Simple XML parser (handles most common cases)
function parseXML(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML: " + errorNode.textContent);
  }

  function nodeToObject(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Handle attributes
    if (node.attributes.length > 0) {
      const attrs: Record<string, string> = {};
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        attrs[`@${attr.name}`] = attr.value;
      }
      Object.assign(obj, attrs);
    }

    // Handle child nodes
    const children = Array.from(node.childNodes);
    const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[];
    const textContent = children
      .filter((c) => c.nodeType === Node.TEXT_NODE)
      .map((c) => c.textContent?.trim() || "")
      .join("")
      .trim();

    if (elementChildren.length === 0) {
      // Leaf node with just text
      if (Object.keys(obj).length === 0) {
        return textContent || null;
      }
      if (textContent) {
        obj["#text"] = textContent;
      }
      return obj;
    }

    // Group children by tag name
    const childGroups: Record<string, unknown[]> = {};
    elementChildren.forEach((child) => {
      const tagName = child.tagName;
      if (!childGroups[tagName]) {
        childGroups[tagName] = [];
      }
      childGroups[tagName].push(nodeToObject(child));
    });

    // Convert groups to object properties
    Object.entries(childGroups).forEach(([tagName, values]) => {
      obj[tagName] = values.length === 1 ? values[0] : values;
    });

    if (textContent) {
      obj["#text"] = textContent;
    }

    return obj;
  }

  const root = doc.documentElement;
  return { [root.tagName]: nodeToObject(root) };
}

// Simple JSON to XML converter
function jsonToXML(json: unknown, indent: number = 2): string {
  function escapeXML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function convert(obj: unknown, tagName: string, level: number): string {
    const indentStr = " ".repeat(level * indent);
    const childIndent = " ".repeat((level + 1) * indent);

    if (obj === null || obj === undefined) {
      return `${indentStr}<${tagName}/>\n`;
    }

    if (typeof obj !== "object") {
      return `${indentStr}<${tagName}>${escapeXML(String(obj))}</${tagName}>\n`;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => convert(item, tagName, level)).join("");
    }

    const record = obj as Record<string, unknown>;
    const attrs: string[] = [];
    const children: string[] = [];
    let textContent = "";

    Object.entries(record).forEach(([key, value]) => {
      if (key.startsWith("@")) {
        attrs.push(`${key.slice(1)}="${escapeXML(String(value))}"`);
      } else if (key === "#text") {
        textContent = escapeXML(String(value));
      } else {
        children.push(convert(value, key, level + 1));
      }
    });

    const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

    if (children.length === 0 && !textContent) {
      return `${indentStr}<${tagName}${attrStr}/>\n`;
    }

    if (children.length === 0) {
      return `${indentStr}<${tagName}${attrStr}>${textContent}</${tagName}>\n`;
    }

    return `${indentStr}<${tagName}${attrStr}>\n${children.join("")}${textContent ? childIndent + textContent + "\n" : ""}${indentStr}</${tagName}>\n`;
  }

  if (typeof json !== "object" || json === null) {
    return convert(json, "root", 0);
  }

  const record = json as Record<string, unknown>;
  const keys = Object.keys(record);

  if (keys.length === 1) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(record[keys[0]], keys[0], 0)}`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(json, "root", 0)}`;
}

function detectFormat(input: string): Mode | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("<")) {
    return "xml-to-json";
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return "json-to-xml";
  }

  return null;
}

export default function XmlJsonPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("xml-to-json");
  const [prettyPrint, setPrettyPrint] = useState(true);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null };

    try {
      if (mode === "xml-to-json") {
        const parsed = parseXML(input);
        return {
          output: prettyPrint ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed),
          error: null,
        };
      } else {
        const parsed = JSON.parse(input);
        const xml = jsonToXML(parsed, prettyPrint ? 2 : 0);
        return { output: xml.trim(), error: null };
      }
    } catch (e) {
      return {
        output: "",
        error: e instanceof Error ? e.message : "Conversion failed",
      };
    }
  }, [input, mode, prettyPrint]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    // Auto-detect format
    const detected = detectFormat(value);
    if (detected && value.length > 5) {
      setMode(detected);
    }
  }, []);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder={mode === "xml-to-json" ? "Paste XML data..." : "Paste JSON data..."}
      outputPlaceholder={mode === "xml-to-json" ? "→ JSON" : "→ XML"}
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-surface rounded p-0.5">
            <Button
              variant={mode === "xml-to-json" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("xml-to-json")}
            >
              XML → JSON
            </Button>
            <Button
              variant={mode === "json-to-xml" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setMode("json-to-xml")}
            >
              JSON → XML
            </Button>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={prettyPrint}
              onChange={(e) => setPrettyPrint(e.target.checked)}
              className="rounded border-border"
            />
            <span>Pretty print</span>
          </label>

          <span className="text-xs text-text-muted hidden md:inline">
            Attributes → @attr, Text content → #text
          </span>
        </div>
      }
    />
  );
}
