import { ApiResponse } from "@/types";

export type Driver = {
    driver_code?: number | null;
    driver_id: string;
    driver_name: string;
    driver_surname: string;
    truck_plate: string;
    trailer_plate: string;
    deleted?: boolean;
    modification_user?: string;
    modification_timestamp?: string;
};

export type DriverApiResponse = Driver & ApiResponse;
