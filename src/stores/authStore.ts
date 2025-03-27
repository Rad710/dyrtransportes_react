import { User } from "@/types";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

// Define JWT payload interface
interface JwtPayload {
    exp: number;
    // Add other claims as needed
}

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User, rememberMe?: boolean) => void;
    logout: () => void;
    checkTokenExpiry: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

        // Start token expiry check
        startTokenExpiryCheck();
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
    checkTokenExpiry: () => {
        const { token, logout } = get();

        if (!token) return true; // No token, consider expired

        try {
            const decodedToken = jwtDecode<JwtPayload>(token);
            const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

            if (decodedToken.exp < currentTime) {
                // Token has expired
                logout();
                return true;
            }

            return false;
        } catch (error) {
            // If there's an error decoding the token, consider it expired
            console.error("Error decoding token:", error);
            logout();
            return true;
        }
    },
}));

// Token expiry checker
let tokenCheckInterval: NodeJS.Timeout | null = null;

export const startTokenExpiryCheck = () => {
    // Clear any existing interval
    if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
    }

    // Check token expiry every minute
    tokenCheckInterval = setInterval(() => {
        useAuthStore.getState().checkTokenExpiry();
    }, 60000); // 60000ms = 1 minute
};

export const stopTokenExpiryCheck = () => {
    if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
        tokenCheckInterval = null;
    }
};

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
                // Check if token is expired before setting auth
                try {
                    const decodedToken = jwtDecode<JwtPayload>(token);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decodedToken.exp > currentTime) {
                        // Token is still valid
                        useAuthStore
                            .getState()
                            .setAuth(token, JSON.parse(user), !!localStorageUser);
                    } else {
                        // Token is expired, clear it
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("user");
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                    }
                } catch (error) {
                    // Invalid token, clear it
                    console.error("Error decoding token during hydration:", error);
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            }

            // Start token expiry check regardless if there's a token or not
            startTokenExpiryCheck();
            resolve();
        }, 100);
    });
};

// Add cleanup function to be called when the app is unmounted
export const cleanup = () => {
    stopTokenExpiryCheck();
};
