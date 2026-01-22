import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover", // Enable safe area insets for notched devices
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#161b22" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Textsy - Browser-Based Developer Tools",
    template: "%s | Textsy",
  },
  description:
    "Free, private developer tools that run entirely in your browser. JSON formatter, password generator, QR codes, hash generator, and more. No data leaves your device.",
  keywords: [
    "text tools",
    "developer tools",
    "json formatter",
    "base64 encoder",
    "jwt decoder",
    "url encoder",
    "regex tester",
    "password generator",
    "qr code generator",
    "hash generator",
    "uuid generator",
    "cron builder",
    "sql formatter",
    "privacy tools",
    "browser-based",
    "no upload",
  ],
  authors: [{ name: "K Pruthvi" }],
  creator: "K Pruthvi",
  metadataBase: new URL("https://text.kpruthvi.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://text.kpruthvi.com",
    siteName: "Textsy",
    title: "Textsy - Free Browser-Based Developer Tools",
    description:
      "Free, private developer tools that run entirely in your browser. JSON, Base64, JWT, passwords, QR codes, and more. No data leaves your device.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Textsy - Free Browser-Based Developer Tools",
    description:
      "Free, private developer tools that run entirely in your browser. JSON, Base64, JWT, passwords, QR codes, and more. No data leaves your device.",
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
        <ThemeProvider>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
