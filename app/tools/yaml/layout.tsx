import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML ↔ JSON Converter",
  description:
    "Convert between YAML and JSON with automatic format detection. Preserves structure, handles nested data, validates syntax on both sides.",
  keywords: [
    "YAML to JSON",
    "JSON to YAML",
    "YAML converter",
    "JSON converter",
    "format converter",
  ],
  alternates: {
    canonical: "/tools/yaml",
  },
  openGraph: {
    title: "YAML ↔ JSON Converter | Textsy",
    description:
      "Convert between YAML and JSON with auto-detection. 100% browser-based, no data uploaded.",
  },
};

export default function YAMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
