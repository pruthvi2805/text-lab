"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  favorites: string[]; // Array of tool IDs
  isFavorite: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => void;
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (toolId: string) => get().favorites.includes(toolId),
      toggleFavorite: (toolId: string) => {
        const { favorites } = get();
        if (favorites.includes(toolId)) {
          set({ favorites: favorites.filter((id) => id !== toolId) });
        } else {
          set({ favorites: [...favorites, toolId] });
        }
      },
      addFavorite: (toolId: string) => {
        const { favorites } = get();
        if (!favorites.includes(toolId)) {
          set({ favorites: [...favorites, toolId] });
        }
      },
      removeFavorite: (toolId: string) => {
        set({ favorites: get().favorites.filter((id) => id !== toolId) });
      },
    }),
    {
      name: "text-lab-favorites",
    }
  )
);
