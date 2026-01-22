# Textsy

Fast, private text utilities that run entirely in your browser. No servers, no uploads, no tracking.

**Live:** [text.kpruthvi.com](https://text.kpruthvi.com)

## Features

- **100% Browser-Based** — All processing happens client-side. Your data never leaves your device.
- **No Tracking** — No analytics, no cookies, no telemetry.
- **Favorites** — Star your most-used tools for quick access.
- **Developer Tools:**

  **Encoders & Decoders**
  - Base64 Encoder/Decoder
  - URL Parser & Encoder
  - JWT Decoder (view header & payload)
  - HTML Entity Encoder/Decoder
  - String Escape/Unescape (JSON, HTML, URL, SQL, Regex, C, Shell, XML, CSV)
  - Hex ↔ Text Converter
  - Number Base Converter (Decimal, Hex, Octal, Binary)

  **Formatters & Converters**
  - JSON Formatter (validate, prettify, minify)
  - YAML ↔ JSON Converter
  - XML ↔ JSON Converter
  - CSV ↔ JSON Converter
  - SQL Formatter (beautify with keyword highlighting)
  - JavaScript/CSS Formatter (beautify & minify)
  - Case Converter (camelCase, snake_case, etc.)
  - Markdown Preview (live rendering)

  **Generators**
  - UUID Generator (v4, v7, validation)
  - Password Generator (secure, customizable)
  - Lorem Ipsum Generator
  - Fake Data Generator (names, emails, addresses, etc.)
  - QR Code Generator (SVG & PNG export)
  - Slug Generator (URL-friendly strings)

  **Security & Hashing**
  - Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
  - HMAC Generator (SHA-256, SHA-384, SHA-512)

  **Analysis & Utilities**
  - Regex Tester (live matching)
  - Text Diff (line, word, character comparison)
  - JSONPath Query Tool
  - Text Statistics (words, sentences, reading time)
  - ASCII/Unicode Lookup Table
  - Color Converter (HEX, RGB, HSL, HWB, CMYK)
  - Unix Timestamp Converter
  - Cron Expression Builder (visual editor)
  - chmod Calculator (Unix permissions)
  - List Utilities (sort, dedupe, shuffle)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Rendering:** Static Site Generation
- **Editor:** CodeMirror 6
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve out
```

## Deployment

This site is configured for static export. The build outputs to the `out/` directory.

To deploy to Cloudflare Pages:
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `out`

## Privacy

Textsy is designed with privacy as a core principle:
- Static site with no backend
- All transformations run in JavaScript in your browser
- No data is ever transmitted to any server
- No cookies, no local storage tracking
- Open source for full transparency

## License

MIT

## Author

Built by [K Pruthvi](https://kpruthvi.com)
