import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator – MD5, SHA-256, SHA-512",
  description:
    "Generate cryptographic hashes with MD5, SHA-1, SHA-256, and SHA-512 algorithms. Useful for checksums and data verification. All processing local.",
  keywords: [
    "hash generator",
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-512",
    "cryptographic hash",
    "checksum",
  ],
  alternates: {
    canonical: "/tools/hash",
  },
  openGraph: {
    title: "Hash Generator – MD5, SHA-256, SHA-512 | Textsy",
    description:
      "Generate cryptographic hashes securely in your browser. MD5, SHA-1, SHA-256, SHA-512. No server processing.",
  },
};

export default function HashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
