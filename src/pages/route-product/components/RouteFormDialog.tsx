import { z } from "zod";
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
import { Route } from "../types";
import { RouteApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { routeTranslationNamespace } from "../translations";
import type { TFunction } from "i18next";
import { numberFormatter, numberParser } from "@/utils/i18n";

const getRouteFormSchema = (t: TFunction) => {
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

    // Create a reusable number validation schema for price fields
    const createPriceSchema = (fieldName: string) =>
        z.coerce
            .string({
                invalid_type_error: t("formDialog.validation.invalidValue"),
                required_error: t("formDialog.validation.fieldRequired", { field: fieldName }),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.too_small,
                        minimum: 1,
                        type: "string",
                        inclusive: true,
                        message: t("formDialog.validation.fieldEmpty", { field: fieldName }),
                    });
                }

                const val = numberParser(arg);
                if (!val) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        message: t("formDialog.validation.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => numberParser(arg).toFixed(2));

    return z.object({
        route_code: z.number().positive(t("formDialog.validation.invalidRouteCode")).nullish(),
        origin: createRequiredStringSchema(t("formDialog.fields.origin")),
        destination: createRequiredStringSchema(t("formDialog.fields.destination")),
        price: createPriceSchema(t("formDialog.fields.price")),
        payroll_price: createPriceSchema(t("formDialog.fields.payrollPrice")),
    });
};

type RouteFormSchema = z.infer<ReturnType<typeof getRouteFormSchema>>;

interface RouteFormDialogProps extends FormDialogProps {
    loadRouteList: () => Promise<void>;
    routeToEdit?: Route | null;
    setRouteToEdit?: React.Dispatch<React.SetStateAction<Route | null>>;
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

    const ROUTE_FORM_DEFAULT_VALUE: RouteFormSchema = {
        route_code: null,
        origin: "",
        destination: "",
        price: "",
        payroll_price: "",
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
    } = useForm<RouteFormSchema>({
        resolver: zodResolver(routeFormSchema),
        defaultValues: ROUTE_FORM_DEFAULT_VALUE,
    });

    // use Effect
    useEffect(() => {
        if (routeToEdit) {
            reset({
                route_code: routeToEdit?.route_code ?? null,
                origin: routeToEdit?.origin ?? "",
                destination: routeToEdit?.destination ?? "",
                price: numberFormatter(parseFloat(routeToEdit?.price ?? "") || 0),
                payroll_price: numberFormatter(parseFloat(routeToEdit?.payroll_price ?? "") || 0),
            });
        } else {
            reset(ROUTE_FORM_DEFAULT_VALUE);
        }
    }, [routeToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Route being edited
    const handleExited = () => {
        reset(ROUTE_FORM_DEFAULT_VALUE);
        if (setRouteToEdit) {
            setRouteToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: Route) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Route...", { formData });
        }
        const resp = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: Route) => {
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
    const onSubmit = async (payload: RouteFormSchema) => {
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
            reset(ROUTE_FORM_DEFAULT_VALUE);
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
                            <TextField
                                {...register("origin")}
                                label={t("formDialog.fields.origin")}
                                fullWidth
                                error={!!errors.origin}
                                helperText={errors.origin?.message}
                            />
                            <TextField
                                {...register("destination")}
                                label={t("formDialog.fields.destination")}
                                fullWidth
                                error={!!errors.destination}
                                helperText={errors.destination?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("price")}
                                label={t("formDialog.fields.price")}
                                fullWidth
                                type="text"
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                            <TextField
                                {...register("payroll_price")}
                                label={t("formDialog.fields.payrollPrice")}
                                fullWidth
                                type="text"
                                error={!!errors.payroll_price}
                                helperText={errors.payroll_price?.message}
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
