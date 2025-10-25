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
import { ShipmentPayrollApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { shipmentPayrollTranslationNamespace } from "../translations";
import {
    getShipmentPayrollFormDefaultValue,
    getShipmentPayrollFormSchema,
    ShipmentPayrollType,
} from "../schema";

interface ShipmentPayrollDialogProps extends FormDialogProps {
    year: number;
    setPayrollList: React.Dispatch<React.SetStateAction<ShipmentPayrollType[]>>;
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
    payrollToEdit?: ShipmentPayrollType | null;
    setPayrollToEdit?: React.Dispatch<React.SetStateAction<ShipmentPayrollType | null>>;
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

    // Form setup
    const {
        control,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm<ShipmentPayrollType>({
        resolver: zodResolver(shipmentPayrollFormSchema),
        defaultValues: getShipmentPayrollFormDefaultValue(startDate),
    });

    // Use Effect for form data
    useEffect(() => {
        if (payrollToEdit) {
            reset({
                payroll_code: payrollToEdit?.payroll_code ?? null,
                payroll_timestamp: payrollToEdit.payroll_timestamp,
                collected: payrollToEdit?.collected ?? false,
                deleted: payrollToEdit?.deleted ?? false,
            });
        } else {
            reset(getShipmentPayrollFormDefaultValue(startDate));
        }
    }, [payrollToEdit, reset]);

    // Event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // After exited reset form to empty and clean payroll being edited
    const handleExited = () => {
        reset(getShipmentPayrollFormDefaultValue(startDate));
        if (setPayrollToEdit) {
            setPayrollToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: ShipmentPayrollType) => {
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

    const putForm = async (formData: ShipmentPayrollType) => {
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
    const onSubmit = async (payload: ShipmentPayrollType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment payroll formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.payroll_code ? await postForm(payload) : await putForm(payload);

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

        if (!payrollToEdit) {
            reset(getShipmentPayrollFormDefaultValue(startDate));
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
                <Box component="span">
                    {!watch("payroll_code")
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
                {!watch("payroll_code") ? t("formDialog.add") : t("formDialog.edit")}
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
                                value={
                                    DateTime.fromHTTP(field.value).isValid
                                        ? DateTime.fromHTTP(field.value).toFormat("yyyy-MM-dd")
                                        : ""
                                }
                                onChange={(e) => {
                                    const dateTime = DateTime.fromISO(e.target.value);
                                    field.onChange(
                                        dateTime.isValid ? dateTime.toHTTP() : undefined
                                    );
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
                    color={!watch("payroll_code") ? "primary" : "info"}
                >
                    {!watch("payroll_code") ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
