import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview with Live Rendering",
  description:
    "Preview Markdown with live HTML rendering. See formatted output and source code side-by-side. Supports tables, code blocks, and more.",
  keywords: [
    "Markdown preview",
    "Markdown to HTML",
    "Markdown editor",
    "Markdown renderer",
    "live preview",
  ],
  alternates: {
    canonical: "/tools/markdown",
  },
  openGraph: {
    title: "Markdown Preview with Live Rendering | Textsy",
    description:
      "Preview Markdown with live rendering. HTML output and formatted view side-by-side. 100% browser-based.",
  },
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
