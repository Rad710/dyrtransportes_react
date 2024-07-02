"use client";
"use strict";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { XIcon, CheckIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Product } from "@/pages/routes/types";
import { useState } from "react";

type ProductFormSchema = {
    productCode?: number;
    productName: string;
    successMessage?: string;
    errorMessage?: string;
};

export const productFormSchema = z.object({
    productCode: z.number().optional(),

    productName: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Producto requerido.",
        })
        .min(1, {
            message: "Campo Producto no puede estar vacío.",
        }),

    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
});

type FormProductProps = {
    form: UseFormReturn<ProductFormSchema, any, undefined>;
    handleSubmit: (formData: Product) => Promise<void>;
};

export const ProductDialogForm = ({ form, handleSubmit }: FormProductProps) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const button = !form.getValues("productCode")
        ? ({
              text: "Agregar Producto",
              description: "Completar datos del Producto",
              variant: "indigo",
          } as const)
        : ({
              text: "Editar Producto",
              description: "Completar datos del Producto",
              variant: "cyan",
          } as const);

    const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
        setButtonDisabled(true);
        await handleSubmit({
            product_code: data.productCode ?? null,
            product_name: data.productName.trim(),
        });
        setButtonDisabled(false);
    };

    const onFormClose = (open: boolean) => {
        if (open) {
            return;
        }
        form.clearErrors();
        form.setValue("successMessage", undefined);
        form.setValue("errorMessage", undefined);
    };

    return (
        <Dialog onOpenChange={onFormClose}>
            <DialogTrigger asChild>
                <Button
                    id="dialog-form-product-trigger"
                    variant={button.variant}
                    size="md-lg"
                >
                    {button.text}
                </Button>
            </DialogTrigger>
            <DialogContent
                id="dialog-form-product-content"
                className="sm:max-w-xl p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <ScrollArea className="max-h-[80vh] p-4">
                    <DialogHeader className="ml-2 mr-2 gap-y-4">
                        <DialogTitle>{button.text}</DialogTitle>
                        <DialogDescription>
                            {!form.getValues("successMessage") &&
                            !form.getValues("errorMessage") ? (
                                <span>{button.description}</span>
                            ) : (
                                ""
                            )}

                            {form.getValues("successMessage") ? (
                                <Alert variant="success">
                                    <CheckIcon className="h-5 w-5" />
                                    <AlertDescription className="mt-1">
                                        {form.getValues("successMessage")}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                ""
                            )}

                            {form.getValues("errorMessage") ? (
                                <Alert variant="destructive">
                                    <XIcon className="h-5 w-5" />
                                    <AlertDescription className="mt-1">
                                        {form.getValues("errorMessage")}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                ""
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 mt-4 ml-2 mr-2"
                            id="form-product"
                        >
                            <FormField
                                control={form.control}
                                name="productName"
                                defaultValue={form.getValues("productName")}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Producto</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Producto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="ghost">Cerrar</Button>
                        </DialogClose>
                        <Button
                            variant={button.variant}
                            type="submit"
                            form="form-product"
                            disabled={buttonDisabled}
                            onClick={() => {
                                if (
                                    !productFormSchema.safeParse(
                                        form.getValues()
                                    ).success
                                ) {
                                    form.setValue("successMessage", undefined);
                                    form.setValue("errorMessage", undefined);
                                }
                            }}
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
