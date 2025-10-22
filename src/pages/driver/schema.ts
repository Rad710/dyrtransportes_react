import type { TFunction } from "i18next";
import { z } from "zod";

export const getDriverFormSchema = (t: TFunction<"driver">) => {
    // Create a reusable string validation for fields with similar requirements
    const createRequiredStringSchema = (fieldName: string) =>
        z
            .string({
                error: t("formDialog.validation.fieldRequired", { field: fieldName }),
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
