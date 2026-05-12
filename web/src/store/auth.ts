import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  user_id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setTokens: (access_token: string, refresh_token: string) => void;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  setTokens: (access_token, refresh_token) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/v1/auth/me");
      set({ user: data });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null });
    window.location.href = "/login";
  },
}));
