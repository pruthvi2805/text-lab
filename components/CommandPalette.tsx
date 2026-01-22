"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { useRecentStore } from "@/stores/recent";
import { useFavoritesStore } from "@/stores/favorites";
import { StarIcon, ClockIcon } from "@/components/ui/icons";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple fuzzy search - matches if all characters appear in order
function fuzzyMatch(query: string, text: string): { matches: boolean; score: number } {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  if (queryLower.length === 0) return { matches: true, score: 0 };

  let queryIndex = 0;
  let score = 0;
  let lastMatchIndex = -1;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      // Bonus for consecutive matches
      if (lastMatchIndex === i - 1) score += 2;
      // Bonus for matching at start of word
      if (i === 0 || textLower[i - 1] === " " || textLower[i - 1] === "-") score += 3;
      score += 1;
      lastMatchIndex = i;
      queryIndex++;
    }
  }

  return {
    matches: queryIndex === queryLower.length,
    score: queryIndex === queryLower.length ? score : 0,
  };
}

function searchTools(query: string) {
  if (!query.trim()) return [];

  const results = tools
    .map((tool) => {
      // Search in name, description, and keywords
      const nameMatch = fuzzyMatch(query, tool.name);
      const shortNameMatch = fuzzyMatch(query, tool.shortName);
      const descMatch = fuzzyMatch(query, tool.description);
      const keywordMatches = tool.keywords.map((k) => fuzzyMatch(query, k));
      const bestKeywordMatch = keywordMatches.reduce(
        (best, curr) => (curr.score > best.score ? curr : best),
        { matches: false, score: 0 }
      );

      const matches = nameMatch.matches || shortNameMatch.matches || descMatch.matches || bestKeywordMatch.matches;
      // Weight name matches higher
      const score = nameMatch.score * 3 + shortNameMatch.score * 2 + descMatch.score + bestKeywordMatch.score;

      return { tool, matches, score };
    })
    .filter((r) => r.matches)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.tool);

  return results;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { recentToolIds, addRecent } = useRecentStore();
  const { favorites } = useFavoritesStore();

  // Get recent and favorite tools
  const recentTools = useMemo(() => {
    return recentToolIds
      .map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) as typeof tools;
  }, [recentToolIds]);

  const favoriteTools = useMemo(() => {
    return tools.filter((t) => favorites.includes(t.id));
  }, [favorites]);

  // Search results or default view
  const searchResults = useMemo(() => searchTools(query), [query]);

  const displayItems = useMemo(() => {
    if (query.trim()) {
      return { type: "search" as const, items: searchResults };
    }

    // Show recent, then favorites, then all tools
    const sections: Array<{ label: string; icon?: "recent" | "star"; tools: typeof tools }> = [];

    if (recentTools.length > 0) {
      sections.push({ label: "Recent", icon: "recent", tools: recentTools });
    }

    if (favoriteTools.length > 0) {
      sections.push({ label: "Favorites", icon: "star", tools: favoriteTools });
    }

    // All tools not in recent or favorites
    const otherTools = tools.filter(
      (t) => !recentToolIds.includes(t.id) && !favorites.includes(t.id)
    );
    if (otherTools.length > 0) {
      sections.push({ label: "All Tools", tools: otherTools });
    }

    return { type: "sections" as const, sections };
  }, [query, searchResults, recentTools, favoriteTools, recentToolIds, favorites]);

  // Flat list of all navigable items
  const flatItems = useMemo(() => {
    if (displayItems.type === "search") {
      return displayItems.items;
    }
    return displayItems.sections.flatMap((s) => s.tools);
  }, [displayItems]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (tool: (typeof tools)[0]) => {
      addRecent(tool.id);
      router.push(tool.path);
      onClose();
    },
    [addRecent, router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatItems, selectedIndex, handleSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 animate-fadeIn"
        onClick={onClose}
        style={{ animationDuration: "100ms" }}
      />

      {/* Palette */}
      <div className="fixed inset-x-4 top-[15vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 animate-slideDown">
        <div className="bg-bg-panel border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <svg
              className="w-5 h-5 text-text-muted shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools..."
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-text-muted bg-bg-surface rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
            {flatItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-muted">
                {query ? "No tools found" : "No tools available"}
              </div>
            ) : displayItems.type === "search" ? (
              // Search results - flat list
              <div className="py-2">
                {displayItems.items.map((tool, index) => {
                  const Icon = tool.icon;
                  const isSelected = index === selectedIndex;
                  const isFavorite = favorites.includes(tool.id);

                  return (
                    <button
                      key={tool.id}
                      data-selected={isSelected}
                      onClick={() => handleSelect(tool)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected ? "bg-accent/20 text-accent" : "text-text-primary hover:bg-bg-hover"
                      }`}
                    >
                      <Icon size={20} className={isSelected ? "text-accent" : "text-text-secondary"} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{tool.name}</div>
                        <div className="text-xs text-text-muted truncate">{tool.description}</div>
                      </div>
                      {isFavorite && <StarIcon size={14} filled className="text-warning shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              // Sections view
              <div className="py-2">
                {displayItems.sections.map((section, sectionIndex) => {
                  // Calculate the starting index for this section
                  const startIndex = displayItems.sections
                    .slice(0, sectionIndex)
                    .reduce((sum, s) => sum + s.tools.length, 0);

                  return (
                    <div key={section.label}>
                      <div className="flex items-center gap-2 px-4 py-2 text-xs text-text-muted uppercase tracking-wide">
                        {section.icon === "recent" && <ClockIcon size={12} />}
                        {section.icon === "star" && <StarIcon size={12} filled className="text-warning" />}
                        {section.label}
                      </div>
                      {section.tools.map((tool, toolIndex) => {
                        const Icon = tool.icon;
                        const absoluteIndex = startIndex + toolIndex;
                        const isSelected = absoluteIndex === selectedIndex;
                        const isFavorite = favorites.includes(tool.id);

                        return (
                          <button
                            key={tool.id}
                            data-selected={isSelected}
                            onClick={() => handleSelect(tool)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isSelected ? "bg-accent/20 text-accent" : "text-text-primary hover:bg-bg-hover"
                            }`}
                          >
                            <Icon size={20} className={isSelected ? "text-accent" : "text-text-secondary"} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{tool.name}</div>
                              <div className="text-xs text-text-muted truncate">{tool.description}</div>
                            </div>
                            {section.icon !== "star" && isFavorite && (
                              <StarIcon size={14} filled className="text-warning shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-text-muted">
            <span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface rounded">↑↓</kbd> navigate
              <span className="mx-2">·</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface rounded">↵</kbd> select
            </span>
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 bg-bg-surface rounded">Ctrl</kbd>
              <span className="mx-0.5">+</span>
              <kbd className="px-1.5 py-0.5 bg-bg-surface rounded">K</kbd> to open
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
