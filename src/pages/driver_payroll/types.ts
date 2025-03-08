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

export type ShipmentExpenses = {
    expense_code: number;
};
