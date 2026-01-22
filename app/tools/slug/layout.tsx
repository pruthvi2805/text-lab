import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slug Generator - Textsy",
  description:
    "Convert text to URL-friendly slugs. Generate kebab-case, snake_case, and custom slug formats for SEO-friendly URLs. No data leaves your browser.",
  keywords: [
    "slug generator",
    "url slug",
    "kebab case",
    "url friendly",
    "seo url",
    "text to slug",
    "slug converter",
  ],
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
