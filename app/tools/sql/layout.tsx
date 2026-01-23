import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter – Format & Beautify Queries",
  description:
    "Format and beautify SQL queries with proper indentation and keyword highlighting. Supports MySQL, PostgreSQL, SQLite, and other dialects.",
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
