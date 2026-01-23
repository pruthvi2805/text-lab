import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Password Generator",
  description:
    "Generate cryptographically secure passwords with custom length and character sets. 100% client-side generation, passwords never leave your device.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password generator",
    "password strength",
    "online password generator",
  ],
  openGraph: {
    title: "Password Generator | Textsy",
    description:
      "Generate secure random passwords with customizable options. 100% browser-based, no data uploaded.",
  },
};

export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
