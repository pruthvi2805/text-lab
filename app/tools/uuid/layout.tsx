import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator - Text Lab",
  description:
    "Generate and validate UUIDs. Supports v4 (random), v7 (timestamp-based), with batch generation and format options.",
  keywords: [
    "UUID generator",
    "GUID generator",
    "UUID v4",
    "UUID v7",
    "unique identifier",
    "UUID validator",
  ],
};

export default function UUIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
