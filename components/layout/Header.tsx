"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getToolByPath } from "@/lib/tools/registry";
import { MenuIcon, GithubIcon } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const currentTool = getToolByPath(pathname);

  return (
    <header className="flex items-center h-10 px-3 bg-bg-panel border-b border-border">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-1.5 -ml-1 mr-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon size={18} />
      </button>

      {/* Branding */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span className="text-sm font-semibold text-text-primary">Text Lab</span>
      </Link>

      {/* Breadcrumb / current tool */}
      {currentTool && (
        <>
          <span className="mx-2 text-text-muted">/</span>
          <span className="text-sm text-text-secondary">{currentTool.name}</span>
        </>
      )}

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
