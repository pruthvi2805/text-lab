import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII & Unicode Table - Textsy",
  description:
    "Browse ASCII table and look up Unicode characters. Search by character, code point, or name. Free character reference tool. No data leaves your browser.",
  keywords: [
    "ascii table",
    "unicode lookup",
    "character codes",
    "ascii chart",
    "unicode search",
    "character reference",
    "code point",
  ],
  openGraph: {
    title: "ASCII & Unicode Table | Textsy",
    description:
      "Browse ASCII table and look up Unicode characters. 100% browser-based, no data uploaded.",
  },
};

export default function AsciiUnicodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
