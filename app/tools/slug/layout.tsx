import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator – SEO-Friendly URLs",
  description:
    "Convert text to URL-friendly slugs in kebab-case, snake_case, or custom formats. Handles special characters and Unicode for clean permalinks.",
  keywords: [
    "slug generator",
    "url slug",
    "kebab case",
    "url friendly",
    "seo url",
    "text to slug",
    "slug converter",
  ],
  alternates: {
    canonical: "/tools/slug",
  },
  openGraph: {
    title: "Slug Generator | Textsy",
    description:
      "Convert text to URL-friendly slugs in multiple formats. 100% browser-based, no data uploaded.",
  },
};

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
