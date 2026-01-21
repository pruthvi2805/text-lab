import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder",
  description:
    "Encode text to Base64 or decode Base64 back to text. Supports standard and URL-safe Base64 variants. Browser-based, no data uploaded.",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "base64 converter",
    "encode base64",
    "decode base64",
    "url-safe base64",
  ],
  openGraph: {
    title: "Base64 Encoder & Decoder | Text Lab",
    description:
      "Encode and decode Base64 strings. 100% browser-based, no data uploaded.",
  },
};

export default function Base64Layout({ children }: { children: React.ReactNode }) {
  return children;
}
