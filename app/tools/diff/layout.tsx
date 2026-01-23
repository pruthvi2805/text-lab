import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff – Compare Text Side-by-Side",
  description:
    "Compare two texts with line-by-line, word, or character-level diff highlighting. Uses the Myers algorithm for accurate change detection.",
  keywords: [
    "text diff",
    "compare text",
    "text comparison",
    "diff tool",
    "find differences",
  ],
  alternates: {
    canonical: "/tools/diff",
  },
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
