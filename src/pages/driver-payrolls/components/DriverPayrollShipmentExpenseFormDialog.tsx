import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { DateTime } from "luxon";
import { AutocompleteOption, FormDialogProps, FormSubmitResult } from "@/types";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { ShipmentExpenseApi } from "../utils";
import { Autocomplete } from "@mui/material";
import { driverPayrollTranslationNamespace } from "../translations";
import {
    ShipmentExpenseType,
    DriverPayrollType,
    getShipmentExpenseFormSchema,
    getShipmentExpenseFormDefaultValue,
} from "../schema";
import { defaultToLocaleNumberString, localeToDefaultNumberString } from "@/utils/i18n";

// Form fields component
interface ShipmentExpenseFormDialogFields {
    form: UseFormReturn<ShipmentExpenseType>;
    driverPayrollList?: DriverPayrollType[];
}

const ShipmentExpenseFormDialogFields = ({
    form,
    driverPayrollList,
}: Readonly<ShipmentExpenseFormDialogFields>) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);

    const driverPayrollOptionList: AutocompleteOption[] = useMemo(
        () =>
            driverPayrollList?.map((item) => ({
                id: item.payroll_code?.toString() ?? "",
                label: `${DateTime.fromHTTP(item.payroll_timestamp).toFormat("dd/MM/yy")} [#${
                    item.payroll_code ?? 0
                }]`,
            })) ?? [],
        [driverPayrollList]
    );

    return (
        <Stack spacing={2}>
            {/* Row 1: Date and Receipt */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="expense_date"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            label={t("expenses.dialogs.form.fields.date")}
                            type="date"
                            error={!!form.formState.errors.expense_date}
                            helperText={form.formState.errors.expense_date?.message}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            value={
                                DateTime.fromHTTP(field.value).isValid
                                    ? DateTime.fromHTTP(field.value).toFormat("yyyy-MM-dd")
                                    : ""
                            }
                            onChange={(e) => {
                                const dateTime = DateTime.fromISO(e.target.value);
                                field.onChange(dateTime.isValid ? dateTime.toHTTP() : "");
                            }}
                        />
                    )}
                />

                <Controller
                    name="receipt"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("expenses.dialogs.form.fields.receipt")}
                            fullWidth
                            error={!!form.formState.errors.receipt}
                            helperText={form.formState.errors.receipt?.message}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? e.target.value : "")}
                        />
                    )}
                />

                {driverPayrollList && (
                    <Controller
                        name="driver_payroll_code"
                        control={form.control}
                        render={({ field }) => (
                            <Autocomplete
                                options={driverPayrollOptionList}
                                value={
                                    driverPayrollOptionList.find(
                                        (option) => String(option.id) === String(field.value)
                                    ) || null
                                }
                                onChange={(_, newValue) => {
                                    field.onChange(Number.parseInt(newValue?.id ?? "") || 0);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("expenses.dialogs.form.fields.payroll")}
                                        error={!!form.formState.errors.driver_payroll_code}
                                        helperText={
                                            form.formState.errors.driver_payroll_code?.message
                                        }
                                        fullWidth
                                    />
                                )}
                                fullWidth
                            />
                        )}
                    />
                )}
            </Stack>

            {/* Row 2: Amount and Reason */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("expenses.dialogs.form.fields.amount")}
                            fullWidth
                            error={!!form.formState.errors.amount}
                            helperText={form.formState.errors.amount?.message}
                            value={field.value ? defaultToLocaleNumberString(field.value) : ""}
                            onChange={(e) => {
                                field.onChange(
                                    e.target.value
                                        ? localeToDefaultNumberString(e.target.value)
                                        : ""
                                );
                            }}
                        />
                    )}
                />

                <Controller
                    name="reason"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("expenses.dialogs.form.fields.reason")}
                            fullWidth
                            error={!!form.formState.errors.reason}
                            helperText={form.formState.errors.reason?.message}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? e.target.value : "")}
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
};

// Main dialog component props
interface DriverPayrollShipmentExpenseFormDialogProps extends FormDialogProps {
    payrollCode: number;
    loadExpenseList: () => Promise<void>;
    expenseToEdit?: ShipmentExpenseType | null;
    setExpenseToEdit?: React.Dispatch<React.SetStateAction<ShipmentExpenseType | null>>;
    driverPayrollList?: DriverPayrollType[];
}

export const DriverPayrollShipmentExpenseFormDialog = ({
    payrollCode,
    loadExpenseList,
    open,
    setOpen,
    expenseToEdit,
    setExpenseToEdit,
    driverPayrollList,
}: Readonly<DriverPayrollShipmentExpenseFormDialogProps>) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);

    // Create schema with translations
    const shipmentExpenseFormSchema = useMemo(() => getShipmentExpenseFormSchema(t), [t]);

    // STATE
    // React form hook setup
    const form = useForm<ShipmentExpenseType>({
        resolver: zodResolver(shipmentExpenseFormSchema),
        defaultValues: getShipmentExpenseFormDefaultValue(payrollCode),
    });

    // Form state management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // CONTEXT
    // Access toast notifications from context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // USE EFFECT
    // Set form values when editing an expense
    useEffect(() => {
        if (!expenseToEdit) {
            form.reset(getShipmentExpenseFormDefaultValue(payrollCode));
        } else {
            form.reset(expenseToEdit);
        }
    }, [expenseToEdit, form, payrollCode]);

    // EVENT HANDLERS
    const handleClose = () => {
        setOpen(false);
    };

    // After exited reset form to empty and clean expense being edited
    const handleExited = () => {
        form.reset(getShipmentExpenseFormDefaultValue(payrollCode));
        if (setExpenseToEdit) {
            setExpenseToEdit(null);
        }
        setSubmitResult(null);
    };

    const postExpense = async (formData: ShipmentExpenseType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Expense...", { formData });
        }
        const resp = await ShipmentExpenseApi.postShipmentExpense(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putExpense = async (formData: ShipmentExpenseType) => {
        if (!formData.expense_code) {
            setSubmitResult({ error: t("expenses.dialogs.form.errors.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Expense...", { formData });
        }
        const resp = await ShipmentExpenseApi.putShipmentExpense(formData.expense_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    const onSubmit = async (payload: ShipmentExpenseType) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting expense formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.expense_code ? await postExpense(payload) : await putExpense(payload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message ?? t("expenses.dialogs.form.defaultSuccess") });
        showToastSuccess(resp.message ?? t("expenses.dialogs.form.defaultSuccess"));

        await loadExpenseList();

        if (!expenseToEdit) {
            form.reset(getShipmentExpenseFormDefaultValue(payrollCode));
        }
    };

    const getDialogDescription = () => {
        if (!Object.keys(form.formState.errors).length) {
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
                <span>{t("expenses.dialogs.form.description")}</span>
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
                {t("expenses.dialogs.form.reviewFields")}
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
            onSubmit={form.handleSubmit(onSubmit)}
            slotProps={{
                transition: {
                    onExited: handleExited, // This is the key prop for after-close actions
                },
            }}
        >
            <DialogTitle>
                {!expenseToEdit
                    ? t("expenses.dialogs.form.addTitle")
                    : t("expenses.dialogs.form.editTitle")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <ShipmentExpenseFormDialogFields
                        form={form}
                        driverPayrollList={driverPayrollList}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("buttons.close")}</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!expenseToEdit ? t("buttons.addExpense") : t("buttons.editExpense")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
