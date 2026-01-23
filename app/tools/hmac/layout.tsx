import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HMAC Generator – SHA-256, SHA-512",
  description:
    "Generate HMAC (Hash-based Message Authentication Code) signatures with SHA-256, SHA-384, and SHA-512 for API authentication and verification.",
  keywords: [
    "hmac generator",
    "hmac calculator",
    "sha256 hmac",
    "sha512 hmac",
    "api signature",
    "message authentication",
    "hmac online",
  ],
  openGraph: {
    title: "HMAC Generator | Textsy",
    description:
      "Generate HMAC signatures with SHA-256/384/512. 100% browser-based, no data uploaded.",
  },
};

export default function HmacLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
