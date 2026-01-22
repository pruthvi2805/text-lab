"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useCallback, useMemo } from "react";
import { tools, categories, ToolCategory } from "@/lib/tools/registry";
import { HomeIcon, XIcon, StarIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { favorites, toggleFavorite } = useFavoritesStore();

  const { favoriteTools, toolsByCategory } = useMemo(() => {
    const favs = tools.filter((tool) => favorites.includes(tool.id));

    // Group non-favorite tools by category
    const byCategory: Record<ToolCategory, typeof tools> = {
      formatting: [],
      encoding: [],
      generators: [],
      text: [],
    };

    tools.forEach((tool) => {
      if (!favorites.includes(tool.id)) {
        byCategory[tool.category].push(tool);
      }
    });

    return { favoriteTools: favs, toolsByCategory: byCategory };
  }, [favorites]);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Don't render anything if closed (but keep in DOM for animation)
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
        style={{ animationDuration: "150ms" }}
      />

      {/* Drawer with slide animation */}
      <div
        className="fixed inset-y-0 left-0 w-64 bg-bg-panel border-r border-border z-50 md:hidden flex flex-col animate-slideIn"
        style={{ animationDuration: "200ms" }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-12 px-4 border-b border-border">
          <span className="font-semibold text-text-primary">Text Lab</span>
          <button
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
            aria-label="Close menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Home */}
          <Link
            href="/"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
              pathname === "/"
                ? "bg-bg-hover text-accent"
                : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
            }`}
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>

          {/* Favorites */}
          {favoriteTools.length > 0 && (
            <>
              <div className="my-2 mx-4 border-t border-border" />
              <div className="flex items-center gap-2 px-4 py-1.5">
                <StarIcon size={12} filled className="text-warning" />
                <span className="text-xs text-text-muted uppercase tracking-wide">Favorites</span>
              </div>
              {favoriteTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.path || pathname === `${tool.path}/`;
                return (
                  <div key={tool.id} className="flex items-center">
                    <Link
                      href={tool.path}
                      onClick={onClose}
                      className={`flex-1 flex items-center gap-3 pl-4 pr-2 py-2.5 transition-colors ${
                        isActive
                          ? "bg-bg-hover text-accent"
                          : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tool.name}</span>
                    </Link>
                    <button
                      onClick={() => toggleFavorite(tool.id)}
                      className="p-2 text-warning hover:bg-bg-hover rounded transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <StarIcon size={14} filled />
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {/* Tools by category */}
          {categories.map((category) => {
            const categoryTools = toolsByCategory[category.id];
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="my-2 mx-4 border-t border-border" />
                <div className="px-4 py-1.5 text-xs text-text-muted uppercase tracking-wide">
                  {category.name}
                </div>
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.path || pathname === `${tool.path}/`;
                  return (
                    <div key={tool.id} className="flex items-center">
                      <Link
                        href={tool.path}
                        onClick={onClose}
                        className={`flex-1 flex items-center gap-3 pl-4 pr-2 py-2.5 transition-colors ${
                          isActive
                            ? "bg-bg-hover text-accent"
                            : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                        }`}
                      >
                        <Icon size={18} />
                        <span>{tool.name}</span>
                      </Link>
                      <button
                        onClick={() => toggleFavorite(tool.id)}
                        className="p-2 text-text-muted hover:text-warning hover:bg-bg-hover rounded transition-colors"
                        aria-label="Add to favorites"
                      >
                        <StarIcon size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer - extra bottom padding for iPhone safe area */}
        <div className="px-4 pt-3 pb-8 border-t border-border text-xs text-text-muted">
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
            <Link
              href="/privacy"
              onClick={onClose}
              className="hover:text-text-secondary transition-colors"
            >
              Privacy
            </Link>
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
    </>
  );
}
