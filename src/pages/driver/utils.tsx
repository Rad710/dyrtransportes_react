import { AxiosError, AxiosResponse } from "axios";
import { Driver, DriverApiResponse } from "./types";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";

export const DriverApi = {
    getDriver: async (code: number | null) =>
        api
            .get(`/driver/${code}`)
            .then((response: AxiosResponse<Driver | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getDriverList: async () =>
        api
            .get(`/drivers`)
            .then((response: AxiosResponse<Driver[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postDriver: async (payload: Driver) =>
        api
            .post(`/driver`, payload)
            .then((response: AxiosResponse<DriverApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putDriver: async (code: number, payload: Driver) =>
        api
            .put(`/driver/${code}`, payload)
            .then((response: AxiosResponse<DriverApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteDriver: async (code: number) =>
        api
            .delete(`/driver/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteDriverList: async (codeList: number[]) =>
        api
            .delete(`/drivers`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    restoreDriver: async (code: number) =>
        api
            .patch(`/driver/${code}/restore`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportDriverList: async () =>
        api
            .get(`/drivers/export-excel`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};
