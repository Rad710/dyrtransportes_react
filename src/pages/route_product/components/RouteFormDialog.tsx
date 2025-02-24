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

import { getGlobalizeNumberFormatter, getGlobalizeParser } from "@/utils/globalize";
import { FormDialogProps, FormSubmitResult } from "@/types";
import { useState } from "react";
import { Route } from "../types";
import { RouteApi } from "../route_product_utils";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

const parser = getGlobalizeParser();
const formatter = getGlobalizeNumberFormatter(2, 2);

const routeFormSchema = z.object({
    route_code: z.number().nullish(),

    origin: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Origen es obligatorio.",
        })
        .min(1, {
            message: "El campo origen no puede estar vacío.",
        }),

    destination: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Destino es obligatorio.",
        })
        .min(1, {
            message: "El campo destino no puede estar vacío.",
        }),

    price: z.coerce
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Precio es obligatorio.",
        })
        .superRefine((arg, ctx) => {
            if (arg.length <= 0) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Precio no puede estar vacío.",
                });
            }

            const val = parser(arg);
            if (!val) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }
        })
        .transform((arg) => parser(arg).toFixed(2)),

    payroll_price: z.coerce
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Precio Liquidación es obligatorio.",
        })
        .superRefine((arg, ctx) => {
            if (arg.length <= 0) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: "Precio Liquidación no puede estar vacío.",
                });
            }

            const val = parser(arg);
            if (!val) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }
        })
        .transform((arg) => parser(arg).toFixed(2)),
});

type RouteFormSchema = z.infer<typeof routeFormSchema>;

interface RouteFormDialogProps extends FormDialogProps {
    setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
    setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
}

const ROUTE_FORM_DEFAULT_VALUE: RouteFormSchema = {
    route_code: null,
    origin: "",
    destination: "",
    price: "0",
    payroll_price: "0",
};

export const RouteFormDialog = ({
    open,
    setOpen,
    setRouteList,
    setSelectedRows,
}: RouteFormDialogProps) => {
    // state
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [submitResult, setSubmitResult] = useState<FormSubmitResult | null>(null);

    // context
    const { showToast } = useToast();

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

    const handleClose = () => {
        reset(ROUTE_FORM_DEFAULT_VALUE);
        setSubmitResult(null);
        setOpen(false);
    };

    const postForm = async (formData: Route) => {
        if (formData.route_code) {
            setSubmitResult({ error: "Ruta ya existe" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Route...", { formData });
        }
        const resp = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }

        setSelectedRows([]);

        if (!isAxiosError(resp) && resp) {
            setSubmitResult({ success: resp.message });
            showToast(resp.message, "success");

            const newRouteList = await RouteApi.getRouteList();
            setRouteList(newRouteList);

            handleClose();
        } else {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToast(resp?.response?.data?.message ?? "", "error");
        }
    };

    const onSubmit = async (payload: RouteFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting route formData...", { payload });
        }

        setButtonDisabled(true);
        await postForm(payload);
        setButtonDisabled(false);
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
                <span>Completar datos de la nueva Ruta</span>
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
            maxWidth="md"
            fullWidth
            component="form"
            onSubmit={handleSubmit(onSubmit)}
        >
            <DialogTitle>Agregar Ruta</DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("origin")}
                                label="Origen"
                                fullWidth
                                error={!!errors.origin}
                                helperText={errors.origin?.message}
                            />
                            <TextField
                                {...register("destination")}
                                label="Destino"
                                fullWidth
                                error={!!errors.destination}
                                helperText={errors.destination?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("price")}
                                label="Precio"
                                fullWidth
                                type="text"
                                error={!!errors.price}
                                helperText={errors.price?.message}
                            />
                            <TextField
                                {...register("payroll_price")}
                                label="Precio Liquidación"
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
                <Button onClick={handleClose}>Cerrar</Button>
                <Button type="submit" variant="contained" disabled={buttonDisabled}>
                    Agregar Ruta
                </Button>
            </DialogActions>
        </Dialog>
    );
};
