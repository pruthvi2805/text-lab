import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds. Get current timestamp instantly. Browser-based tool.",
  keywords: [
    "unix timestamp",
    "epoch converter",
    "timestamp to date",
    "date to timestamp",
    "unix time",
    "epoch time",
  ],
  openGraph: {
    title: "Unix Timestamp Converter | Textsy",
    description:
      "Convert Unix timestamps to dates and back. 100% browser-based, no data uploaded.",
  },
};

export default function TimestampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
