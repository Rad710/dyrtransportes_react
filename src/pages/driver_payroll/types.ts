import { ApiResponse } from "@/types";

export type DriverPayroll = {
    payroll_code?: number | null;
    payroll_timestamp: string;
    driver_code: number;
    paid: boolean;
    paid_timestamp?: string;

    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type DriverPayrollApiResponse = DriverPayroll & ApiResponse;

export type ShipmentExpense = {
    expense_code?: number | null;
    expense_date: string;
    receipt: string;
    amount: string;
    reason: string;
    driver_payroll_code: number;
    deleted: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type ShipmentExpenseApiResponse = ShipmentExpense & ApiResponse;
