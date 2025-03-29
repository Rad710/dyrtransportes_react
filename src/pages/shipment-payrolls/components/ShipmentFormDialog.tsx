import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
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

import { DateTime } from "luxon";
import { AutocompleteOption, FormDialogProps, FormSubmitResult } from "@/types";
import { Product, Route } from "@/pages/route-product/types";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { Autocomplete } from "@mui/material";
import { Driver } from "@/pages/driver/types";
import { DriverPayroll } from "@/pages/driver-payrolls/types";
import { numberFormatter } from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { shipmentTranslationNamespace } from "../translations"; // Adjust path as needed
import type { AutocompleteOptionDriver, Shipment, ShipmentPayroll } from "../types";
import { ShipmentApi, ShipmentUtils, type ShipmentFormSchema } from "../utils";

interface ShipmentFormDialogFields {
    form: UseFormReturn<ShipmentFormSchema>;
    productList: Product[];
    driverList: Driver[];
    routeList: Route[];
    shipmentPayrollList?: ShipmentPayroll[];
    driverPayrollList?: DriverPayroll[];
}

const ShipmentFormDialogFields = ({
    form,
    productList,
    driverList,
    routeList,
    shipmentPayrollList,
    driverPayrollList,
}: Readonly<ShipmentFormDialogFields>) => {
    const { t } = useTranslation(shipmentTranslationNamespace);

    // Watch origin field for dependent fields
    const watchedOrigin = form.watch("origin");

    // Memoized option lists for better performance
    const truckPlateOptionList: AutocompleteOption[] = useMemo(
        () =>
            Array.from(new Set(driverList.map((item) => item.truck_plate ?? "")))
                .filter(Boolean)
                .map((truck_plate) => ({ id: truck_plate, label: truck_plate }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        [driverList]
    );
    const originOptionList: AutocompleteOption[] = useMemo(
        () =>
            Array.from(
                new Map(
                    routeList.map((item) => [item.origin, { label: item.origin, id: item.origin }])
                ).values()
            ).sort((a, b) => a.label.localeCompare(b.label)),
        [routeList]
    );
    const destinationOptionList: AutocompleteOption[] = useMemo(
        () =>
            Array.from(
                new Map(
                    routeList
                        .filter((item) => item.origin === watchedOrigin)
                        .map((item) => [
                            item.destination,
                            { label: item.destination, id: item.destination },
                        ])
                ).values()
            ).sort((a, b) => a.label.localeCompare(b.label)),
        [routeList, watchedOrigin]
    );
    const productOptionList: AutocompleteOption[] = useMemo(
        () =>
            productList.map((item) => ({
                id: item.product_code?.toString() ?? "",
                label: item.product_name ?? "",
            })),
        [productList]
    );
    const driverOptionList: AutocompleteOptionDriver[] = useMemo(
        () =>
            driverList.map((item) => ({
                id: item.driver_code?.toString() ?? "",
                label: ((item.driver_name ?? "") + " " + (item.driver_surname ?? "")).trim(),
                truck_plate: item.truck_plate ?? "",
                trailer_plate: item.trailer_plate ?? "",
            })),
        [driverList]
    );

    // optional options enable the fields
    const shipmentPayrollOptionList: AutocompleteOption[] = useMemo(
        () =>
            shipmentPayrollList?.map((item) => ({
                id: item.payroll_code?.toString() ?? "",
                label: `${DateTime.fromHTTP(item.payroll_timestamp).toFormat("dd/MM/yy")} [#${
                    item.payroll_code ?? 0
                }]`,
            })) ?? [],
        [shipmentPayrollList]
    );

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
            {/* Row 1: Date, Driver, Truck Plate */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="shipment_date"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            fullWidth
                            label={t("formDialog.fields.shipment_date")}
                            type="date"
                            error={!!form.formState.errors.shipment_date}
                            helperText={form.formState.errors.shipment_date?.message}
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
                    name="driver_code"
                    control={form.control}
                    render={({ field }) => (
                        <Autocomplete
                            options={driverOptionList}
                            value={
                                driverOptionList.find(
                                    (option) => option.id === field.value?.toString()
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(parseInt(newValue?.id ?? "") || 0);
                                form.setValue("driver_name", newValue?.label ?? "");
                                form.setValue("truck_plate", newValue?.truck_plate ?? "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("formDialog.fields.driver")}
                                    error={
                                        !!form.formState.errors.driver_code ||
                                        !!form.formState.errors.driver_name
                                    }
                                    helperText={
                                        form.formState.errors.driver_code?.message ||
                                        form.formState.errors.driver_name?.message
                                    }
                                    fullWidth
                                />
                            )}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="truck_plate"
                    control={form.control}
                    render={({ field }) => (
                        <Autocomplete
                            options={truckPlateOptionList}
                            value={
                                truckPlateOptionList.find((option) => option.id === field.value) ||
                                null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue?.id ?? "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("formDialog.fields.truck_plate")}
                                    error={!!form.formState.errors.truck_plate}
                                    helperText={form.formState.errors.truck_plate?.message}
                                    fullWidth
                                />
                            )}
                            fullWidth
                        />
                    )}
                />

                {shipmentPayrollList && (
                    <Controller
                        name="shipment_payroll_code"
                        control={form.control}
                        render={({ field }) => (
                            <Autocomplete
                                options={shipmentPayrollOptionList}
                                value={
                                    shipmentPayrollOptionList.find(
                                        (option) => String(option.id) === String(field.value)
                                    ) || null
                                }
                                onChange={(_, newValue) => {
                                    field.onChange(parseInt(newValue?.id ?? "") || 0);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("formDialog.fields.payroll")}
                                        error={!!form.formState.errors.shipment_payroll_code}
                                        helperText={
                                            form.formState.errors.shipment_payroll_code?.message
                                        }
                                        fullWidth
                                    />
                                )}
                                fullWidth
                            />
                        )}
                    />
                )}

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
                                        label={t("formDialog.fields.driver_payroll")}
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

            {/* Row 2: Product, Origin, Destination */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="product_code"
                    control={form.control}
                    render={({ field }) => (
                        <Autocomplete
                            options={productOptionList}
                            value={
                                productOptionList.find(
                                    (option) => String(option.id) === String(field.value)
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(parseInt(newValue?.id ?? "") || 0);
                                form.setValue("product_name", newValue?.label ?? "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("formDialog.fields.product")}
                                    error={
                                        !!form.formState.errors.product_code ||
                                        !!form.formState.errors.product_name
                                    }
                                    helperText={
                                        form.formState.errors.product_code?.message ||
                                        form.formState.errors.product_name?.message
                                    }
                                    fullWidth
                                />
                            )}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="origin"
                    control={form.control}
                    render={({ field }) => (
                        <Autocomplete
                            options={originOptionList}
                            value={
                                originOptionList.find(
                                    (option) => String(option.id) === String(field.value)
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                field.onChange(newValue?.id ?? "");
                                form.setValue("destination", "");
                                form.setValue("route_code", 0);
                                form.setValue("price", "");
                                form.setValue("payroll_price", "");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("formDialog.fields.origin")}
                                    error={
                                        !!form.formState.errors.origin ||
                                        !!form.formState.errors.route_code
                                    }
                                    helperText={
                                        form.formState.errors.origin?.message ||
                                        form.formState.errors.route_code?.message
                                    }
                                    fullWidth
                                />
                            )}
                            fullWidth
                        />
                    )}
                />

                <Controller
                    name="destination"
                    control={form.control}
                    render={({ field }) => (
                        <Autocomplete
                            options={destinationOptionList}
                            value={
                                destinationOptionList.find(
                                    (option) => String(option.id) === String(field.value)
                                ) || null
                            }
                            onChange={(_, newValue) => {
                                const selectedDestination = newValue?.id ?? "";
                                field.onChange(selectedDestination);

                                const selectedRoute =
                                    routeList.find(
                                        (item) =>
                                            item.origin === watchedOrigin &&
                                            item.destination === selectedDestination
                                    ) ?? null;

                                form.setValue("route_code", selectedRoute?.route_code ?? 0);
                                form.setValue(
                                    "price",
                                    numberFormatter(parseFloat(selectedRoute?.price ?? "") || 0)
                                );
                                form.setValue(
                                    "payroll_price",
                                    numberFormatter(
                                        parseFloat(selectedRoute?.payroll_price ?? "") || 0
                                    )
                                );
                            }}
                            disabled={!watchedOrigin}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("formDialog.fields.destination")}
                                    error={
                                        !!form.formState.errors.destination ||
                                        !!form.formState.errors.route_code
                                    }
                                    helperText={
                                        form.formState.errors.destination?.message ||
                                        form.formState.errors.route_code?.message
                                    }
                                    fullWidth
                                />
                            )}
                            fullWidth
                        />
                    )}
                />
            </Stack>

            {/* Row 3: Dispatch, Receipt, Price */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="dispatch_code"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.dispatch_code")}
                            fullWidth
                            error={!!form.formState.errors.dispatch_code}
                            helperText={form.formState.errors.dispatch_code?.message}
                        />
                    )}
                />

                <Controller
                    name="receipt_code"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.receipt_code")}
                            fullWidth
                            error={!!form.formState.errors.receipt_code}
                            helperText={form.formState.errors.receipt_code?.message}
                        />
                    )}
                />

                <Controller
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.price", {
                                priceNoVat:
                                    numberFormatter(parseFloat(field.value || "0") * (10 / 11)) ||
                                    0,
                            })}
                            fullWidth
                            error={!!form.formState.errors.price}
                            helperText={form.formState.errors.price?.message}
                        />
                    )}
                />
            </Stack>

            {/* Row 4: Payroll Price, Origin Weight, Destination Weight */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                    name="payroll_price"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.payroll_price")}
                            fullWidth
                            error={!!form.formState.errors.payroll_price}
                            helperText={form.formState.errors.payroll_price?.message}
                        />
                    )}
                />

                <Controller
                    name="origin_weight"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.origin_weight")}
                            type="number"
                            fullWidth
                            error={!!form.formState.errors.origin_weight}
                            helperText={form.formState.errors.origin_weight?.message}
                        />
                    )}
                />

                <Controller
                    name="destination_weight"
                    control={form.control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t("formDialog.fields.destination_weight")}
                            type="number"
                            fullWidth
                            error={!!form.formState.errors.destination_weight}
                            helperText={form.formState.errors.destination_weight?.message}
                        />
                    )}
                />
            </Stack>
        </Stack>
    );
};

