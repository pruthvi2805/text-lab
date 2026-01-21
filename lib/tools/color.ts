export type ColorFormat = "hex" | "rgb" | "hsl" | "hwb" | "cmyk";

export interface ColorValue {
  hex: string;
  hexShort: string | null;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hwb: { h: number; w: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  css: {
    hex: string;
    rgb: string;
    hsl: string;
    hwb: string;
  };
}

export interface ColorParseResult {
  valid: boolean;
  color: ColorValue | null;
  inputFormat: ColorFormat | null;
  error: string | null;
}

/**
 * Parse a color from various formats
 */
export function parseColor(input: string): ColorParseResult {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return { valid: false, color: null, inputFormat: null, error: "Please enter a color value" };
  }

  // Try HEX
  const hexResult = parseHex(trimmed);
  if (hexResult) {
    return { valid: true, color: hexResult, inputFormat: "hex", error: null };
  }

  // Try RGB
  const rgbResult = parseRGB(trimmed);
  if (rgbResult) {
    return { valid: true, color: rgbResult, inputFormat: "rgb", error: null };
  }

  // Try HSL
  const hslResult = parseHSL(trimmed);
  if (hslResult) {
    return { valid: true, color: hslResult, inputFormat: "hsl", error: null };
  }

  // Try HWB
  const hwbResult = parseHWB(trimmed);
  if (hwbResult) {
    return { valid: true, color: hwbResult, inputFormat: "hwb", error: null };
  }

  // Try CMYK
  const cmykResult = parseCMYK(trimmed);
  if (cmykResult) {
    return { valid: true, color: cmykResult, inputFormat: "cmyk", error: null };
  }

  // Try named colors
  const namedResult = parseNamedColor(trimmed);
  if (namedResult) {
    return { valid: true, color: namedResult, inputFormat: "hex", error: null };
  }

  return {
    valid: false,
    color: null,
    inputFormat: null,
    error: "Could not parse color. Try formats like #ff5500, rgb(255, 85, 0), hsl(20, 100%, 50%)",
  };
}

/**
 * Parse HEX color
 */
