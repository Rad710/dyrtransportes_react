import { ApiResponse } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { DateTime } from "luxon";
import { Shipment, ShipmentApiResponse, ShipmentAggregated, ShipmentPayroll } from "./types";
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
            .get(`/export-shipment-payrolls?startDate=${startDate}&endDate=${endDate}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};

export const ShipmentApi = {
    getShipment: async (code: number) =>
        api
            .get(`/shipment/${code}`)
            .then((response: AxiosResponse<Shipment | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentList: async (shipment_payroll_code?: number | null) =>
        api
            .get(
                `/shipments${shipment_payroll_code ? `?shipment_payroll_code=${shipment_payroll_code}` : ""}`,
            )
            .then((response: AxiosResponse<Shipment[] | null>) => {
                return response.data ?? [];
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentAggregated: async (shipment_payroll_code: number) =>
        api
            .get(`/shipments-aggregated?shipment_payroll_code=${shipment_payroll_code}`)
            .then((response: AxiosResponse<ShipmentAggregated[] | null>) => {
                return response.data ?? [];
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postShipment: async (payload: Shipment) =>
        api
            .post(`/shipment`, payload)
            .then((response: AxiosResponse<ShipmentApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putShipment: async (code: number, payload: Shipment) =>
        api
            .put(`/shipment/${code}`, payload)
            .then((response: AxiosResponse<ShipmentApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipment: async (code: number) =>
        api
            .delete(`/shipment/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentList: async (codeList: number[]) =>
        api
            .delete(`/shipments`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportShipmentList: async () =>
        api
            .get(`/export-shipments`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),

    // Optional: If you need to export shipments within a date range, similar to shipment-payrolls
    exportShipmentListByDateRange: async (startDate: DateTime, endDate: DateTime) =>
        api
            .get(`/export-shipments?startDate=${startDate}&endDate=${endDate}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};
