import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Driver } from "./types";

export const DriverApi = {
    getDriver: async (code: number | null) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<Driver | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    getDriverList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/drivers`)
            .then((response: AxiosResponse<Driver[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postDriver: async (payload: Driver) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/driver`, payload)
            .then((response: AxiosResponse<Driver>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Driver>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putDriver: async (code: number, payload: Driver) =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/driver/${code}`, payload)
            .then((response: AxiosResponse<Driver>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Driver>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteDriver: async (code: number) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    // TODO CREATE ENDPOINT
    deleteDriverList: async (codeList: number[]) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/drivers`, {
                data: codeList,
            })
            .then((response: AxiosResponse<{ success: string } | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    reactivateDriver: async (code: number) =>
        axios
            .patch(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),
    // TODO usar nombre del archivo de backend
    exportDriverList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-drivers`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart>) => {
                saveAs(
                    new Blob([response.data]),
                    response.headers["content-disposition"]?.split("filename=")?.at(1) ||
                        "nomina_de_choferes.xlsx",
                );
                toastSuccess("Planilla exportada exitosamente.");
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),
};
