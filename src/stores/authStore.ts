import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth: (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null }),
}));

// Optional: Add persistence if needed
// Note: This still uses localStorage but only for page refreshes
export const hydrateAuth = () => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (token && user) {
        useAuthStore.getState().setAuth(token, JSON.parse(user));
    }
};
