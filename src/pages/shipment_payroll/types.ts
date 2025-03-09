import { ApiResponse, AutocompleteOption } from "@/types";

export type ShipmentPayroll = {
    payroll_code?: number | null;
    payroll_timestamp: string;
    collected: boolean;
    collection_timestamp?: string;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type Shipment = {
    shipment_code?: number | null;
    shipment_date: string;

    driver_name: string;
    truck_plate: string;
    trailer_plate?: string | null;
    driver_code: number;

    product_code: number;
    product_name: string;

    route_code: number;
    origin: string;
    destination: string;
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

export type GroupedShipments = {
    shipments: Shipment[];
    product: string;
    origin: string;
    destination: string;

    subtotal_origin_weight: string;
    subtotal_destination_weight: string;
    subtotal_difference: string;
    subtotal_money: string;
};

export interface AutocompleteOptionDriver extends AutocompleteOption {
    truck_plate: string;
    trailer_plate: string;
}
