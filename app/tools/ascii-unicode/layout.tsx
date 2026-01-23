import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII & Unicode Character Lookup",
  description:
    "Browse the complete ASCII table and search Unicode characters by code point or name. Comprehensive character reference with decimal, hex, and HTML codes.",
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
