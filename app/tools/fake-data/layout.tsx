import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake Data Generator for Testing",
  description:
    "Generate realistic test data: names, emails, addresses, phone numbers. Export as JSON, CSV, or text. Fully client-side, no uploads.",
  keywords: [
    "fake data generator",
    "test data",
    "mock data",
    "dummy data",
    "random names",
    "random emails",
    "sample data generator",
  ],
  openGraph: {
    title: "Fake Data Generator | Textsy",
    description:
      "Generate realistic fake data for testing. 100% browser-based, no data uploaded.",
  },
};

export default function FakeDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
