import { Shipment, ShipmentApiResponse, GroupedShipments } from "./types";
import { api } from "@/utils/axios";
import type { TFunction } from "i18next";
import { z } from "zod";
import { globalizeFormatter, globalizeParser } from "@/utils/globalize";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";
import { DateTime } from "luxon";

export const ShipmentApi = {
    getShipment: async (code: number) =>
        api
            .get(`/shipment/${code}`)
            .then((response: AxiosResponse<Shipment | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getShipmentList: async (shipment_payroll_code?: number | null) =>
        api
            .get(`/shipments?shipment_payroll_code=${shipment_payroll_code}`)
            .then((response: AxiosResponse<Shipment[] | null>) => {
                return response.data ?? [];
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    getGroupedShipmentsList: async (shipmentPayrollCode: number) =>
        api
            .get(`/shipment/grouped-shipments?shipment_payroll_code=${shipmentPayrollCode}`)
            .then((response: AxiosResponse<GroupedShipments[] | null>) => {
                return response.data ?? [];
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    postShipment: async (payload: Shipment) =>
        api
            .post(`/shipment`, payload)
            .then((response: AxiosResponse<ShipmentApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    putShipment: async (code: number, payload: Shipment) =>
        api
            .put(`/shipment/${code}`, payload)
            .then((response: AxiosResponse<ShipmentApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    changeShipmentListShipmentPayroll: async (
        shipmentPayrollCode: number,
        shipmentCodeList: number[],
    ) =>
        api
            .patch(
                `/shipments/change-shipment-payroll?shipment_payroll_code=${shipmentPayrollCode}`,
                shipmentCodeList,
            )
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
    deleteShipment: async (code: number) =>
        api
            .delete(`/shipment/${code}`)
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    deleteShipmentList: async (codeList: number[]) =>
        api
            .delete(`/shipments`, {
                data: codeList,
            })
            .then((response: AxiosResponse<ApiResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),

    exportShipmentList: async (shipmentPayrollCode: number) =>
        api
            .get(`/shipments/export-excel?shipment_payroll_code=${shipmentPayrollCode}`, {
                responseType: "blob",
            })
            .then((response: AxiosResponse<BlobPart | null>) => {
                return response ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse;
            }),
};

// SHIPMENT
const getShipmentFormSchema = (t: TFunction) =>
    z.object({
        shipment_code: z
            .number()
            .positive(t("formDialog.validation.invalidShipmentCode"))
            .nullish(),
        shipment_date: z.coerce.date({
            required_error: t("formDialog.validation.fieldRequired", {
                field: t("formDialog.fields.shipment_date"),
            }),
        }),

        driver_name: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.driver"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.driver") }),
            ),
        truck_plate: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.truck_plate"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.truck_plate"),
                }),
            ),
        trailer_plate: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.truck_plate"),
                }),
            })
            .nullish(),
        driver_code: z.coerce
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.driver"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.driver") }),
            ),

        product_code: z.coerce
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.product"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.product") }),
            ),
        product_name: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.product"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.product") }),
            ),

        route_code: z.coerce
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", { field: "Route" }),
            })
            .min(1, t("formDialog.validation.fieldEmpty", { field: "Route" })),
        origin: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", { field: t("formDialog.fields.origin") }),
            ),
        destination: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination"),
                }),
            })
            .min(
                1,
                t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination"),
                }),
            ),

        price: z.coerce
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.price"),
                }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.too_small,
                        minimum: 1,
                        type: "string",
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", {
                            field: t("formDialog.fields.price"),
                        }),
                    });
                }

                const val = globalizeParser(arg);
                if (!val) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => globalizeParser(arg).toFixed(2)),
        payroll_price: z.coerce
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll_price"),
                }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.too_small,
                        minimum: 1,
                        type: "string",
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", {
                            field: t("formDialog.fields.payroll_price"),
                        }),
                    });
                }

                const val = globalizeParser(arg);
                if (!val) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => globalizeParser(arg).toFixed(2)),

        dispatch_code: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.dispatch_code"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.dispatch_code"),
                }),
            }),
        receipt_code: z
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.receipt_code"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.receipt_code"),
                }),
            }),
        origin_weight: z.coerce
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            })
            .int(
                t("formDialog.validation.noDecimals", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            )
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.origin_weight"),
                }),
            }),
        destination_weight: z.coerce
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            })
            .int(
                t("formDialog.validation.noDecimals", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            )
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.destination_weight"),
                }),
            }),
        shipment_payroll_code: z
            .number({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.payroll"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.payroll"),
                }),
            }),
        driver_payroll_code: z
            .number()
            .positive(t("formDialog.validation.invalidPayrollCode"))
            .nullish(),
    });
