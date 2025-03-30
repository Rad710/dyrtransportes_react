import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { FormDialogProps, FormSubmitResult } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { ShipmentPayroll } from "../types";
import { ShipmentPayrollApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { shipmentPayrollTranslationNamespace } from "../translations";
import type { TFunction } from "i18next";

const getShipmentPayrollFormSchema = (t: TFunction) => {
    return z.object({
        payroll_code: z.number().positive(t("formDialog.validation.invalidPayrollCode")).nullish(),
        payroll_timestamp: z.date({
            required_error: t("formDialog.validation.dateRequired"),
        }),
        collected: z.boolean(),
        deleted: z.boolean(),
    });
};
type ShipmentPayrollFormSchema = z.infer<ReturnType<typeof getShipmentPayrollFormSchema>>;

interface ShipmentPayrollDialogProps extends FormDialogProps {
    year: number;
    setPayrollList: React.Dispatch<React.SetStateAction<ShipmentPayroll[]>>;
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
    payrollToEdit?: ShipmentPayroll | null;
    setPayrollToEdit?: React.Dispatch<React.SetStateAction<ShipmentPayroll | null>>;
}

export const ShipmentPayrollFormDialog = ({
    year,
    setPayrollList,
    setSelectedPayrollList,
    open,
    setOpen,
    payrollToEdit,
    setPayrollToEdit,
}: ShipmentPayrollDialogProps) => {
    // Translation
    const { t } = useTranslation(shipmentPayrollTranslationNamespace);

    // Create schema with translations
    const shipmentPayrollFormSchema = useMemo(() => getShipmentPayrollFormSchema(t), [t]);

    // State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // Context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // Initial date setup
    const startDate = DateTime.fromObject(
        {
            year: year,
            month: DateTime.now().month,
            day: DateTime.now().day,
        },
        {
            zone: "local",
        }
    );

    // Default values
    const PAYROLL_FORM_DEFAULT_VALUE: ShipmentPayrollFormSchema = {
        payroll_code: null,
        payroll_timestamp: startDate.toJSDate(),
        collected: false,
        deleted: false,
    };

    // Form setup
    const {
        control,
        formState: { errors },
        reset,
        handleSubmit,
        getValues,
    } = useForm<ShipmentPayrollFormSchema>({
        resolver: zodResolver(shipmentPayrollFormSchema),
        defaultValues: PAYROLL_FORM_DEFAULT_VALUE,
    });

    // Use Effect for form data
    useEffect(() => {
        if (payrollToEdit) {
            reset({
                payroll_code: payrollToEdit?.payroll_code ?? null,
                payroll_timestamp: payrollToEdit?.payroll_timestamp
                    ? DateTime.fromHTTP(payrollToEdit.payroll_timestamp).toJSDate()
                    : startDate.toJSDate(),
                collected: payrollToEdit?.collected ?? false,
                deleted: payrollToEdit?.deleted ?? false,
            });
        } else {
            reset(PAYROLL_FORM_DEFAULT_VALUE);
        }
    }, [payrollToEdit, reset]);

    // Event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // After exited reset form to empty and clean payroll being edited
    const handleExited = () => {
        reset(PAYROLL_FORM_DEFAULT_VALUE);
        if (setPayrollToEdit) {
            setPayrollToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: ShipmentPayroll) => {
        if (formData.payroll_code) {
            setSubmitResult({ error: t("formDialog.alreadyExists") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting ShipmentPayroll...", { formData });
        }
        const resp = await ShipmentPayrollApi.postShipmentPayroll(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: ShipmentPayroll) => {
        if (!formData.payroll_code) {
            setSubmitResult({ error: t("formDialog.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT ShipmentPayroll...", { formData });
        }
        const resp = await ShipmentPayrollApi.putShipmentPayroll(formData.payroll_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // Submit form as post or put
    const onSubmit = async (payload: ShipmentPayrollFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment payroll formData...", { payload });
        }

        const transformedPayload: ShipmentPayroll = {
            ...payload,
            payroll_timestamp: DateTime.fromJSDate(payload.payroll_timestamp).toHTTP() || "",
        };
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment payroll transformedPayload...", {
                transformedPayload,
            });
        }

        setIsSubmitting(true);
        const resp = !payload.payroll_code
            ? await postForm(transformedPayload)
            : await putForm(transformedPayload);

        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message || t("notifications.operationSuccess") });
        showToastSuccess(resp.message || t("notifications.operationSuccess"));

        setSelectedPayrollList([]);

        const shipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
        setPayrollList(!isAxiosError(shipmentPayrollList) ? shipmentPayrollList : []);
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
                <Box component="span">
                    {!getValues("payroll_code")
                        ? t("formDialog.descriptionAdd")
                        : t("formDialog.descriptionEdit")}
                </Box>
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
            maxWidth="sm"
            fullWidth
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            slotProps={{
                transition: {
                    onExited: handleExited,
                },
            }}
        >
            <DialogTitle>
                {!getValues("payroll_code") ? t("formDialog.add") : t("formDialog.edit")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box
                    sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Controller
                        name="payroll_timestamp"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label={t("formDialog.fields.date")}
                                type="date"
                                fullWidth
                                value={
                                    field.value
                                        ? DateTime.fromJSDate(field.value).toFormat("yyyy-MM-dd")
                                        : ""
                                }
                                onChange={(e) => {
                                    const dateValue = e.target.value;
                                    if (dateValue) {
                                        field.onChange(DateTime.fromISO(dateValue).toJSDate());
                                    }
                                }}
                                error={!!errors.payroll_timestamp}
                                helperText={errors.payroll_timestamp?.message}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    htmlInput: {
                                        min: startDate.toFormat("yyyy-MM-dd"),
                                        max: DateTime.fromObject({
                                            year: year,
                                            month: 12,
                                            day: 31,
                                        }).toFormat("yyyy-MM-dd"),
                                    },
                                }}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("formDialog.close")}</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color={!getValues("payroll_code") ? "primary" : "info"}
                >
                    {!getValues("payroll_code") ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
