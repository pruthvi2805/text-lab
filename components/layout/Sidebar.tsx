"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools, categories, ToolCategory } from "@/lib/tools/registry";
import { HomeIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { useFavoritesStore } from "@/stores/favorites";
import { useSidebarStore } from "@/stores/sidebar";
import { useMemo, useEffect, useRef } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { favorites } = useFavoritesStore();
  const { isExpanded, toggle } = useSidebarStore();
  const navRef = useRef<HTMLElement>(null);

  const { favoriteTools, toolsByCategory } = useMemo(() => {
    const favs = tools.filter((tool) => favorites.includes(tool.id));

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

  // Auto-scroll to active tool when pathname changes
  useEffect(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector('[data-active="true"]');
    if (activeLink) {
      activeLink.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <aside
      className={`hidden md:flex flex-col h-full overflow-hidden bg-bg-panel border-r border-border transition-all duration-200 ${
        isExpanded ? "w-56" : "w-14"
      }`}
    >
      {/* Home button */}
      <Link
        href="/"
        className={`flex items-center gap-3 h-12 shrink-0 hover:bg-bg-hover transition-colors ${
          isExpanded ? "px-4" : "justify-center"
        } ${pathname === "/" ? "text-accent border-l-2 border-accent" : "text-text-secondary"}`}
        title={isExpanded ? undefined : "Home"}
      >
        <HomeIcon size={22} />
        {isExpanded && <span className="font-medium">Home</span>}
      </Link>

      {/* Navigation */}
      <nav ref={navRef} className="flex flex-col flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {/* Favorites section */}
        {favoriteTools.length > 0 && (
          <>
            {/* Collapsed: clickable icon to expand */}
            {!isExpanded && (
              <button
                onClick={toggle}
                className="flex items-center justify-center py-2 shrink-0 text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors group"
                title="Expand to see favorites"
              >
                <StarIcon size={14} />
                <span className="absolute left-full ml-2 px-2 py-1 bg-bg-surface text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Favorites ({favoriteTools.length})
                </span>
              </button>
            )}
            {/* Expanded: show header and tools */}
            {isExpanded && (
              <div className="px-4 py-1.5">
                <span className="text-xs text-text-muted uppercase tracking-wide">Favorites</span>
              </div>
            )}
            {favoriteTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = pathname === tool.path || pathname === `${tool.path}/`;

              return (
                <div key={tool.id} className="flex items-center group">
                  <Link
                    href={tool.path}
                    data-active={isActive}
                    className={`flex items-center gap-3 h-11 flex-1 shrink-0 hover:bg-bg-hover transition-colors relative ${
                      isExpanded ? "px-4" : "justify-center"
                    } ${isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"}`}
                    title={isExpanded ? undefined : tool.name}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent" />
                    )}
                    <Icon size={20} />
                    {isExpanded && <span className="truncate">{tool.name}</span>}
                    {/* Collapsed tooltip */}
                    {!isExpanded && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-bg-surface text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {tool.shortName}
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
            <div className={`my-2 border-t border-border ${isExpanded ? "mx-4" : "mx-3"}`} />
          </>
        )}

        {/* Tools by category */}
        {categories.map((category) => {
          const categoryTools = toolsByCategory[category.id];
          if (categoryTools.length === 0) return null;

          return (
            <div key={category.id}>
              {isExpanded && (
                <div className="px-4 py-1.5 text-xs text-text-muted uppercase tracking-wide">
                  {category.name}
                </div>
              )}
              {categoryTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.path || pathname === `${tool.path}/`;

                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    data-active={isActive}
                    className={`flex items-center gap-3 h-11 shrink-0 hover:bg-bg-hover transition-colors relative group ${
                      isExpanded ? "px-4" : "justify-center"
                    } ${isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"}`}
                    title={isExpanded ? undefined : tool.name}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent" />
                    )}
                    <Icon size={20} />
                    {isExpanded && <span className="truncate">{tool.name}</span>}
                    {/* Collapsed tooltip */}
                    {!isExpanded && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-bg-surface text-text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {tool.shortName}
                      </span>
                    )}
                  </Link>
                );
              })}
              {isExpanded && <div className="my-2 mx-4 border-t border-border" />}
            </div>
          );
        })}
      </nav>

      {/* Toggle button */}
      <button
        onClick={toggle}
        className={`flex items-center gap-2 h-10 shrink-0 border-t border-border hover:bg-bg-hover transition-colors text-text-muted hover:text-text-primary ${
          isExpanded ? "px-4 justify-start" : "justify-center"
        }`}
        title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? (
          <>
            <ChevronLeftIcon size={18} />
            <span className="text-xs">Collapse</span>
          </>
        ) : (
          <ChevronRightIcon size={18} />
        )}
      </button>
    </aside>
  );
}
