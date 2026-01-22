"use client";

import Link from "next/link";
import { Shell } from "@/components/layout";
import { tools } from "@/lib/tools/registry";
import { ShieldIcon, StarIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";
import { useMemo } from "react";

export default function HomePage() {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();

  const { favoriteTools, otherTools } = useMemo(() => {
    const favs = tools.filter((tool) => favorites.includes(tool.id));
    const others = tools.filter((tool) => !favorites.includes(tool.id));
    return { favoriteTools: favs, otherTools: others };
  }, [favorites]);

  return (
    <Shell>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Developer Text Utilities
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-4">
              Paste anything. Format, encode, decode, convert—instantly.
            </p>

            {/* Privacy guarantee - prominent and confident */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
              <ShieldIcon size={18} />
              <span>Your data stays on your device. Always.</span>
            </div>
            <p className="text-xs text-text-muted mt-2">
              No servers. No uploads. No tracking. Everything runs locally in your browser.
            </p>
          </div>

          {/* Favorites section */}
          {favoriteTools.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <StarIcon size={18} filled className="text-warning" />
                <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                  Favorites
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFavorite={true}
                    onToggleFavorite={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All tools section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                {favoriteTools.length > 0 ? "All Tools" : "Tools"}
              </h2>
              {favoriteTools.length === 0 && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <StarIcon size={12} />
                  Star tools to add them to favorites
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={false}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center text-sm text-text-muted">
            <p>
              &copy; 2026 Pruthvi Kauticwar &middot;{" "}
              <a
                href="https://kpruthvi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                kpruthvi.com
              </a>
              {" "}&middot;{" "}
              <a
                href="/privacy"
                className="hover:text-text-secondary transition-colors"
              >
                Privacy
              </a>
              {" "}&middot;{" "}
              <a
                href="https://kpruthvi.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                Contact
              </a>
              {" "}&middot;{" "}
              <a
                href="https://github.com/pruthvi2805/text-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-secondary transition-colors"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

interface ToolCardProps {
  tool: (typeof tools)[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <div className="group relative flex flex-col p-4 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors">
      <Link href={tool.path} className="absolute inset-0 z-0" />
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-bg-surface rounded-md text-accent group-hover:bg-accent/10 transition-colors">
          <Icon size={20} />
        </div>
        <h2 className="font-semibold text-text-primary flex-1">{tool.name}</h2>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`relative z-10 p-1.5 rounded-md transition-all active:scale-125 ${
            isFavorite
              ? "text-warning hover:bg-warning/10"
              : "text-text-muted hover:text-warning hover:bg-bg-surface"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
        >
          <StarIcon size={16} filled={isFavorite} />
        </button>
      </div>
      <p className="text-sm text-text-secondary">{tool.description}</p>
    </div>
  );
}
