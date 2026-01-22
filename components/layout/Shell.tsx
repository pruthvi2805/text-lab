"use client";

import { useState, useEffect, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "@/components/CommandPalette";
import { useCommandPaletteStore } from "@/stores/command-palette";

interface ShellProps {
  children: ReactNode;
  inputLength?: number;
  outputLength?: number;
}

export function Shell({ children, inputLength = 0, outputLength = 0 }: ShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isOpen: commandPaletteOpen, open: openCommandPalette, close: closeCommandPalette } = useCommandPaletteStore();

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [mobileNavOpen]);

  // Keyboard shortcut for command palette (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openCommandPalette]);

  return (
    <div className="flex flex-col h-screen h-[100dvh] bg-bg-darkest">
      {/* Header */}
      <Header onMenuClick={() => setMobileNavOpen(true)} onSearchClick={openCommandPalette} />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">{children}</main>
      </div>

      {/* Status bar */}
      <StatusBar inputLength={inputLength} outputLength={outputLength} />

      {/* Mobile navigation drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Command palette */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={closeCommandPalette} />
    </div>
  );
}
