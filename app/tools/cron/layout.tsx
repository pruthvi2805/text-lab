import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Builder & Parser",
  description:
    "Build and parse cron expressions visually. Get human-readable explanations and preview upcoming schedules. Browser-based crontab tool.",
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
