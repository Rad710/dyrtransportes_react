import type { ApiResponse } from "@/types";
import type { TFunction } from "i18next";
import { DateTime } from "luxon";
import z from "zod";
import { zodDateHTTPString, zodFloatString, zodIntString } from "@/utils/zod-utils";

// SHIPMENT
export const getShipmentFormSchema = (t: TFunction) =>
    z.object({
        shipment_code: z
            .number()
            .positive(t("formDialog.validation.invalidShipmentCode"))
            .nullish(),

        shipment_date: zodDateHTTPString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.shipment_date"),
            }),
            t("formDialog.validation.invalidValue")
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

        price: zodFloatString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.price"),
            }),
            t("formDialog.validation.fieldEmpty", {
                field: t("formDialog.fields.price"),
            }),
            t("formDialog.validation.invalidNumber")
        ),
        payroll_price: zodFloatString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.payroll_price"),
            }),
            t("formDialog.validation.fieldEmpty", {
                field: t("formDialog.fields.payroll_price"),
            }),
            t("formDialog.validation.invalidNumber")
        ),

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

        origin_weight: zodIntString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.origin_weight"),
            }),
            t("formDialog.validation.fieldEmpty", {
                field: t("formDialog.fields.origin_weight"),
            }),
            t("formDialog.validation.invalidNumber"),
            t("formDialog.validation.noDecimals", {
                field: t("formDialog.fields.origin_weight"),
            })
        ),
        destination_weight: zodIntString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.destination_weight"),
            }),
            t("formDialog.validation.fieldEmpty", {
                field: t("formDialog.fields.destination_weight"),
            }),
            t("formDialog.validation.invalidNumber"),
            t("formDialog.validation.noDecimals", {
                field: t("formDialog.fields.destination_weight"),
            })
        ),
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

        payroll_timestamp: zodDateHTTPString(
            t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.payroll_timestamp"),
            }),
            t("formDialog.validation.invalidValue")
        ),
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
