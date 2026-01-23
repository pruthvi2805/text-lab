"use client";

import Link from "next/link";
import { Shell } from "@/components/layout";
import { tools, categories, ToolCategory } from "@/lib/tools/registry";
import { ShieldIcon, StarIcon, SearchIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";
import { useRecentStore } from "@/stores/recent";
import { useToastStore } from "@/stores/toast";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useMemo, useCallback } from "react";

const MAX_QUICK_ACCESS = 6;

export default function HomePage() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { recentToolIds } = useRecentStore();
  const { addToast } = useToastStore();
  const { open: openCommandPalette } = useCommandPaletteStore();

  const handleToggleFavorite = useCallback(
    (toolId: string, toolName: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const wasFavorite = favorites.includes(toolId);
      toggleFavorite(toolId);
      addToast(
        wasFavorite ? `Removed ${toolName} from favorites` : `Added ${toolName} to favorites`,
        "warning"
      );
    },
    [favorites, toggleFavorite, addToast]
  );

  // Combined quick access: favorites first, then recent (excluding duplicates)
  const quickAccessTools = useMemo(() => {
    const favTools = tools.filter((t) => favorites.includes(t.id));
    const recentNotFav = recentToolIds
      .filter((id) => !favorites.includes(id))
      .map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) as typeof tools;

    return [...favTools, ...recentNotFav].slice(0, MAX_QUICK_ACCESS);
  }, [favorites, recentToolIds]);

  // Tools by category (all tools, for the main grid)
  const toolsByCategory = useMemo(() => {
    const byCategory: Record<ToolCategory, typeof tools> = {
      formatting: [],
      encoding: [],
      generators: [],
      text: [],
    };

    tools.forEach((tool) => {
      byCategory[tool.category].push(tool);
    });

    return byCategory;
  }, []);

  return (
    <Shell>
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          {/* Hero with Search */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Textsy – Private, Browser-Only Developer Tools
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-5">
              Format, encode, generate, and analyze data instantly. All tools run locally in your browser—no uploads, no tracking.
            </p>

            {/* Search bar - opens command palette */}
            <button
              onClick={openCommandPalette}
              className="w-full max-w-md mx-auto flex items-center gap-3 px-4 py-3 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors text-left group"
            >
              <SearchIcon size={18} className="text-text-muted group-hover:text-accent transition-colors" />
              <span className="flex-1 text-text-muted">Search tools...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-text-muted bg-bg-surface rounded border border-border">
                <span>Ctrl</span>
                <span>K</span>
              </kbd>
            </button>

            {/* Privacy badge - compact */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-success">
              <ShieldIcon size={14} />
              <span>Your data never leaves your browser</span>
            </div>
          </div>

          {/* Quick Access - Compact horizontal row */}
          {quickAccessTools.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <StarIcon size={14} filled className="text-warning" />
                <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Quick Access
                </h2>
              </div>
              {/* Horizontal scroll on mobile, wrap on desktop */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible scrollbar-hide">
                {quickAccessTools.map((tool) => {
                  const Icon = tool.icon;
                  const isFavorite = favorites.includes(tool.id);
                  return (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="group flex items-center gap-2 px-3 py-2 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors shrink-0"
                    >
                      <Icon size={16} className="text-accent" />
                      <span className="text-sm font-medium text-text-primary whitespace-nowrap">
                        {tool.shortName}
                      </span>
                      {isFavorite && (
                        <StarIcon size={12} filled className="text-warning" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tools by Category */}
          <div className="space-y-6">
            <h2 className="text-sm font-medium text-text-secondary">All Tools</h2>

            {categories.map((category) => {
              const categoryTools = toolsByCategory[category.id];
              if (categoryTools.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <span className="text-xs text-text-muted hidden sm:inline">
                      — {category.description}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={favorites.includes(tool.id)}
                        onToggleFavorite={(e) => handleToggleFavorite(tool.id, tool.name, e)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-border text-center text-xs text-text-muted">
            <p>
              &copy; 2026 Pruthvi Kauticwar &middot;{" "}
              <a href="https://kpruthvi.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
                kpruthvi.com
              </a>
              {" "}&middot;{" "}
              <Link href="/privacy" className="hover:text-text-secondary transition-colors">
                Privacy
              </Link>
              {" "}&middot;{" "}
              <a href="https://github.com/pruthvi2805/text-lab" target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors">
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

// Tool card for category grid
interface ToolCardProps {
  tool: (typeof tools)[0];
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <div className="group relative flex flex-col p-3 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors">
      <Link href={tool.path} className="absolute inset-0 z-0" />
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={18} className="text-accent shrink-0" />
        <h3 className="font-medium text-text-primary text-sm flex-1 truncate">{tool.name}</h3>
        <button
          onClick={onToggleFavorite}
          className={`relative z-10 p-1 rounded transition-all star-button ${
            isFavorite
              ? "text-warning hover:bg-warning/10"
              : "text-text-muted hover:text-warning hover:bg-bg-surface md:opacity-0 md:group-hover:opacity-100"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <StarIcon size={14} filled={isFavorite} />
        </button>
      </div>
      <p className="text-xs text-text-muted line-clamp-2">{tool.description}</p>
    </div>
  );
}
