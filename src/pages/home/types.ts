export type DriverStatisticRow = {
    driver_code: number;
    driver_name: string;
    shipments: number;
    total_origin_weight: string;
    total_destination_weight: string;
    total_diff: string;
    total_shipment_payroll: string;
    total_driver_payroll: string;
    total_expenses_amount_receipt: string;
    total_expenses_amount_no_receipt: string;
    total_expenses_amount: string;
};
export type ProductStatisticRow = {
    product_code: number;
    product_name: string;
    shipments: number;
    total_origin_weight: string;
    total_destination_weight: string;
    total_diff: string;
};

export type ProfitData = {
    shipments: number;
    totalOriginWeight: number;
    totalDestinationWeight: number;
    totalShipmentPayroll: number;
    totalDriverPayroll: number;
    totalExpensesAmountReceipt: number;
    totalExpensesAmountNoReceipt: number;
    totalLosses: number;
    totalProfits: number;
};
