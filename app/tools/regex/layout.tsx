import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test JavaScript regular expressions with live matching and highlighting. View all matches, capture groups, and match indices with support for all flags.",
  keywords: [
    "regex tester",
    "regular expression",
    "regexp",
    "pattern matching",
    "regex debugger",
    "javascript regex",
  ],
  openGraph: {
    title: "Regex Tester | Textsy",
    description:
      "Test JavaScript regex patterns with live matching. 100% browser-based, no data uploaded.",
  },
};

export default function RegexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
