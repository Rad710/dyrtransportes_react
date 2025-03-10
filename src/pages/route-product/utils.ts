import { AxiosError, AxiosResponse } from "axios";
import { Product, ProductApiResponse, Route, RouteApiResponse } from "./types";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";

export const RouteApi = {
    getRouteList: async () =>
        api
            .get(`/routes`)
            .then((response: AxiosResponse<Route[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postRoute: async (payload: Route) =>
        api
            .post(`/route`, payload)
            .then((response: AxiosResponse<RouteApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putRoute: async (code: number, payload: Route) =>
        api
            .put(`/route/${code}`, payload)
            .then((response: AxiosResponse<RouteApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteRoute: async (code: number) =>
        api
            .delete(`/route/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteRouteList: async (codeList: number[]) =>
        api
            .delete(`/routes`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportRouteList: async () =>
        api
            .get(`/routes/export-excel`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};

export const ProductApi = {
    getProductList: async () =>
        api
            .get(`/products`)
            .then((response: AxiosResponse<Product[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
    postProduct: async (payload: Product) =>
        api
            .post(`/product`, payload)
            .then((response: AxiosResponse<ProductApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putProduct: async (code: number, payload: Product) =>
        api
            .put(`/product/${code}`, payload)
            .then((response: AxiosResponse<ProductApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteProduct: async (code: number) =>
        api
            .delete(`/product/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteProductList: async (codeList: number[]) =>
        api
            .delete(`/products`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportProductList: async () =>
        api
            .get(`/products/export-excel`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};
