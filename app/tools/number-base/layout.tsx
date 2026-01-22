import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Base Converter - Textsy",
  description:
    "Convert numbers between decimal, hexadecimal, octal, and binary formats. Free online base converter with instant conversion. No data leaves your browser.",
  keywords: [
    "number base converter",
    "hex converter",
    "binary converter",
    "decimal to hex",
    "octal converter",
    "base conversion",
    "radix converter",
  ],
  openGraph: {
    title: "Number Base Converter | Textsy",
    description:
      "Convert between decimal, hex, octal, and binary. 100% browser-based, no data uploaded.",
  },
};

export default function NumberBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
