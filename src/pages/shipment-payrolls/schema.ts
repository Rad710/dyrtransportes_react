import type { ApiResponse } from "@/types";
import type { TFunction } from "i18next";
import { DateTime } from "luxon";
import z from "zod";

// SHIPMENT
export const getShipmentFormSchema = (t: TFunction) =>
    z.object({
        shipment_code: z
            .number()
            .positive(t("formDialog.validation.invalidShipmentCode"))
            .nullish(),

        shipment_date: z
            .string()
            .min(
                1,
                t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.shipment_date"),
                })
            )
            .superRefine((arg, ctx) => {
                const val = DateTime.fromHTTP(arg);
                if (!val.isValid) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() < DateTime.fromHTTP("2000-01-01").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() > DateTime.fromHTTP("2100-12-31").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
            }),

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
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.price"),
                }),
            })
            .superRefine((arg, ctx) => {
                const val = Number.parseFloat(arg);
                if (!val || val < 0) {
                    return ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => Number.parseFloat(arg).toFixed(2)),
        payroll_price: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll_price"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.payroll_price"),
                }),
            })
            .superRefine((arg, ctx) => {
                const val = Number.parseFloat(arg);
                if (!val || val < 0) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => Number.parseFloat(arg).toFixed(2)),

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
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            })
            .superRefine((arg, ctx) => {
                const val = Number.parseInt(arg);
                if (!val || val < 0) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }

                const floatVal = Number.parseFloat(arg);
                if (floatVal.toString().includes(".")) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.noDecimals", {
                            field: t("formDialog.fields.origin_weight"),
                        }),
                        expected: "int",
                        received: "float",
                    });
                }
            })
            .transform((arg) => Number.parseInt(arg).toString()),

        destination_weight: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            })
            .superRefine((arg, ctx) => {
                const val = Number.parseInt(arg);
                if (!val || val < 0) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }

                const floatVal = Number.parseFloat(arg);
                if (floatVal.toString().includes(".")) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.noDecimals", {
                            field: t("formDialog.fields.destination_weight"),
                        }),
                        expected: "int",
                        received: "float",
                    });
                }
            })
            .transform((arg) => Number.parseInt(arg).toString()),
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

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
export type ShipmentType = z.infer<ReturnType<typeof getShipmentFormSchema>>;
export type ShipmentApiResponse = ShipmentType & ApiResponse;

export const getShipmentFormDefaultValue = (payrollCode: number): ShipmentType => ({
    shipment_code: null,
    shipment_date: DateTime.now().startOf("day").toHTTP(),
    driver_name: "",
    driver_code: 0,
    truck_plate: "",
    trailer_plate: null,

    product_code: 0,
    product_name: "",

    route_code: 0,
    origin: "",
    destination: "",
    price: "",
    payroll_price: "",

    dispatch_code: "",
    receipt_code: "",
    origin_weight: "",
    destination_weight: "",
    shipment_payroll_code: payrollCode,
    driver_payroll_code: null,
});

// SHIPMENT PAYROLL
export const getShipmentPayrollFormSchema = (t: TFunction) => {
    return z.object({
        payroll_code: z.number().positive(t("formDialog.validation.invalidPayrollCode")).nullish(),
        payroll_timestamp: z
            .string()
            .min(
                1,
                t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll_timestamp"),
                })
            )
            .superRefine((arg, ctx) => {
                const val = DateTime.fromHTTP(arg);
                if (!val.isValid) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() < DateTime.fromHTTP("2000-01-01").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() > DateTime.fromHTTP("2100-12-31").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.validation.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
            }),
        collected: z.boolean(),
        collection_timestamp: z.string().nullish(),

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
};
export type ShipmentPayrollType = z.infer<ReturnType<typeof getShipmentPayrollFormSchema>>;
export type ShipmentPayrollApiResponse = ShipmentPayrollType & ApiResponse;

export const getShipmentPayrollFormDefaultValue = (startDate: DateTime): ShipmentPayrollType => ({
    payroll_code: null,
    payroll_timestamp: startDate.toHTTP() || "",
    collected: false,
    deleted: false,
});
