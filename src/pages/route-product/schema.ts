import type { ApiResponse } from "@/types";
import type { TFunction } from "i18next";
import z from "zod";

// ROUTE
export const getRouteFormSchema = (t: TFunction) => {
    return z.object({
        route_code: z.number().positive(t("formDialog.validation.invalidRouteCode")).nullish(),
        origin: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.origin"),
                }),
            }),
        destination: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination"),
                }),
            }),

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
                    field: t("formDialog.fields.payrollPrice"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.payrollPrice"),
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

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
};
export type RouteType = z.infer<ReturnType<typeof getRouteFormSchema>>;
export type RouteApiResponse = RouteType & ApiResponse;

export const getRouteFormDefaultValue = (): RouteType => ({
    route_code: null,
    origin: "",
    destination: "",
    price: "",
    payroll_price: "",
});

// PRODUCT
export const getProductFormSchema = (t: TFunction) => {
    return z.object({
        product_code: z.number().positive(t("formDialog.validation.invalidProductCode")).nullish(),
        product_name: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.productName"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.productName"),
                }),
            }),

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
};
export type ProductType = z.infer<ReturnType<typeof getProductFormSchema>>;
export type ProductApiResponse = ProductType & ApiResponse;

export const getProductFormDefaultValue = (): ProductType => ({
    product_code: null,
    product_name: "",
});
