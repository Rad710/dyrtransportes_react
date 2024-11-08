export type Route = {
    route_code?: number | null;
    origin: string;
    destination: string;
    price: string | number;
    payroll_price: string | number;
    deleted?: boolean;
    company_id?: string;
    modification_user?: string;

    success?: string;
    error?: string;
};

export type Product = {
    product_code?: number | null;
    product_name: string;
    deleted?: boolean;
    company_id?: string;
    modification_user?: string;

    success?: string;
    error?: string;
};
