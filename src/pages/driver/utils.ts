import type { Driver, DriverApiResponse } from "./types";
import type { ApiResponse } from "@/types";
import { api } from "@/utils/axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { TFunction } from "i18next";
import { z } from "zod";

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

export const getDriverFormSchema = (t: TFunction<"driver">) => {
    // Create a reusable string validation for fields with similar requirements
    const createRequiredStringSchema = (fieldName: string) =>
        z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", { field: fieldName }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: fieldName.toLowerCase(),
                }),
            });

    return z.object({
        driver_code: z.number().positive(t("formDialog.validation.invalidDriverCode")).nullish(),
        driver_id: createRequiredStringSchema(t("formDialog.fields.driverId")),
        driver_name: createRequiredStringSchema(t("formDialog.fields.name")),
        driver_surname: createRequiredStringSchema(t("formDialog.fields.surname")),
        truck_plate: createRequiredStringSchema(t("formDialog.fields.truckPlate")),
        trailer_plate: createRequiredStringSchema(t("formDialog.fields.trailerPlate")),
    });
};

export type DriverFormSchema = z.infer<ReturnType<typeof getDriverFormSchema>>;
