/**
 * The zod helpers the forms are built on: dates, amounts and weights.
 */
import { describe, expect, it } from "vitest";

import { zodDateHTTPString, zodFloatString, zodIntString } from "@/utils/zod-utils";

const date = zodDateHTTPString("requerido", "fecha inválida");
const amount = zodFloatString("requerido", "vacío", "número inválido");
const weight = zodIntString("requerido", "vacío", "número inválido", "sin decimales");

describe("zodDateHTTPString", () => {
    it("accepts the HTTP format the API answers with", () => {
        const result = date.safeParse("Sun, 01 Mar 2026 00:00:00 GMT");

        expect(result.success).toBe(true);
    });

    it("rejects an empty value", () => {
        const result = date.safeParse("");

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("requerido");
    });

    it("rejects an ISO date, the API does not take it", () => {
        expect(date.safeParse("2026-03-01").success).toBe(false);
    });

    it("rejects text that is not a date", () => {
        expect(date.safeParse("mañana").success).toBe(false);
    });

    it("rejects a date before the year 2000", () => {
        expect(date.safeParse("Fri, 01 Jan 1999 00:00:00 GMT").success).toBe(false);
    });

    it("rejects a date after 2100", () => {
        expect(date.safeParse("Mon, 01 Jan 2200 00:00:00 GMT").success).toBe(false);
    });
});

describe("zodFloatString", () => {
    it("keeps two decimals", () => {
        const result = amount.safeParse("120.756");

        expect(result.success).toBe(true);
        expect(result.data).toBe("120.76");
    });

    it("completes the decimals of a whole number", () => {
        expect(amount.safeParse("55").data).toBe("55.00");
    });

    it("rejects an empty value", () => {
        const result = amount.safeParse("");

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe("vacío");
    });

    it("rejects a negative amount", () => {
        expect(amount.safeParse("-1").success).toBe(false);
    });

    it("rejects text", () => {
        expect(amount.safeParse("abc").success).toBe(false);
    });

    it("rejects zero, the forms use it for prices and weights", () => {
        // Number.parseFloat("0") is falsy, so the helper turns it down
        expect(amount.safeParse("0").success).toBe(false);
    });
});

describe("zodIntString", () => {
    it("accepts a whole number", () => {
        const result = weight.safeParse("30000");

        expect(result.success).toBe(true);
        expect(result.data).toBe("30000");
    });

    it("rejects decimals", () => {
        const result = weight.safeParse("30000.5");

        expect(result.success).toBe(false);
        expect(result.error?.issues.map((issue) => issue.message)).toContain("sin decimales");
    });

    it("rejects a negative number", () => {
        expect(weight.safeParse("-30").success).toBe(false);
    });

    it("rejects an empty value", () => {
        expect(weight.safeParse("").success).toBe(false);
    });
});
