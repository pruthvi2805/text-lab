import { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML to JSON Converter - Textsy",
  description:
    "Convert XML to JSON and JSON to XML online. Free bidirectional converter with proper attribute handling. No data leaves your browser.",
  keywords: [
    "xml to json",
    "json to xml",
    "xml converter",
    "json converter",
    "xml json online",
    "data format converter",
    "xml parser",
  ],
  openGraph: {
    title: "XML to JSON Converter | Textsy",
    description:
      "Convert between XML and JSON formats. 100% browser-based, no data uploaded.",
  },
};

export default function XmlJsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
