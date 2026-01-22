import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview - Textsy",
  description:
    "Preview Markdown with live rendering. See the HTML output and formatted preview side by side.",
  keywords: [
    "Markdown preview",
    "Markdown to HTML",
    "Markdown editor",
    "Markdown renderer",
    "live preview",
  ],
};

export default function MarkdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
