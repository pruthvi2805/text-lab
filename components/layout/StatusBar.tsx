"use client";

import Link from "next/link";
import { ShieldIcon } from "@/components/ui/icons";

interface StatusBarProps {
  inputLength?: number;
  outputLength?: number;
}

export function StatusBar({ inputLength = 0, outputLength = 0 }: StatusBarProps) {
  return (
    <footer className="hidden md:flex items-center h-6 px-3 bg-bg-panel border-t border-border text-xs">
      {/* Privacy link */}
      <Link
        href="/privacy"
        className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ShieldIcon size={12} />
        <span className="hidden sm:inline">Your data never leaves this browser</span>
        <span className="sm:hidden">Private</span>
      </Link>

      {/* Separator and Hub link */}
      <span className="mx-2 text-text-muted">·</span>
      <a
        href="https://kpruthvi.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-muted hover:text-text-secondary transition-colors"
      >
        kpruthvi.com
      </a>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats */}
      {(inputLength > 0 || outputLength > 0) && (
        <div className="flex items-center gap-3 text-text-muted">
          {inputLength > 0 && (
            <span>
              Input: {inputLength.toLocaleString()} char{inputLength !== 1 ? "s" : ""}
            </span>
          )}
          {outputLength > 0 && (
            <span>
              Output: {outputLength.toLocaleString()} char{outputLength !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </footer>
  );
}
