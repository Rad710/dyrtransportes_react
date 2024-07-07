export type Driver = {
    driver_code?: number | null;
    driver_id?: string | null;
    driver_name?: string | null;
    driver_surname?: string | null;
    truck_plate?: string | null;
    trailer_plate?: string | null;
    deleted?: boolean | null;
    company_id?: string | null;
    modification_user?: string | null;

    success?: string;
    error?: string;
};
