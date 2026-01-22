import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Expression Builder - Textsy",
  description:
    "Build and parse cron expressions with a visual editor. See human-readable descriptions and next scheduled runs. No data leaves your browser.",
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
