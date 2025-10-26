import { Controller, useForm } from "react-hook-form";
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
import { DriverApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { driverTranslationNamespace } from "../translations";
import { getDriverFormDefaultValue, getDriverFormSchema, type DriverType } from "../schema";

interface DriverFormDialogProps extends FormDialogProps {
    loadDriverList: () => Promise<void>;
    driverToEdit?: DriverType | null;
    setDriverToEdit?: React.Dispatch<React.SetStateAction<DriverType | null>>;
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

    // state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // react form
    const {
        control,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<DriverType>({
        resolver: zodResolver(driverFormSchema),
        defaultValues: getDriverFormDefaultValue(),
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
            reset(getDriverFormDefaultValue());
        }
    }, [driverToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Driver being edited
    const handleExited = () => {
        reset(getDriverFormDefaultValue());
        if (setDriverToEdit) {
            setDriverToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: DriverType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Driver...", { formData });
        }
        const resp = await DriverApi.postDriver(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: DriverType) => {
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
    const onSubmit = async (payload: DriverType) => {
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
            reset(getDriverFormDefaultValue());
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
                            <Controller
                                name="driver_id"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.driverId")}
                                        fullWidth
                                        error={!!errors.driver_id}
                                        helperText={errors.driver_id?.message}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? e.target.value : "")
                                        }
                                    />
                                )}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <Controller
                                name="driver_name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.name")}
                                        fullWidth
                                        error={!!errors.driver_name}
                                        helperText={errors.driver_name?.message}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? e.target.value : "")
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="driver_surname"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.surname")}
                                        fullWidth
                                        error={!!errors.driver_surname}
                                        helperText={errors.driver_surname?.message}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? e.target.value : "")
                                        }
                                    />
                                )}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <Controller
                                name="truck_plate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.truckPlate")}
                                        fullWidth
                                        error={!!errors.truck_plate}
                                        helperText={errors.truck_plate?.message}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? e.target.value : "")
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="trailer_plate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.trailerPlate")}
                                        fullWidth
                                        error={!!errors.trailer_plate}
                                        helperText={errors.trailer_plate?.message}
                                        value={field.value || ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value ? e.target.value : "")
                                        }
                                    />
                                )}
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
