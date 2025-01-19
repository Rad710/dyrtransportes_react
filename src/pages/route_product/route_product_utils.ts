import { toastAxiosError, toastSuccess } from "@/utils/notification";
import axios, { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Product, Route } from "./types";
import { PromiseResult } from "@/types";

export const RouteApi = {
    getRoute: async (code: number | null): Promise<Route | null> =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/route/${code}`)
            .then((response: AxiosResponse<Route | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    getRouteList: async (): Promise<Route[]> =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/routes`)
            .then((response: AxiosResponse<Route[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postRoute: async (payload: Route): Promise<Route | null> =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/route`, payload)
            .then((response: AxiosResponse<Route | null>) => {
                if (response.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Route | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putRoute: async (code: number, payload: Route): Promise<Route | null> =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/route/${code}`, payload)
            .then((response: AxiosResponse<Route | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Route | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteRoute: async (code: number): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/route/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse?.response?.data ?? null;
            }),

    deleteRouteList: async (codeList: number[]): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/routes`, {
                data: codeList,
            })
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse?.response?.data ?? null;
            }),

    exportRouteList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-routes`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                if (response.data) {
                    saveAs(new Blob([response.data]), "lista_de_precios.xlsx");
                    toastSuccess("Planilla exportada exitosamente.");
                } else {
                    toastSuccess("Error al exportar planilla.");
                }
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
            }),
};

export const ProductApi = {
    getProductList: async (): Promise<Product[]> =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/products`)
            .then((response: AxiosResponse<Product[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),
    postProduct: async (payload: Product): Promise<Product | null> =>
        axios
            .post(`${import.meta.env.VITE_API_URL}/product`, payload)
            .then((response: AxiosResponse<Product | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Product | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    putProduct: async (code: number, payload: Product): Promise<Product | null> =>
        axios
            .put(`${import.meta.env.VITE_API_URL}/product/${code}`, payload)
            .then((response: AxiosResponse<Product | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<Product | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    deleteProduct: async (code: number): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/product/${code}`)
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    // TODO CREATE ENDPOINT
    deleteProductList: async (codeList: number[]): Promise<PromiseResult | null> =>
        axios
            .delete(`${import.meta.env.VITE_API_URL}/products`, {
                data: codeList,
            })
            .then((response: AxiosResponse<{ success: string } | null>) => {
                if (response?.data?.success) {
                    toastSuccess(response.data.success);
                }
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return errorResponse.response?.data ?? null;
            }),

    // TODO CREATE ENDPOINT
    exportProductList: async () =>
        axios
            .get(`${import.meta.env.VITE_API_URL}/export-products`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                if (response.data) {
                    saveAs(new Blob([response.data]), "lista_de_productos.xlsx");
                    toastSuccess("Planilla exportada exitosamente.");
                } else {
                    toastSuccess("Error al exportar planilla.");
                }
            })
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
            }),
};
