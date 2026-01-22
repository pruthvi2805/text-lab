import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hex to Text Converter - Textsy",
  description:
    "Convert hexadecimal to text and text to hex online. Free hex encoder/decoder with multiple output formats. No data leaves your browser.",
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
