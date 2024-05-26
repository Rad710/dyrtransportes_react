export type Route = {
    route_code: number | null;
    origin?: string | null;
    destination?: string | null;
    price?: number | null;
    payroll_price?: number | null;
    deleted?: boolean | null;
    company_id?: string | null;
    modification_user?: string | null;
    checked?: boolean;
};
