import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import { Product } from "../types";
import { ProductApi } from "../route_product_utils";
import { PromiseResult } from "@/types";

const productFormSchema = z.object({
    product_code: z.number().nullish(),

    product_name: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Producto es obligatorio.",
        })
        .min(1, {
            message: "El campo Producto no puede estar vacío.",
        }),
});

type FormProductProps = {
    setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
    productToEdit: Product | null;
    setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
    setSelectedProductRows: React.Dispatch<React.SetStateAction<number[]>>;
};

export const ProductDialogForm = ({
    setProductList,
    productToEdit,
    setProductToEdit,
    setSelectedProductRows,
}: FormProductProps) => {
    //STATE
    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            product_code: null, // Default to null instead of undefined, avoid warning message
            product_name: "",
        },
    });

    const button = !form.getValues("product_code")
        ? ({
              text: "Agregar Producto",
              description: "Completar datos del Producto",
              variant: "indigo",
              size: "md-lg",
          } as const)
        : ({
              text: "Editar Producto",
              description: "Completar datos del Producto a editar",
              variant: "cyan",
              size: "md-lg",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<PromiseResult | null>(null);

    // USE EFFECTS
    useEffect(() => {
        // show dialog when clicking editar action button
        if (productToEdit) {
            setIsOpen(true);

            form.reset({
                product_code: productToEdit?.product_code ?? undefined,
                product_name: productToEdit?.product_name ?? "",
            });
        }
    }, [productToEdit]);

    useEffect(() => {
        // hide submit result when there is new error (form is changing)
        // this allows to change form description
        setSubmitResult((prev) => (Object.keys(form.formState.errors).length ? null : prev));
    }, [form.formState.errors]);

    // HANDLERS
    const handlePostProduct = async (formData: Product) => {
        if (formData.product_code) {
            setSubmitResult({ error: "Producto ya existe" });
            return;
        }

        const result = await ProductApi.postProduct(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post product...", { result });
        }

        setSelectedProductRows([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const newProductList = await ProductApi.getProductList();
            setProductList(newProductList);

            // reset dialog when succesfully created NEW
            form.reset({
                product_code: null,
                product_name: "",
            });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
        }
    };

    const handlePutProduct = async (formData: Product) => {
        if (!formData.product_code) {
            setSubmitResult({ error: "Producto no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT product...", { formData });
        }

        const result = await ProductApi.putProduct(formData.product_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT result...", { result });
        }

        setSelectedProductRows([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const newProductList = await ProductApi.getProductList();
            setProductList(newProductList);
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
        }
    };

    const handleOnOpenChange = (open: boolean) => {
        setIsOpen(open);

        // timeout solves issue of form changing text/color when closing
        setTimeout(() => {
            form.clearErrors();
            form.reset({
                product_code: undefined,
                product_name: "",
            });

            setSubmitResult(null);
            setProductToEdit(null);
        }, 100);
    };

    const onFormSubmit = async (payload: z.infer<typeof productFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting product formData...", { payload });
        }

        setButtonDisabled(true);
        if (!payload.product_code) {
            await handlePostProduct(payload);
        } else {
            await handlePutProduct(payload);
        }
        setButtonDisabled(false);
    };

    const FormComponent = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-2 mt-2 ml-2 mr-2"
                id="form-product"
            >
                <FormField
                    control={form.control}
                    name="product_name"
                    defaultValue={form.getValues("product_name")}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Producto</FormLabel>
                            <FormControl>
                                <Input placeholder="Producto" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild>
                <Button variant="indigo" size="md-lg">
                    Agregar Producto
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-2xl p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <ScrollArea className="max-h-[80vh] p-4">
                    <DialogHeader className="ml-2 mr-2 gap-y-4">
                        <DialogTitle>{button.text}</DialogTitle>
                        <DialogDescription>
                            {!Object.keys(form.formState.errors).length ? (
                                submitResult ? (
                                    <span
                                        className={
                                            submitResult.success ? "text-green-600" : "text-red-600"
                                        }
                                    >
                                        {submitResult.success || submitResult.error}
                                    </span>
                                ) : (
                                    <span>{button.description}</span>
                                )
                            ) : (
                                <span className="text-red-500 font-bold">
                                    Revise los campos requerido
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {FormComponent}

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="ghost">Cerrar</Button>
                        </DialogClose>
                        <Button
                            variant={button.variant}
                            type="submit"
                            form="form-product"
                            disabled={buttonDisabled}
                        >
                            {button.text}
                        </Button>
                    </DialogFooter>

                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
