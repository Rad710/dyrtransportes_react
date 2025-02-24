import { toastAxiosError, toastSuccess } from "@/utils/notification";
import { AxiosError, AxiosResponse } from "axios";
import { saveAs } from "file-saver";
import { Product, Route, RouteFormResponse } from "./types";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";

export const RouteApi = {
    getRoute: async (code: number | null): Promise<Route | null> =>
        api
            .get(`/route/${code}`)
            .then((response: AxiosResponse<Route | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return null;
            }),

    getRouteList: async (): Promise<Route[]> =>
        api
            .get(`/routes`)
            .then((response: AxiosResponse<Route[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string } | null>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),

    postRoute: async (
        payload: Route,
    ): Promise<RouteFormResponse | null | AxiosError<RouteFormResponse | null>> =>
        api
            .post(`/route`, payload)
            .then((response: AxiosResponse<RouteFormResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<RouteFormResponse | null>) => {
                return errorResponse ?? null;
            }),

    putRoute: async (code: number, payload: Route): Promise<Route | null> =>
        api
            .put(`/route/${code}`, payload)
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
        api
            .delete(`/route/${code}`)
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
        api
            .delete(`/routes`, {
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
        api
            .get(`/export-routes`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse>) => {
                console.log({ errorResponse });
                return errorResponse;
            }),
};

export const ProductApi = {
    getProductList: async (): Promise<Product[]> =>
        api
            .get(`/products`)
            .then((response: AxiosResponse<Product[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<{ error: string }>) => {
                console.log({ errorResponse });
                toastAxiosError(errorResponse);
                return [];
            }),
    postProduct: async (payload: Product): Promise<Product | null> =>
        api
            .post(`/product`, payload)
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
        api
            .put(`/product/${code}`, payload)
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
        api
            .delete(`/product/${code}`)
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
        api
            .delete(`/products`, {
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
        api
            .get(`/export-products`, {
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
