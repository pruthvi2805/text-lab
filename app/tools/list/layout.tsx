import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Utilities",
  description:
    "Sort, deduplicate, reverse, shuffle, and transform line-separated text lists. Add prefixes, suffixes, or line numbers to each entry.",
  keywords: [
    "list sorter",
    "remove duplicates",
    "shuffle list",
    "reverse lines",
    "add prefix",
    "add suffix",
    "line tools",
  ],
  openGraph: {
    title: "List Utilities | Textsy",
    description:
      "Sort, deduplicate, reverse, and transform text lists. 100% browser-based, no data uploaded.",
  },
};

export default function ListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
