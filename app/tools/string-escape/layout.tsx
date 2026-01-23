import { Metadata } from "next";

export const metadata: Metadata = {
  title: "String Escape/Unescape Tool",
  description:
    "Escape and unescape strings for JSON, HTML, URL, SQL, Regex, XML, CSV, and Shell. Handles special characters safely for multiple programming contexts.",
  keywords: [
    "string escape",
    "string unescape",
    "escape characters",
    "json escape",
    "html escape",
    "url encode",
    "sql escape",
    "regex escape",
  ],
  openGraph: {
    title: "String Escape/Unescape | Textsy",
    description:
      "Escape and unescape strings for multiple formats. 100% browser-based, no data uploaded.",
  },
};

export default function StringEscapeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
