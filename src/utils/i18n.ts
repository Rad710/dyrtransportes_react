import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Don't want to wait for resource load
i18n.use(initReactI18next).init({
    resources: {},
    fallbackLng: "en",
    debug: !!import.meta.env.VITE_DEBUG,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export const i18nChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};

i18n.changeLanguage("es");

type LanguageOptions = "en" | "es";
export const appLanguages: LanguageOptions[] = ["en", "es"];

export default i18n;
