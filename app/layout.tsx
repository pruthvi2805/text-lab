import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

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
    "Privacy-first developer tools that run 100% in your browser. JSON formatter, Base64 encoder, JWT decoder, hash generator, and more. No uploads, no tracking.",
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
      "Privacy-first developer tools running 100% in your browser. JSON formatter, Base64, JWT decoder, and 30+ more tools. No uploads, no tracking.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Textsy - Free Browser-Based Developer Tools",
    description:
      "Privacy-first developer tools running 100% in your browser. JSON formatter, Base64, JWT decoder, and 30+ more tools. No uploads, no tracking.",
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
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
