import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Diff - Textsy",
  description:
    "Compare two texts and see the differences. Line, word, or character-level comparison with Myers diff algorithm.",
  keywords: [
    "text diff",
    "compare text",
    "text comparison",
    "diff tool",
    "find differences",
  ],
};

export default function DiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
