import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";
import { DriverPayroll, ShipmentExpense, ShipmentExpenseApiResponse } from "./types";
import { Shipment } from "../shipment-payrolls/types";

export const DriverPayrollApi = {
    getDriverPayroll: async (payrollCode: number) =>
        api
            .get(`/driver-payroll/${payrollCode}`)
            .then((response: AxiosResponse<DriverPayroll | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getDriverPayrollList: async (driverCode: number) =>
        api
            .get(`/driver/${driverCode}/payrolls`)
            .then((response: AxiosResponse<DriverPayroll[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    // TODO: move to shipments endpoints
    getDriverPayrollShipmentList: async (driverPayrollCode: number) =>
        api
            .get(`/driver-payroll/${driverPayrollCode}/shipments`)
            .then((response: AxiosResponse<Shipment[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    changeShipmentListDriverPayroll: async (
        driverPayrollCode: number,
        shipmentCodeList: number[],
    ) =>
        api
            .patch(
                `/shipments/change-driver-payroll?driver_payroll_code=${driverPayrollCode}`,
                shipmentCodeList,
            )
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    updateCollectionStatus: async (payroll: DriverPayroll) =>
        api
            .patch(`/driver-payroll/${payroll.payroll_code ?? 0}/paid-status`, payroll)
            .then((response: AxiosResponse<DriverPayroll | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportDriverPayroll: async (driverPayrollCode: number) =>
        api
            .get(`/driver-payrolls/export-excel?driver_payroll_code=${driverPayrollCode}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};

export const ShipmentExpenseApi = {
    getShipmentExpense: async (expenseCode: number) =>
        api
            .get(`/shipment-expense/${expenseCode}`)
            .then((response: AxiosResponse<ShipmentExpense | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentExpenseList: async (driverPayrollCode?: number | null) =>
        api
            .get(`/shipment-expenses?driver_payroll_code=${driverPayrollCode}`)
            .then((response: AxiosResponse<ShipmentExpense[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postShipmentExpense: async (payload: ShipmentExpense) =>
        api
            .post(`/shipment-expense`, payload)
            .then((response: AxiosResponse<ShipmentExpenseApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putShipmentExpense: async (code: number, payload: ShipmentExpense) =>
        api
            .put(`/shipment-expense/${code}`, payload)
            .then((response: AxiosResponse<ShipmentExpenseApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    changeShipmentListDriverPayroll: async (
        driverPayrollCode: number,
        shipmentExpenseCodeList: number[],
    ) =>
        api
            .patch(
                `/shipment-expenses/change-driver-payroll?driver_payroll_code=${driverPayrollCode}`,
                shipmentExpenseCodeList,
            )
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentExpense: async (code: number) =>
        api
            .delete(`/shipment-expense/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentExpenseList: async (codeList: number[]) =>
        api
            .delete(`/shipment-expenses`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
};
