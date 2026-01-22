import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash Generator - Textsy",
  description:
    "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes. Secure client-side hashing with no server processing.",
  keywords: [
    "hash generator",
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-512",
    "cryptographic hash",
    "checksum",
  ],
};

export default function HashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
