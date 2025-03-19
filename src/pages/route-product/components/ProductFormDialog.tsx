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
import { useEffect, useMemo, useState } from "react";
import { Product } from "../types";
import { ProductApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { productTranslationNamespace } from "../translations";

interface ProductFormDialogProps extends FormDialogProps {
    loadProductList: () => Promise<void>;
    productToEdit?: Product | null;
    setProductToEdit?: React.Dispatch<React.SetStateAction<Product | null>>;
}

export const ProductFormDialog = ({
    open,
    setOpen,
    loadProductList,
    productToEdit,
    setProductToEdit,
}: ProductFormDialogProps) => {
    // Translation
    const { t } = useTranslation(productTranslationNamespace);

    // Create schema with translations
    const productFormSchema = useMemo(() => {
        // Create a reusable string validation for fields with similar requirements
        const createRequiredStringSchema = (fieldName: string) =>
            z
                .string({
                    invalid_type_error: t("formDialog.validation.invalidValue"),
                    required_error: t("formDialog.validation.fieldRequired", { field: fieldName }),
                })
                .min(1, {
                    message: t("formDialog.validation.fieldEmpty", {
                        field: fieldName.toLowerCase(),
                    }),
                });

        return z.object({
            product_code: z
                .number()
                .positive(t("formDialog.validation.invalidProductCode"))
                .nullish(),
            product_name: createRequiredStringSchema(t("formDialog.fields.productName")),
        });
    }, [t]);

    type ProductFormSchema = z.infer<typeof productFormSchema>;

    const PRODUCT_FORM_DEFAULT_VALUE: ProductFormSchema = {
        product_code: null,
        product_name: "",
    };

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
    } = useForm<ProductFormSchema>({
        resolver: zodResolver(productFormSchema),
        defaultValues: PRODUCT_FORM_DEFAULT_VALUE,
    });

    // use Effect
    useEffect(() => {
        if (productToEdit) {
            reset({
                product_code: productToEdit?.product_code ?? null,
                product_name: productToEdit?.product_name ?? "",
            });
        } else {
            reset(PRODUCT_FORM_DEFAULT_VALUE);
        }
    }, [productToEdit, reset]);

    // event handlers
    const handleClose = () => {
        setOpen(false);
    };

    // after exited reset form to empty and clean Product being edited
    const handleExited = () => {
        reset(PRODUCT_FORM_DEFAULT_VALUE);
        if (setProductToEdit) {
            setProductToEdit(null);
        }
        setSubmitResult(null);
    };

    const postForm = async (formData: Product) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Product...", { formData });
        }
        const resp = await ProductApi.postProduct(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post resp...", { resp });
        }
        return resp;
    };

    const putForm = async (formData: Product) => {
        if (!formData.product_code) {
            setSubmitResult({ error: t("formDialog.cannotEdit") });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Product...", { formData });
        }
        const resp = await ProductApi.putProduct(formData.product_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT resp...", { resp });
        }
        return resp;
    };

    // submit form as post or put
    const onSubmit = async (payload: ProductFormSchema) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting product formData...", { payload });
        }

        setIsSubmitting(true);
        const resp = !payload.product_code ? await postForm(payload) : await putForm(payload);
        setIsSubmitting(false);

        if (isAxiosError(resp) || !resp) {
            setSubmitResult({ error: resp?.response?.data?.message ?? "" });
            showToastAxiosError(resp);
            return;
        }

        setSubmitResult({ success: resp.message });
        showToastSuccess(resp.message);

        await loadProductList();

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
            <DialogTitle>{!productToEdit ? t("formDialog.add") : t("formDialog.edit")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{getDialogDescription()}</DialogContentText>
                <Box sx={{ mt: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            {...register("product_name")}
                            label={t("formDialog.fields.productName")}
                            fullWidth
                            error={!!errors.product_name}
                            helperText={errors.product_name?.message}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t("formDialog.close")}</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {!productToEdit ? t("formDialog.add") : t("formDialog.edit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