interface ShipmentFormDialogProps extends FormDialogProps {
    payrollCode: number;
    loadShipmentList: () => Promise<void>;
    productList: Product[];
    driverList: Driver[];
    routeList: Route[];
    shipmentToEdit?: Shipment | null;
    setShipmentToEdit?: React.Dispatch<React.SetStateAction<Shipment | null>>;
    shipmentPayrollList?: ShipmentPayroll[];
    driverPayrollList?: DriverPayroll[];
}

export const ShipmentFormDialog = ({
    payrollCode,
    loadShipmentList,
    open,
    setOpen,
    productList,
    driverList,
    routeList,
    shipmentToEdit,
    setShipmentToEdit,
    shipmentPayrollList,
    driverPayrollList,
}: Readonly<ShipmentFormDialogProps>) => {
    const { t } = useTranslation(shipmentTranslationNamespace);

    // Create schema with translations
    const shipmentFormSchema = useMemo(() => ShipmentUtils.getShipmentFormSchema(t), [t]);

    // STATE
    // React form hook setup
    const form = useForm<ShipmentFormSchema>({
        resolver: zodResolver(shipmentFormSchema),
        defaultValues: ShipmentUtils.SHIPMENT_FORM_DEFAULT_VALUE(payrollCode),
    });

    // Form state management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    //CONTEXT
    // Access toast notifications from context
    const { showToastSuccess, showToastAxiosError } = useToast();

    // USE EFFECT
    // Set form values when editing a shipment
    useEffect(() => {
        if (!shipmentToEdit) {
            form.reset(ShipmentUtils.SHIPMENT_FORM_DEFAULT_VALUE(payrollCode));
        } else {
            form.reset(ShipmentUtils.shipmentToFormSchema(shipmentToEdit, payrollCode));
        }
    }, [shipmentToEdit, form, payrollCode]);

    // EVENT HANDLERS
    const handleClose = () => {
        setOpen(false);
    };
    // after exited reset form to empty and clean Shipment being edited
    const handleExited = () => {
        form.reset(ShipmentUtils.SHIPMENT_FORM_DEFAULT_VALUE(payrollCode));
        if (setShipmentToEdit) {
            setShipmentToEdit(null);
        }
        setSubmitResult(null);
    };

    const postShipment = async (formData: Shipment) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Shipment...", { formData });
        }
        const resp = await ShipmentApi.postShipment(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };
    const putShipment = async (formData: Shipment) => {
        if (!formData.shipment_code) {
            setSubmitResult({ error: t("formDialog.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Shipment...", { formData });
        }
        const resp = await ShipmentApi.putShipment(formData.shipment_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };
    const onSubmit = async (payload: ShipmentFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment formData...", { payload });
        }

        // Transform form data to API format
        const transformedPayload: Shipment = ShipmentUtils.formSchemaToShipment(payload);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting shipment transformedPayload...", { transformedPayload });
        }

        setIsSubmitting(true);
        const resp = !payload.shipment_code
            ? await postShipment(transformedPayload)
            : await putShipment(transformedPayload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message ?? t("formDialog.successMessage") });
        showToastSuccess(resp.message ?? t("formDialog.successMessage"));

        await loadShipmentList();

        handleClose();
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
            maxWidth="lg"
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
                {!shipmentToEdit ? t("formDialog.add") : t("formDialog.edit")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <ShipmentFormDialogFields
                        form={form}
                        productList={productList}
                        driverList={driverList}
                        routeList={routeList}
                        shipmentPayrollList={shipmentPayrollList}
                        driverPayrollList={driverPayrollList}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("formDialog.close")}</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!shipmentToEdit ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
