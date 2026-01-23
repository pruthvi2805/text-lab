import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator – MD5, SHA-256, SHA-512",
  description:
    "Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) securely in your browser. No server processing, data stays local.",
  keywords: [
    "hash generator",
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-512",
    "cryptographic hash",
    "checksum",
  ],
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
