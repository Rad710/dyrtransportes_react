import { ApiResponse } from "@/types";

export type ShipmentPayroll = {
    payroll_code?: number | null;
    payroll_timestamp: string;
    collected: boolean;
    collection_timestamp?: string;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;

    success?: string;
    error?: string;
};

export type Shipment = {
    shipment_code?: number | null;
    shipment_date: string;
    driver_code: number;
    truck_plate: string;
    product_code: number;
    route_code: number;
    price: string;
    payroll_price: string;
    dispatch_code: string;
    receipt_code: string;
    origin_weight: string;
    destination_weight: string;
    shipment_payroll_code: number;
    driver_payroll_code?: number | null;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type ShipmentApiResponse = Shipment & ApiResponse;

export type ShipmentAggregated = {
    product: string;
    destination: string;
    origin: string;
    shipments: Shipment[];
    subtotalDestination: string;
    subtotalDifference: string;
    subtotalMoney: string;
    subtotalOrigin: string;
};
