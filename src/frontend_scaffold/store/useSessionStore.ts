import { create } from "zustand";
import type { User } from "@/models";

/**
 * Session store — caches the current authenticated user in UI state.
 * Source of truth is the Auth.js JWT; this store mirrors it client-side.
 */
interface SessionState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
