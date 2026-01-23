import { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Parser & Encoder",
  description:
    "Parse URLs into components, encode text for URLs, or decode percent-encoded strings. Extract query parameters, hostname, path, and protocol details.",
  keywords: [
    "url parser",
    "url encoder",
    "url decoder",
    "query string parser",
    "uri encoder",
    "percent encoding",
  ],
  openGraph: {
    title: "URL Parser & Encoder | Textsy",
    description:
      "Parse, encode, and decode URLs. Extract query parameters and URL components. 100% browser-based.",
  },
};

export default function UrlLayout({ children }: { children: React.ReactNode }) {
  return children;
}
