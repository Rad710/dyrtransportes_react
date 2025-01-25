import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromiseResult, SelectOption } from "@/types";
import { Shipment, ShipmentAggregated } from "../types";
import { DateTime } from "luxon";
import { ShipmentApi } from "../shipment_payroll_utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getGlobalizeParser } from "@/utils/globalize";
import { Input } from "@/components/ui/input";

import Select from "react-select";
import { ProductApi, RouteApi } from "@/pages/route_product/route_product_utils";
import { DriverApi } from "@/pages/driver/driver_utils";
import { Route } from "@/pages/route_product/types";

type ShipmentDialogFormProps = {
    payrollCode: number;
    setShipmentAggegatedList: React.Dispatch<React.SetStateAction<ShipmentAggregated[]>>;
    setSelectedShipmentList: React.Dispatch<React.SetStateAction<number[]>>;
};

const parser = getGlobalizeParser();
// const formatter = getGlobalizeNumberFormatter(2, 2);

const shipmentFormSchema = z.object({
    shipment_code: z.number().nullish(),

    shipment_date: z.coerce.date({
        required_error: "El campo Fecha es obligatorio.",
    }),

    driver_code: z.coerce
        .number({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Chofer es obligatorio.",
        })
        .min(1, "El campo Chofer no puede estar vacío"),

    truck_plate: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Chapa Camión es obligatorio.",
        })
        .min(1, "El campo Chapa no puede estar vacío"),

    product_code: z.coerce
        .number({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Producto es obligatorio.",
        })
        .min(1, "El campo Producto no puede estar vacío"),

    origin: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Origen es obligatorio.",
        })
        .min(1, "El campo Origen no puede estar vacío"),

    destination: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Destino es obligatorio.",
        })
        .min(1, "El campo Destino no puede estar vacío"),

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
            if (!val) {
                return ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }
        })
        .transform((arg) => parser(arg).toFixed(2)),

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
            if (!val) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    message: "Número inválido",
                    expected: "number",
                    received: "unknown",
                });
            }
        })
        .transform((arg) => parser(arg).toFixed(2)),

    dispatch_code: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Remisión es obligatorio.",
        })
        .min(1, {
            message: "El campo remisión no puede estar vacío.",
        }),

    receipt_code: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Recepción es obligatorio.",
        })
        .min(1, {
            message: "El campo Recepción no puede estar vacío.",
        }),
    origin_weight: z.coerce
        .number({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Kg. Origen es obligatorio.",
        })
        .int("El campo Kg. Origen no puede tener números decimales.")
        .min(1, {
            message: "El campo Kg. Origen no puede estar vacío.",
        }),
    destination_weight: z.coerce
        .number({
            invalid_type_error: "Valor inválido.",
            required_error: "El campo Kg. Destino es obligatorio.",
        })
        .int("El campo Kg. Destino no puede tener números decimales.")
        .min(1, {
            message: "El campo Kg. Destino no puede estar vacío.",
        }),
    shipment_payroll_code: z.number(),
    driver_payroll_code: z.number().nullish(),
});

