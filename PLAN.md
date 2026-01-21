# Text Lab - Development Plan

> **Domain:** text.kpruthvi.com
> **Status:** Build Complete — Ready for Deployment
> **Last Updated:** 2026-01-21

---

## Project Overview

Text Lab is a static, browser-only text utility web application. Zero backend, zero APIs, all processing happens client-side. Designed for developers who need quick text transformations without trusting third-party servers.

**Design Vision:** IDE-like aesthetic (VS Code inspired)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Rendering | Static Site Generation (`output: 'export'`) |
| Editor | CodeMirror 6 |
| State | Zustand (installed, not yet used) |
| Styling | Tailwind CSS v4 (dark-first) |
| Deployment | Cloudflare Pages |

---

## Tools Implemented (8 total)

| # | Tool | Route | Status |
|---|------|-------|--------|
| 1 | JSON Formatter | `/tools/json` | ✅ Done |
| 2 | Text Case Converter | `/tools/case-converter` | ✅ Done |
| 3 | JWT Decoder | `/tools/jwt` | ✅ Done |
| 4 | URL Parser/Encoder | `/tools/url` | ✅ Done |
| 5 | List Utilities | `/tools/list` | ✅ Done |
| 6 | Regex Tester | `/tools/regex` | ✅ Done |
| 7 | Unix Timestamp Converter | `/tools/timestamp` | ✅ Done |
| 8 | Base64 | `/tools/base64` | ✅ Done |

---

## Build Phases

### Phase 1: Foundation ✅
- [x] Define requirements
- [x] Choose tech stack
- [x] Design system
- [x] Directory structure

### Phase 2: Project Setup ✅
- [x] Initialize Next.js project
- [x] Configure Tailwind with IDE theme
- [x] Setup TypeScript
- [x] Configure static export for Cloudflare Pages
- [x] Create base layout (IDE shell)

### Phase 3: Core Components ✅
- [x] Sidebar/Activity bar component
- [x] Header component
- [x] Status bar component
- [x] CodeMirror editor wrapper
- [x] Mobile navigation
- [x] Tool page template (ToolLayout)

### Phase 4: Tool Implementation ✅
- [x] Tool registry system
- [x] JSON Formatter
- [x] Text Case Converter
- [x] JWT Decoder
- [x] URL Parser/Encoder
- [x] List Utilities
- [x] Regex Tester
- [x] Unix Timestamp Converter
- [x] Base64 Encoder/Decoder

### Phase 5: Polish & SEO ✅
- [x] Homepage with tool grid
- [x] Privacy page
- [x] Meta tags per tool page
- [x] robots.txt & sitemap.xml
- [x] README.md

### Phase 6: Deployment ⏳
- [x] Test static export (npm run build)
- [ ] Create GitHub repo
- [ ] Push code
- [ ] Connect to Cloudflare Pages
- [ ] Configure custom domain (text.kpruthvi.com)
- [ ] Add to hub (kpruthvi.com)

---

## Deferred to V2
- Pipeline system (chain multiple tools)
- Smart paste (auto-detect content type)
- Tool favorites
- Recent tools history
- Export/import settings
- Keyboard shortcuts
- Error boundaries

---

## Notes
- Build outputs to `out/` directory
- All 13 pages successfully generated
- Static export verified working
