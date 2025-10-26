import { z } from "zod";
import type { TFunction } from "i18next";
import { DateTime } from "luxon";
import type { ApiResponse } from "@/types";
import { zodDateHTTPString, zodIntString } from "@/utils/zod-utils";

// Define schema for form validation
export const getShipmentExpenseFormSchema = (t: TFunction) =>
    z.object({
        expense_code: z.number().nullable(),
        expense_date: zodDateHTTPString(
            t("expenses.dialogs.form.errors.dateRequired"),
            t("expenses.dialogs.form.errors.invalidValue")
        ),
        receipt: z
            .string({
                error: t("expenses.dialogs.form.errors.receiptRequired"),
            })
            .trim()
            .transform((val) => val || null)
            .nullish(),

        amount: zodIntString(
            t("expenses.dialogs.form.errors.amountRequired"),
            t("expenses.dialogs.form.errors.amountRequired"),
            t("expenses.dialogs.form.errors.invalidValue"),
            t("expenses.dialogs.form.errors.noDecimals")
        ),
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
        payroll_timestamp: zodDateHTTPString(
            t("formDialog.errors.dateRequired"),
            t("formDialog.errors.invalidValue")
        ),
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
