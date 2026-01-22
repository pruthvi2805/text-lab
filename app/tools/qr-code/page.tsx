"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tools";
import { Button } from "@/components/ui/Button";

// Simple QR Code generator using alphanumeric mode
// This is a simplified implementation for demonstration

const ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

// QR Code version/size configurations
const QR_VERSIONS = [
  { version: 1, size: 21, capacity: 25 },
  { version: 2, size: 25, capacity: 47 },
  { version: 3, size: 29, capacity: 77 },
  { version: 4, size: 33, capacity: 114 },
  { version: 5, size: 37, capacity: 154 },
  { version: 6, size: 41, capacity: 195 },
];

function createQRMatrix(data: string): number[][] | null {
  const upperData = data.toUpperCase();

  // Find appropriate version
  const version = QR_VERSIONS.find((v) => v.capacity >= upperData.length);
  if (!version) return null;

  const size = version.size;
  const matrix: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  // Add finder patterns (top-left, top-right, bottom-left)
  const addFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = row + r;
        const nc = col + c;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;

        if (r === -1 || r === 7 || c === -1 || c === 7) {
          matrix[nr][nc] = 0; // White border
        } else if (r === 0 || r === 6 || c === 0 || c === 6) {
          matrix[nr][nc] = 1; // Black outer
        } else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) {
          matrix[nr][nc] = 1; // Black center
        } else {
          matrix[nr][nc] = 0; // White inner
        }
      }
    }
  };

  addFinderPattern(0, 0);
  addFinderPattern(0, size - 7);
  addFinderPattern(size - 7, 0);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Encode data in a simple pattern
  // This is a simplified encoding - real QR needs proper Reed-Solomon
  let dataIndex = 0;
  const dataBits: number[] = [];

  // Convert to bits (simple encoding)
  for (const char of upperData) {
    const code = char.charCodeAt(0);
    for (let i = 7; i >= 0; i--) {
      dataBits.push((code >> i) & 1);
    }
  }

  // Fill data area (simplified - skipping reserved areas)
  let bitIndex = 0;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // Skip timing column

    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        const actualRow = (col + 1) % 4 < 2 ? size - 1 - row : row;

        // Skip finder and timing areas
        if (
          (actualRow < 9 && actualCol < 9) ||
          (actualRow < 9 && actualCol >= size - 8) ||
          (actualRow >= size - 8 && actualCol < 9) ||
          actualRow === 6 ||
          actualCol === 6
        ) {
          continue;
        }

        if (bitIndex < dataBits.length) {
          matrix[actualRow][actualCol] = dataBits[bitIndex++];
        } else {
          // Padding pattern
          matrix[actualRow][actualCol] = (actualRow + actualCol) % 2 === 0 ? 1 : 0;
        }
      }
    }
  }

  return matrix;
}

function renderQRToSVG(matrix: number[][], moduleSize: number, darkColor: string, lightColor: string): string {
  const size = matrix.length * moduleSize;
  const margin = moduleSize * 2;
  const totalSize = size + margin * 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="${lightColor}"/>`;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === 1) {
        const x = margin + col * moduleSize;
        const y = margin + row * moduleSize;
        svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${darkColor}"/>`;
      }
    }
  }

  svg += "</svg>";
  return svg;
}

export default function QRCodePage() {
  const [input, setInput] = useState("https://text.kpruthvi.com");
  const [moduleSize, setModuleSize] = useState(8);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { matrix, error } = useMemo(() => {
    if (!input.trim()) return { matrix: null, error: null };
    if (input.length > 150) return { matrix: null, error: "Input too long (max 150 characters)" };

    const m = createQRMatrix(input);
    if (!m) return { matrix: null, error: "Failed to generate QR code" };
    return { matrix: m, error: null };
  }, [input]);

  const svgContent = useMemo(() => {
    if (!matrix) return "";
    return renderQRToSVG(matrix, moduleSize, darkColor, lightColor);
  }, [matrix, moduleSize, darkColor, lightColor]);

  const handleDownloadSVG = useCallback(() => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [svgContent]);

  const handleDownloadPNG = useCallback(() => {
    if (!matrix) return;

    const canvas = document.createElement("canvas");
    const margin = moduleSize * 2;
    const size = matrix.length * moduleSize + margin * 2;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = lightColor;
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = darkColor;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 1) {
          ctx.fillRect(
            margin + col * moduleSize,
            margin + row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [matrix, moduleSize, darkColor, lightColor]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    if (error) return "";

    const lines = [
      "═══════════════════════════════════════",
      "           QR CODE GENERATED",
      "═══════════════════════════════════════",
      "",
      `Content: ${input.length > 50 ? input.slice(0, 50) + "..." : input}`,
      `Length: ${input.length} characters`,
      matrix ? `Size: ${matrix.length}x${matrix.length} modules` : "",
      "",
      "Use the buttons above to download",
      "as SVG or PNG format.",
      "",
      "═══════════════════════════════════════",
    ];

    return lines.join("\n");
  }, [input, matrix, error]);

  return (
    <ToolLayout
      input={input}
      output={output}
      onInputChange={handleInputChange}
      inputPlaceholder="Enter text or URL to encode..."
      outputPlaceholder="→ QR code info"
      error={error}
      options={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Size:</label>
            <select
              value={moduleSize}
              onChange={(e) => setModuleSize(parseInt(e.target.value))}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value={4}>Small</option>
              <option value={8}>Medium</option>
              <option value={12}>Large</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-text-muted">Colors:</label>
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-8 h-6 rounded border border-border cursor-pointer"
              title="Dark color"
            />
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-8 h-6 rounded border border-border cursor-pointer"
              title="Light color"
            />
          </div>

          {matrix && (
            <>
              <Button variant="secondary" size="sm" onClick={handleDownloadSVG}>
                Download SVG
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownloadPNG}>
                Download PNG
              </Button>
            </>
          )}
        </div>
      }
      actions={
        matrix && (
          <div
            className="flex justify-center p-4 bg-white rounded"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )
      }
    />
  );
}
