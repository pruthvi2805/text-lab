import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JavaScript & CSS Formatter - Textsy",
  description:
    "Format, beautify, and minify JavaScript and CSS code online. Free code formatter with proper indentation. No data leaves your browser.",
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
