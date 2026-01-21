# Text Lab - Development Plan

> **Domain:** text.kpruthvi.com
> **Status:** ✅ Complete - Live on Cloudflare
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
| State | Zustand (theme + favorites) |
| Styling | Tailwind CSS v4 (dark-first) |
| Deployment | Cloudflare Pages |

---

## Tools Implemented (16 total)

| # | Tool | Route | Status |
|---|------|-------|--------|
| 1 | JSON Formatter | `/tools/json` | ✅ Done |
| 2 | Base64 Encoder | `/tools/base64` | ✅ Done |
| 3 | URL Parser/Encoder | `/tools/url` | ✅ Done |
| 4 | JWT Decoder | `/tools/jwt` | ✅ Done |
| 5 | Hash Generator | `/tools/hash` | ✅ Done |
| 6 | UUID Generator | `/tools/uuid` | ✅ Done |
| 7 | Unix Timestamp Converter | `/tools/timestamp` | ✅ Done |
| 8 | YAML ↔ JSON | `/tools/yaml` | ✅ Done |
| 9 | Text Case Converter | `/tools/case-converter` | ✅ Done |
| 10 | Regex Tester | `/tools/regex` | ✅ Done |
| 11 | Text Diff | `/tools/diff` | ✅ Done |
| 12 | Markdown Preview | `/tools/markdown` | ✅ Done |
| 13 | HTML Entities | `/tools/html-entities` | ✅ Done |
| 14 | Color Converter | `/tools/color` | ✅ Done |
| 15 | List Utilities | `/tools/list` | ✅ Done |
| 16 | Lorem Ipsum Generator | `/tools/lorem` | ✅ Done |

---

## Features

- ✅ 16 developer tools
- ✅ Dark/Light mode toggle (localStorage persisted)
- ✅ Tool favorites (localStorage persisted)
- ✅ Responsive design (mobile + desktop)
- ✅ IDE-like aesthetic
- ✅ Privacy-first (100% client-side)
- ✅ SEO optimized (meta tags, sitemap)
- ✅ Scroll restoration on navigation

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
- [x] All 16 tools implemented

### Phase 5: Polish & SEO ✅
- [x] Homepage with tool grid
- [x] Privacy page
- [x] Meta tags per tool page
- [x] robots.txt & sitemap.xml
- [x] README.md
- [x] Dark/Light mode toggle
- [x] Tool favorites
- [x] Scroll restoration

### Phase 6: Deployment ✅
- [x] Test static export (npm run build)
- [x] Create GitHub repo
- [x] Push code
- [x] Deploy to GitHub Pages (auto via Actions)
- [x] Connect to Cloudflare Pages
- [x] Configure custom domain (text.kpruthvi.com)
- [x] Add to hub (kpruthvi.com)

---

## Deferred to Future

- Pipeline system (chain multiple tools)
- Smart paste (auto-detect content type)
- Recent tools history
- Export/import settings
- Keyboard shortcuts
- Error boundaries

---

## Notes

- Build outputs to `out/` directory
- All 21 pages successfully generated
- Static export verified working
- Cloudflare Pages: text.kpruthvi.com (live)
