import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter",
  description:
    "Convert text between lowercase, UPPERCASE, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more with instant transformation.",
  keywords: [
    "case converter",
    "text case",
    "camelCase",
    "snake_case",
    "kebab-case",
    "uppercase",
    "lowercase",
    "title case",
  ],
  alternates: {
    canonical: "/tools/case-converter",
  },
  openGraph: {
    title: "Case Converter | Textsy",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and more. 100% browser-based.",
  },
};

export default function CaseConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
