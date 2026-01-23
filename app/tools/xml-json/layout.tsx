import { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML ↔ JSON Converter",
  description:
    "Convert between XML and JSON while preserving attributes and nested elements. Handles complex structures and validates both formats.",
  keywords: [
    "xml to json",
    "json to xml",
    "xml converter",
    "json converter",
    "xml json online",
    "data format converter",
    "xml parser",
  ],
  alternates: {
    canonical: "/tools/xml-json",
  },
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
