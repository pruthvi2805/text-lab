import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode JWT tokens to inspect header and payload claims. View expiration, issued time, and all embedded data. Your tokens stay on your device.",
  keywords: [
    "jwt decoder",
    "json web token",
    "jwt parser",
    "decode jwt",
    "jwt viewer",
    "bearer token",
  ],
  openGraph: {
    title: "JWT Decoder | Textsy",
    description:
      "Decode JWT tokens to view header and payload. 100% browser-based, no data uploaded.",
  },
};

export default function JwtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
