"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { getToolByPath } from "@/lib/tools/registry";
import { MenuIcon, GithubIcon, StarIcon, SearchIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useFavoritesStore } from "@/stores/favorites";
import { useToastStore } from "@/stores/toast";

interface HeaderProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const pathname = usePathname();
  const currentTool = getToolByPath(pathname);
  const isToolPage = !!currentTool;
  const { favorites, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  const isFavorite = currentTool ? favorites.includes(currentTool.id) : false;

  const handleToggleFavorite = useCallback(() => {
    if (!currentTool) return;
    toggleFavorite(currentTool.id);
    addToast(
      isFavorite
        ? `Removed ${currentTool.name} from favorites`
        : `Added ${currentTool.name} to favorites`,
      "warning"
    );
  }, [currentTool, isFavorite, toggleFavorite, addToast]);

  return (
    <header className="flex items-center h-10 px-3 bg-bg-panel border-b border-border shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 -ml-1 mr-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon size={18} />
      </button>

      {/* Branding - hidden on mobile when viewing a tool */}
      <Link
        href="/"
        className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isToolPage ? "hidden md:flex" : ""}`}
      >
        <span className="text-sm font-semibold text-text-primary">Textsy</span>
      </Link>

      {/* Current tool name - prominent display */}
      {currentTool && (() => {
        const ToolIcon = currentTool.icon;
        return (
          <>
            <span className="mx-2 text-text-muted hidden md:inline">/</span>
            <div className="flex items-center gap-2">
              <ToolIcon size={18} className="text-accent" />
              <span className="text-base font-semibold text-text-primary truncate max-w-[180px] sm:max-w-none">
                {currentTool.name}
              </span>
            </div>
            <button
              onClick={handleToggleFavorite}
              className={`ml-2 p-1 rounded transition-colors star-button ${
                isFavorite
                  ? "text-warning hover:bg-bg-hover"
                  : "text-text-muted hover:text-warning hover:bg-bg-hover"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon size={16} filled={isFavorite} />
            </button>
          </>
        );
      })()}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search button */}
      <button
        onClick={onSearchClick}
        className="flex items-center gap-2 px-2 py-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
        aria-label="Search tools"
      >
        <SearchIcon size={16} />
        <span className="hidden md:inline text-xs text-text-muted">Search</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-text-muted bg-bg-surface rounded border border-border">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Privacy badge */}
      <span className="hidden lg:flex items-center gap-1.5 ml-2 px-2 py-0.5 text-xs text-success bg-success/10 rounded">
        <span className="w-1.5 h-1.5 bg-success rounded-full" />
        100% Private
      </span>

      {/* Theme toggle */}
      <div className="ml-2">
        <ThemeToggle />
      </div>

      {/* GitHub link */}
      <a
        href="https://github.com/pruthvi2805/text-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1 p-1.5 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
        aria-label="View on GitHub"
      >
        <GithubIcon size={16} />
      </a>
    </header>
  );
}
