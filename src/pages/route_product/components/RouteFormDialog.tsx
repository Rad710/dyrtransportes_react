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
import { useEffect, useState } from "react";
import { Route } from "../types";
import { RouteApi } from "../route_product_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

const parser = getGlobalizeParser();
const formatter = getGlobalizeNumberFormatter(2, 2);

// Create a reusable string validation for fields with similar requirements
const createRequiredStringSchema = (fieldName: string) =>
    z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: `El campo ${fieldName} es obligatorio.`,
        })
        .min(1, {
            message: `El campo ${fieldName.toLowerCase()} no puede estar vacío.`,
        });

// Create a reusable number validation schema for price fields
const createPriceSchema = (fieldName: string) =>
    z.coerce
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: `El campo ${fieldName} es obligatorio.`,
        })
        .superRefine((arg, ctx) => {
            if (arg.length <= 0) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 1,
                    type: "string",
                    inclusive: true,
                    message: `${fieldName} no puede estar vacío.`,
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
        .transform((arg) => parser(arg).toFixed(2));

const routeFormSchema = z.object({
    route_code: z.number().positive("Código Ruta inválido").nullish(),
    origin: createRequiredStringSchema("Origen"),
    destination: createRequiredStringSchema("Destino"),
    price: createPriceSchema("Precio"),
    payroll_price: createPriceSchema("Precio Liquidación"),
});

type RouteFormSchema = z.infer<typeof routeFormSchema>;

interface RouteFormDialogProps extends FormDialogProps {
    loadRouteList: () => Promise<void>;
    routeToEdit?: Route | null;
    setRouteToEdit?: React.Dispatch<React.SetStateAction<Route | null>>;
}

const ROUTE_FORM_DEFAULT_VALUE: RouteFormSchema = {
    route_code: null,
    origin: "",
    destination: "",
    price: "",
    payroll_price: "",
};

export const RouteFormDialog = ({
    open,
    setOpen,
    loadRouteList,
    routeToEdit,
    setRouteToEdit,
}: RouteFormDialogProps) => {
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
                price: formatter(parseFloat(routeToEdit?.price ?? "") || 0),
                payroll_price: formatter(parseFloat(routeToEdit?.payroll_price ?? "") || 0),
            });
        } else {
            reset(ROUTE_FORM_DEFAULT_VALUE);
        }
    }, [routeToEdit]);

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
            setSubmitResult({ error: "Ruta no puede editarse" });
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
                <span>Completar datos de la Ruta</span>
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
            slotProps={{
                transition: {
                    onExited: handleExited, // This is the key prop for after-close actions
                },
            }}
        >
            <DialogTitle>{!routeToEdit ? "Agregar Ruta" : "Editar Ruta"}</DialogTitle>
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
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!routeToEdit ? "Agregar Ruta" : "Editar Ruta"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
