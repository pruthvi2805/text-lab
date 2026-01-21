import Link from "next/link";
import { Shell } from "@/components/layout";
import { tools } from "@/lib/tools/registry";
import { ShieldIcon } from "@/components/ui/icons";

export default function HomePage() {
  return (
    <Shell>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Text Lab
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              Fast, private text utilities that run entirely in your browser.
              No servers, no uploads, no tracking.
            </p>

            {/* Privacy badge */}
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm">
              <ShieldIcon size={16} />
              <span>100% browser-based — your data never leaves this device</span>
            </div>
          </div>

          {/* Tool grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group flex flex-col p-4 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-bg-surface rounded-md text-accent group-hover:bg-accent/10 transition-colors">
                      <Icon size={20} />
                    </div>
                    <h2 className="font-semibold text-text-primary">{tool.name}</h2>
                  </div>
                  <p className="text-sm text-text-secondary">{tool.description}</p>
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center text-sm text-text-muted">
            <p>
              Built by{" "}
              <a
                href="https://kpruthvi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                K Pruthvi
              </a>
              . Open source on{" "}
              <a
                href="https://github.com/kpruthvireddy/text-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
