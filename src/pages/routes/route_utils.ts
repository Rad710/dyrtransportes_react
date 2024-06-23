import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Route } from "./types";

export const RouteApi = {
    getRoute: async (code: number | null) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/route/${code}`)
            .then(
                (response: AxiosResponse<Route | null>) => response.data ?? null
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                if (errorResponse?.response?.status !== 404) {
                    console.log({ errorResponse });
                    toastAxiosError(errorResponse);
                }
                return null;
            }),

    getRouteList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/routes`)
            .then(
                (response: AxiosResponse<Route[] | null>) => response.data ?? []
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postRoute: async (payload: Route) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/route`, payload)
            .then((response: AxiosResponse<Route>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Route>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    patchRoute: async (code: number, payload: Route) =>
        axios
            .patch(`${import.meta.env.VITE_API_URL}/route/${code}`, payload)
            .then((response: AxiosResponse<Route>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Route>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteRouteList: async (codeList: number[]) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/routes`, {
                data: codeList,
            })
            .then(
                (response: AxiosResponse<{ success: string } | null>) =>
                    response.data ?? null
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    exportRouteList: async (codeList: number[]) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export_routes`, {
                responseType: "blob",
                params: { route_list: codeList },
                paramsSerializer: {
                    indexes: false,
                },
            })
            .then((response: AxiosResponse<BlobPart>) => {
                saveAs(new Blob([response.data]), "lista_de_precios.xlsx");
                toastSuccess("Planilla exportada exitosamente.");
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),
};
