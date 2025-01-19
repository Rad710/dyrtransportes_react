import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
import { PromiseResult } from "@/types";
import { ShipmentPayroll } from "../types";
import { DateTime } from "luxon";
import { ShipmentPayrollApi } from "../shipment_payroll_utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";

type ShipmentPayrollDialogFormProps = {
    year: number;
    setPayrollList: React.Dispatch<React.SetStateAction<ShipmentPayroll[]>>;
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
};

const shipmentPayrollFormSchema = z.object({
    payroll_code: z.number().nullish(),
    payroll_timestamp: z.date({
        required_error: "Para crear la planilla se necesita de una fecha.",
    }),
    collected: z.boolean(),
    deleted: z.boolean(),
});

export const ShipmentPayrollDialogForm = ({
    year,
    setPayrollList,
    setSelectedPayrollList,
}: ShipmentPayrollDialogFormProps) => {
    //STATE
    const startDate = DateTime.fromObject(
        {
            year: year,
            month: DateTime.now().month,
            day: DateTime.now().day,
        },
        {
            zone: "local",
        },
    );

    const form = useForm<z.infer<typeof shipmentPayrollFormSchema>>({
        resolver: zodResolver(shipmentPayrollFormSchema),
        defaultValues: {
            payroll_code: null, // Default to null instead of undefined, avoid warning message
            payroll_timestamp: startDate.toJSDate(),
            collected: false,
            deleted: false,
        },
    });

    const button = !form.getValues("payroll_code")
        ? ({
              text: "Agregar Planilla",
              description: "Seleccione una fecha para la nueva Planilla",
              variant: "indigo",
              size: "md-lg",
          } as const)
        : ({
              text: "Editar Planilla",
              description: "Seleccione una fecha para la Planilla a editar",
              variant: "cyan",
              size: "md-lg",
          } as const);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [submitResult, setSubmitResult] = useState<PromiseResult | null>(null);

    // USE EFFECTS
    useEffect(() => {
        // hide submit result when there is new error (form is changing)
        // this allows to change form description
        setSubmitResult((prev) => (Object.keys(form.formState.errors).length ? null : prev));
    }, [form.formState.errors]);

    // HANDLERS
    const handlePostShipmentPayroll = async (formData: ShipmentPayroll) => {
        if (formData.payroll_code) {
            setSubmitResult({ error: "Planilla ya existe" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting ShipmentPayroll...", { formData });
        }
        const result = await ShipmentPayrollApi.postShipmentPayroll(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post result...", { result });
        }

        setSelectedPayrollList([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const shipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
            setPayrollList(shipmentPayrollList);

            // reset dialog when succesfully created NEW route
            form.reset({
                payroll_code: null, // Default to null instead of undefined, avoid warning message
                payroll_timestamp: startDate.toJSDate(),
                collected: false,
                deleted: false,
            });
        }

        if (result?.error) {
            setSubmitResult({ error: result.error });
        }
    };

    const handlePutShipmentPayroll = async (formData: ShipmentPayroll) => {
        if (!formData.payroll_code) {
            setSubmitResult({ error: "Planilla no puede editarse" });
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT ShipmentPayroll...", { formData });
        }
        const result = await ShipmentPayrollApi.putShipmentPayroll(formData.payroll_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log("PUT result...", { result });
        }

        setSelectedPayrollList([]);

        if (result?.success) {
            setSubmitResult({ success: result.success });

            const shipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
            setPayrollList(shipmentPayrollList);
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
                payroll_code: null, // Default to null instead of undefined, avoid warning message
                payroll_timestamp: startDate.toJSDate(),
                collected: false,
                deleted: false,
            });

            setSubmitResult(null);
        }, 100);
    };

    const onFormSubmit = async (payload: z.infer<typeof shipmentPayrollFormSchema>) => {
        setButtonDisabled(true);

        const transformedPayload: ShipmentPayroll = {
            ...payload,
            payroll_timestamp: DateTime.fromJSDate(payload.payroll_timestamp).toHTTP() || "",
        };

        if (import.meta.env.VITE_DEBUG) {
            console.log("Submitting ShipmentPayroll formData...", { payload });
            console.log("Submitting ShipmentPayroll transformedFormData...", {
                transformedPayload,
            });
        }

        if (!payload.payroll_code) {
            await handlePostShipmentPayroll(transformedPayload);
        } else {
            await handlePutShipmentPayroll(transformedPayload);
        }

        setButtonDisabled(false);
    };

    console.log(year);
    const FormComponent = (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-2 mt-2 ml-2 mr-2"
                id="form-shipment-payroll"
            >
                <div className="flex ml-auto mt-2 items-center justify-center">
                    <FormField
                        control={form.control}
                        name="payroll_timestamp"
                        defaultValue={form.getValues("payroll_timestamp")}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        fromDate={startDate.toJSDate()}
                                        toDate={new Date(`${year}-12-31`)}
                                        disabled={(date) =>
                                            date < new Date("1900-01-01") ||
                                            date.getFullYear() !== year
                                        }
                                        initialFocus
                                    />
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
                className="sm:max-w-2xl p-0"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <ScrollArea className="max-h-[80vh] p-4">
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
                            form="form-shipment-payroll"
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
