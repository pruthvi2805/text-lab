import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Text Lab - Browser-Based Text Utilities",
    template: "%s | Text Lab",
  },
  description:
    "Free, private text utilities that run entirely in your browser. JSON formatter, Base64 encoder, JWT decoder, and more. No data leaves your device.",
  keywords: [
    "text tools",
    "json formatter",
    "base64 encoder",
    "jwt decoder",
    "url encoder",
    "regex tester",
    "developer tools",
    "privacy",
    "browser-based",
  ],
  authors: [{ name: "K Pruthvi" }],
  creator: "K Pruthvi",
  metadataBase: new URL("https://text.kpruthvi.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://text.kpruthvi.com",
    siteName: "Text Lab",
    title: "Text Lab - Browser-Based Text Utilities",
    description:
      "Free, private text utilities that run entirely in your browser. No data leaves your device.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Lab - Browser-Based Text Utilities",
    description:
      "Free, private text utilities that run entirely in your browser. No data leaves your device.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
