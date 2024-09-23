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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Route } from "@/pages/routeAndProduct/types";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastSuccess } from "@/utils/notification";
import { RouteApi } from "../route_utils";
import { useForm } from "react-hook-form";
import { SubmitResult } from "@/types";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);
Globalize.locale("es");

const parser = Globalize.numberParser();
const formatter = Globalize.numberFormatter({
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const routeFormSchema = z.object({
    route_code: z.number().optional(),

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

    price_string: z
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

    payroll_price_string: z
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
});

type RouteDialogFormProps = {
    routeList: Route[];
    setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
    routeToEdit: Route | null;
    setRouteToEdit: React.Dispatch<React.SetStateAction<Route | null>>;
};

export const RouteDialogForm = ({
    routeList,
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
                route_code: routeToEdit?.route_code ?? undefined,
                origin: routeToEdit?.origin ?? "",
                destination: routeToEdit?.destination ?? "",
                price_string:
                    formatter(typeof routeToEdit?.price === "number" ? routeToEdit?.price : 0) ||
                    "",
                payroll_price_string:
                    formatter(
                        typeof routeToEdit?.payroll_price === "number"
                            ? routeToEdit.payroll_price
                            : 0,
                    ) || "",
            });
        }
    }, [routeToEdit]);

    useEffect(() => {
        // reset dialog when succesfully created NEW route
        if (!routeToEdit) {
            form.reset({
                route_code: undefined,
                origin: "",
                destination: "",
                price_string: "",
                payroll_price_string: "",
            });
        }
    }, [form.formState.isSubmitSuccessful]);

    // HANDLERS
    const handlePostRoute = async (formData: Route) => {
        if (formData.route_code) {
            setSubmitResult({ error: "Ruta ya existe" });
            throw new Error("Ruta ya existe");
        }

        const result = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post Route...", { result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setRouteList([
                {
                    route_code: result.route_code,
                    origin: result.origin,
                    destination: result.destination,
                    price: parseFloat(result.price?.toString() ?? "") || 0,
                    payroll_price: parseFloat(result.payroll_price?.toString() ?? "") || 0,
                },
                ...routeList,
            ]);
            setSubmitResult({ success: result.success });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            throw result.error;
        }
    };

    const handlePutRoute = async (formData: Route) => {
        if (!formData.route_code) {
            setSubmitResult({ error: "Ruta no puede editarse" });
            throw new Error("Ruta no puede editarse");
        }

        const result = await RouteApi.putRoute(formData.route_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Put Route...", { result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setRouteList(
                routeList.map((item) =>
                    formData.route_code === item.route_code
                        ? {
                              route_code: result.route_code,
                              origin: result.origin,
                              destination: result.destination,
                              price: parseFloat(result.price?.toString() ?? "") || 0,
                              payroll_price:
                                  parseFloat(result.payroll_price?.toString() ?? "") || 0,
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
                route_code: undefined,
                origin: "",
                destination: "",
                price_string: "",
                payroll_price_string: "",
            });

            setSubmitResult(null);
            setRouteToEdit(null);
        }, 100);
    };

    const onFormSubmit = async (data: z.infer<typeof routeFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting route formData...", { data });
        }

        setButtonDisabled(true);
        const payload: Route = {
            route_code: data.route_code ?? null,
            origin: data.origin.trim(),
            destination: data.destination.trim(),
            price: parser(data.price_string),
            payroll_price: parser(data.payroll_price_string),
        };
        if (!payload.route_code) {
            handlePostRoute(payload);
        } else {
            handlePutRoute(payload);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting payload...", { payload });
            console.log("Form values: ", form.getValues());
        }

        setButtonDisabled(false);
    };

    const FormComponent = (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
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
                                <FormItem className="mt-6 md:mt-0">
                                    <FormLabel>Destino</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Destino" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="md:flex md:flex-row md:gap-6">
                        <FormField
                            control={form.control}
                            name="price_string"
                            defaultValue={form.getValues("price_string")}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Precio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="payroll_price_string"
                            defaultValue={form.getValues("payroll_price_string")}
                            render={({ field }) => (
                                <FormItem className="mt-6 md:mt-0">
                                    <FormLabel>Precio Liquidación</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Precio Liquidación" {...field} />
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
