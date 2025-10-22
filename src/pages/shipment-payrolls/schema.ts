import { numberParser } from "@/utils/i18n";
import type { TFunction } from "i18next";
import z from "zod";

// SHIPMENT
export const getShipmentFormSchema = (t: TFunction) =>
    z.object({
        shipment_code: z
            .number()
            .positive(t("formDialog.validation.invalidShipmentCode"))
            .nullish(),
        shipment_date: z
            .date({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.shipment_date"),
                }),
            })
            .min(
                new Date("2000-01-01"),
                t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.shipment_date"),
                })
            )
            .max(
                new Date("2100-12-31"),
                t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.shipment_date"),
                })
            ),

        driver_name: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.driver"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.driver") })
            ),
        truck_plate: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.truck_plate"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.truck_plate"),
                })
            ),
        trailer_plate: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.truck_plate"),
                }),
            })
            .nullish(),
        driver_code: z
            .number({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.driver"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.driver") })
            ),

        product_code: z
            .number({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.product"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.product") })
            ),
        product_name: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.product"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.product") })
            ),

        route_code: z
            .number({
                error: t("formDialog.validation.fieldRequired", { field: "Route" }),
            })
            .min(1, t("formDialog.validation.fieldEmpty", { field: "Route" })),
        origin: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.origin") })
            ),
        destination: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination"),
                })
            ),

        price: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.price"),
                }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: "too_small",
                        origin: "string",
                        minimum: 1,
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", {
                            field: t("formDialog.fields.price"),
                        }),
                    });
                }

                const val = numberParser(arg);
                if (!val) {
                    return ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => numberParser(arg).toFixed(2)),
        payroll_price: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll_price"),
                }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: "too_small",
                        origin: "string",
                        minimum: 1,
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", {
                            field: t("formDialog.fields.payroll_price"),
                        }),
                    });
                }

                const val = numberParser(arg);
                if (!val) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => numberParser(arg).toFixed(2)),

        dispatch_code: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.dispatch_code"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.dispatch_code"),
                }),
            }),
        receipt_code: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.receipt_code"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.receipt_code"),
                }),
            }),
        origin_weight: z
            .number({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            })
            .int(
                t("formDialog.validation.noDecimals", {
                    field: t("formDialog.fields.origin_weight"),
                })
            )
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            }),
        destination_weight: z
            .number({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            })
            .int(
                t("formDialog.validation.noDecimals", {
                    field: t("formDialog.fields.destination_weight"),
                })
            )
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            }),
        shipment_payroll_code: z
            .number({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.payroll"),
                }),
            }),
        driver_payroll_code: z
            .number()
            .positive(t("formDialog.validation.invalidPayrollCode"))
            .nullish(),
    });
export type ShipmentFormSchema = z.infer<ReturnType<typeof getShipmentFormSchema>>;

// SHIPMENT PAYROLL
export const getShipmentPayrollFormSchema = (t: TFunction) => {
    return z.object({
        payroll_code: z.number().positive(t("formDialog.validation.invalidPayrollCode")).nullish(),
        payroll_timestamp: z
            .date({
                error: t("formDialog.validation.dateRequired"),
            })
            .min(new Date("2000-01-01"), t("formDialog.validation.dateRequired"))
            .max(new Date("2100-12-31"), t("formDialog.validation.dateRequired")),
        collected: z.boolean(),
        deleted: z.boolean(),
    });
};
export type ShipmentPayrollFormSchema = z.infer<ReturnType<typeof getShipmentPayrollFormSchema>>;
