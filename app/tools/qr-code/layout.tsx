import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator – Text & URLs",
  description:
    "Generate QR codes from text, URLs, WiFi credentials, or contact information. Download as SVG or PNG with customizable colors and sizes.",
  keywords: [
    "qr code generator",
    "qr code maker",
    "create qr code",
    "qr code online",
    "url to qr",
    "text to qr code",
    "free qr code",
  ],
  alternates: {
    canonical: "/tools/qr-code",
  },
  openGraph: {
    title: "QR Code Generator | Textsy",
    description:
      "Generate QR codes from text or URLs. 100% browser-based, no data uploaded.",
  },
};

export default function QrCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
