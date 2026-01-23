import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript & CSS Formatter",
  description:
    "Format, beautify, and minify JavaScript and CSS code. Instant formatting with proper indentation. Browser-based, no uploads required.",
  keywords: [
    "javascript formatter",
    "css formatter",
    "js beautifier",
    "css minifier",
    "code formatter",
    "js minifier",
    "pretty print javascript",
  ],
  openGraph: {
    title: "JavaScript & CSS Formatter | Textsy",
    description:
      "Format, beautify, and minify JavaScript and CSS. 100% browser-based, no data uploaded.",
  },
};

export default function JsFormatterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
