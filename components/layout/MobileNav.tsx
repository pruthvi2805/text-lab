"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools/registry";
import { HomeIcon, XIcon } from "@/components/ui/icons";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-bg-panel border-r border-border z-50 md:hidden flex flex-col">
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

          {/* Divider */}
          <div className="my-2 mx-4 border-t border-border" />

          {/* Tools */}
          <div className="px-4 py-1.5 text-xs text-text-muted uppercase tracking-wide">
            Tools
          </div>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = pathname === tool.path || pathname === `${tool.path}/`;
            return (
              <Link
                key={tool.id}
                href={tool.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  isActive
                    ? "bg-bg-hover text-accent"
                    : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                }`}
              >
                <Icon size={18} />
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <Link
            href="/privacy"
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </>
  );
}
