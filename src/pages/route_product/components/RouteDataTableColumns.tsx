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
import { getGlobalizeNumberFormatter } from "@/utils/globalize";

const formatter = getGlobalizeNumberFormatter(2, 2);

export const routeFilterColumnList = ["Origen", "Destino"] as const;

export const routeDataTableColumns = (
    selectedRouteRows: number[],
    setSelectedRouteRows: React.Dispatch<React.SetStateAction<number[]>>,
    setRouteToEdit: React.Dispatch<React.SetStateAction<Route | null>>,
    setRouteToDelete: React.Dispatch<React.SetStateAction<Route | null>>,
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
                                  .getPaginationRowModel()
                                  .rows.map((item) => item.original.route_code ?? 0)
                            : [];

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select all value: ", !!value);
                            console.log("current selectedRouteRows: ", selectedRouteRows);
                            console.log("new selectedRouteRows: ", newSelectedRouteRows);
                        }

                        setSelectedRouteRows(newSelectedRouteRows);
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => {
                return (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                            row.toggleSelected(!!value);
                            const newSelectedRouteRows = !!value
                                ? [...selectedRouteRows, row.original.route_code ?? 0]
                                : selectedRouteRows.filter(
                                      (item) => item !== row.original.route_code,
                                  );

                            if (import.meta.env.VITE_DEBUG) {
                                console.log("Select item value: ", !!value);
                                console.log("current selectedRouteRows: ", selectedRouteRows);
                                console.log("new selectedRouteRows: ", newSelectedRouteRows);
                            }

                            setSelectedRouteRows(newSelectedRouteRows);
                        }}
                        aria-label="Seleccionar fila"
                    />
                );
            },
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
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <span className="md:text-lg">Origen</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">{row.getValue("Origen")}</div>
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
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <span className="md:text-lg">Destino</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">{row.getValue("Destino")}</div>
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <span className="md:text-lg">Precio Flete</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right md:text-base">
                    {formatter(parseFloat(row.getValue("Precio") ?? "") || 0)}
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <span className="md:text-lg">Precio Liquidación</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-right md:text-base">
                    {formatter(parseFloat(row.getValue("Precio Liquidación") ?? "") || 0)}
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRouteToDelete(row.original)}
                            >
                                <span className="text-red-600">Eliminar</span>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRouteToEdit(row.original)}
                            >
                                <span className="text-cyan-600">Editar</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
};
