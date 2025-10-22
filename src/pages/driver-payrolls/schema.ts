import { z } from "zod";
import type { TFunction } from "i18next";
import { numberFormatter, numberParser } from "@/utils/i18n";
import { DateTime } from "luxon";
import type { ShipmentExpense } from "./types";

// Define schema for form validation
export const getShipmentExpenseFormSchema = (t: TFunction) =>
    z.object({
        expense_code: z.number().nullable(),
        expense_date: z
            .date({
                error: t("expenses.dialogs.form.errors.dateRequired"),
            })
            .min(new Date("2000-01-01"), t("expenses.dialogs.form.errors.dateRequired"))
            .max(new Date("2100-12-31"), t("expenses.dialogs.form.errors.dateRequired")),
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
            .string({
                error: t("expenses.dialogs.form.errors.amountRequired"),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: "too_small",
                        origin: "string",
                        minimum: 1,
                        inclusive: true,
                        message: t("expenses.dialogs.form.errors.amountEmpty"),
                    });
                }

                const val = numberParser(arg);
                if (!val) {
                    return ctx.addIssue({
                        code: "invalid_type",
                        message: t("expenses.dialogs.form.errors.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => numberParser(arg).toFixed(2)),
        reason: z.string({
            error: t("expenses.dialogs.form.errors.reasonRequired"),
        }),
        driver_payroll_code: z.number({
            error: t("expenses.dialogs.form.errors.payrollCodeRequired"),
        }),
    });
export type ShipmentExpenseFormSchema = z.infer<ReturnType<typeof getShipmentExpenseFormSchema>>;

// Default values for the form
export const EXPENSE_FORM_DEFAULT_VALUE = (payrollCode: number): ShipmentExpenseFormSchema => ({
    expense_code: null,
    expense_date: DateTime.now().startOf("day").toJSDate(),
    receipt: "",
    amount: "",
    reason: "",
    driver_payroll_code: payrollCode,
});
// Transformation functions between form schema and API schema
export const expenseToFormSchema = (expense: ShipmentExpense): ShipmentExpenseFormSchema => ({
    expense_code: expense?.expense_code ?? null,
    expense_date: DateTime.fromHTTP(expense.expense_date).toJSDate(),
    receipt: expense?.receipt ?? "",
    amount: numberFormatter(parseFloat(expense?.amount ?? "0") || 0),
    reason: expense?.reason ?? "",
    driver_payroll_code: expense?.driver_payroll_code ?? 0,
});
export const formSchemaToExpense = (formSchema: ShipmentExpenseFormSchema): ShipmentExpense => ({
    expense_code: formSchema.expense_code,
    expense_date: DateTime.fromJSDate(formSchema.expense_date).toHTTP() ?? "",
    receipt: formSchema.receipt ?? "",
    amount: formSchema.amount,
    reason: formSchema.reason,
    driver_payroll_code: formSchema.driver_payroll_code,
    deleted: false,
});

// Create a dynamic schema that uses translations
export const getDriverPayrollFormSchema = (t: TFunction) =>
    z.object({
        payroll_code: z.number().positive(t("formDialog.errors.invalidCode")).nullish(),
        payroll_timestamp: z
            .date({
                error: t("formDialog.errors.dateRequired"),
            })
            .min(new Date("2000-01-01"), t("formDialog.errors.dateRequired"))
            .max(new Date("2100-12-31"), t("formDialog.errors.dateRequired")),
        paid: z.boolean(),
        deleted: z.boolean(),
    });
export type DriverPayrollFormSchema = z.infer<ReturnType<typeof getDriverPayrollFormSchema>>;
