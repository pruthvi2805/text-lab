import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter (Browser-Only, No Uploads)",
  description:
    "Format and beautify SQL queries directly in your browser. Supports all SQL dialects with syntax highlighting. Privacy-first, no data uploaded.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql",
    "sql pretty print",
    "sql indentation",
    "sql online",
    "query formatter",
  ],
  openGraph: {
    title: "SQL Formatter | Textsy",
    description:
      "Format and beautify SQL queries online. 100% browser-based, no data uploaded.",
  },
};

export default function SqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
