"use client";
"use strict";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Driver } from "../types";
import { DriverApi } from "../driver_utils";
import { toastSuccess } from "@/utils/notification";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

type DriverDialogDeleteProps = {
    setDriverList: React.Dispatch<React.SetStateAction<Driver[]>>;
    selectedDriverRows: number[];
    setSelectedDriverRows: React.Dispatch<React.SetStateAction<number[]>>;
    driverToDelete?: Driver | null;
    setDriverToDelete: React.Dispatch<React.SetStateAction<Driver | null>>;
};

export const DriverDialogDelete = ({
    setDriverList,
    selectedDriverRows,
    setSelectedDriverRows,
    driverToDelete,
    setDriverToDelete,
}: DriverDialogDeleteProps) => {
    // STATE
    const [open, setOpen] = useState<boolean>(false);

    // USE EFFECT
    useEffect(() => {
        setOpen(!!driverToDelete);
    }, [driverToDelete]);

    // HANDLERS
    const handleDeleteDriverItem = async () => {
        if (!driverToDelete?.driver_code) {
            return;
        }

        const result = await DriverApi.deleteDriver(driverToDelete.driver_code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log("Deleting... ", driverToDelete.driver_code);
        }

        if (result?.success) {
            toastSuccess(result.success);

            const newDriverList = await DriverApi.getDriverList();
            setDriverList(newDriverList);
        }
    };

    const handleDeleteDriverList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedDriverRows });
        }

        const result = await DriverApi.deleteDriverList(selectedDriverRows);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ selectedDriverRows });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setSelectedDriverRows([]);

            const newDriverList = await DriverApi.getDriverList();
            setDriverList(newDriverList);
        }
    };

    const handleOnOpenChange = (open: boolean) => {
        setOpen(open);

        // timeout solves issue of dialog changing text/color when closing
        setTimeout(() => {
            setDriverToDelete(null);
        }, 100);
    };

    return (
        <AlertDialogConfirm
            size="md-lg"
            variant="destructive"
            disabled={driverToDelete ? false : selectedDriverRows.length === 0}
            open={open}
            onOpenChange={handleOnOpenChange}
            buttonContent={
                <>
                    <Trash2Icon className="w-6 h-6" />
                    Eliminar
                </>
            }
            onClickFunctionPromise={
                driverToDelete ? handleDeleteDriverItem : handleDeleteDriverList
            }
        >
            <span className="md:text-lg">
                Se <strong className="font-bold text-gray-700">deshabilitará:</strong>
                <br />
                <strong className="font-bold text-gray-700">
                    {driverToDelete?.driver_code ? (
                        <>
                            {driverToDelete?.driver_name ??
                                "" + " " + driverToDelete?.driver_surname ??
                                ""}
                            {" - "}
                            {driverToDelete?.truck_plate ??
                                "" + " " + driverToDelete?.trailer_plate ??
                                ""}
                        </>
                    ) : (
                        "Todos los Choferes seleccionadas"
                    )}
                </strong>
            </span>
        </AlertDialogConfirm>
    );
};
