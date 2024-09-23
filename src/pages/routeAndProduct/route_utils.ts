import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Product, Route } from "./types";

export const RouteApi = {
    getRoute: async (code: number | null) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/route/${code}`)
            .then(
                (response: AxiosResponse<Route | null>) =>
                    response.data ?? null,
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
                (response: AxiosResponse<Route[] | null>) =>
                    response.data ?? [],
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

    putRoute: async (code: number, payload: Route) =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/route/${code}`, payload)
            .then((response: AxiosResponse<Route>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Route>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteRoute: async (code: number) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/route/${code}`)
            .then(
                (response: AxiosResponse<{ success: string } | null>) =>
                    response.data ?? null,
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    deleteRouteList: async (codeList: number[]) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/routes`, {
                data: codeList,
            })
            .then(
                (response: AxiosResponse<{ success: string } | null>) =>
                    response.data ?? null,
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    exportRouteList: async (codeList?: number[]) =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-routes`, {
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

export const ProductApi = {
    getProductList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/products`)
            .then(
                (response: AxiosResponse<Product[] | null>) =>
                    response.data ?? [],
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),
    postProduct: async (payload: Product) =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/product`, payload)
            .then((response: AxiosResponse<Product>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Product>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    // TODO CHECK ENDPOINT
    putProduct: async (code: number, payload: Product) =>
        axios
            .patch(`${import.meta.env.VITE_API_URL}/product/${code}`, payload)
            .then((response: AxiosResponse<Product>) => response.data ?? null)
            .catch((errorResponse: AxiosError<Product>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteProduct: async (code: number) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/product/${code}`)
            .then(
                (response: AxiosResponse<{ success: string } | null>) =>
                    response.data ?? null,
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    // TODO CREATE ENDPOINT
    deleteProductList: async (codeList: number[]) =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/products`, {
                data: codeList,
            })
            .then(
                (response: AxiosResponse<{ success: string } | null>) =>
                    response.data ?? null,
            )
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    // TODO CREATE ENDPOINT
    exportProductList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-products`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart>) => {
                saveAs(new Blob([response.data]), "lista_de_productos.xlsx");
                toastSuccess("Planilla exportada exitosamente.");
            })
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),
};
