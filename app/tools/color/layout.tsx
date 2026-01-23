import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter – HEX, RGB, HSL, CMYK",
  description:
    "Convert colors between HEX, RGB, HSL, HWB, and CMYK with live preview. Browser-based color picker for developers. No uploads required.",
  keywords: [
    "color converter",
    "HEX to RGB",
    "RGB to HSL",
    "color picker",
    "CSS colors",
    "color formats",
  ],
  openGraph: {
    title: "Color Converter – HEX, RGB, HSL, CMYK | Textsy",
    description:
      "Convert colors between HEX, RGB, HSL, HWB, and CMYK. 100% browser-based with live preview.",
  },
};

export default function ColorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
