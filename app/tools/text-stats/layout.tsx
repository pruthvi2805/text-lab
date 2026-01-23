import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Statistics – Word Count & Analysis",
  description:
    "Analyze text with word count, character count, reading time, and keyword frequency. Comprehensive text statistics in your browser.",
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
