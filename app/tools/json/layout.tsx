import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description:
    "Format, validate, and minify JSON with syntax highlighting and error detection. Instant pretty-printing or single-line compression.",
  keywords: [
    "json formatter",
    "json validator",
    "json minifier",
    "json beautifier",
    "json pretty print",
    "format json online",
  ],
  alternates: {
    canonical: "/tools/json",
  },
  openGraph: {
    title: "JSON Formatter | Textsy",
    description:
      "Format, validate, and minify JSON online. 100% browser-based, no data uploaded.",
  },
};

export default function JsonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
