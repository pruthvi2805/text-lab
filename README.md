# Text Lab

Fast, private text utilities that run entirely in your browser. No servers, no uploads, no tracking.

**Live:** [text.kpruthvi.com](https://text.kpruthvi.com)

## Features

- **100% Browser-Based** — All processing happens client-side. Your data never leaves your device.
- **No Tracking** — No analytics, no cookies, no telemetry.
- **8 Developer Tools:**
  - JSON Formatter (validate, prettify, minify)
  - Case Converter (camelCase, snake_case, etc.)
  - JWT Decoder (view header & payload)
  - URL Parser & Encoder
  - List Utilities (sort, dedupe, shuffle)
  - Regex Tester (live matching)
  - Unix Timestamp Converter
  - Base64 Encoder/Decoder

## Tech Stack

- **Framework:** Next.js 14 (App Router)
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

Text Lab is designed with privacy as a core principle:
- Static site with no backend
- All transformations run in JavaScript in your browser
- No data is ever transmitted to any server
- No cookies, no local storage tracking
- Open source for full transparency

## License

MIT

## Author

Built by [K Pruthvi](https://kpruthvi.com)