function parseHex(input: string): ColorValue | null {
  let hex = input.replace(/^#/, "");

  // 3-char shorthand
  if (/^[0-9a-f]{3}$/i.test(hex)) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // 6-char full
  if (!/^[0-9a-f]{6}$/i.test(hex)) {
    return null;
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return createColorValue(r, g, b);
}

/**
 * Parse RGB color
 */
function parseRGB(input: string): ColorValue | null {
  const match = input.match(/^rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (!match) return null;

  const r = Math.min(255, parseInt(match[1], 10));
  const g = Math.min(255, parseInt(match[2], 10));
  const b = Math.min(255, parseInt(match[3], 10));

  return createColorValue(r, g, b);
}

/**
 * Parse HSL color
 */
function parseHSL(input: string): ColorValue | null {
  const match = input.match(/^hsla?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
  if (!match) return null;

  const h = parseInt(match[1], 10) % 360;
  const s = Math.min(100, parseInt(match[2], 10));
  const l = Math.min(100, parseInt(match[3], 10));

  const rgb = hslToRgb(h, s, l);
  return createColorValue(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse HWB color
 */
function parseHWB(input: string): ColorValue | null {
  const match = input.match(/^hwb\s*\(\s*(\d{1,3})\s*,?\s*(\d{1,3})%?\s*,?\s*(\d{1,3})%?/);
  if (!match) return null;

  const h = parseInt(match[1], 10) % 360;
  const w = Math.min(100, parseInt(match[2], 10));
  const b = Math.min(100, parseInt(match[3], 10));

  const rgb = hwbToRgb(h, w, b);
  return createColorValue(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse CMYK color
 */
function parseCMYK(input: string): ColorValue | null {
  const match = input.match(/^cmyk\s*\(\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/);
  if (!match) return null;

  const c = Math.min(100, parseInt(match[1], 10));
  const m = Math.min(100, parseInt(match[2], 10));
  const y = Math.min(100, parseInt(match[3], 10));
  const k = Math.min(100, parseInt(match[4], 10));

  const rgb = cmykToRgb(c, m, y, k);
  return createColorValue(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse named CSS colors
 */
function parseNamedColor(input: string): ColorValue | null {
  const colors: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    green: "#008000",
    blue: "#0000ff",
    yellow: "#ffff00",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    brown: "#a52a2a",
    gray: "#808080",
    grey: "#808080",
    silver: "#c0c0c0",
    gold: "#ffd700",
    navy: "#000080",
    teal: "#008080",
    olive: "#808000",
    maroon: "#800000",
    lime: "#00ff00",
    aqua: "#00ffff",
    fuchsia: "#ff00ff",
    coral: "#ff7f50",
    salmon: "#fa8072",
    tomato: "#ff6347",
    crimson: "#dc143c",
    indigo: "#4b0082",
    violet: "#ee82ee",
    turquoise: "#40e0d0",
    tan: "#d2b48c",
    chocolate: "#d2691e",
    firebrick: "#b22222",
    darkred: "#8b0000",
    darkgreen: "#006400",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkmagenta: "#8b008b",
    darkorange: "#ff8c00",
    darkviolet: "#9400d3",
    lightblue: "#add8e6",
    lightgreen: "#90ee90",
    lightgray: "#d3d3d3",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    steelblue: "#4682b4",
    royalblue: "#4169e1",
    skyblue: "#87ceeb",
    slategray: "#708090",
    slategrey: "#708090",
    transparent: "#000000",
  };

  const hex = colors[input];
  if (!hex) return null;

  return parseHex(hex);
}

/**
 * Create a ColorValue from RGB
 */
function createColorValue(r: number, g: number, b: number): ColorValue {
  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const hwb = rgbToHwb(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  // Check if can be shortened
  let hexShort: string | null = null;
  if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
    hexShort = `#${hex[1]}${hex[3]}${hex[5]}`;
  }

  return {
    hex,
    hexShort,
    rgb: { r, g, b },
    hsl,
    hwb,
    cmyk,
    css: {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hwb: `hwb(${hwb.h} ${hwb.w}% ${hwb.b}%)`,
    },
  };
}

// === Color conversion functions ===

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHwb(r: number, g: number, b: number): { h: number; w: number; b: number } {
  const hsl = rgbToHsl(r, g, b);
  const w = Math.min(r, g, b) / 255;
  const blk = 1 - Math.max(r, g, b) / 255;

  return {
    h: hsl.h,
    w: Math.round(w * 100),
    b: Math.round(blk * 100),
  };
}

function hwbToRgb(h: number, w: number, b: number): { r: number; g: number; b: number } {
  w /= 100;
  b /= 100;

  if (w + b >= 1) {
    const gray = Math.round((w / (w + b)) * 255);
    return { r: gray, g: gray, b: gray };
  }

  const rgb = hslToRgb(h, 100, 50);
  const f = (c: number) => Math.round(c * (1 - w - b) + w * 255);

  return {
    r: f(rgb.r / 255),
    g: f(rgb.g / 255),
    b: f(rgb.b / 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

/**
 * Format color result for display
 */
export function formatColorOutput(result: ColorParseResult): string {
  if (!result.valid || !result.color) {
    return result.error || "Invalid color";
  }

  const c = result.color;
  const lines = [
    `=== COLOR CONVERSION ===`,
    ``,
    `HEX:    ${c.hex}${c.hexShort ? ` (${c.hexShort})` : ""}`,
    `RGB:    ${c.css.rgb}`,
    `HSL:    ${c.css.hsl}`,
    `HWB:    ${c.css.hwb}`,
    `CMYK:   cmyk(${c.cmyk.c}%, ${c.cmyk.m}%, ${c.cmyk.y}%, ${c.cmyk.k}%)`,
    ``,
    `=== VALUES ===`,
    ``,
    `Red:        ${c.rgb.r} (${Math.round((c.rgb.r / 255) * 100)}%)`,
    `Green:      ${c.rgb.g} (${Math.round((c.rgb.g / 255) * 100)}%)`,
    `Blue:       ${c.rgb.b} (${Math.round((c.rgb.b / 255) * 100)}%)`,
    ``,
    `Hue:        ${c.hsl.h}°`,
    `Saturation: ${c.hsl.s}%`,
    `Lightness:  ${c.hsl.l}%`,
  ];

  return lines.join("\n");
}

export const colorFormats: { value: ColorFormat; label: string; example: string }[] = [
  { value: "hex", label: "HEX", example: "#ff5500" },
  { value: "rgb", label: "RGB", example: "rgb(255, 85, 0)" },
  { value: "hsl", label: "HSL", example: "hsl(20, 100%, 50%)" },
  { value: "hwb", label: "HWB", example: "hwb(20 0% 0%)" },
  { value: "cmyk", label: "CMYK", example: "cmyk(0, 67, 100, 0)" },
];
