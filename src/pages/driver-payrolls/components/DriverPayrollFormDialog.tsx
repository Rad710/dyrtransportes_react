import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import { FormDialogProps, FormSubmitResult } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { DriverPayrollApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DateTime } from "luxon";
import { driverPayrollListTranslationNamespace } from "../translations";
import {
    getDriverPayrollFormDefaultValue,
    getDriverPayrollFormSchema,
    DriverPayrollType,
} from "../schema";

// Styled component for the dialog content with better scroll handling
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    overflow: "visible", // Allow content to be visible outside the dialog
    paddingBottom: theme.spacing(2),
}));

interface DriverPayrollDialogProps extends FormDialogProps {
    driverCode: number;
    setDriverPayrollList: React.Dispatch<React.SetStateAction<DriverPayrollType[]>>;
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
    payrollToEdit?: DriverPayrollType | null;
    setPayrollToEdit?: React.Dispatch<React.SetStateAction<DriverPayrollType | null>>;
}

export const DriverPayrollFormDialog = ({
    driverCode,
    setDriverPayrollList,
    setSelectedPayrollList,
    open,
    setOpen,
    payrollToEdit,
    setPayrollToEdit,
}: DriverPayrollDialogProps) => {
    // i18n
    const { t } = useTranslation(driverPayrollListTranslationNamespace);

    const driverPayrollFormSchema = useMemo(() => getDriverPayrollFormSchema(t), [t]);

    // State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // Context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // Initial date setup
    const currentDate = DateTime.now();
    const startDate = DateTime.fromObject(
        {
            year: currentDate.year,
            month: currentDate.month,
            day: currentDate.day,
        },
        {
            zone: "local",
        }
    );

    // Form setup
    const {
        control,
        formState: { errors },
        reset,
        handleSubmit,
        watch,
    } = useForm<DriverPayrollType>({
        resolver: zodResolver(driverPayrollFormSchema),
        defaultValues: getDriverPayrollFormDefaultValue(startDate, driverCode),
    });

    // Use Effect for form data
    useEffect(() => {
        if (payrollToEdit) {
            reset({
                payroll_code: payrollToEdit?.payroll_code ?? null,
                payroll_timestamp: payrollToEdit?.payroll_timestamp,
                paid: payrollToEdit?.paid ?? false,
                deleted: payrollToEdit?.deleted ?? false,
            });
        } else {
            reset(getDriverPayrollFormDefaultValue(startDate, driverCode));
        }
    }, [payrollToEdit]);

    // Event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // After exited reset form to empty and clean payroll being edited
    const handleExited = () => {
        reset(getDriverPayrollFormDefaultValue(startDate, driverCode));
        if (setPayrollToEdit) {
            setPayrollToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: DriverPayrollType) => {
        if (formData.payroll_code) {
            setSubmitResult({ error: t("formDialog.errors.alreadyExists") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting DriverPayroll...", { formData });
        }
        const resp = await DriverPayrollApi.postDriverPayroll(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: DriverPayrollType) => {
        if (!formData.payroll_code) {
            setSubmitResult({ error: t("formDialog.errors.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT DriverPayroll...", { formData });
        }
        const resp = await DriverPayrollApi.putDriverPayroll(formData.payroll_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // Submit form as post or put
    const onSubmit = async (payload: DriverPayrollType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting driver payroll payload...", {
                payload,
            });
        }

        setIsSubmitting(true);
        const resp = !payload.payroll_code ? await postForm(payload) : await putForm(payload);

        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message || "Operation successful" });
        showToastSuccess(resp.message || "Operation successful");

        setSelectedPayrollList([]);

        const driverPayrollList = await DriverPayrollApi.getDriverPayrollList(driverCode);
        setDriverPayrollList(!isAxiosError(driverPayrollList) ? driverPayrollList : []);

        if (!payrollToEdit) {
            reset(getDriverPayrollFormDefaultValue(startDate, driverCode));
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
                        ? t("formDialog.selectNewDate")
                        : t("formDialog.selectEditDate")}
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
                {!watch("payroll_code") ? t("formDialog.addTitle") : t("formDialog.editTitle")}
            </DialogTitle>
            <StyledDialogContent>
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
                                label={t("formDialog.dateLabel")}
                                type="date"
                                fullWidth
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
                                error={!!errors.payroll_timestamp}
                                helperText={errors.payroll_timestamp?.message}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                    htmlInput: {
                                        min: startDate.minus({ years: 1 }).toFormat("yyyy-MM-dd"),
                                        max: startDate.plus({ months: 1 }).toFormat("yyyy-MM-dd"),
                                    },
                                }}
                            />
                        )}
                    />
                </Box>
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("buttons.close")}</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color={!watch("payroll_code") ? "primary" : "info"}
                >
                    {!watch("payroll_code") ? t("buttons.addPayroll") : t("buttons.editPayroll")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
