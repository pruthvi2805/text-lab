import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder",
  description:
    "Decode JSON Web Tokens (JWT) to view header and payload claims. See expiration status, issued time, and all claims. Browser-based, no data uploaded.",
  keywords: [
    "jwt decoder",
    "json web token",
    "jwt parser",
    "decode jwt",
    "jwt viewer",
    "bearer token",
  ],
  openGraph: {
    title: "JWT Decoder | Text Lab",
    description:
      "Decode JWT tokens to view header and payload. 100% browser-based, no data uploaded.",
  },
};

export default function JwtLayout({ children }: { children: React.ReactNode }) {
  return children;
}
