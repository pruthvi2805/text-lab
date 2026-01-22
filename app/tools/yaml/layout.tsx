import { Metadata } from "next";

export const metadata: Metadata = {
  title: "YAML ↔ JSON Converter - Textsy",
  description:
    "Convert between YAML and JSON formats. Auto-detect input format with pure client-side processing.",
  keywords: [
    "YAML to JSON",
    "JSON to YAML",
    "YAML converter",
    "JSON converter",
    "format converter",
  ],
};

export default function YAMLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
