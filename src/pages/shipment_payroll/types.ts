export type ShipmentPayroll = {
    payroll_code?: number | null;
    payroll_timestamp: string;
    collected: boolean;
    collection_timestamp?: string;
    deleted?: boolean;
    company_id?: string;
    modification_user?: string;

    success?: string;
    error?: string;
};
