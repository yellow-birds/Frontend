import { create } from "zustand";
import { clearSession, getCurrentUser, saveSession } from "~/lib/auth";
import type { User } from "~/types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  hydrate: () => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isHydrated: false,

  hydrate() {
    // Called once on client mount to restore session from localStorage
    const user = getCurrentUser();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("yb_token")
        : null;
    set({ user, token, isHydrated: true });
  },

  login(token, user) {
    saveSession(token, user);
    set({ token, user });
  },

  logout() {
    clearSession();
    set({ token: null, user: null });
  },
}));
