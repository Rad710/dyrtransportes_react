import { numberParser } from "@/utils/i18n";
import type { TFunction } from "i18next";
import z from "zod";

export const getRouteFormSchema = (t: TFunction) => {
    const createRequiredStringSchema = (fieldName: string) =>
        z
            .string({
                error: t("formDialog.validation.fieldRequired", { field: fieldName }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: fieldName.toLowerCase(),
                }),
            });

    // Create a reusable number validation schema for price fields
    const createPriceSchema = (fieldName: string) =>
        z
            .string({
                error: t("formDialog.validation.fieldRequired", { field: fieldName }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: "too_small",
                        origin: "string",
                        minimum: 1,
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", { field: fieldName }),
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
            .transform((arg) => numberParser(arg).toFixed(2));

    return z.object({
        route_code: z.number().positive(t("formDialog.validation.invalidRouteCode")).nullish(),
        origin: createRequiredStringSchema(t("formDialog.fields.origin")),
        destination: createRequiredStringSchema(t("formDialog.fields.destination")),
        price: createPriceSchema(t("formDialog.fields.price")),
        payroll_price: createPriceSchema(t("formDialog.fields.payrollPrice")),
    });
};
export type RouteFormSchema = z.infer<ReturnType<typeof getRouteFormSchema>>;

export const getProductFormSchema = (t: TFunction) => {
    const createRequiredStringSchema = (fieldName: string) =>
        z
            .string({
                error: t("formDialog.validation.fieldRequired", { field: fieldName }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: fieldName.toLowerCase(),
                }),
            });

    return z.object({
        product_code: z.number().positive(t("formDialog.validation.invalidProductCode")).nullish(),
        product_name: createRequiredStringSchema(t("formDialog.fields.productName")),
    });
};
export type ProductFormSchema = z.infer<ReturnType<typeof getProductFormSchema>>;
