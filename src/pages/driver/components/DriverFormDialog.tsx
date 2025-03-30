import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { FormDialogProps, FormSubmitResult } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Driver } from "../types";
import { DriverApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { driverTranslationNamespace } from "../translations";
import type { TFunction } from "i18next";
import { z } from "zod";

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

type DriverFormSchema = z.infer<ReturnType<typeof getDriverFormSchema>>;

interface DriverFormDialogProps extends FormDialogProps {
    loadDriverList: () => Promise<void>;
    driverToEdit?: Driver | null;
    setDriverToEdit?: React.Dispatch<React.SetStateAction<Driver | null>>;
}

export const DriverFormDialog = ({
    open,
    setOpen,
    loadDriverList,
    driverToEdit,
    setDriverToEdit,
}: DriverFormDialogProps) => {
    // Translation
    const { t } = useTranslation(driverTranslationNamespace);

    // Create schema with translations
    const driverFormSchema = useMemo(() => getDriverFormSchema(t), [t]);

    const DRIVER_FORM_DEFAULT_VALUE: DriverFormSchema = {
        driver_code: null,
        driver_id: "",
        driver_name: "",
        driver_surname: "",
        truck_plate: "",
        trailer_plate: "",
    };

    // state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // react form
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<DriverFormSchema>({
        resolver: zodResolver(driverFormSchema),
        defaultValues: DRIVER_FORM_DEFAULT_VALUE,
    });

    // use Effect
    useEffect(() => {
        if (driverToEdit) {
            reset({
                driver_code: driverToEdit?.driver_code ?? null,
                driver_id: driverToEdit?.driver_id ?? "",
                driver_name: driverToEdit?.driver_name ?? "",
                driver_surname: driverToEdit?.driver_surname ?? "",
                truck_plate: driverToEdit?.truck_plate ?? "",
                trailer_plate: driverToEdit?.trailer_plate ?? "",
            });
        } else {
            reset(DRIVER_FORM_DEFAULT_VALUE);
        }
    }, [driverToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Driver being edited
    const handleExited = () => {
        reset(DRIVER_FORM_DEFAULT_VALUE);
        if (setDriverToEdit) {
            setDriverToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: Driver) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Driver...", { formData });
        }
        const resp = await DriverApi.postDriver(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: Driver) => {
        if (!formData.driver_code) {
            setSubmitResult({ error: t("formDialog.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Driver...", { formData });
        }
        const resp = await DriverApi.putDriver(formData.driver_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // submit form as post or put
    const onSubmit = async (payload: DriverFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting driver formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.driver_code ? await postForm(payload) : await putForm(payload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message });
        showToastSuccess(resp.message);

        await loadDriverList();

        if (!driverToEdit) {
            reset(DRIVER_FORM_DEFAULT_VALUE);
        }
    };

    const getDialogDescription = () => {
        if (!Object.keys(errors).length) {
            return submitResult ? (
                <Box
                    component="span"
                    sx={{
                        color: (theme) =>
                            submitResult.success
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                    }}
                >
                    {submitResult.success || submitResult.error}
                </Box>
            ) : (
                <span>{t("formDialog.description")}</span>
            );
        }

        return (
            <Box
                component="span"
                sx={{
                    color: (theme) => theme.palette.error.main,
                    fontWeight: "bold",
                }}
            >
                {t("formDialog.reviewFields")}
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            slotProps={{
                transition: {
                    onExited: handleExited, // This is the key prop for after-close actions
                },
            }}
        >
            <DialogTitle>{!driverToEdit ? t("formDialog.add") : t("formDialog.edit")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("driver_id")}
                                label={t("formDialog.fields.driverId")}
                                fullWidth
                                error={!!errors.driver_id}
                                helperText={errors.driver_id?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("driver_name")}
                                label={t("formDialog.fields.name")}
                                fullWidth
                                error={!!errors.driver_name}
                                helperText={errors.driver_name?.message}
                            />
                            <TextField
                                {...register("driver_surname")}
                                label={t("formDialog.fields.surname")}
                                fullWidth
                                error={!!errors.driver_surname}
                                helperText={errors.driver_surname?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("truck_plate")}
                                label={t("formDialog.fields.truckPlate")}
                                fullWidth
                                error={!!errors.truck_plate}
                                helperText={errors.truck_plate?.message}
                            />
                            <TextField
                                {...register("trailer_plate")}
                                label={t("formDialog.fields.trailerPlate")}
                                fullWidth
                                error={!!errors.trailer_plate}
                                helperText={errors.trailer_plate?.message}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("formDialog.close")}</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!driverToEdit ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
