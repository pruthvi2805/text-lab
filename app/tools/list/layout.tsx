import { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Utilities",
  description:
    "Sort, deduplicate, reverse, shuffle, and transform text lists. Add prefixes, suffixes, or line numbers. Process line-separated data easily. Browser-based tool.",
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
    title: "List Utilities | Text Lab",
    description:
      "Sort, deduplicate, reverse, and transform text lists. 100% browser-based, no data uploaded.",
  },
};

export default function ListLayout({ children }: { children: React.ReactNode }) {
  return children;
}
