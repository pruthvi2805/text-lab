"use client";

import Link from "next/link";
import { Shell } from "@/components/layout";
import { tools, categories, ToolCategory } from "@/lib/tools/registry";
import { ShieldIcon, StarIcon, ClockIcon, SearchIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";
import { useRecentStore } from "@/stores/recent";
import { useToastStore } from "@/stores/toast";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useMemo, useCallback } from "react";

export default function HomePage() {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { recentToolIds } = useRecentStore();
  const { addToast } = useToastStore();
  const { open: openCommandPalette } = useCommandPaletteStore();

  const handleToggleFavorite = useCallback(
    (toolId: string, toolName: string) => {
      const wasFavorite = favorites.includes(toolId);
      toggleFavorite(toolId);
      addToast(
        wasFavorite ? `Removed ${toolName} from favorites` : `Added ${toolName} to favorites`,
        "warning"
      );
    },
    [favorites, toggleFavorite, addToast]
  );

  // Get recent tools (excluding favorites to avoid duplication)
  const recentTools = useMemo(() => {
    return recentToolIds
      .filter((id) => !favorites.includes(id))
      .map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) as typeof tools;
  }, [recentToolIds, favorites]);

  const { favoriteTools, toolsByCategory } = useMemo(() => {
    const favs = tools.filter((tool) => favorites.includes(tool.id));

    // Group tools by category (excluding favorites and recent)
    const byCategory: Record<ToolCategory, typeof tools> = {
      formatting: [],
      encoding: [],
      generators: [],
      text: [],
    };

    tools.forEach((tool) => {
      if (!favorites.includes(tool.id) && !recentToolIds.includes(tool.id)) {
        byCategory[tool.category].push(tool);
      }
    });

    return { favoriteTools: favs, toolsByCategory: byCategory };
  }, [favorites, recentToolIds]);

  const hasQuickAccess = favoriteTools.length > 0 || recentTools.length > 0;

  return (
    <Shell>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          {/* Hero with Search */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Developer Text Utilities
            </h1>
            <p className="text-text-secondary max-w-md mx-auto mb-5">
              Format, encode, decode, convert—instantly. 100% private.
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

          {/* Quick Access: Favorites + Recent */}
          {hasQuickAccess && (
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Favorites */}
                {favoriteTools.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <StarIcon size={14} filled className="text-warning" />
                      <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide">
                        Favorites
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {favoriteTools.map((tool) => (
                        <CompactToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={true}
                          onToggleFavorite={() => handleToggleFavorite(tool.id, tool.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent */}
                {recentTools.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ClockIcon size={14} className="text-text-muted" />
                      <h2 className="text-xs font-medium text-text-muted uppercase tracking-wide">
                        Recent
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {recentTools.map((tool) => (
                        <CompactToolCard
                          key={tool.id}
                          tool={tool}
                          isFavorite={false}
                          onToggleFavorite={() => handleToggleFavorite(tool.id, tool.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Tools by Category */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-text-secondary">
                {hasQuickAccess ? "All Tools" : "Tools"}
              </h2>
              {!hasQuickAccess && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <StarIcon size={12} />
                  Star to add favorites
                </span>
              )}
            </div>

            {categories.map((category) => {
              // Show all tools in category if no quick access section, otherwise show remaining
              const categoryTools = hasQuickAccess
                ? toolsByCategory[category.id]
                : tools.filter((t) => t.category === category.id);

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
                        onToggleFavorite={() => handleToggleFavorite(tool.id, tool.name)}
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

// Compact card for favorites/recent section
interface CompactToolCardProps {
  tool: (typeof tools)[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function CompactToolCard({ tool, isFavorite, onToggleFavorite }: CompactToolCardProps) {
  const Icon = tool.icon;

  return (
    <div className="group relative flex items-center gap-3 p-3 bg-bg-panel border border-border rounded-lg hover:border-accent/50 hover:bg-bg-surface transition-colors">
      <Link href={tool.path} className="absolute inset-0 z-0" />
      <Icon size={18} className="text-accent shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-text-primary text-sm truncate">{tool.name}</h3>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`relative z-10 p-1 rounded transition-all star-button ${
          isFavorite
            ? "text-warning hover:bg-warning/10"
            : "text-text-muted hover:text-warning hover:bg-bg-surface opacity-0 group-hover:opacity-100"
        }`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <StarIcon size={14} filled={isFavorite} />
      </button>
    </div>
  );
}

// Full card for category grid
interface ToolCardProps {
  tool: (typeof tools)[0];
  isFavorite: boolean;
  onToggleFavorite: () => void;
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`relative z-10 p-1 rounded transition-all star-button ${
            isFavorite
              ? "text-warning hover:bg-warning/10"
              : "text-text-muted hover:text-warning hover:bg-bg-surface opacity-0 group-hover:opacity-100"
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
