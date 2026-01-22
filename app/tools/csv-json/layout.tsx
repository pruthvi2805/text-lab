import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSV to JSON Converter - Textsy",
  description:
    "Convert CSV to JSON and JSON to CSV online. Free bidirectional converter with custom delimiter support. No data leaves your browser.",
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
