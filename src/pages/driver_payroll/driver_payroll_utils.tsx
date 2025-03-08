import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/types";
import { api } from "@/utils/axios";
import { DriverPayroll } from "./types";
import { Shipment } from "../shipment_payroll/types";

export const DriverPayrollApi = {
    getDriverPayroll: async (payrollCode: number) =>
        api
            .get(`/driver-payroll/${payrollCode}`)
            .then((response: AxiosResponse<DriverPayroll | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getDriverPayrollList: async (driverCode: number) =>
        api
            .get(`/driver/${driverCode}/payrolls`)
            .then((response: AxiosResponse<DriverPayroll[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getDriverPayrollShipmentList: async (driverPayrollCode: number) =>
        api
            .get(`/driver-payroll/${driverPayrollCode}/shipments`)
            .then((response: AxiosResponse<Shipment[] | null>) => response.data ?? [])
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    updateCollectionStatus: async (payroll: DriverPayroll) =>
        api
            .patch(`/driver-payroll/${payroll.payroll_code ?? 0}/paid-status`, payroll)
            .then((response: AxiosResponse<DriverPayroll | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportDriverPayroll: async (payrollCode: number) =>
        api
            .get(`/export-driver-payroll/${payrollCode}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};
