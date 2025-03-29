import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Don't want to wait for resource load
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {},
        fallbackLng: "en",
        debug: !!import.meta.env.VITE_DEBUG,
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
        detection: {
            order: ["navigator", "htmlTag", "cookie", "localStorage", "path", "subdomain"],
            caches: ["localStorage", "cookie"], // Cache language detection results
        },
    });

export const i18nChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};

type LanguageOptions = "en" | "es";
export const appLanguages: LanguageOptions[] = ["en", "es"];

/**
 * Parses a string or number value based on the current i18n language setting
 * Properly handles decimal separators for different locales
 * @param value - The string or number to parse
 * @returns The parsed number or 0 if parsing failed
 */
export const numberParser = (value: string | number): number => {
    if (typeof value === "number") return value;

    const locale = i18n.language;
    let processedValue = String(value).trim();

    if (locale === "es") {
        // Spanish uses comma as decimal separator and period as thousands separator
        processedValue = processedValue.replace(/\./g, "").replace(/,/g, ".");
    } else {
        // English uses period as decimal separator and comma as thousands separator
        processedValue = processedValue.replace(/,/g, "");
    }

    const result = parseFloat(processedValue);
    return isNaN(result) ? 0 : result;
};

/**
 * Formats a number based on the current i18n language setting
 * @param value - The number to format
 * @param options - Optional Intl.NumberFormatOptions for customizing the output
 * @returns A formatted string representation of the number
 */
export const numberFormatter = (value: number, options: Intl.NumberFormatOptions = {}): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const locale = i18n.language;

    return new Intl.NumberFormat(locale, mergedOptions).format(value);
};

export default i18n;
