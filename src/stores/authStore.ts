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
        // Save to sessionStorage when setting auth
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
        set({ token, user });
    },
    logout: () => {
        // Clear sessionStorage on logout
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        set({ token: null, user: null });
    },
}));

export const hydrateAuth = async () => {
    return new Promise<void>((resolve) => {
        // Simulate a small delay to ensure consistent behavior
        setTimeout(() => {
            const token = sessionStorage.getItem("token");
            const user = sessionStorage.getItem("user");

            if (token && user) {
                useAuthStore.getState().setAuth(token, JSON.parse(user));
            }
            resolve();
        }, 100);
    });
};
