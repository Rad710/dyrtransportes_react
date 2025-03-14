import i18n from "./i18n";

/**
 * Parses a string representation of a number according to the current locale
 * @param value - The string to parse into a number
 * @returns The parsed number value
 */
export const globalizeParser = (value: string | number): number => {
    if (typeof value === "number") return value;

    // Handle different locale decimal separators
    const locale = i18n.language;
    let processedValue = String(value).trim();

    if (locale === "es") {
        // In Spanish, comma is used as decimal separator and periods for thousands
        // Replace all periods (thousand separators) then replace comma with period for parsing
        processedValue = processedValue.replace(/\./g, "").replace(/,/g, ".");
    } else {
        // For English and other locales that use period as decimal separator
        // Remove any thousand separators (commas)
        processedValue = processedValue.replace(/,/g, "");
    }

    const result = parseFloat(processedValue);
    return isNaN(result) ? 0 : result;
};

/**
 * Formats a number according to the current locale and specified options
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @returns The formatted number string
 */
export const globalizeFormatter = (
    value: number,
    options: Intl.NumberFormatOptions = {},
): string => {
    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const locale = i18n.language;

    return new Intl.NumberFormat(locale, mergedOptions).format(value);
};

/**
 * Formats a number as currency according to the current locale
 * @param value - The number to format as currency
 * @param currencyCode - The currency code (default: USD for English, EUR for Spanish)
 * @returns The formatted currency string
 */
export const currencyFormatter = (value: number, currencyCode?: string): string => {
    const locale = i18n.language;
    let currency = currencyCode;

    if (!currency) {
        // Default currencies based on locale if not specified
        currency = locale === "es" ? "EUR" : "USD";
    }

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Formats a number as a percentage according to the current locale
 * @param value - The number to format as percentage (0.1 = 10%)
 * @returns The formatted percentage string
 */
export const percentFormatter = (value: number): string => {
    return new Intl.NumberFormat(i18n.language, {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(value);
};
