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
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import { FormDialogProps, FormSubmitResult } from "@/types";
import { useEffect, useState } from "react";
import { DriverPayroll } from "../types";
import { DriverPayrollApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DateTime } from "luxon";

// Styled component for the dialog content with better scroll handling
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    overflow: "visible", // Allow content to be visible outside the dialog
    paddingBottom: theme.spacing(2),
}));

const driverPayrollFormSchema = z.object({
    payroll_code: z.number().positive("Invalid Payroll Code").nullish(),
    payroll_timestamp: z.date({
        required_error: "A date is required to create the payroll.",
    }),
    paid: z.boolean(),
    deleted: z.boolean(),
});

type DriverPayrollFormSchema = z.infer<typeof driverPayrollFormSchema>;

interface DriverPayrollDialogProps extends FormDialogProps {
    driverCode: number;
    setDriverPayrollList: React.Dispatch<React.SetStateAction<DriverPayroll[]>>;
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
    payrollToEdit?: DriverPayroll | null;
    setPayrollToEdit?: React.Dispatch<React.SetStateAction<DriverPayroll | null>>;
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
        },
    );

    // Default values
    const PAYROLL_FORM_DEFAULT_VALUE: DriverPayrollFormSchema = {
        payroll_code: null,
        payroll_timestamp: startDate.toJSDate(),
        paid: false,
        deleted: false,
    };

    // Form setup
    const {
        control,
        formState: { errors },
        reset,
        handleSubmit,
        getValues,
    } = useForm<DriverPayrollFormSchema>({
        resolver: zodResolver(driverPayrollFormSchema),
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
                paid: payrollToEdit?.paid ?? false,
                deleted: payrollToEdit?.deleted ?? false,
            });
        } else {
            reset(PAYROLL_FORM_DEFAULT_VALUE);
        }
    }, [payrollToEdit]);

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

    const postForm = async (formData: DriverPayroll) => {
        if (formData.payroll_code) {
            setSubmitResult({ error: "Payroll already exists" });
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

    const putForm = async (formData: DriverPayroll) => {
        if (!formData.payroll_code) {
            setSubmitResult({ error: "Payroll cannot be edited" });
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
    const onSubmit = async (payload: DriverPayrollFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting driver payroll formData...", { payload });
        }

        const transformedPayload: DriverPayroll = {
            ...payload,
            driver_code: driverCode,
            payroll_timestamp: DateTime.fromJSDate(payload.payroll_timestamp).toHTTP() || "",
        };
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting driver payroll transformedPayload...", {
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

        setSubmitResult({ success: resp.message || "Operation successful" });
        showToastSuccess(resp.message || "Operation successful");

        setSelectedPayrollList([]);

        const driverPayrollList = await DriverPayrollApi.getDriverPayrollList(driverCode);
        setDriverPayrollList(!isAxiosError(driverPayrollList) ? driverPayrollList : []);

        handleClose();
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
                        ? "Select a date for the new Driver Payroll"
                        : "Select a date for the Driver Payroll to edit"}
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
                Please review the required fields
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
                {!getValues("payroll_code") ? "Add Driver Payroll" : "Edit Driver Payroll"}
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
                                label="Payroll Date"
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
                <Button onClick={handleClose}>Close</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color={!getValues("payroll_code") ? "primary" : "info"}
                >
                    {!getValues("payroll_code") ? "Add Payroll" : "Edit Payroll"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
