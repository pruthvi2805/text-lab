import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter",
  description:
    "Format, validate, and minify JSON online. Free browser-based JSON formatter with syntax validation, pretty printing, and minification. No data leaves your browser.",
  keywords: [
    "json formatter",
    "json validator",
    "json minifier",
    "json beautifier",
    "json pretty print",
    "format json online",
  ],
  openGraph: {
    title: "JSON Formatter | Text Lab",
    description:
      "Format, validate, and minify JSON online. 100% browser-based, no data uploaded.",
  },
};

export default function JsonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
