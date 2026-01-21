"use client";

import Link from "next/link";
import { ShieldIcon } from "@/components/ui/icons";

interface StatusBarProps {
  inputLength?: number;
  outputLength?: number;
}

export function StatusBar({ inputLength = 0, outputLength = 0 }: StatusBarProps) {
  return (
    <footer className="flex items-center h-6 px-3 bg-bg-panel border-t border-border text-xs">
      {/* Privacy link */}
      <Link
        href="/privacy"
        className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ShieldIcon size={12} />
        <span>Your data never leaves this browser</span>
      </Link>

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
