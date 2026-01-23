import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Builder & Parser",
  description:
    "Build and parse cron expressions with a visual interface. Get human-readable explanations and preview next scheduled execution times.",
  keywords: [
    "cron expression",
    "cron builder",
    "cron parser",
    "cron generator",
    "crontab",
    "schedule expression",
    "cron syntax",
  ],
  openGraph: {
    title: "Cron Expression Builder | Textsy",
    description:
      "Build and parse cron expressions visually. 100% browser-based, no data uploaded.",
  },
};

export default function CronLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
