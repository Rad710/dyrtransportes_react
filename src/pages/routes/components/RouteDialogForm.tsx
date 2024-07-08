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
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Route } from "@/pages/routes/types";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastSuccess } from "@/utils/notification";
import { RouteApi } from "../route_utils";
import { useForm } from "react-hook-form";

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
});

type FormRouteProps = {
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
}: FormRouteProps) => {
    const form = useForm<z.infer<typeof routeFormSchema>>({
        resolver: zodResolver(routeFormSchema),
    });

    const [submitResultMessage, setSubmitResultMessage] = useState("");

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const button = !form.getValues("routeCode")
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

    useEffect(() => {
        if (routeToEdit) {
            form.reset({
                routeCode: routeToEdit?.route_code ?? undefined,
                origin: routeToEdit?.origin ?? "",
                destination: routeToEdit?.destination ?? "",
                priceString:
                    formatter(
                        typeof routeToEdit?.price === "number"
                            ? routeToEdit?.price
                            : 0
                    ) || "",
                payrollPriceString:
                    formatter(
                        typeof routeToEdit?.payroll_price === "number"
                            ? routeToEdit.payroll_price
                            : 0
                    ) || "",
            });
        }
    }, [routeToEdit]);

    useEffect(() => {
        if (!routeToEdit) {
            form.reset({
                routeCode: undefined,
                origin: "",
                destination: "",
                priceString: "",
                payrollPriceString: "",
            });
        }
    }, [form.formState.isSubmitSuccessful, routeToEdit]);

    const handlePostRoute = async (formData: Route) => {
        if (formData.route_code) {
            setSubmitResultMessage("Ruta ya existe");
            throw new Error("Ruta ya existe");
        }

        const result = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setRouteList([
                {
                    route_code: result.route_code,
                    origin: result.origin,
                    destination: result.destination,
                    price: parseFloat(result.price?.toString() ?? "") || 0,
                    payroll_price:
                        parseFloat(result.payroll_price?.toString() ?? "") || 0,
                },
                ...routeList,
            ]);
            setSubmitResultMessage(result.success);
        }

        if (result?.error) {
            setSubmitResultMessage(result.error);
            throw result.error;
        }
    };

    const handlePutRoute = async (formData: Route) => {
        if (!formData.route_code) {
            setSubmitResultMessage("Ruta no puede editarse");
            throw new Error("Ruta no puede editarse");
        }

        const result = await RouteApi.putRoute(formData.route_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
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
                              price:
                                  parseFloat(result.price?.toString() ?? "") ||
                                  0,
                              payroll_price:
                                  parseFloat(
                                      result.payroll_price?.toString() ?? ""
                                  ) || 0,
                          }
                        : item
                )
            );
            setSubmitResultMessage(result.success);
        }

        if (result?.error) {
            setSubmitResultMessage(result.error);
            throw result.error;
        }
    };

    const onSubmit = async (data: z.infer<typeof routeFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting...", { data });
        }

        setButtonDisabled(true);

        const payload: Route = {
            route_code: data.routeCode ?? null,
            origin: data.origin.trim(),
            destination: data.destination.trim(),
            price: parser(data.priceString),
            payroll_price: parser(data.payrollPriceString),
        };
        if (!payload.route_code) {
            handlePostRoute(payload);
        } else {
            handlePutRoute(payload);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log({ payload });
            console.log("Form values: ", form.getValues());
        }

        setButtonDisabled(false);
    };

    const onFormClose = (open: boolean) => {
        console.log(open);
        if (open) {
            return;
        }
        form.clearErrors();
        setSubmitResultMessage("");
        setRouteToEdit(null);
    };

    return (
        <Dialog
            onOpenChange={onFormClose}
            open={routeToEdit ? true : undefined}
        >
            <DialogTrigger asChild>
                <Button variant={button.variant} size={button.size}>
                    {button.text}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl p-0">
                <ScrollArea className="max-h-[80vh] p-4">
                    <DialogHeader className="ml-2 mr-2 gap-y-4">
                        <DialogTitle>{button.text}</DialogTitle>
                        <DialogDescription>
                            {submitResultMessage ? (
                                <span
                                    className={
                                        submitResultMessage.includes("exito")
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {submitResultMessage}
                                </span>
                            ) : (
                                <span>{button.description}</span>
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
