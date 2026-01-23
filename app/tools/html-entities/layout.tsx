import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder/Decoder",
  description:
    "Encode and decode HTML entities for special characters. Supports named entities (&amp;), numeric (&#38;), and hexadecimal (&#x26;) formats.",
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
