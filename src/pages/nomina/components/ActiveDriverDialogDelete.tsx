"use client";
"use strict";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Driver } from "../types";
import { DriverApi } from "../driver_utils";
import { toastSuccess } from "@/utils/notification";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

type ActiveDriverDialogDelete = {
    setActiveDriverList: React.Dispatch<React.SetStateAction<Driver[]>>;
    selectedActiveDriverRows: number[];
    setSelectedActiveDriverRows: React.Dispatch<React.SetStateAction<number[]>>;
    activeDriverToDelete?: Driver | null;
    setActiveDriverToDelete: React.Dispatch<React.SetStateAction<Driver | null>>;
};

export const ActiveDriverDialogDelete = ({
    setActiveDriverList,
    selectedActiveDriverRows,
    setSelectedActiveDriverRows,
    activeDriverToDelete,
    setActiveDriverToDelete,
    
}: ActiveDriverDialogDelete) => {
    // STATE
    const [open, setOpen] = useState<boolean>(false);

    // USE EFFECT
    useEffect(() => {
        setOpen(!!activeDriverToDelete);
    }, [activeDriverToDelete]);

    // HANDLERS
    const handleDeleteDriverItem = async () => {
        if (!activeDriverToDelete?.driver_code) {
            return;
        }

        const result = await DriverApi.deleteDriver(activeDriverToDelete.driver_code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log("Deleting... ", activeDriverToDelete.driver_code);
        }

        if (result?.success) {
            toastSuccess(result.success);

            const newDriverList = await DriverApi.getDriverList();
            const filteredDrivers = newDriverList.filter((item) => !item.deleted);
            setActiveDriverList(filteredDrivers);
        }

        setSelectedActiveDriverRows([]);
    };

    const handleDeleteDriverList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedActiveDriverRows });
        }

        const result = await DriverApi.deleteDriverList(selectedActiveDriverRows);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ selectedActiveDriverRows });
        }

        if (result?.success) {
            toastSuccess(result.success);

            const newDriverList = await DriverApi.getDriverList();
            const filteredDrivers = newDriverList.filter((item) => !item.deleted);
            setActiveDriverList(filteredDrivers);
        }

        setSelectedActiveDriverRows([]);
    };

    const handleOnOpenChange = (open: boolean) => {
        setOpen(open);

        // timeout solves issue of dialog changing text/color when closing
        setTimeout(() => {
            setActiveDriverToDelete(null);
        }, 100);
    };

    return (
        <AlertDialogConfirm
            size="md-lg"
            variant="destructive"
            disabled={activeDriverToDelete ? false : selectedActiveDriverRows.length === 0}
            open={open}
            onOpenChange={handleOnOpenChange}
            buttonContent={
                <>
                    <Trash2Icon className="w-6 h-6" />
                    Eliminar
                </>
            }
            onClickFunctionPromise={
                activeDriverToDelete ? handleDeleteDriverItem : handleDeleteDriverList
            }
        >
            <span className="md:text-lg">
                Se <strong className="font-bold text-gray-700">deshabilitará:</strong>
                <br />
                <strong className="font-bold text-gray-700">
                    {activeDriverToDelete?.driver_code ? (
                        <>
                            {activeDriverToDelete?.driver_name ??
                                "" + " " + activeDriverToDelete?.driver_surname ??
                                ""}
                            {" - "}
                            {activeDriverToDelete?.truck_plate ??
                                "" + " " + activeDriverToDelete?.trailer_plate ??
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