export const ShipmentDialogForm = ({
    payrollCode,
    setShipmentAggegatedList,
    setSelectedShipmentList,
}: ShipmentDialogFormProps) => {
    // date without timezone
    const currentDate = DateTime.fromObject(
        {
            year: DateTime.now().year,
            month: DateTime.now().month,
            day: DateTime.now().day,
        },
        {
            zone: "utc",
        },
    );

    //STATE
    const form = useForm<z.infer<typeof shipmentFormSchema>>({
        resolver: zodResolver(shipmentFormSchema),
        defaultValues: {
            shipment_code: null,
            shipment_date: currentDate.toJSDate(),
            driver_code: 0,
            truck_plate: "",
            product_code: 0,
            origin: "",
            destination: "",
            price: "0",
            payroll_price: "0",
            dispatch_code: "",
            receipt_code: "",
            origin_weight: 0,
            destination_weight: 0,
            shipment_payroll_code: payrollCode,
            driver_payroll_code: null,
        },
    });

    const button = !form.getValues("shipment_code")
        ? ({
              text: "Agregar Carga",
              description: "Completar datos de la nueva carga",
              variant: "indigo",
              size: "md-lg",
          } as const)
        : ({
              text: "Editar Planilla",
              description: "Completar datos de la carga a editar",
              variant: "cyan",
              size: "md-lg",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<PromiseResult | null>(null);

    // SELECT OPTIONS STATE
    const [productOptionList, setProductOptionList] = useState<SelectOption[]>([]);
    const [driverOptionList, setDriverOptionList] = useState<SelectOption[]>([]);
    const [truckPlateOptionList, setTruckPlateOptionList] = useState<SelectOption[]>([]);
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [originOptionList, setOriginOptionList] = useState<SelectOption[]>([]);
    const [destinationOptionList, setDestinationOptionList] = useState<SelectOption[]>([]);

    useEffect(() => {
        const loadOptions = async () => {
            const [products, drivers, routes] = await Promise.all([
                ProductApi.getProductList(),

                DriverApi.getDriverList(),

                RouteApi.getRouteList(),
            ]);

            setProductOptionList(
                products.map((item) => ({
                    value: item.product_code?.toString() ?? "",
                    label: item.product_name ?? "",
                })) as SelectOption[],
            );
            setDriverOptionList(
                drivers.map((item) => ({
                    value: item.driver_code?.toString() ?? "",
                    label: item.driver_name ?? "",
                })) as SelectOption[],
            );

            setTruckPlateOptionList(
                drivers.map((item) => ({
                    value: item.truck_plate?.toString() ?? "",
                    label: item.truck_plate ?? "",
                })) as SelectOption[],
            );

            setRouteList(routes);

            const originOptions = Array.from(
                new Map(
                    routes.map((item) => [item.origin, { label: item.origin, value: item.origin }]),
                ).values(),
            ).sort((a, b) => a.label.localeCompare(b.label));
            setOriginOptionList(originOptions as SelectOption[]);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded productOptionList ", { productOptionList });
                console.log("Loaded driverOptionList ", { driverOptionList });
            }
        };

        loadOptions();
    }, []);

    // USE EFFECTS
    useEffect(() => {
        // hide submit result when there is new error (form is changing)
        // this allows to change form description
        setSubmitResult((prev) => (Object.keys(form.formState.errors).length ? null : prev));
    }, [form.formState.errors]);

    const updateDestinationOptionList = (origin: string) => {
        const destinationOptions = Array.from(
            new Map(
                routeList
                    .filter((item) => item.origin === origin)
                    .map((item) => [
                        item.destination,
                        {
                            label: item.destination,
                            value: item.destination,
                        },
                    ]),
            ).values(),
        ).sort((a, b) => a.label.localeCompare(b.label));
        setDestinationOptionList(destinationOptions as SelectOption[]);

        form.setValue("destination", "");
    };

    // HANDLERS
    const handlePostShipment = async (formData: Shipment) => {
        if (formData.shipment_code) {
            setSubmitResult({ error: "Carga ya existe" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting Shipment...", { formData });
        }
        const result = await ShipmentApi.postShipment(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post result...", { result });
        }

        setSelectedShipmentList([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const shipments = await ShipmentApi.getShipmentAggregated(payrollCode);
            setShipmentAggegatedList(shipments);

            // reset dialog when succesfully created NEW
            form.reset({
                shipment_code: undefined,
                shipment_date: currentDate.toJSDate(),
                driver_code: 0,
                truck_plate: "",
                product_code: 0,
                origin: "",
                destination: "",
                price: "0",
                payroll_price: "0",
                dispatch_code: "",
                receipt_code: "",
                origin_weight: 0,
                destination_weight: 0,
                shipment_payroll_code: payrollCode,
                driver_payroll_code: undefined,
            });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
        }
    };

    const handlePutShipment = async (formData: Shipment) => {
        if (!formData.shipment_code) {
            setSubmitResult({ error: "Carga no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT Shipment...", { formData });
        }
        const result = await ShipmentApi.putShipment(formData.shipment_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT result...", { result });
        }

        setSelectedShipmentList([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const shipments = await ShipmentApi.getShipmentAggregated(payrollCode);
            setShipmentAggegatedList(shipments);
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
                shipment_code: undefined,
                shipment_date: currentDate.toJSDate(),
                driver_code: 0,
                truck_plate: "",
                product_code: 0,
                origin: "",
                destination: "",
                price: "0",
                payroll_price: "0",
                dispatch_code: "",
                receipt_code: "",
                origin_weight: 0,
                destination_weight: 0,
                shipment_payroll_code: payrollCode,
                driver_payroll_code: undefined,
            });

            setSubmitResult(null);
        }, 100);
    };

    const onFormSubmit = async (payload: z.infer<typeof shipmentFormSchema>) => {
        setButtonDisabled(true);

        const transformedPayload: Shipment = {
            shipment_code: payload.shipment_code,
            shipment_date: DateTime.fromJSDate(payload.shipment_date).toHTTP() || "",
            driver_code: payload.driver_code,
            truck_plate: payload.truck_plate,
            product_code: payload.product_code,
            route_code:
                routeList.find(
                    (item) =>
                        item.origin === payload.origin && item.destination === payload.destination,
                )?.route_code ?? 0,
            price: payload.price,
            payroll_price: payload.payroll_price,
            dispatch_code: payload.dispatch_code,
            receipt_code: payload.receipt_code,
            origin_weight: payload.origin_weight.toString(),
            destination_weight: payload.destination_weight.toString(),
            shipment_payroll_code: payload.shipment_payroll_code,
            driver_payroll_code: payload.driver_payroll_code,
            deleted: false,
        };

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting Shipment formData...", { payload });
            console.log("Submitting Shipment transformedFormData...", {
                transformedPayload,
            });
        }

        if (!payload.shipment_code) {
            await handlePostShipment(transformedPayload);
        } else {
            await handlePutShipment(transformedPayload);
        }

        setButtonDisabled(false);
    };

    const FormComponent = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-2 mt-2 ml-2 mr-2"
                id="form-shipment"
            >
                <div className="md:flex md:flex-row md:gap-6 justify-evenly">
                    <FormField
                        control={form.control}
                        name="shipment_date"
                        defaultValue={form.getValues("shipment_date")}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        {...field}
                                        value={
                                            field.value instanceof Date
                                                ? field.value.toISOString().split("T")[0]
                                                : field.value
                                        }
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="driver_code"
                        defaultValue={form.getValues("driver_code")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Chofer</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        isSearchable={true}
                                        tabSelectsValue={false}
                                        onChange={(value) => {
                                            const selection =
                                                value as unknown as SelectOption | null;
                                            form.setValue(
                                                "driver_code",
                                                parseInt(selection?.value ?? "") || 0,
                                            );
                                        }}
                                        name="driver_code"
                                        options={driverOptionList}
                                        noOptionsMessage={() => "Sin resultados"}
                                        placeholder="Chofer"
                                        maxMenuHeight={200}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="truck_plate"
                        defaultValue={form.getValues("truck_plate")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Chapa</FormLabel>
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        isSearchable={true}
                                        tabSelectsValue={false}
                                        onChange={(value) => {
                                            const selection =
                                                value as unknown as SelectOption | null;
                                            form.setValue("truck_plate", selection?.value ?? "");

                                            console.log(form.getValues());
                                        }}
                                        name="truck_plate"
                                        options={truckPlateOptionList}
                                        noOptionsMessage={() => "Sin resultados"}
                                        placeholder="Chapa"
                                        maxMenuHeight={200}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:flex md:flex-row md:gap-6 justify-evenly">
                    <FormField
                        control={form.control}
                        name="product_code"
                        defaultValue={form.getValues("product_code")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Producto</FormLabel>

                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        isSearchable={true}
                                        tabSelectsValue={false}
                                        onChange={(value) => {
                                            const selection =
                                                value as unknown as SelectOption | null;
                                            form.setValue(
                                                "product_code",
                                                parseInt(selection?.value ?? "") || 0,
                                            );

                                            console.log(form.getValues());
                                        }}
                                        name="product_code"
                                        options={productOptionList}
                                        noOptionsMessage={() => "Sin resultados"}
                                        placeholder="Producto"
                                        maxMenuHeight={200}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="origin"
                        defaultValue={form.getValues("origin")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full overflow-visible">
                                <FormLabel>Origen</FormLabel>

                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        isSearchable={true}
                                        tabSelectsValue={false}
                                        onChange={(value) => {
                                            const selection =
                                                value as unknown as SelectOption | null;
                                            form.setValue("origin", selection?.value ?? "");

                                            updateDestinationOptionList(selection?.value ?? "");
                                        }}
                                        name="origin"
                                        options={originOptionList}
                                        noOptionsMessage={() => "Sin resultados"}
                                        placeholder="Origen"
                                        maxMenuHeight={200}
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
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Destino</FormLabel>

                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        isSearchable={true}
                                        tabSelectsValue={false}
                                        onChange={(value) => {
                                            const selection =
                                                value as unknown as SelectOption | null;
                                            form.setValue("destination", selection?.value ?? "");
                                        }}
                                        name="destination"
                                        options={destinationOptionList}
                                        noOptionsMessage={() => "Sin resultados"}
                                        placeholder="Destino"
                                        maxMenuHeight={200}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:flex md:flex-row md:gap-6 justify-evenly">
                    <FormField
                        control={form.control}
                        name="dispatch_code"
                        defaultValue={form.getValues("dispatch_code")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Remisión</FormLabel>
                                <FormControl>
                                    <Input placeholder="Remisión" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="receipt_code"
                        defaultValue={form.getValues("receipt_code")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Recepción</FormLabel>
                                <FormControl>
                                    <Input placeholder="Recepción" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                </div>

                <div className="md:flex md:flex-row md:gap-6 justify-evenly">
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
                    <FormField
                        control={form.control}
                        name="origin_weight"
                        defaultValue={form.getValues("origin_weight")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Kg. Origen</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kg. Origen" {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="destination_weight"
                        defaultValue={form.getValues("destination_weight")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0 w-full">
                                <FormLabel>Kg. Destino</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kg. Destino" {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
            <DialogTrigger asChild>
                <Button id="dialog-form-shipment-payroll-trigger" variant="indigo" size="md-lg">
                    Agregar Planilla
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-4xl p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <ScrollArea className="max-h-[80vh] p-4" type="scroll">
                    <DialogHeader className="ml-2 mr-2 gap-y-4">
                        <DialogTitle>{button.text} </DialogTitle>
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

                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="ghost">Cerrar</Button>
                        </DialogClose>
                        <Button
                            variant={button.variant}
                            type="submit"
                            form="form-shipment"
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
