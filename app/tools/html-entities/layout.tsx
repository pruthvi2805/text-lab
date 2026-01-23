import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder/Decoder",
  description:
    "Encode and decode HTML entities instantly. Convert special characters to named, numeric, or hex entities. Browser-based, no uploads.",
  keywords: [
    "HTML entities",
    "encode HTML",
    "decode HTML",
    "HTML escape",
    "special characters",
    "entity converter",
  ],
  openGraph: {
    title: "HTML Entity Encoder/Decoder | Textsy",
    description:
      "Encode and decode HTML entities. Named, numeric, and hex formats. 100% browser-based.",
  },
};

export default function HTMLEntitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
