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
    setAuth: (token, user) => {
        // Save to localStorage when setting auth
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user });
    },
    logout: () => {
        // Clear localStorage on logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null });
    },
}));

export const hydrateAuth = async () => {
    return new Promise<void>((resolve) => {
        // Simulate a small delay to ensure consistent behavior
        setTimeout(() => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            if (token && user) {
                useAuthStore.getState().setAuth(token, JSON.parse(user));
            }
            resolve();
        }, 100);
    });
};
