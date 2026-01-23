import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hex ↔ Text Converter",
  description:
    "Convert between hexadecimal and text instantly. Bidirectional hex encoder/decoder with multiple output formats. Browser-based, no uploads.",
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
