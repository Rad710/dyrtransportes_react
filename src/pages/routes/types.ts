export type Route = {
    route_code?: number | null;
    origin?: string | null;
    destination?: string | null;
    price?: string | number | null;
    payroll_price?: string | number | null;
    deleted?: boolean | null;
    company_id?: string | null;
    modification_user?: string | null;

    success?: string;
    error?: string;
};

export type Product = {
    product_code?: number | null;
    product_name?: string | null;
    deleted?: boolean | null;
    company_id?: string | null;
    modification_user?: string | null;

    success?: string;
    error?: string;
};
