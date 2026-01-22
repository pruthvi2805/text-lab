import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter - Textsy",
  description:
    "Convert colors between HEX, RGB, HSL, HWB, and CMYK formats. Parse named CSS colors with live preview.",
  keywords: [
    "color converter",
    "HEX to RGB",
    "RGB to HSL",
    "color picker",
    "CSS colors",
    "color formats",
  ],
};

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
