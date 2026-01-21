"use client";

import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { MobileNav } from "./MobileNav";

interface ShellProps {
  children: ReactNode;
  inputLength?: number;
  outputLength?: number;
}

export function Shell({ children, inputLength = 0, outputLength = 0 }: ShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-bg-darkest">
      {/* Header */}
      <Header onMenuClick={() => setMobileNavOpen(true)} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <Sidebar />

        {/* Content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* Status bar */}
      <StatusBar inputLength={inputLength} outputLength={outputLength} />

      {/* Mobile navigation drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </div>
  );
}
