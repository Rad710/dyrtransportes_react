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
import { UseFormReturn } from "react-hook-form";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { useState } from "react";
import { Driver } from "../types";

type DriverFormSchema = {
    driverCode?: number;
    driverId: string;
    driverName: string;
    driverSurname: string;
    truckPlate: string;
    trailerPlate: string;
    successMessage?: string;
    errorMessage?: string;
};

export const driverFormSchema = z.object({
    driverCode: z.number().optional(),

    driverId: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo C.I. requerido",
        })
        .min(1, {
            message: "Campo C.I. no puede estar vacío.",
        }),

    driverName: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Nombre requerido.",
        })
        .min(1, {
            message: "Campo Nombre no puede estar vacío.",
        }),

    driverSurname: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Apellido requerido.",
        })
        .min(1, {
            message: "Campo Apellido no puede estar vacío.",
        }),

    truckPlate: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Chapa de Camión requerido.",
        })
        .min(1, {
            message: "Campo Chapa de Camión no puede estar vacío.",
        }),

    trailerPlate: z
        .string({
            invalid_type_error: "Valor inválido.",
            required_error: "Campo Chapa de Carreta requerido.",
        })
        .min(1, {
            message: "Campo Chapa de Carreta no puede estar vacío.",
        }),

    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
});

type FormDriverProps = {
    form: UseFormReturn<DriverFormSchema, any, undefined>;
    handleSubmit: (formData: Driver) => Promise<void>;
};

export const DriverDialogForm = ({ form, handleSubmit }: FormDriverProps) => {
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const button = !form.getValues("driverCode")
        ? ({
              text: "Agregar Chofer",
              description: "Completar datos del nuevo Chofer",
              variant: "indigo",
          } as const)
        : ({
              text: "Editar Chofer",
              description: "Completar datos del Chofer a editar",
              variant: "cyan",
          } as const);

    const onSubmit = async (data: z.infer<typeof driverFormSchema>) => {
        setButtonDisabled(true);
        await handleSubmit({
            driver_code: data.driverCode ?? null,
            driver_id: data.driverId.trim(),
            driver_name: data.driverName.trim(),
            driver_surname: data.driverSurname.trim(),
            truck_plate: data.truckPlate.trim(),
            trailer_plate: data.trailerPlate.trim(),
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
                    id="dialog-form-driver-trigger"
                    variant={button.variant}
                    size="md-lg"
                >
                    {button.text}
                </Button>
            </DialogTrigger>
            <DialogContent
                id="dialog-form-driver-content"
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
                            id="form-driver"
                        >
                            <div className="md:flex md:flex-row md:gap-6">
                                <FormField
                                    control={form.control}
                                    name="driverId"
                                    defaultValue={form.getValues("driverId")}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>C.I.</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="C.I."
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
                                    name="driverName"
                                    defaultValue={form.getValues("driverName")}
                                    render={({ field }) => (
                                        <FormItem className="mt-6 md:mt-0">
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nombre"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="driverSurname"
                                    defaultValue={form.getValues(
                                        "driverSurname"
                                    )}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Apellido</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Apellido"
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
                                    name="truckPlate"
                                    defaultValue={form.getValues("truckPlate")}
                                    render={({ field }) => (
                                        <FormItem className="mt-6 md:mt-0">
                                            <FormLabel>
                                                Chapa de Camión
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Chapa de Camión"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="trailerPlate"
                                    defaultValue={form.getValues(
                                        "trailerPlate"
                                    )}
                                    render={({ field }) => (
                                        <FormItem className="mt-6 md:mt-0">
                                            <FormLabel>
                                                Chapa de Carreta
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Chapa de Carreta"
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
                            form="form-driver"
                            disabled={buttonDisabled}
                            onClick={() => {
                                if (
                                    !driverFormSchema.safeParse(
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
