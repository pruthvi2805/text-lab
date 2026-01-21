import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester",
  description:
    "Test JavaScript regular expressions with live matching. See all matches, capture groups, and match positions. Supports all regex flags. Browser-based tool.",
  keywords: [
    "regex tester",
    "regular expression",
    "regexp",
    "pattern matching",
    "regex debugger",
    "javascript regex",
  ],
  openGraph: {
    title: "Regex Tester | Text Lab",
    description:
      "Test JavaScript regex patterns with live matching. 100% browser-based, no data uploaded.",
  },
};

export default function RegexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
