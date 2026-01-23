import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description:
    "Generate Lorem Ipsum placeholder text for mockups, designs, and prototypes. Customize by words, sentences, or paragraphs with instant output.",
  keywords: [
    "Lorem Ipsum",
    "placeholder text",
    "dummy text",
    "filler text",
    "text generator",
    "Lorem generator",
  ],
  openGraph: {
    title: "Lorem Ipsum Generator | Textsy",
    description:
      "Generate Lorem Ipsum placeholder text. Customize words, sentences, or paragraphs instantly.",
  },
};

export default function LoremLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
