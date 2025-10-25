import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

type LanguageOptions = "en" | "es";
export const appLanguages: LanguageOptions[] = ["en", "es"];

// Don't want to wait for resource load
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {},
        supportedLngs: appLanguages,
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
        load: "languageOnly",
        nonExplicitSupportedLngs: true,
        cleanCode: true,
    });

export const i18nChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
};

export const numberToLocaleString = (
    value: number,
    options: Intl.NumberFormatOptions = {}
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const locale = i18n.languages[0];

    return new Intl.NumberFormat(locale, mergedOptions).format(value);
};

export const localeToDefaultNumberString = (value: string): string => {
    const locale = i18n.languages[0];
    let processedValue = String(value).trim();

    // Check if locale starts with "es" to handle both "es" and variants like "es-ES"
    if (locale.startsWith("es")) {
        // Spanish uses comma as decimal separator and period as thousands separator
        processedValue = processedValue.replaceAll(".", "").replaceAll(",", ".");
    } else {
        processedValue = processedValue.replaceAll(",", "");
    }

    return processedValue;
};

export const defaultToLocaleNumberString = (value: string): string => {
    const startsWithDot = value.startsWith(".");
    if (startsWithDot) {
        return value;
    }

    const intValue = Number.parseInt(value);
    if (Number.isNaN(intValue)) {
        return "";
    }
    const floatPartString = value.split(".")?.at(1);

    return (
        numberToLocaleString(intValue) +
        (floatPartString !== undefined ? "." + floatPartString : "")
    );
};

export default i18n;
