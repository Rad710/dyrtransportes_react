import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Route } from "./types";

export const RouteApi = {
    postRoute: async (payload: Route) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/route`, payload)
            .then(
                (
                    response: AxiosResponse<
                        (Route & { success: string }) | null
                    >
                ) => response.data ?? null
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
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

    patchRoute: async (code: number | null, payload: Route) =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/route/${code}`, payload)
            .then(
                (
                    response: AxiosResponse<
                        (Route & { success: string }) | null
                    >
                ) => response.data ?? null
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    deleteRouteList: async (codeList: (number | null)[]) =>
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

    exportRouteList: async (codeList?: (number | null)[]) =>
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
