import type { ApiResponse } from "@/types";
import type { TFunction } from "i18next";
import { z } from "zod";

export const getDriverFormSchema = (t: TFunction<"driver">) => {
    return z.object({
        driver_code: z.number().positive(t("formDialog.validation.invalidDriverCode")).nullish(),
        driver_id: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.driverId"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.driverId").toLowerCase(),
                }),
            }),
        driver_name: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.name"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.name").toLowerCase(),
                }),
            }),
        driver_surname: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.surname"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.surname").toLowerCase(),
                }),
            }),
        truck_plate: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.truckPlate"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.truckPlate").toLowerCase(),
                }),
            }),
        trailer_plate: z
            .string({
                error: t("formDialog.validation.fieldRequired", {
                    field: t("formDialog.fields.trailerPlate"),
                }),
            })
            .min(1, {
                message: t("formDialog.validation.fieldEmpty", {
                    field: t("formDialog.fields.trailerPlate").toLowerCase(),
                }),
            }),

        deleted: z.boolean().nullish(),
        modification_user: z.string().nullish(),
        modification_timestamp: z.string().nullish(),
    });
};

export type DriverType = z.infer<ReturnType<typeof getDriverFormSchema>>;
export type DriverApiResponse = DriverType & ApiResponse;

export const getDriverFormDefaultValue = (): DriverType => ({
    driver_code: null,
    driver_id: "",
    driver_name: "",
    driver_surname: "",
    truck_plate: "",
    trailer_plate: "",
});
