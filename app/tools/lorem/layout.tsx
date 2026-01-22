import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Textsy",
  description:
    "Generate placeholder text for designs and mockups. Customize words, sentences, or paragraphs with classic Lorem Ipsum.",
  keywords: [
    "Lorem Ipsum",
    "placeholder text",
    "dummy text",
    "filler text",
    "text generator",
    "Lorem generator",
  ],
};

export default function LoremLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
