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
import { useForm } from "react-hook-form";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { useEffect, useState } from "react";
import { Driver } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitResult } from "@/types";
import { DriverApi } from "../driver_utils";
import { toastSuccess } from "@/utils/notification";

const driverFormSchema = z.object({
    driver_code: z.number().nullish(),

    driver_id: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo C.I. requerido",
        })
        .min(1, {
            message: "Campo C.I. no puede estar vacío.",
        }),

    driver_name: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Nombre requerido.",
        })
        .min(1, {
            message: "Campo Nombre no puede estar vacío.",
        }),

    driver_surname: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Apellido requerido.",
        })
        .min(1, {
            message: "Campo Apellido no puede estar vacío.",
        }),

    truck_plate: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Chapa de Camión requerido.",
        })
        .min(1, {
            message: "Campo Chapa de Camión no puede estar vacío.",
        }),

    trailer_plate: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Chapa de Carreta requerido.",
        })
        .min(1, {
            message: "Campo Chapa de Carreta no puede estar vacío.",
        }),
});

type FormDriverProps = {
    setActiveDriverList: React.Dispatch<React.SetStateAction<Driver[]>>;
    activeDriverToEdit: Driver | null;
    setActiveDriverToEdit: React.Dispatch<React.SetStateAction<Driver | null>>;
    setSelectedActiveDriverRows: React.Dispatch<React.SetStateAction<number[]>>;
};

export const DriverDialogForm = ({
    setActiveDriverList,
    activeDriverToEdit,
    setActiveDriverToEdit,
    setSelectedActiveDriverRows,
}: FormDriverProps) => {
    //STATE
    const form = useForm<z.infer<typeof driverFormSchema>>({
        resolver: zodResolver(driverFormSchema),
    });

    const button = !form.getValues("driver_code")
        ? ({
              text: "Agregar Chofer",
              description: "Completar datos del nuevo Chofer",
              variant: "indigo",
              size: "md-lg",
          } as const)
        : ({
              text: "Editar Chofer",
              description: "Completar datos del Chofer a editar",
              variant: "cyan",
              size: "md-lg",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

    // USE EFFECTS
    useEffect(() => {
        // show dialog when clicking editar action button
        if (activeDriverToEdit) {
            setIsOpen(true);

            form.reset({
                driver_code: activeDriverToEdit?.driver_code ?? null,
                driver_id: activeDriverToEdit?.driver_id ?? "",
                driver_name: activeDriverToEdit?.driver_name ?? "",
                driver_surname: activeDriverToEdit?.driver_surname ?? "",
                truck_plate: activeDriverToEdit?.truck_plate ?? "",
                trailer_plate: activeDriverToEdit?.trailer_plate ?? "",
            });
        }
    }, [activeDriverToEdit]);

    useEffect(() => {
        // hide submit result when there is new error (form is changing)
        // this allows to change form description
        setSubmitResult((prev) => (Object.keys(form.formState.errors).length ? null : prev));
    }, [form.formState.errors]);

    // HANDLERS
    const handlePostDriver = async (formData: Driver) => {
        if (formData.driver_code) {
            setSubmitResult({ error: "Chofer ya existe" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting driver...", { formData });
        }
        const result = await DriverApi.postDriver(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post result...", { result });
        }

        if (result?.success) {
            setSubmitResult({ success: result.success });
            toastSuccess(result.success);

            const newDriverList = await DriverApi.getDriverList();
            const filteredDrivers = newDriverList.filter((item) => !item.deleted);
            setActiveDriverList(filteredDrivers);

            // reset dialog when succesfully created NEW route
            form.reset({
                driver_code: undefined,
                driver_id: "",
                driver_name: "",
                driver_surname: "",
                truck_plate: "",
                trailer_plate: "",
            });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            throw result.error;
        }

        setSelectedActiveDriverRows([]);
    };

    const handlePutDriver = async (formData: Driver) => {
        if (!formData.driver_code) {
            setSubmitResult({ error: "Chofer no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT driver...", { formData });
        }
        const result = await DriverApi.putDriver(formData.driver_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT result...", { result });
        }

        if (result?.success) {
            setSubmitResult({ success: result.success });
            toastSuccess(result.success);

            const newDriverList = await DriverApi.getDriverList();
            const filteredDrivers = newDriverList.filter((item) => !item.deleted);
            setActiveDriverList(filteredDrivers);
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
            return;
        }

        setSelectedActiveDriverRows([]);
    };

    const handleOnOpenChange = (open: boolean) => {
        setIsOpen(open);

        // timeout solves issue of form changing text/color when closing
        setTimeout(() => {
            form.clearErrors();
            form.reset({
                driver_code: undefined,
                driver_id: "",
                driver_name: "",
                driver_surname: "",
                truck_plate: "",
                trailer_plate: "",
            });

            setSubmitResult(null);
            setActiveDriverToEdit(null);
        }, 100);
    };

    const onFormSubmit = async (payload: z.infer<typeof driverFormSchema>) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting product formData...", { payload });
        }

        setButtonDisabled(true);
        if (!payload.driver_code) {
            await handlePostDriver(payload);
        } else {
            await handlePutDriver(payload);
        }

        setButtonDisabled(false);
    };

    const FormComponent = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-2 mt-2 ml-2 mr-2"
                id="form-driver"
            >
                <div className="md:flex md:flex-row md:gap-6">
                    <FormField
                        control={form.control}
                        name="driver_id"
                        defaultValue={form.getValues("driver_id")}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>C.I.</FormLabel>
                                <FormControl>
                                    <Input placeholder="C.I." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:flex md:flex-row md:gap-6">
                    <FormField
                        control={form.control}
                        name="driver_name"
                        defaultValue={form.getValues("driver_name")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0">
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="driver_surname"
                        defaultValue={form.getValues("driver_surname")}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input placeholder="Apellido" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="md:flex md:flex-row md:gap-6">
                    <FormField
                        control={form.control}
                        name="truck_plate"
                        defaultValue={form.getValues("truck_plate")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0">
                                <FormLabel>Chapa de Camión</FormLabel>
                                <FormControl>
                                    <Input placeholder="Chapa de Camión" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="trailer_plate"
                        defaultValue={form.getValues("trailer_plate")}
                        render={({ field }) => (
                            <FormItem className="mt-2 md:mt-0">
                                <FormLabel>Chapa de Carreta</FormLabel>
                                <FormControl>
                                    <Input placeholder="Chapa de Carreta" {...field} />
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
                <Button id="dialog-form-driver-trigger" variant="indigo" size="md-lg">
                    Agregar Chofer
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
                            form="form-driver"
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
