import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter",
  description:
    "Convert text between different cases: lowercase, UPPERCASE, Title Case, camelCase, snake_case, kebab-case, and more. Free browser-based tool.",
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
  openGraph: {
    title: "Case Converter | Text Lab",
    description:
      "Convert text between camelCase, snake_case, kebab-case, and more. 100% browser-based.",
  },
};

export default function CaseConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
