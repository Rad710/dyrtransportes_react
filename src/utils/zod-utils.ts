import { DateTime } from "luxon";
import z from "zod";

export const zodDateHTTPString = (fieldRequiredMessage: string, invalidValueMessage: string) =>
    z
        .string()
        .min(1, fieldRequiredMessage)
        .superRefine((arg, ctx) => {
            const val = DateTime.fromHTTP(arg);
            if (!val.isValid) {
                ctx.addIssue({
                    code: "invalid_type",
                    message: invalidValueMessage,
                    expected: "date",
                    received: "unknown",
                });
            }
            // fromHTTP does not parse an ISO date, it answered an invalid
            // DateTime whose toMillis() is NaN, so this bound never rejected
            if (val.toMillis() < DateTime.fromISO("2000-01-01").toMillis()) {
                ctx.addIssue({
                    code: "invalid_type",
                    message: invalidValueMessage,
                    expected: "date",
                    received: "unknown",
                });
            }
            if (val.toMillis() > DateTime.fromISO("2100-12-31").toMillis()) {
                ctx.addIssue({
                    code: "invalid_type",
                    message: invalidValueMessage,
                    expected: "date",
                    received: "unknown",
                });
            }
        });

export const zodFloatString = (fieldRequired: string, fieldEmpty: string, invalidNumber: string) =>
    z
        .string({
            error: fieldRequired,
        })
        .min(1, {
            message: fieldEmpty,
        })
        .superRefine((arg, ctx) => {
            const val = Number.parseFloat(arg);
            if (!val || val < 0) {
                return ctx.addIssue({
                    code: "invalid_type",
                    message: invalidNumber,
                    expected: "number",
                    received: "unknown",
                });
            }
        })
        .transform((arg) => Number.parseFloat(arg).toFixed(2));

export const zodIntString = (
    fieldRequired: string,
    fieldEmpty: string,
    invalidNumber: string,
    noDecimals: string
) =>
    z
        .string({
            error: fieldRequired,
        })
        .min(1, {
            message: fieldEmpty,
        })
        .superRefine((arg, ctx) => {
            const val = Number.parseInt(arg);
            if (!val || val < 0) {
                ctx.addIssue({
                    code: "invalid_type",
                    message: invalidNumber,
                    expected: "number",
                    received: "unknown",
                });
            }

            const floatVal = Number.parseFloat(arg);
            if (floatVal.toString().includes(".")) {
                ctx.addIssue({
                    code: "invalid_type",
                    message: noDecimals,
                    expected: "int",
                    received: "float",
                });
            }
        })
        .transform((arg) => Number.parseInt(arg).toString());
