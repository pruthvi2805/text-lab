import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hex ↔ Text Converter",
  description:
    "Convert text to hexadecimal bytes or decode hex back to readable text. Supports multiple output formats and handles UTF-8 encoding.",
  keywords: [
    "hex to text",
    "text to hex",
    "hexadecimal converter",
    "hex encoder",
    "hex decoder",
    "hex string",
    "byte converter",
  ],
  openGraph: {
    title: "Hex to Text Converter | Textsy",
    description:
      "Convert between hexadecimal and text. 100% browser-based, no data uploaded.",
  },
};

export default function HexTextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
