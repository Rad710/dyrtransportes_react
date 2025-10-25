import { z } from "zod";
import type { TFunction } from "i18next";
import { DateTime } from "luxon";
import type { ApiResponse } from "@/types";

// Define schema for form validation
export const getShipmentExpenseFormSchema = (t: TFunction) =>
    z.object({
        expense_code: z.number().nullable(),
        expense_date: z
            .string()
            .min(1, t("expenses.dialogs.form.errors.dateRequired"))
            .superRefine((arg, ctx) => {
                const val = DateTime.fromHTTP(arg);
                if (!val.isValid) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("expenses.dialogs.form.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() < DateTime.fromHTTP("2000-01-01").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("expenses.dialogs.form.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() > DateTime.fromHTTP("2100-12-31").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("expenses.dialogs.form.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
            }),
        receipt: z
            .string({
                error: t("expenses.dialogs.form.errors.receiptRequired"),
            })
            .transform((val) => {
                if (val === null || val === undefined) {
                    return val;
                }
                const trimmed = val.trim();
                return trimmed === "" ? null : trimmed;
            })
            .nullish(),
        amount: z
            .string()
            .min(1, t("expenses.dialogs.form.errors.amountRequired"))
            .superRefine((arg, ctx) => {
                const val = Number.parseFloat(arg);
                if (!val || val < 0) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("expenses.dialogs.form.errors.invalidValue"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => Number.parseFloat(arg).toFixed(2)),
        reason: z.string({
            error: t("expenses.dialogs.form.errors.reasonRequired"),
        }),
        driver_payroll_code: z.number({
            error: t("expenses.dialogs.form.errors.payrollCodeRequired"),
        }),

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
export type ShipmentExpenseType = z.infer<ReturnType<typeof getShipmentExpenseFormSchema>>;
export type ShipmentExpenseApiResponseType = ShipmentExpenseType & ApiResponse;

// Default values for the form
export const getShipmentExpenseFormDefaultValue = (payrollCode: number): ShipmentExpenseType => ({
    expense_code: null,
    expense_date: DateTime.now().startOf("day").toHTTP(),
    receipt: "",
    amount: "",
    reason: "",
    driver_payroll_code: payrollCode,
});

// Create a dynamic schema that uses translations
export const getDriverPayrollFormSchema = (t: TFunction) =>
    z.object({
        payroll_code: z.number().positive(t("formDialog.errors.invalidCode")).nullish(),
        payroll_timestamp: z
            .string()
            .min(1, t("formDialog.errors.dateRequired"))
            .superRefine((arg, ctx) => {
                const val = DateTime.fromHTTP(arg);
                if (!val.isValid) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() < DateTime.fromHTTP("2000-01-01").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
                if (val.toMillis() > DateTime.fromHTTP("2100-12-31").toMillis()) {
                    ctx.addIssue({
                        code: "invalid_type",
                        message: t("formDialog.errors.invalidValue"),
                        expected: "date",
                        received: "unknown",
                    });
                }
            }),
        driver_code: z.number().positive(t("formDialog.errors.invalidDriverCode")),
        paid: z.boolean().nullish(),
        paid_timestamp: z.string().nullish(),
        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
export type DriverPayrollType = z.infer<ReturnType<typeof getDriverPayrollFormSchema>>;
export type DriverPayrollApiResponseType = DriverPayrollType & ApiResponse;

// Default values
export const getDriverPayrollFormDefaultValue = (
    startDate: DateTime,
    driverCode: number
): DriverPayrollType => ({
    payroll_code: null,
    payroll_timestamp: startDate.toHTTP() || "",
    driver_code: driverCode,
    paid: false,
    deleted: false,
});
