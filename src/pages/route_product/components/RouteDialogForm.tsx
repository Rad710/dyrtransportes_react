"use client";
"use strict";

import React, { useEffect, useMemo, useState } from "react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Route } from "@/pages/route_product/types";

import { toastSuccess } from "@/utils/notification";
import { RouteApi } from "../route_utils";
import { SubmitResult } from "@/types";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);
Globalize.locale("es");

const parser = Globalize.numberParser();

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
            required_error: "El campo Destino s obligatorio.",
        })
        .min(1, {
            message: "El campo destination no puede estar vacío.",
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
        })
        .transform((arg) => parser(arg)),

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
        })
        .transform((arg) => parser(arg)),
});

type RouteDialogFormProps = {
    setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
    routeToEdit: Route | null;
    setRouteToEdit: React.Dispatch<React.SetStateAction<Route | null>>;
};

export const RouteDialogForm = ({
    setRouteList,
    routeToEdit,
    setRouteToEdit,
}: RouteDialogFormProps) => {
    // STATE
    const form = useForm<z.infer<typeof routeFormSchema>>({
        resolver: zodResolver(routeFormSchema),
    });

    const button = !form.getValues("route_code")
        ? ({
              text: "Agregar Ruta",
              description: "Completar datos de la nueva Ruta",
              variant: "indigo",
              size: "md-lg",
          } as const)
        : ({
              text: "Editar Ruta",
              description: "Completar datos de la Ruta a editar",
              variant: "cyan",
              size: "md-lg",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

    // USE EFFECTS
    useEffect(() => {
        // show dialog when clicking editar action button
        if (routeToEdit) {
            setIsOpen(true);

            form.reset({
                route_code: routeToEdit?.route_code ?? null,
                origin: routeToEdit?.origin ?? "",
                destination: routeToEdit?.destination ?? "",
                price: typeof routeToEdit?.price === "number" ? (routeToEdit?.price ?? 0) : 0,
                payroll_price:
                    typeof routeToEdit?.payroll_price === "number"
                        ? (routeToEdit.payroll_price ?? 0)
                        : 0,
            });
        }
    }, [routeToEdit]);

    useEffect(() => {
        // hide submit result when there is new error (form is changing)
        // this allows to change form description
        setSubmitResult((prev) => (Object.keys(form.formState.errors).length ? null : prev));
    }, [form.formState.errors]);

    // HANDLERS
    const handlePostRoute = async (formData: Route) => {
        if (formData.route_code) {
            setSubmitResult({ error: "Ruta ya existe" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Route...", { formData });
        }
        const result = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post result...", { result });
        }

        if (result?.success) {
            setSubmitResult({ success: result.success });
            toastSuccess(result.success);

            const newRouteList = await RouteApi.getRouteList();
            setRouteList(newRouteList);

            // reset dialog when succesfully created NEW route
            form.reset({
                route_code: null,
                origin: "",
                destination: "",
                price: 0,
                payroll_price: 0,
            });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            return;
        }
    };

    const handlePutRoute = async (formData: Route) => {
        if (!formData.route_code) {
            setSubmitResult({ error: "Ruta no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Route...", { formData });
        }
        const result = await RouteApi.putRoute(formData.route_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT result...", { result });
        }

        if (result?.success) {
            setSubmitResult({ success: result.success });
            toastSuccess(result.success);

            const newRouteList = await RouteApi.getRouteList();
            setRouteList(newRouteList);
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            return;
        }
    };

    const handleOnOpenChange = (open: boolean) => {
        setIsOpen(open);

        // timeout solves issue of form changing text/color when closing
        setTimeout(() => {
            form.clearErrors();
            form.reset({
                route_code: null,
                origin: "",
                destination: "",
                price: 0,
                payroll_price: 0,
            });

            setSubmitResult(null);
            setRouteToEdit(null);
        }, 100);
    };

    const onFormSubmit = async (payload: z.infer<typeof routeFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting route formData...", { payload });
        }

        setButtonDisabled(true);
        if (!payload.route_code) {
            await handlePostRoute(payload);
        } else {
            await handlePutRoute(payload);
        }

        setButtonDisabled(false);
    };

    const FormComponent = (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className="space-y-2 mt-2 ml-2 mr-2"
                    id="form-route"
                >
                    <div className="md:flex md:flex-row md:gap-6 justify-evenly">
                        <FormField
                            control={form.control}
                            name="origin"
                            defaultValue={form.getValues("origin")}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Origen</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Origen" {...field} />
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
                                <FormItem className="mt-2 md:mt-0 w-full">
                                    <FormLabel>Destino</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Destino" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="md:flex md:flex-row md:gap-6 justify-evenly">
                        <FormField
                            control={form.control}
                            name="price"
                            defaultValue={form.getValues("price")}
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Precio" {...field} type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payroll_price"
                            defaultValue={form.getValues("payroll_price")}
                            render={({ field }) => (
                                <FormItem className="mt-2 md:mt-0 w-full">
                                    <FormLabel>Precio Liquidación</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Precio Liquidación"
                                            {...field}
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </>
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild>
                <Button variant="indigo" size="md-lg">
                    Agregar Ruta
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
                            form="form-route"
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
