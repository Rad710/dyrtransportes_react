"use client";
"use strict";

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
import { ProductApi } from "../route_utils";
import { toastSuccess } from "@/utils/notification";
import { SubmitResult } from "@/types";

const productFormSchema = z.object({
    product_code: z.number().optional(),

    product_name: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Producto requerido.",
        })
        .min(1, {
            message: "Campo Producto no puede estar vacío.",
        }),
});

type FormProductProps = {
    productList: Product[];
    setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
    productToEdit: Product | null;
    setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
};

export const ProductDialogForm = ({
    productList,
    setProductList,
    productToEdit,
    setProductToEdit,
}: FormProductProps) => {
    //STATE
    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
    });

    const button = !form.getValues("product_code")
        ? ({
              text: "Agregar Producto",
              description: "Completar datos del Producto",
              variant: "indigo",
          } as const)
        : ({
              text: "Editar Producto",
              description: "Completar datos del Producto a editar",
              variant: "cyan",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

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
        // reset dialog when succesfully created NEW route
        if (!productToEdit) {
            form.reset({
                product_code: undefined,
                product_name: "",
            });
        }
    }, [form.formState.isSubmitSuccessful]);

    // HANDLERS
    const handlePostProduct = async (formData: Product) => {
        if (formData.product_code) {
            setSubmitResult({ error: "Producto ya existe" });
            throw new Error("Producto ya existe");
        }

        const result = await ProductApi.postProduct(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post product...", { result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setProductList([
                {
                    product_code: result.product_code,
                    product_name: result.product_name,
                },
                ...productList,
            ]);
            setSubmitResult({ success: result.success });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            throw result.error;
        }
    };

    const handlePutProduct = async (formData: Product) => {
        if (!formData.product_code) {
            setSubmitResult({ error: "Producto no puede editarse" });
            throw new Error("Producto no puede editarse");
        }

        const result = await ProductApi.putProduct(formData.product_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Put product...", { result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setProductList(
                productList.map((item) =>
                    formData.product_code === item.product_code
                        ? {
                              product_code: result.product_code,
                              product_name: result.product_name,
                          }
                        : item,
                ),
            );
            setSubmitResult({ success: result.success });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            throw result.error;
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

    const onFormSubmit = async (data: z.infer<typeof productFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting product formData...", { data });
        }

        setButtonDisabled(true);
        const payload: Product = {
            product_code: data.product_code ?? null,
            product_name: data.product_name.trim(),
        };
        if (!payload.product_code) {
            handlePostProduct(payload);
        } else {
            handlePutProduct(payload);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting payload...", { payload });
            console.log("Form values: ", form.getValues());
        }

        setButtonDisabled(false);
    };

    const FormComponent = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-6 mt-4 ml-2 mr-2"
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
                className="sm:max-w-xl p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <ScrollArea className="max-h-[80vh] p-4">
                    <DialogHeader className="ml-2 mr-2 gap-y-4">
                        <DialogTitle>{button.text}</DialogTitle>
                        <DialogDescription>
                            {submitResult ? (
                                <span
                                    className={
                                        submitResult.success ? "text-green-600" : "text-red-600"
                                    }
                                >
                                    {submitResult.success || submitResult.error}
                                </span>
                            ) : (
                                <span>{button.description}</span>
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
