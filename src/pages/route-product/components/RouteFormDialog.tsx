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
import { RouteType, getRouteFormDefaultValue, getRouteFormSchema } from "../schema";
import { RouteApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { routeTranslationNamespace } from "../translations";
import {
    defaultToLocaleNumberString,
    localeToDefaultNumberString,
    numberToLocaleString,
} from "@/utils/i18n";

interface RouteFormDialogProps extends FormDialogProps {
    loadRouteList: () => Promise<void>;
    routeToEdit?: RouteType | null;
    setRouteToEdit?: React.Dispatch<React.SetStateAction<RouteType | null>>;
}

export const RouteFormDialog = ({
    open,
    setOpen,
    loadRouteList,
    routeToEdit,
    setRouteToEdit,
}: RouteFormDialogProps) => {
    // Translation
    const { t } = useTranslation(routeTranslationNamespace);

    // Create schema with translations
    const routeFormSchema = useMemo(() => getRouteFormSchema(t), [t]);

    // state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // react form
    const {
        formState: { errors },
        reset,
        handleSubmit,
        control,
    } = useForm<RouteType>({
        resolver: zodResolver(routeFormSchema),
        defaultValues: getRouteFormDefaultValue(),
    });

    // use Effect
    useEffect(() => {
        if (routeToEdit) {
            reset({
                route_code: routeToEdit?.route_code ?? null,
                origin: routeToEdit?.origin ?? "",
                destination: routeToEdit?.destination ?? "",
                price: routeToEdit?.price ?? "",
                payroll_price: routeToEdit?.payroll_price ?? "",
            });
        } else {
            reset(getRouteFormDefaultValue());
        }
    }, [routeToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Route being edited
    const handleExited = () => {
        reset(getRouteFormDefaultValue());
        if (setRouteToEdit) {
            setRouteToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: RouteType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Route...", { formData });
        }
        const resp = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: RouteType) => {
        if (!formData.route_code) {
            setSubmitResult({ error: t("formDialog.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Route...", { formData });
        }
        const resp = await RouteApi.putRoute(formData.route_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // submit form as post or put
    const onSubmit = async (payload: RouteType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting route formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.route_code ? await postForm(payload) : await putForm(payload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message });
        showToastSuccess(resp.message);

        await loadRouteList();

        if (!routeToEdit) {
            reset(getRouteFormDefaultValue());
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
            <DialogTitle>{!routeToEdit ? t("formDialog.add") : t("formDialog.edit")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <Controller
                                name="origin"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.origin")}
                                        fullWidth
                                        error={!!errors.origin}
                                        helperText={errors.origin?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="destination"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.destination")}
                                        fullWidth
                                        error={!!errors.destination}
                                        helperText={errors.destination?.message}
                                    />
                                )}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="text"
                                        label={t("formDialog.fields.price", {
                                            priceNoVat:
                                                numberToLocaleString(
                                                    Number.parseFloat(field.value || "0") *
                                                        (10 / 11)
                                                ) || 0,
                                        })}
                                        fullWidth
                                        error={!!errors.price}
                                        helperText={errors.price?.message}
                                        value={
                                            field.value
                                                ? defaultToLocaleNumberString(field.value)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            field.onChange(
                                                e.target.value
                                                    ? localeToDefaultNumberString(e.target.value)
                                                    : undefined
                                            );
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="payroll_price"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t("formDialog.fields.payrollPrice")}
                                        fullWidth
                                        type="text"
                                        error={!!errors.payroll_price}
                                        helperText={errors.payroll_price?.message}
                                        value={
                                            field.value
                                                ? defaultToLocaleNumberString(field.value)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            field.onChange(
                                                e.target.value
                                                    ? localeToDefaultNumberString(e.target.value)
                                                    : undefined
                                            );
                                        }}
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
                    {!routeToEdit ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
