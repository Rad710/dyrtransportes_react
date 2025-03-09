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
import { ShipmentPayroll } from "../types";
import { ShipmentPayrollApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DateTime } from "luxon";

// Styled component for the dialog content with better scroll handling
const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    overflow: "visible", // Allow content to be visible outside the dialog
    paddingBottom: theme.spacing(2),
}));

const shipmentPayrollFormSchema = z.object({
    payroll_code: z.number().positive("Código Planilla inválido").nullish(),
    payroll_timestamp: z.date({
        required_error: "Para crear la planilla se necesita de una fecha.",
    }),
    collected: z.boolean(),
    deleted: z.boolean(),
});

type ShipmentPayrollFormSchema = z.infer<typeof shipmentPayrollFormSchema>;

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
        },
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

    const postForm = async (formData: ShipmentPayroll) => {
        if (formData.payroll_code) {
            setSubmitResult({ error: "Planilla ya existe" });
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
            setSubmitResult({ error: "Planilla no puede editarse" });
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

        setIsSubmitting(true);

        const transformedPayload: ShipmentPayroll = {
            ...payload,
            payroll_timestamp: DateTime.fromJSDate(payload.payroll_timestamp).toHTTP() || "",
        };
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment payroll transformedPayload...", {
                transformedPayload,
            });
        }

        const resp = !payload.payroll_code
            ? await postForm(transformedPayload)
            : await putForm(transformedPayload);

        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message || "Operación exitosa" });
        showToastSuccess(resp.message || "Operación exitosa");

        setSelectedPayrollList([]);

        const shipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
        setPayrollList(!isAxiosError(shipmentPayrollList) ? shipmentPayrollList : []);

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
                        ? "Seleccione una fecha para la nueva Planilla"
                        : "Seleccione una fecha para la Planilla a editar"}
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
                Revise los campos requerido
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
                {!getValues("payroll_code") ? "Agregar Planilla" : "Editar Planilla"}
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
                                label="Fecha de Planilla"
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
            </StyledDialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    color={!getValues("payroll_code") ? "primary" : "info"}
                >
                    {!getValues("payroll_code") ? "Agregar Planilla" : "Editar Planilla"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
