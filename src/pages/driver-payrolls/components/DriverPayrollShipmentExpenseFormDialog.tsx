import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
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
import { DriverPayroll, ShipmentExpense } from "../types";
import { ShipmentExpenseApi } from "../utils";
import { Autocomplete } from "@mui/material";
import { driverPayrollTranslationNamespace } from "../translations";
import type { TFunction } from "i18next";
import { numberFormatter, numberParser } from "@/utils/i18n";

// Define schema for form validation
const getShipmentExpenseFormSchema = (t: TFunction) =>
    z.object({
        expense_code: z.number().nullable(),
        expense_date: z.coerce.date({
            required_error: t("expenses.dialogs.form.errors.dateRequired"),
        }),
        receipt: z.string({
            invalid_type_error: t("expenses.dialogs.form.errors.invalidValue"),
            required_error: t("expenses.dialogs.form.errors.receiptRequired"),
        }),
        amount: z.coerce
            .string({
                invalid_type_error: t("expenses.dialogs.form.errors.invalidValue"),
                required_error: t("expenses.dialogs.form.errors.amountRequired"),
            })
            .superRefine((arg, ctx) => {
                if (arg.length <= 0) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.too_small,
                        minimum: 1,
                        type: "string",
                        inclusive: true,
                        message: t("expenses.dialogs.form.errors.amountEmpty"),
                    });
                }

                const val = numberParser(arg);
                if (!val) {
                    return ctx.addIssue({
                        code: z.ZodIssueCode.invalid_type,
                        message: t("expenses.dialogs.form.errors.invalidNumber"),
                        expected: "number",
                        received: "unknown",
                    });
                }
            })
            .transform((arg) => numberParser(arg).toFixed(2)),
        reason: z.string({
            invalid_type_error: t("expenses.dialogs.form.errors.invalidValue"),
            required_error: t("expenses.dialogs.form.errors.reasonRequired"),
        }),
        driver_payroll_code: z.number({
            invalid_type_error: t("expenses.dialogs.form.errors.invalidValue"),
            required_error: t("expenses.dialogs.form.errors.payrollCodeRequired"),
        }),
    });

type ShipmentExpenseFormSchema = z.infer<ReturnType<typeof getShipmentExpenseFormSchema>>;

// Default values for the form
const EXPENSE_FORM_DEFAULT_VALUE = (payrollCode: number): ShipmentExpenseFormSchema => ({
    expense_code: null,
    expense_date: DateTime.now().startOf("day").toJSDate(),
    receipt: "",
    amount: "",
    reason: "",
    driver_payroll_code: payrollCode,
});

// Transformation functions between form schema and API schema
const expenseToFormSchema = (expense: ShipmentExpense): ShipmentExpenseFormSchema => ({
    expense_code: expense?.expense_code ?? null,
    expense_date: DateTime.fromHTTP(expense.expense_date).toJSDate(),
    receipt: expense?.receipt ?? "",
    amount: numberFormatter(parseFloat(expense?.amount ?? "0") || 0),
    reason: expense?.reason ?? "",
    driver_payroll_code: expense?.driver_payroll_code ?? 0,
});

const formSchemaToExpense = (formSchema: ShipmentExpenseFormSchema): ShipmentExpense => ({
    expense_code: formSchema.expense_code,
    expense_date: DateTime.fromJSDate(formSchema.expense_date).toHTTP() ?? "",
    receipt: formSchema.receipt,
    amount: formSchema.amount,
    reason: formSchema.reason,
    driver_payroll_code: formSchema.driver_payroll_code,
    deleted: false,
});

// Form fields component
interface ShipmentExpenseFormDialogFields {
    form: UseFormReturn<ShipmentExpenseFormSchema>;
    driverPayrollList?: DriverPayroll[];
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
                            value={DateTime.fromJSDate(
                                field.value ?? DateTime.now().startOf("day").toJSDate()
                            ).toFormat("yyyy-MM-dd")}
                            onChange={(e) => {
                                field.onChange(
                                    e.target.value
                                        ? DateTime.fromISO(e.target.value).toJSDate()
                                        : DateTime.now().startOf("day").toJSDate()
                                );
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
                                    field.onChange(parseInt(newValue?.id ?? "") || 0);
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
    expenseToEdit?: ShipmentExpense | null;
    setExpenseToEdit?: React.Dispatch<React.SetStateAction<ShipmentExpense | null>>;
    driverPayrollList?: DriverPayroll[];
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
    const form = useForm<ShipmentExpenseFormSchema>({
        resolver: zodResolver(shipmentExpenseFormSchema),
        defaultValues: EXPENSE_FORM_DEFAULT_VALUE(payrollCode),
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
            form.reset(EXPENSE_FORM_DEFAULT_VALUE(payrollCode));
        } else {
            form.reset(expenseToFormSchema(expenseToEdit));
        }
    }, [expenseToEdit, form, payrollCode]);

    // EVENT HANDLERS
    const handleClose = () => {
        setOpen(false);
    };

    // After exited reset form to empty and clean expense being edited
    const handleExited = () => {
        form.reset(EXPENSE_FORM_DEFAULT_VALUE(payrollCode));
        if (setExpenseToEdit) {
            setExpenseToEdit(null);
        }
        setSubmitResult(null);
    };

    const postExpense = async (formData: ShipmentExpense) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Expense...", { formData });
        }
        const resp = await ShipmentExpenseApi.postShipmentExpense(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putExpense = async (formData: ShipmentExpense) => {
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

    const onSubmit = async (payload: ShipmentExpenseFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting expense formData...", { payload });
        }

        // Transform form data to API format
        const transformedPayload: ShipmentExpense = formSchemaToExpense(payload);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting expense transformedPayload...", { transformedPayload });
        }

        setIsSubmitting(true);
        const resp = !payload.expense_code
            ? await postExpense(transformedPayload)
            : await putExpense(transformedPayload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message ?? t("expenses.dialogs.form.defaultSuccess") });
        showToastSuccess(resp.message ?? t("expenses.dialogs.form.defaultSuccess"));

        await loadExpenseList();
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
