import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID Generator – v4 & v7 with Validation",
  description:
    "Generate UUIDs in v4 (random) or v7 (timestamp-based) format. Validate existing UUIDs and generate in batches for testing or development.",
  keywords: [
    "UUID generator",
    "GUID generator",
    "UUID v4",
    "UUID v7",
    "unique identifier",
    "UUID validator",
  ],
  alternates: {
    canonical: "/tools/uuid",
  },
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
