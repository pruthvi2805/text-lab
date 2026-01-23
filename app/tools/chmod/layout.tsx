import { Metadata } from "next";

export const metadata: Metadata = {
  title: "chmod Calculator – Unix File Permissions",
  description:
    "Calculate Unix/Linux file permissions with an interactive interface. Convert instantly between numeric (755) and symbolic (rwxr-xr-x) notation.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions",
    "chmod converter",
    "linux permissions",
    "permission calculator",
    "rwx permissions",
  ],
  openGraph: {
    title: "chmod Calculator | Textsy",
    description:
      "Calculate Unix file permissions interactively. 100% browser-based, no data uploaded.",
  },
};

export default function ChmodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
