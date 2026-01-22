import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSONPath Query Tool - Textsy",
  description:
    "Query JSON data with JSONPath expressions. Extract values, filter arrays, and navigate nested structures. No data leaves your browser.",
  keywords: [
    "jsonpath",
    "json query",
    "jsonpath tester",
    "json filter",
    "json extract",
    "jsonpath expression",
    "json selector",
  ],
  openGraph: {
    title: "JSONPath Query Tool | Textsy",
    description:
      "Query JSON data with JSONPath expressions. 100% browser-based, no data uploaded.",
  },
};

export default function JsonPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
