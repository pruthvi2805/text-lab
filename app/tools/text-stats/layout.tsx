import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Statistics - Textsy",
  description:
    "Analyze text with word count, character count, sentence count, reading time, and keyword frequency. Free online text analyzer. No data leaves your browser.",
  keywords: [
    "word count",
    "character count",
    "text statistics",
    "reading time calculator",
    "text analyzer",
    "keyword density",
    "sentence count",
  ],
  openGraph: {
    title: "Text Statistics | Textsy",
    description:
      "Analyze text with word count, reading time, and keyword frequency. 100% browser-based, no data uploaded.",
  },
};

export default function TextStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
