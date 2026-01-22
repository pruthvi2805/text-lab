"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { getToolByPath } from "@/lib/tools/registry";
import { MenuIcon, GithubIcon, ChevronLeftIcon, StarIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useFavoritesStore } from "@/stores/favorites";
import { useToastStore } from "@/stores/toast";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
      {/* Mobile: Back button on tool pages, Menu button on home */}
      {isToolPage ? (
        <Link
          href="/"
          className="md:hidden p-1.5 -ml-1 mr-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
          aria-label="Back to home"
        >
          <ChevronLeftIcon size={18} />
        </Link>
      ) : (
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 -ml-1 mr-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon size={18} />
        </button>
      )}

      {/* Mobile menu button (always visible on tool pages alongside back) */}
      {isToolPage && (
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 mr-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
          aria-label="Open menu"
        >
          <MenuIcon size={18} />
        </button>
      )}

      {/* Branding - hidden on mobile when viewing a tool */}
      <Link
        href="/"
        className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isToolPage ? "hidden md:flex" : ""}`}
      >
        <span className="text-sm font-semibold text-text-primary">Text Lab</span>
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

      {/* Privacy badge */}
      <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 text-xs text-success bg-success/10 rounded">
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
        className="ml-1 p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
        aria-label="View on GitHub"
      >
        <GithubIcon size={16} />
      </a>
    </header>
  );
}
