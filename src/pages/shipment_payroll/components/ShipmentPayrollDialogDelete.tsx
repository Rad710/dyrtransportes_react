import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { ShipmentPayroll } from "../types";
import { ShipmentPayrollApi } from "../shipment_payroll_utils";
import { DateTime } from "luxon";

type ShipmentPayrollDialogDeleteProps = {
    year: number;
    setPayrollList: React.Dispatch<React.SetStateAction<ShipmentPayroll[]>>;
    selectedPayrollList: number[];
    setSelectedPayrollList: React.Dispatch<React.SetStateAction<number[]>>;
    payrollToDelete?: ShipmentPayroll | null;
    setPayrollToDelete: React.Dispatch<React.SetStateAction<ShipmentPayroll | null>>;
};

export const ShipmentPayrollDialogDelete = ({
    year,
    setPayrollList,
    selectedPayrollList,
    setSelectedPayrollList,
    payrollToDelete,
    setPayrollToDelete,
}: ShipmentPayrollDialogDeleteProps) => {
    // STATE
    const [open, setOpen] = useState<boolean>(false);

    // USE EFFECT
    useEffect(() => {
        setOpen(!!payrollToDelete);
    }, [payrollToDelete]);

    // HANDLERS
    const handleDeleteShipmentPayrollItem = async () => {
        if (!payrollToDelete?.payroll_code) {
            return;
        }

        const result = await ShipmentPayrollApi.deleteShipmentPayroll(payrollToDelete.payroll_code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log("Deleting... ", payrollToDelete.payroll_code);
        }

        if (result?.success) {
            const newShipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
            setPayrollList(newShipmentPayrollList);
        }
    };

    const handleDeleteShipmentPayrollList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedPayrollList });
        }

        const result = await ShipmentPayrollApi.deleteShipmentPayrollList(selectedPayrollList);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ selectedPayrollList });
        }

        setSelectedPayrollList([]);

        if (result?.success) {
            const newShipmentPayrollList = await ShipmentPayrollApi.getShipmentPayrollList(year);
            setPayrollList(newShipmentPayrollList);
        }
    };

    const handleOnOpenChange = (open: boolean) => {
        setOpen(open);

        // timeout solves issue of dialog changing text/color when closing
        setTimeout(() => {
            setPayrollToDelete(null);
        }, 100);
    };

    return (
        <AlertDialogConfirm
            size="md-lg"
            variant="destructive"
            disabled={payrollToDelete ? false : selectedPayrollList.length === 0}
            open={open}
            onOpenChange={handleOnOpenChange}
            buttonContent={
                <>
                    <Trash2Icon className="w-6 h-6" />
                    Eliminar
                </>
            }
            onClickFunctionPromise={
                payrollToDelete ? handleDeleteShipmentPayrollItem : handleDeleteShipmentPayrollList
            }
        >
            <span className="md:text-lg">
                Esta acción es irreversible. Se{" "}
                <strong className="font-bold text-gray-700">eliminará permanentemente:</strong>
                <br />
                <strong className="font-bold text-gray-700">
                    {payrollToDelete?.payroll_timestamp
                        ? DateTime.fromHTTP(payrollToDelete.payroll_timestamp, {
                              zone: "local",
                          })
                              .setLocale("es")
                              .toLocaleString({
                                  month: "long",
                                  day: "numeric",
                              })
                        : "Todas las Planillas seleccionadas"}
                </strong>
            </span>
        </AlertDialogConfirm>
    );
};
