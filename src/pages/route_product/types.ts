import { ApiResponse } from "@/types";

export type Route = {
    route_code?: number | null;
    origin: string;
    destination: string;
    price: string;
    payroll_price: string;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type RouteApiResponse = Route & ApiResponse;

export type Product = {
    product_code?: number | null;
    product_name: string;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type ProductApiResponse = Product & ApiResponse;
