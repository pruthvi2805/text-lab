"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 5;

interface RecentState {
  recentToolIds: string[];
  addRecent: (toolId: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      recentToolIds: [],
      addRecent: (toolId: string) => {
        const { recentToolIds } = get();
        // Remove if already exists, then add to front
        const filtered = recentToolIds.filter((id) => id !== toolId);
        const updated = [toolId, ...filtered].slice(0, MAX_RECENT);
        set({ recentToolIds: updated });
      },
      clearRecent: () => {
        set({ recentToolIds: [] });
      },
    }),
    {
      name: "text-lab-recent",
    }
  )
);
