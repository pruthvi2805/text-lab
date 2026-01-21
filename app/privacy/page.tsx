import { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/layout";
import { ShieldIcon, CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Text Lab privacy policy. Learn how we protect your data by processing everything locally in your browser.",
};

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="h-full overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-success/10 rounded-lg">
              <ShieldIcon size={28} className="text-success" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Privacy Policy</h1>
              <p className="text-text-secondary">Your data stays on your device</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 text-text-secondary">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                The Short Version
              </h2>
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <p className="text-success font-medium">
                  Text Lab processes all data locally in your browser. Nothing is ever
                  sent to any server.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                What We Don&apos;t Collect
              </h2>
              <ul className="space-y-2">
                {[
                  "Your input text or data",
                  "Your output or transformed text",
                  "Any personal information",
                  "Usage analytics or telemetry",
                  "Cookies or tracking data",
                  "IP addresses or location data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckIcon size={18} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                How It Works
              </h2>
              <p className="mb-4">
                Text Lab is a static website with no backend server. All text
                transformations happen using JavaScript running in your browser:
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>JSON formatting? Done in your browser.</li>
                <li>Base64 encoding? Done in your browser.</li>
                <li>JWT decoding? Done in your browser.</li>
                <li>Every single tool? Done in your browser.</li>
              </ul>
              <p className="mt-4">
                There is literally no server to send data to. The site is hosted as
                static files on Cloudflare Pages.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Third-Party Services
              </h2>
              <p>
                The only external resources loaded are Google Fonts for typography.
                No analytics, no tracking pixels, no advertising scripts.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Open Source
              </h2>
              <p>
                Text Lab is open source. You can verify these claims by reviewing the
                source code on{" "}
                <a
                  href="https://github.com/pruthvi2805/text-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">
                Questions?
              </h2>
              <p>
                If you have any questions about this privacy policy, feel free to reach
                out via{" "}
                <a
                  href="https://kpruthvi.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  the contact page
                </a>
                .
              </p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-6 border-t border-border">
            <Link
              href="/"
              className="text-accent hover:underline text-sm"
            >
              ← Back to tools
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
