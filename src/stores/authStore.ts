import { User } from "@/types";
import { create } from "zustand";

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User, rememberMe?: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth: (token, user, rememberMe) => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (rememberMe) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }
        set({ token, user });
    },
    logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        set({
            token: null,
            user: null,
        });
    },
}));

export const hydrateAuth = async () => {
    return new Promise<void>((resolve) => {
        // Simulate a small delay to ensure consistent behavior
        setTimeout(() => {
            const sessionStorageToken = sessionStorage.getItem("token");
            const sessionStorageUser = sessionStorage.getItem("user");

            const localStorageToken = localStorage.getItem("token");
            const localStorageUser = localStorage.getItem("user");

            const token = sessionStorageToken ?? localStorageToken;
            const user = sessionStorageUser ?? localStorageUser;
            if (token && user) {
                useAuthStore.getState().setAuth(token, JSON.parse(user), !!localStorageUser);
            }
            resolve();
        }, 100);
    });
};
