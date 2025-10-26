import type { ApiResponse } from "@/types";
import type { TFunction } from "i18next";
import z from "zod";
import { zodFloatString } from "@/utils/zod-utils";

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
                field: t("formDialog.fields.payrollPrice"),
            }),
            t("formDialog.validation.fieldEmpty", {
                field: t("formDialog.fields.payrollPrice"),
            }),
            t("formDialog.validation.invalidNumber")
        ),

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
