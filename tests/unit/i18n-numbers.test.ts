/**
 * Number formatting: the app shows amounts in the user's language and has to
 * turn them back into the plain form before sending them to the API.
 */
import { beforeEach, describe, expect, it } from "vitest";

import i18n, {
    defaultToLocaleNumberString,
    i18nChangeLanguage,
    localeToDefaultNumberString,
    numberToLocaleString,
} from "@/utils/i18n";

const useLanguage = async (language: string) => {
    i18nChangeLanguage(language);
    await i18n.changeLanguage(language);
};

describe("in Spanish", () => {
    beforeEach(() => useLanguage("es"));

    it("groups thousands with a period", () => {
        expect(numberToLocaleString(1662225)).toBe("1.662.225");
    });

    it("writes decimals with a comma", () => {
        expect(numberToLocaleString(120.75)).toBe("120,75");
    });

    it("turns what the user typed back into a plain number", () => {
        expect(localeToDefaultNumberString("1.662.225,50")).toBe("1662225.50");
    });

    it("shows a plain number the way the user reads it", () => {
        expect(defaultToLocaleNumberString("1662225.50")).toBe("1.662.225,50");
    });

    it("leaves a value that starts with a dot alone, it is being typed", () => {
        expect(defaultToLocaleNumberString(".5")).toBe(".5");
    });

    it("answers empty for something that is not a number", () => {
        expect(defaultToLocaleNumberString("abc")).toBe("");
    });
});

describe("in English", () => {
    beforeEach(() => useLanguage("en"));

    it("groups thousands with a comma", () => {
        expect(numberToLocaleString(1662225)).toBe("1,662,225");
    });

    it("writes decimals with a period", () => {
        expect(numberToLocaleString(120.75)).toBe("120.75");
    });

    it("turns what the user typed back into a plain number", () => {
        expect(localeToDefaultNumberString("1,662,225.50")).toBe("1662225.50");
    });

    it("shows a plain number the way the user reads it", () => {
        expect(defaultToLocaleNumberString("1662225.50")).toBe("1,662,225.50");
    });
});

describe("round trip", () => {
    it("survives going to the locale form and back", async () => {
        for (const language of ["es", "en"]) {
            await useLanguage(language);
            const shown = defaultToLocaleNumberString("29950.75");

            expect(localeToDefaultNumberString(shown)).toBe("29950.75");
        }
    });
});
