import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Shipment, ShipmentAggregated, ShipmentPayroll } from "./types";
import { DateTime } from "luxon";

export const ShipmentPayrollApi = {
    getShipmentPayroll: async (code: number | null) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/shipment-payroll/${code}`)
            .then((response: AxiosResponse<ShipmentPayroll | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    getShipmentPayrollList: async (year?: number | null) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/shipment-payrolls?year=${year ?? ""}`)
            .then((response: AxiosResponse<ShipmentPayroll[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postShipmentPayroll: async (payload: ShipmentPayroll) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/shipment-payroll`, payload)
            .then((response: AxiosResponse<ShipmentPayroll>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ShipmentPayroll>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putShipmentPayroll: async (code: number, payload: ShipmentPayroll) =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/shipment-payroll/${code}`, payload)
            .then((response: AxiosResponse<ShipmentPayroll>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ShipmentPayroll>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteShipmentPayroll: async (code: number) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/shipment-payroll/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    deleteShipmentPayrollList: async (codeList: number[]) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/shipment-payrolls`, {
                data: codeList,
            })
            .then((response: AxiosResponse<{ success: string } | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    exportShipmentPayrollList: async (startDate: DateTime, endDate: DateTime) =>
        axios
            .get(
                `${
                    import.meta.env.VITE_API_URL
                }/export-shipment-payrolls?startDate=${startDate}&endDate=${endDate}`,
                {
                    responseType: "blob",
                },
            )
            .then((response: AxiosResponse<BlobPart>) => {
                saveAs(new Blob([response.data]), "lista_de_cobranzas.xlsx");
                toastSuccess("Planilla exportada exitosamente.");
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
            }),
};

export const ShipmentApi = {
    getShipmentList: async (shipment_payroll_code: number | null) =>
        axios
            .get(
                `${import.meta.env.VITE_API_URL}/shipments?shipment_payroll_code=${shipment_payroll_code ?? ""}`,
            )
            .then((response: AxiosResponse<Shipment[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    getShipmentAggregated: async (shipment_payroll_code: number | null) =>
        axios
            .get(
                `${import.meta.env.VITE_API_URL}/shipments-aggregated?shipment_payroll_code=${shipment_payroll_code ?? ""}`,
            )
            .then((response: AxiosResponse<ShipmentAggregated[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postShipment: async (payload: Shipment) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/shipment`, payload)
            .then((response: AxiosResponse<Shipment>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Shipment>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putShipment: async (code: number, payload: Shipment) =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/shipment/${code}`, payload)
            .then((response: AxiosResponse<Shipment>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Shipment>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),
};
