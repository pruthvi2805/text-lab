import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Password Generator",
  description:
    "Generate cryptographically secure random passwords with customizable length and character sets. Generated locally — nothing sent to servers.",
  keywords: [
    "password generator",
    "secure password",
    "random password",
    "strong password generator",
    "password strength",
    "online password generator",
  ],
  alternates: {
    canonical: "/tools/password",
  },
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
