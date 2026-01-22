"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { HomeIcon, StarIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";
import { useMemo, useEffect, useRef } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const navRef = useRef<HTMLElement>(null);

  // Sort tools: favorites first, then others (maintaining original order within each group)
  const sortedTools = useMemo(() => {
    const favs = tools.filter((tool) => favorites.includes(tool.id));
    const others = tools.filter((tool) => !favorites.includes(tool.id));
    return [...favs, ...others];
  }, [favorites]);

  const hasFavorites = favorites.length > 0;

  // Auto-scroll to active tool when pathname changes
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector('[data-active="true"]');
    if (activeLink) {
      activeLink.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <aside className="hidden md:flex flex-col w-14 h-full overflow-hidden bg-bg-panel border-r border-border">
      {/* Home button */}
      <Link
        href="/"
        className={`flex items-center justify-center h-12 shrink-0 hover:bg-bg-hover transition-colors ${
          pathname === "/" ? "text-accent border-l-2 border-accent" : "text-text-secondary"
        }`}
        title="Home"
      >
        <HomeIcon size={22} />
      </Link>

      {/* Favorites divider */}
      {hasFavorites && (
        <div className="flex items-center justify-center py-1.5 shrink-0">
          <StarIcon size={12} filled className="text-warning" />
        </div>
      )}

      {/* Tool icons */}
      <nav ref={navRef} className="flex flex-col flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {sortedTools.map((tool, index) => {
          const Icon = tool.icon;
          const isActive = pathname === tool.path || pathname === `${tool.path}/`;
          const isFirstNonFavorite = hasFavorites && !favorites.includes(tool.id) &&
            (index === 0 || favorites.includes(sortedTools[index - 1].id));

          return (
            <div key={tool.id}>
              {/* Divider between favorites and non-favorites */}
              {isFirstNonFavorite && (
                <div className="mx-3 my-2 border-t border-border" />
              )}
              <Link
                href={tool.path}
                data-active={isActive}
                className={`flex items-center justify-center h-11 shrink-0 hover:bg-bg-hover transition-colors relative group ${
                  isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
                title={tool.name}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent" />
                )}
                <Icon size={20} />
                {/* Tooltip */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-bg-surface text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {tool.shortName}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
