import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator – v4 & v7 with Validation",
  description:
    "Generate UUIDs (v4 random, v7 timestamp-based) and validate existing UUIDs. Batch generation supported. Runs securely in your browser.",
  keywords: [
    "UUID generator",
    "GUID generator",
    "UUID v4",
    "UUID v7",
    "unique identifier",
    "UUID validator",
  ],
  openGraph: {
    title: "UUID Generator – v4 & v7 with Validation | Textsy",
    description:
      "Generate and validate UUIDs. Supports v4 (random) and v7 (timestamp-based). 100% browser-based.",
  },
};

export default function UUIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
