import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff – Compare Text Side-by-Side",
  description:
    "Compare two texts with line-by-line or word-level diff highlighting. Uses Myers algorithm, runs locally in your browser. No uploads.",
  keywords: [
    "text diff",
    "compare text",
    "text comparison",
    "diff tool",
    "find differences",
  ],
  openGraph: {
    title: "Text Diff – Compare Text Side-by-Side | Textsy",
    description:
      "Compare texts with intelligent diff highlighting. 100% browser-based, no data uploaded.",
  },
};

export default function DiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
