"use client";
"use strict";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Route } from "../types";
import { RouteApi } from "../route_utils";
import { toastSuccess } from "@/utils/notification";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

type RouteDialogDeleteProps = {
    setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
    selectedRouteRows: number[];
    setSelectedRouteRows: React.Dispatch<React.SetStateAction<number[]>>;
    routeToDelete?: Route | null;
    setRouteToDelete: React.Dispatch<React.SetStateAction<Route | null>>;
};

export const RouteDialogDelete = ({
    setRouteList,
    selectedRouteRows,
    setSelectedRouteRows,
    routeToDelete,
    setRouteToDelete,
}: RouteDialogDeleteProps) => {
    // STATE
    const [open, setOpen] = useState<boolean>(false);

    // USE EFFECT
    useEffect(() => {
        setOpen(!!routeToDelete);
    }, [routeToDelete]);

    // HANDLERS
    const handleDeleteRouteItem = async () => {
        if (!routeToDelete?.route_code) {
            return;
        }

        const result = await RouteApi.deleteRoute(routeToDelete.route_code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log("Deleting... ", routeToDelete.route_code);
        }

        if (result?.success) {
            toastSuccess(result.success);

            const newRouteList = await RouteApi.getRouteList();
            setRouteList(newRouteList);
        }
        setSelectedRouteRows([]);
    };

    const handleDeleteRouteList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedRouteRows });
        }

        const result = await RouteApi.deleteRouteList(selectedRouteRows);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ selectedRouteRows });
        }

        if (result?.success) {
            toastSuccess(result.success);

            const newRouteList = await RouteApi.getRouteList();
            setRouteList(newRouteList);
        }
        setSelectedRouteRows([]);
    };

    const handleOnOpenChange = (open: boolean) => {
        setOpen(open);

        // timeout solves issue of dialog changing text/color when closing
        setTimeout(() => {
            setRouteToDelete(null);
        }, 100);
    };

    return (
        <AlertDialogConfirm
            size="md-lg"
            variant="destructive"
            disabled={routeToDelete ? false : selectedRouteRows.length === 0}
            open={open}
            onOpenChange={handleOnOpenChange}
            buttonContent={
                <>
                    <Trash2Icon className="w-6 h-6" />
                    Eliminar
                </>
            }
            onClickFunctionPromise={routeToDelete ? handleDeleteRouteItem : handleDeleteRouteList}
        >
            <span className="md:text-lg">
                Esta acción es irreversible. Se{" "}
                <strong className="font-bold text-gray-700">eliminará permanentemente:</strong>
                <br />
                <strong className="font-bold text-gray-700">
                    {routeToDelete?.route_code ? (
                        <>
                            {routeToDelete?.origin}
                            {" - "}
                            {routeToDelete?.destination}
                        </>
                    ) : (
                        "Todas las Rutas seleccionadas"
                    )}
                </strong>
            </span>
        </AlertDialogConfirm>
    );
};
