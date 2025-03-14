import { i18nChangeLanguage } from "@/utils/i18n";
import { create } from "zustand";

export type ThemeOptions = "light" | "dark" | "system";
export type LanguageOptions = "es" | "en";

interface PreferenceState {
    language: LanguageOptions;
    theme: ThemeOptions;
    setLanguage: (lang: LanguageOptions) => void;
    setTheme: (theme: ThemeOptions) => void;
}

export const usePreferenceStore = create<PreferenceState>((set) => ({
    language: "en", // Default language
    theme: "system", // Default theme

    setLanguage: (lang) => {
        // Change i18next language with react-i18next integration
        i18nChangeLanguage(lang);

        // Store language preference
        localStorage.setItem("language", lang);

        // Update state
        set({ language: lang });
    },

    setTheme: (theme: ThemeOptions) => {
        // Store theme preference
        localStorage.setItem("theme", theme);

        // Update state
        set({ theme });
    },
}));

export const hydratePreferences = async () => {
    return new Promise<void>((resolve) => {
        // Simulate a small delay to ensure consistent behavior
        setTimeout(() => {
            // Get stored language preference
            const storedLanguage = (localStorage.getItem("language") ?? "en") as LanguageOptions;
            if (storedLanguage) {
                usePreferenceStore.getState().setLanguage(storedLanguage);
            }

            // Get stored theme preference
            const storedTheme = (localStorage.getItem("theme") ?? "system") as ThemeOptions;
            if (storedTheme) {
                usePreferenceStore.getState().setTheme(storedTheme);
            }

            resolve();
        }, 100);
    });
};
