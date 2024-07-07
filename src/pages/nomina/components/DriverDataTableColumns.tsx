import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Driver } from "../types";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";

import Globalize from "globalize";
import cldrDataES from "cldr-data/main/es/numbers.json";
import cldrDataEN from "cldr-data/main/en/numbers.json";
import cldrDataSupplementSubTags from "cldr-data/supplemental/likelySubtags.json";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);
Globalize.locale("es");

const formatter = Globalize.numberFormatter({
    maximumFractionDigits: 0,
});

export const driverFilterColumnList = [
    "C.I.",
    "Nombre",
    "Chapa Camón",
    "Chapa Carreta",
] as const;

export const driverDataTableColumns = (
    handleDeleteItemAction: (code?: number | null) => Promise<void>,
    handleEditItemAction: (driver: Driver) => void,
    handleReactivateItemAction: (driver?: number | null) => void
): ColumnDef<Driver>[] => {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "C.I.",
            accessorFn: (row) => row.driver_id,
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">C.I.</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const driverIdString = formatter(
                    parseInt(row.getValue("C.I.")) || 0
                );

                return (
                    <div className="text-right font-medium md:text-base">
                        {driverIdString === "0"
                            ? row.getValue("C.I.")
                            : driverIdString}
                    </div>
                );
            },
        },
        {
            id: "Nombre",
            accessorFn: (row) =>
                `${row.driver_name ?? ""} ${row.driver_surname ?? ""}`,
            header: ({ column }) => {
                return (
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">Nombre</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">
                    {row.getValue("Nombre")}
                </div>
            ),
        },
        {
            id: "Chapa Camión",
            accessorFn: (row) => row.truck_plate,
            header: ({ column }) => {
                return (
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">Chapa Camión</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-left md:text-base">
                    {row.getValue("Chapa Camión")}
                </div>
            ),
        },
        {
            id: "Chapa Carreta",
            accessorFn: (row) => row.trailer_plate,
            header: ({ column }) => {
                return (
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">Chapa Carreta</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-left md:text-base">
                    {row.getValue("Chapa Carreta") ?? "Sin datos"}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir acciones</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            {!row.original.deleted ? (
                                <AlertDialogConfirm
                                    buttonClassName="w-full"
                                    buttonContent={
                                        <span className="text-red-500">
                                            Eliminar
                                        </span>
                                    }
                                    onClickFunctionPromise={async () =>
                                        handleDeleteItemAction(
                                            row.original.driver_code
                                        )
                                    }
                                    variant="ghost"
                                    size="sm"
                                >
                                    <span className="md:text-lg">
                                        Se{" "}
                                        <strong className="font-bold text-gray-700">
                                            desactivará:
                                        </strong>
                                        <br />
                                        <strong className="font-bold text-gray-700">
                                            {`(${row.original.driver_id ?? ""}) 
                                    ${row.original.driver_name ?? ""} ${
                                                row.original.driver_surname ??
                                                ""
                                            }`}
                                        </strong>
                                    </span>
                                </AlertDialogConfirm>
                            ) : (
                                ""
                            )}

                            {row.original.deleted ? (
                                <AlertDialogConfirm
                                    buttonClassName="w-full"
                                    buttonContent={
                                        <span className="text-green-500">
                                            Activar
                                        </span>
                                    }
                                    onClickFunctionPromise={async () =>
                                        handleReactivateItemAction(
                                            row.original.driver_code
                                        )
                                    }
                                    variant="ghost"
                                    size="sm"
                                >
                                    <span className="md:text-lg">
                                        Se{" "}
                                        <strong className="font-bold text-gray-700">
                                            habilitará:
                                        </strong>
                                        <br />
                                        <strong className="font-bold text-gray-700">
                                            {`(${row.original.driver_id ?? ""}) 
                                ${row.original.driver_name ?? ""} ${
                                                row.original.driver_surname ??
                                                ""
                                            }`}
                                        </strong>
                                    </span>
                                </AlertDialogConfirm>
                            ) : (
                                ""
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {!row.original.deleted ? (
                            <DropdownMenuItem
                                onClick={(e) => e.preventDefault()}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                        handleEditItemAction(row.original)
                                    }
                                >
                                    <span className="text-indigo-500">
                                        Editar
                                    </span>
                                </Button>
                            </DropdownMenuItem>
                        ) : (
                            ""
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
};
