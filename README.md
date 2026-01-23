<div align="center">

# Textsy

**Privacy-first developer tools that run entirely in your browser**

[Visit Textsy](https://text.kpruthvi.com) · [Report Bug](https://github.com/pruthvi2805/text-lab/issues) · [Request Feature](https://github.com/pruthvi2805/text-lab/issues)

[![Live Site](https://img.shields.io/badge/live-text.kpruthvi.com-58a6ff?style=flat-square)](https://text.kpruthvi.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## About

Textsy is a suite of 33 developer tools built with one core principle: **your data never leaves your browser**. No servers, no uploads, no tracking. Just pure client-side processing for the tools you use every day.

Format JSON. Decode JWTs. Generate UUIDs. Convert between data formats. Hash sensitive strings. All locally, all privately, all instantly.

### Why Textsy?

**Privacy by Architecture**
Every tool runs entirely in your browser using WebAssembly and native JavaScript APIs. Your sensitive data—API tokens, passwords, production configs—stays on your device.

**Developer-Focused**
Clean, IDE-inspired interface. Keyboard shortcuts. Instant processing. No distractions, no ads, no bloat. Built by developers, for developers.

**Open Source**
Transparent code you can audit. MIT licensed. Deploy your own instance if you want absolute control.

---

## Features

### Data Formatting
- **JSON Formatter** — Validate, format, and minify JSON with syntax highlighting
- **YAML ↔ JSON** — Convert between YAML and JSON with auto-detection
- **XML ↔ JSON** — Bidirectional conversion with attribute handling
- **CSV ↔ JSON** — Transform spreadsheet data to structured JSON
- **SQL Formatter** — Beautify SQL queries with proper indentation
- **JavaScript & CSS Formatter** — Format or minify JS and CSS code
- **Markdown Preview** — Live rendering with HTML source view

### Encoding & Decoding
- **Base64 Encoder** — Encode/decode with URL-safe variant support
- **JWT Decoder** — Inspect token claims and expiration (no signature verification)
- **URL Parser** — Parse URLs and encode/decode components
- **HTML Entities** — Convert special characters to entities and back
- **String Escape** — Escape for JSON, SQL, Regex, and more
- **Hex ↔ Text** — Convert between hexadecimal and plain text
- **Number Base Converter** — Decimal, hex, octal, and binary conversion
- **ASCII/Unicode Lookup** — Browse character tables and search by code point

### Generators
- **Hash Generator** — MD5, SHA-1, SHA-256, SHA-512 cryptographic hashes
- **HMAC Generator** — Generate message authentication codes
- **UUID Generator** — Create v4 (random) or v7 (timestamp-based) UUIDs
- **Password Generator** — Cryptographically secure passwords with custom rules
- **Lorem Ipsum** — Placeholder text generation
- **Fake Data Generator** — Realistic test data for names, emails, addresses
- **QR Code Generator** — Create QR codes from text or URLs
- **Cron Expression Builder** — Visual cron syntax builder
- **Timestamp Converter** — Unix timestamps to human-readable dates

### Text Tools
- **Regex Tester** — Test JavaScript regular expressions with live highlighting
- **Text Diff** — Compare texts line-by-line or word-by-word
- **Case Converter** — camelCase, snake_case, PascalCase, and more
- **List Utilities** — Sort, deduplicate, reverse, and transform lists
- **Text Statistics** — Word count, reading time, keyword frequency
- **Slug Generator** — Convert text to URL-friendly slugs
- **Color Converter** — HEX, RGB, HSL, HWB, and CMYK conversion
- **JSONPath Evaluator** — Test JSONPath queries against JSON data
- **chmod Calculator** — Unix file permission calculator

---

## Technology

Built with modern web technologies for performance and reliability:

- **[Next.js 16](https://nextjs.org)** — React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety throughout
- **[Tailwind CSS 4](https://tailwindcss.com)** — Utility-first styling
- **[CodeMirror 6](https://codemirror.net/)** — Powerful code editor
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Lightweight state management

**Static Site Generation**
Pre-rendered at build time for instant loading. Deployed on Cloudflare Pages with global CDN distribution.

**No Backend Required**
Zero server-side processing. All tools use native browser APIs and WASM where needed. Works offline once cached.

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/pruthvi2805/text-lab.git
cd text-lab

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

Visit `http://localhost:3000` to see your local instance.

### Project Structure

```
text-lab/
├── app/                    # Next.js app router pages
│   ├── tools/             # Individual tool pages (33 tools)
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Header, Shell, Sidebar
│   ├── tools/            # ToolLayout wrapper
│   └── ui/               # Buttons, Icons, Toast
├── lib/                   # Tool implementations
│   └── tools/            # Business logic for each tool
├── stores/               # Zustand state stores
└── public/               # Static assets
```

---

## Privacy Guarantee

**What we collect:** Nothing. No analytics, no tracking pixels, no cookies beyond session storage.

**What we see:** Nothing. All processing happens in your browser. Your data never touches our servers.

**What we log:** Nothing. Static site hosting means there are no application logs or databases.

**Open Source Verification:**
Don't trust us—verify the code yourself. Every line is auditable in this repository.

---

## Contributing

Contributions are welcome! Whether it's a bug fix, new tool, or UX improvement:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

Please ensure your code:
- Follows the existing TypeScript patterns
- Maintains the privacy-first architecture (no external API calls)
- Includes proper error handling
- Works on mobile devices

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

Built with care by [Pruthvi Kauticwar](https://kpruthvi.com).

Inspired by the need for trustworthy developer tools that respect your privacy.

---

<div align="center">

**[Try Textsy Now →](https://text.kpruthvi.com)**

Made for developers who value privacy

</div>
