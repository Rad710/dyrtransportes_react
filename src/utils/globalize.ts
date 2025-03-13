import i18next from "i18next";
import { DayNumbers } from "luxon";

// Initialize i18next
i18next.init({
    lng: "es", // default language
    fallbackLng: "en",
    resources: {
        en: {
            translation: {
                // Translation resources if needed
            },
            formats: {
                number: {
                    currency: {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    },
                    decimal: {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    },
                    percent: {
                        style: "percent",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    },
                },
            },
        },
        es: {
            translation: {
                // Translation resources if needed
            },
            formats: {
                number: {
                    currency: {
                        style: "currency",
                        currency: "PYG",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    },
                    decimal: {
                        style: "decimal",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    },
                    percent: {
                        style: "percent",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    },
                },
            },
        },
    },
});

// Number parser function (equivalent to globalizeParser)
export const globalizeParser = (value: string) => {
    if (typeof value === "number") {
        return value;
    }

    // Handle different locale decimal separators
    const locale = i18next.language;
    let processedValue = value;

    if (locale === "es") {
        // In Spanish, comma is used as decimal separator
        processedValue = value.replace(/\./g, "").replace(/,/g, ".");
    }

    return parseFloat(processedValue);
};

// Number formatter function (equivalent to globalizeFormatter)
export const globalizeFormatter = (value: DayNumbers) => {
    const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    return new Intl.NumberFormat(i18next.language, defaultOptions).format(value);
};

// Change language function
export const changeLanguage = (lang: string) => {
    return i18next.changeLanguage(lang);
};

// Usage examples:
// Format a number: numberFormatter(1234.567) -> "1,234.57" in English, "1.234,57" in Spanish
// Parse a number: numberParser("1.234,56") -> 1234.56 when in Spanish locale
