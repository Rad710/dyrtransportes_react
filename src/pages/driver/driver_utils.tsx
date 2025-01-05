import { toastAxiosError, toastError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Driver } from "./types";
import { PromiseResult } from "@/types";

export const DriverApi = {
    getDriver: async (code: number | null): Promise<Driver | null> =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<Driver | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    getDriverList: async (): Promise<Driver[]> =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/drivers`)
            .then((response: AxiosResponse<Driver[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postDriver: async (payload: Driver): Promise<Driver | null> =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/driver`, payload)
            .then((response: AxiosResponse<Driver | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Driver | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putDriver: async (code: number, payload: Driver): Promise<Driver | null> =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/driver/${code}`, payload)
            .then((response: AxiosResponse<Driver | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Driver | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteDriver: async (code: number): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteDriverList: async (codeList: number[]): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/drivers`, {
                data: codeList,
            })
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    reactivateDriver: async (code: number): Promise<PromiseResult | null> =>
        axios
            .patch(`${import.meta.env.VITE_API_URL}/driver/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),
    // TODO usar nombre del archivo de backend
    exportDriverList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-drivers`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                if (response.data) {
                    saveAs(
                        new Blob([response.data]),
                        response.headers["content-disposition"]?.split("filename=")?.at(1) ||
                            "nomina_de_choferes.xlsx"
                    );
                    toastSuccess("Planilla exportada exitosamente.");
                } else {
                    toastError("Error al Exportar Planilla");
                }
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
            }),
};
