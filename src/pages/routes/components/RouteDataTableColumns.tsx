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
import { Route } from "../types";
import React from "react";
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const routeFilterColumnList = ["Origen", "Destino"] as const;

export const routeColumns = (
    selectedRouteRows: number[],
    setSelectedRouteRows: React.Dispatch<React.SetStateAction<number[]>>,
    handleDeleteItemAction: (code?: number | null) => Promise<void>,
    handleEditItemAction: (route: Route) => void
): ColumnDef<Route>[] => {
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
                        const newSelectedRouteRows = !!value
                            ? table
                                  .getCoreRowModel()
                                  .rows.map(
                                      (item) => item.original.route_code ?? 0
                                  )
                            : [];

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select all value: ", !!value);
                            console.log(
                                "current selectedRouteRows: ",
                                selectedRouteRows
                            );
                            console.log(
                                "new selectedRouteRows: ",
                                newSelectedRouteRows
                            );
                        }

                        setSelectedRouteRows(newSelectedRouteRows);
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);

                        const newSelectedRouteRows = !!value
                            ? [
                                  ...selectedRouteRows,
                                  row.original.route_code ?? 0,
                              ]
                            : selectedRouteRows.filter(
                                  (item) => item !== row.original.route_code
                              );

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select item value: ", !!value);
                            console.log(
                                "current selectedRouteRows: ",
                                selectedRouteRows
                            );
                            console.log(
                                "new selectedRouteRows: ",
                                newSelectedRouteRows
                            );
                        }

                        setSelectedRouteRows(newSelectedRouteRows);
                    }}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Origen",
            accessorFn: (row) => row.origin,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:text-black"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="md:text-lg">Origen</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">
                    {row.getValue("Origen")}
                </div>
            ),
        },
        {
            id: "Destino",
            accessorFn: (row) => row.destination,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:text-black"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="md:text-lg">Destino</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">
                    {row.getValue("Destino")}
                </div>
            ),
        },
        {
            id: "Precio",
            accessorFn: (row) => row.price,
            header: ({ column }) => {
                return (
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">Precio Flete</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right md:text-base">
                    {formatter(row.getValue("Precio"))}
                </div>
            ),
        },
        {
            id: "Precio Liquidación",
            accessorFn: (row) => row.payroll_price,
            header: ({ column }) => {
                return (
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            className="text-right hover:bg-transparent hover:text-black"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            <span className="md:text-lg">
                                Precio Liquidación
                            </span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right md:text-base">
                    {formatter(row.getValue("Precio Liquidación"))}
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
                            <AlertDialogConfirm
                                buttonClassName="w-full"
                                buttonContent={
                                    <span className="text-red-500">
                                        Eliminar
                                    </span>
                                }
                                onClickFunctionPromise={async () =>
                                    handleDeleteItemAction(
                                        row.original.route_code
                                    )
                                }
                                variant="ghost"
                                size="sm"
                            >
                                <span className="md:text-lg">
                                    Esta acción es irreversible. Se{" "}
                                    <strong className="font-bold text-gray-700">
                                        eliminará:
                                    </strong>
                                    <br />
                                    <strong className="font-bold text-gray-700">
                                        {row.original.origin}
                                        {" - "}
                                        {row.original.destination}.
                                    </strong>
                                </span>
                            </AlertDialogConfirm>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() =>
                                    handleEditItemAction(row.original)
                                }
                            >
                                <span className="text-indigo-500">Editar</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
};
