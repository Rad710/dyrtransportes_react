"use client";

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

import Globalize from "globalize";
import cldrDataES from "cldr-data/main/es/numbers.json";
import cldrDataEN from "cldr-data/main/en/numbers.json";
import cldrDataSupplementSubTags from "cldr-data/supplemental/likelySubtags.json";

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
import { Route } from "@/pages/routes/types";
import { useState } from "react";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);
Globalize.locale("es");

const parser = Globalize.numberParser();

const formatter = Globalize.numberFormatter({
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

type RouteFormSchema = {
    routeCode?: number;
    origin: string;
    destination: string;
    priceString: string;
    payrollPriceString: string;
    successMessage?: string;
    errorMessage?: string;
};

export const routeFormSchema = z.object({
    routeCode: z.number().optional(),

    origin: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Origen requerido.",
        })
        .min(1, {
            message: "Campo origen no puede estar vacío.",
        }),

    destination: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Destino requerido.",
        })
        .min(1, {
            message: "Campo destination no puede estar vacío.",
        }),

    priceString: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Precio requerido.",
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

            if (isNaN(val)) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }

            if (val < 0) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 0,
                    type: "number",
                    inclusive: true,
                    message: "Precio debe ser positivo",
                });
            }
        }),

    payrollPriceString: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Precio Liquidación requerido.",
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

            if (isNaN(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }

            if (val < 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_small,
                    minimum: 0,
                    type: "number",
                    inclusive: true,
                    message: "Precio Liquidación debe ser positivo",
                });
            }
        }),

    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
});

type FormRouteProps = {
    form: UseFormReturn<RouteFormSchema, any, undefined>;
    handleSubmit: (formData: Route) => Promise<void>;
};

export const RouteDialogForm = ({ form, handleSubmit }: FormRouteProps) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const button = !form.getValues("routeCode")
        ? ({
              text: "Agregar Ruta",
              description: "Completar datos de la nueva Ruta",
              variant: "indigo",
          } as const)
        : ({
              text: "Editar Ruta",
              description: "Completar datos de la Ruta a editar",
              variant: "cyan",
          } as const);

    const onSubmit = async (data: z.infer<typeof routeFormSchema>) => {
        setButtonDisabled(true);
        await handleSubmit({
            route_code: data.routeCode ?? null,
            origin: data.origin.trim(),
            destination: data.destination.trim(),
            price: parser(data.priceString),
            payroll_price: parser(data.payrollPriceString),
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
                    id="dialog-form-route-trigger"
                    variant={button.variant}
                    size="md-lg"
                >
                    {button.text}
                </Button>
            </DialogTrigger>
            <DialogContent
                id="dialog-form-route-content"
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
                            id="form-route"
                        >
                            <div className="md:flex md:flex-row md:gap-6">
                                <FormField
                                    control={form.control}
                                    name="origin"
                                    defaultValue={form.getValues("origin")}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Origen</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Origen"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="destination"
                                    defaultValue={form.getValues("destination")}
                                    render={({ field }) => (
                                        <FormItem className="mt-6 md:mt-0">
                                            <FormLabel>Destino</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Destino"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="md:flex md:flex-row md:gap-6">
                                <FormField
                                    control={form.control}
                                    name="priceString"
                                    defaultValue={form.getValues("priceString")}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Precio"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="payrollPriceString"
                                    defaultValue={form.getValues(
                                        "payrollPriceString"
                                    )}
                                    render={({ field }) => (
                                        <FormItem className="mt-6 md:mt-0">
                                            <FormLabel>
                                                Precio Liquidación
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Precio Liquidación"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="ghost">Cerrar</Button>
                        </DialogClose>
                        <Button
                            variant={button.variant}
                            type="submit"
                            form="form-route"
                            disabled={buttonDisabled}
                            onClick={() => {
                                if (
                                    !routeFormSchema.safeParse(form.getValues())
                                        .success
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
