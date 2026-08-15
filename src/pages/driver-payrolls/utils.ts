import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";
import { DateTime } from "luxon";
import {
    DriverPayrollType,
    DriverPayrollApiResponseType,
    ShipmentExpenseType,
    ShipmentExpenseApiResponseType,
} from "./schema";

export const DriverPayrollApi = {
    getDriverPayroll: async (payrollCode: number) =>
        api
            .get(`/driver-payroll/${payrollCode}`)
            .then((response: AxiosResponse<DriverPayrollType | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getDriverPayrollList: async (driverCode: number) =>
        api
            .get(`/driver/${driverCode}/payrolls`)
            .then((response: AxiosResponse<DriverPayrollType[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postDriverPayroll: async (payload: DriverPayrollType) =>
        api
            .post(`/driver-payroll`, payload)
            .then((response: AxiosResponse<DriverPayrollApiResponseType | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putDriverPayroll: async (code: number, payload: DriverPayrollType) =>
        api
            .put(`/driver-payroll/${code}`, payload)
            .then((response: AxiosResponse<DriverPayrollApiResponseType | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    updateCollectionStatus: async (payroll: DriverPayrollType) =>
        api
            .patch(`/driver-payroll/${payroll.payroll_code ?? 0}/paid-status`, payroll)
            .then((response: AxiosResponse<DriverPayrollApiResponseType | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteDriverPayroll: async (code: number) =>
        api
            .delete(`/driver-payroll/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteDriverPayrollList: async (codeList: number[]) =>
        api
            .delete(`/driver-payrolls`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportDriverPayrollList: async (driverCode: number, startDate: DateTime, endDate: DateTime) =>
        api
            .get(`/driver-payrolls/export-excel`, {
                params: {
                    driver_code: driverCode,
                    start_date: startDate,
                    end_date: endDate,
                },
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),

    exportDriverPayroll: async (driverPayrollCode: number) =>
        api
            .get(`/driver-payroll/export-excel/${driverPayrollCode}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),

    // Same document as the Excel export, the API converts it to PDF
    exportDriverPayrollPdf: async (driverPayrollCode: number) =>
        api
            .get(`/driver-payroll/export-pdf/${driverPayrollCode}`, {
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
            .then((response: AxiosResponse<ShipmentExpenseType | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentExpenseList: async (driverPayrollCode?: number | null) =>
        api
            .get(`/shipment-expenses?driver_payroll_code=${driverPayrollCode}`)
            .then((response: AxiosResponse<ShipmentExpenseType[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postShipmentExpense: async (payload: ShipmentExpenseType) =>
        api
            .post(`/shipment-expense`, payload)
            .then((response: AxiosResponse<ShipmentExpenseApiResponseType | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putShipmentExpense: async (code: number, payload: ShipmentExpenseType) =>
        api
            .put(`/shipment-expense/${code}`, payload)
            .then((response: AxiosResponse<ShipmentExpenseApiResponseType | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    changeShipmentListDriverPayroll: async (
        driverPayrollCode: number,
        shipmentExpenseCodeList: number[]
    ) =>
        api
            .patch(
                `/shipment-expenses/change-driver-payroll?driver_payroll_code=${driverPayrollCode}`,
                shipmentExpenseCodeList
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