export type ShipmentFormSchema = z.infer<ReturnType<typeof getShipmentFormSchema>>;

export const ShipmentUtils = {
    getShipmentFormSchema: getShipmentFormSchema,

    SHIPMENT_FORM_DEFAULT_VALUE: (payrollCode: number): ShipmentFormSchema => ({
        shipment_code: null,
        shipment_date: DateTime.now().startOf("day").toJSDate(),
        driver_name: "",
        driver_code: 0,
        truck_plate: "",
        trailer_plate: null,

        product_code: 0,
        product_name: "",

        route_code: 0,
        origin: "",
        destination: "",
        price: "",
        payroll_price: "",

        dispatch_code: "",
        receipt_code: "",
        origin_weight: 0,
        destination_weight: 0,
        shipment_payroll_code: payrollCode,
        driver_payroll_code: null,
    }),

    shipmentToFormSchema: (shipment: Shipment, payrollCode: number): ShipmentFormSchema => ({
        shipment_code: shipment?.shipment_code ?? null,
        shipment_date: DateTime.fromHTTP(shipment.shipment_date).toJSDate(),
        driver_name: shipment.driver_name ?? "",
        driver_code: shipment?.driver_code ?? 0,
        truck_plate: shipment?.truck_plate ?? "",
        trailer_plate: shipment.trailer_plate ?? null,

        product_code: shipment?.product_code ?? 0,
        product_name: shipment?.product_name ?? "",

        route_code: shipment?.route_code ?? 0,
        origin: shipment?.origin ?? "",
        destination: shipment?.destination ?? "",
        price: globalizeFormatter(parseFloat(shipment?.price ?? "0") || 0),
        payroll_price: globalizeFormatter(parseFloat(shipment?.payroll_price ?? "0") || 0),

        dispatch_code: shipment?.dispatch_code ?? "",
        receipt_code: shipment?.receipt_code ?? "",
        origin_weight: parseInt(shipment?.origin_weight ?? "0") || 0,
        destination_weight: parseInt(shipment?.destination_weight ?? "0") || 0,
        shipment_payroll_code: shipment?.shipment_payroll_code ?? payrollCode,
        driver_payroll_code: shipment?.driver_payroll_code ?? null,
    }),

    formSchemaToShipment: (formSchema: ShipmentFormSchema): Shipment => ({
        shipment_code: formSchema.shipment_code,
        shipment_date: DateTime.fromJSDate(formSchema.shipment_date).toHTTP() ?? "",

        driver_name: formSchema.driver_name,
        truck_plate: formSchema.truck_plate,
        trailer_plate: formSchema.trailer_plate,
        driver_code: formSchema.driver_code,

        product_code: formSchema.product_code,
        product_name: formSchema.product_name,

        route_code: formSchema.route_code,
        origin: formSchema.origin,
        destination: formSchema.destination,
        price: formSchema.price,
        payroll_price: formSchema.payroll_price,

        dispatch_code: formSchema.dispatch_code,
        receipt_code: formSchema.receipt_code,
        origin_weight: formSchema.origin_weight.toString(),
        destination_weight: formSchema.destination_weight.toString(),
        shipment_payroll_code: formSchema.shipment_payroll_code,
        driver_payroll_code: formSchema.driver_payroll_code,
        deleted: false,
    }),
};
