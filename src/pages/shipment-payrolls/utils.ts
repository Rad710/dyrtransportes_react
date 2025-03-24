import { ApiResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { DateTime } from "luxon";
import { ShipmentPayroll } from "./types";
import { api } from "@/utils/axios";

export type ShipmentPayrollApiResponse = ShipmentPayroll & ApiResponse;

export const ShipmentPayrollApi = {
    getShipmentPayroll: async (code: number | null) =>
        api
            .get(`/shipment-payroll/${code}`)
            .then((response: AxiosResponse<ShipmentPayrollApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentPayrollList: async (year?: number | null) =>
        api
            .get(`/shipment-payrolls?year=${year ?? ""}`)
            .then((response: AxiosResponse<ShipmentPayroll[] | null>) => {
                return response.data ?? [];
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postShipmentPayroll: async (payload: ShipmentPayroll) =>
        api
            .post(`/shipment-payroll`, payload)
            .then((response: AxiosResponse<ShipmentPayrollApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putShipmentPayroll: async (code: number, payload: ShipmentPayroll) =>
        api
            .put(`/shipment-payroll/${code}`, payload)
            .then((response: AxiosResponse<ShipmentPayrollApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    updateCollectionStatus: async (payroll: ShipmentPayroll) =>
        api
            .patch(`/shipment-payroll/${payroll.payroll_code ?? 0}/collection-status`, payroll)
            .then((response: AxiosResponse<ShipmentPayrollApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentPayroll: async (code: number) =>
        api
            .delete(`/shipment-payroll/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentPayrollList: async (codeList: number[]) =>
        api
            .delete(`/shipment-payrolls`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportShipmentPayrollList: async (startDate: DateTime, endDate: DateTime) =>
        api
            .get(`/shipment-payrolls/export-excel?start_date=${startDate}&end_date=${endDate}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};
