import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV ↔ JSON Converter",
  description:
    "Convert between CSV and JSON with custom delimiter support. Auto-detects headers, handles quoted fields, and preserves data types.",
  keywords: [
    "csv to json",
    "json to csv",
    "csv converter",
    "json converter",
    "csv json online",
    "data format converter",
    "tabular data",
  ],
  openGraph: {
    title: "CSV to JSON Converter | Textsy",
    description:
      "Convert between CSV and JSON formats. 100% browser-based, no data uploaded.",
  },
};

export default function CsvJsonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
