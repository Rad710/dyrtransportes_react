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

export type RouteFormSchema = {
    routeCode?: number;
    origin: string;
    destination: string;
    priceString: string;
    payrollPriceString: string;
    successMessage?: string;
    errorMessage?: string;
};
