import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSONPath Evaluator – Query JSON Data",
  description:
    "Test JSONPath expressions against JSON data with live results. Extract values, filter arrays, and navigate deeply nested structures with ease.",
  keywords: [
    "jsonpath",
    "json query",
    "jsonpath tester",
    "json filter",
    "json extract",
    "jsonpath expression",
    "json selector",
  ],
  alternates: {
    canonical: "/tools/json-path",
  },
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
