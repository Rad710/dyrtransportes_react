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

import { FormDialogProps, FormSubmitResult } from "@/types";
import { useEffect, useState } from "react";
import { Driver } from "../types";
import { DriverApi } from "../driver_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

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

const driverFormSchema = z.object({
    driver_code: z.number().nullish(),
    driver_id: createRequiredStringSchema("Cédula"),
    driver_name: createRequiredStringSchema("Nombre"),
    driver_surname: createRequiredStringSchema("Apellido"),
    truck_plate: createRequiredStringSchema("Placa Camión"),
    trailer_plate: createRequiredStringSchema("Placa Remolque"),
});

type DriverFormSchema = z.infer<typeof driverFormSchema>;

interface DriverFormDialogProps extends FormDialogProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setDriverList: React.Dispatch<React.SetStateAction<Driver[]>>;
    driverToEdit?: Driver | null;
    setDriverToEdit?: React.Dispatch<React.SetStateAction<Driver | null>>;
}

const DRIVER_FORM_DEFAULT_VALUE: DriverFormSchema = {
    driver_code: null,
    driver_id: "",
    driver_name: "",
    driver_surname: "",
    truck_plate: "",
    trailer_plate: "",
};

export const DriverFormDialog = ({
    setLoading,
    open,
    setOpen,
    setDriverList,
    driverToEdit,
    setDriverToEdit,
}: DriverFormDialogProps) => {
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
    } = useForm<DriverFormSchema>({
        resolver: zodResolver(driverFormSchema),
        defaultValues: DRIVER_FORM_DEFAULT_VALUE,
    });

    // use Effect
    useEffect(() => {
        if (driverToEdit) {
            reset({
                driver_code: driverToEdit?.driver_code ?? null,
                driver_id: driverToEdit?.driver_id ?? "",
                driver_name: driverToEdit?.driver_name ?? "",
                driver_surname: driverToEdit?.driver_surname ?? "",
                truck_plate: driverToEdit?.truck_plate ?? "",
                trailer_plate: driverToEdit?.trailer_plate ?? "",
            });
        } else {
            reset(DRIVER_FORM_DEFAULT_VALUE);
        }
    }, [driverToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Driver being edited
    const handleExited = () => {
        reset(DRIVER_FORM_DEFAULT_VALUE);
        if (setDriverToEdit) {
            setDriverToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: Driver) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Driver...", { formData });
        }
        const resp = await DriverApi.postDriver(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: Driver) => {
        if (!formData.driver_code) {
            setSubmitResult({ error: "Chofer no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Driver...", { formData });
        }
        const resp = await DriverApi.putDriver(formData.driver_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // submit form as post or put
    const onSubmit = async (payload: DriverFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting driver formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.driver_code ? await postForm(payload) : await putForm(payload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message });
        showToastSuccess(resp.message);

        setLoading(true);
        const driverListResp = await DriverApi.getDriverList();
        setLoading(false);

        if (!isAxiosError(driverListResp)) {
            const filteredDrivers = driverListResp.filter((item) => !item.deleted);
            setDriverList(filteredDrivers);
        } else {
            setDriverList([]);
        }

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
                <span>Completar datos del Chofer</span>
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
                Revise los campos requeridos
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
            <DialogTitle>{!driverToEdit ? "Agregar Chofer" : "Editar Chofer"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("driver_id")}
                                label="Cédula"
                                fullWidth
                                error={!!errors.driver_id}
                                helperText={errors.driver_id?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("driver_name")}
                                label="Nombre"
                                fullWidth
                                error={!!errors.driver_name}
                                helperText={errors.driver_name?.message}
                            />
                            <TextField
                                {...register("driver_surname")}
                                label="Apellido"
                                fullWidth
                                error={!!errors.driver_surname}
                                helperText={errors.driver_surname?.message}
                            />
                        </Stack>
                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                            <TextField
                                {...register("truck_plate")}
                                label="Placa Camión"
                                fullWidth
                                error={!!errors.truck_plate}
                                helperText={errors.truck_plate?.message}
                            />
                            <TextField
                                {...register("trailer_plate")}
                                label="Placa Remolque"
                                fullWidth
                                error={!!errors.trailer_plate}
                                helperText={errors.trailer_plate?.message}
                            />
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cerrar</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!driverToEdit ? "Agregar Chofer" : "Editar Chofer"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
