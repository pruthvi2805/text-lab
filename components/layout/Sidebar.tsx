"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { HomeIcon } from "@/components/ui/icons";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-14 h-full overflow-hidden bg-bg-panel border-r border-border">
      {/* Home button */}
      <Link
        href="/"
        className={`flex items-center justify-center h-12 hover:bg-bg-hover transition-colors ${
          pathname === "/" ? "text-accent border-l-2 border-accent" : "text-text-secondary"
        }`}
        title="Home"
      >
        <HomeIcon size={22} />
      </Link>

      {/* Tool icons */}
      <nav className="flex flex-col flex-1 py-2 overflow-y-auto">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = pathname === tool.path || pathname === `${tool.path}/`;
          return (
            <Link
              key={tool.id}
              href={tool.path}
              className={`flex items-center justify-center h-11 hover:bg-bg-hover transition-colors relative group ${
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
          );
        })}
      </nav>
    </aside>
  );
}
