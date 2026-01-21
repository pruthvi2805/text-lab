import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder/Decoder - Text Lab",
  description:
    "Encode and decode HTML entities. Convert special characters to named, numeric, or hexadecimal entities.",
  keywords: [
    "HTML entities",
    "encode HTML",
    "decode HTML",
    "HTML escape",
    "special characters",
    "entity converter",
  ],
};

export default function HTMLEntitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
