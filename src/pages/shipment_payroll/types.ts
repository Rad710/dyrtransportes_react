export type ShipmentPayroll = {
    payroll_code?: number | null;
    payroll_timestamp: string;
    collected: boolean;
    collection_timestamp?: string;
    deleted?: boolean;
    company_id?: string;
    modification_user?: string;
    modification_timestamp?: string;

    success?: string;
    error?: string;
};

export type Shipment = {
    shipment_code?: number | null;
    shipment_date: string;
    driver_code: number;
    product_code: number;
    route_code: number;
    price: number;
    paid_price: number;
    dispatch_code: string;
    receipt_code: string;
    origin_weight: string;
    destination_weight: string;
    shipment_payroll_code: number;
    driver_payroll_code: number;
    deleted?: boolean;
    company_id?: string;
    modification_user?: string;
    modification_timestamp?: string;

    success?: string;
    error?: string;
};
