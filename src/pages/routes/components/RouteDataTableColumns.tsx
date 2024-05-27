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

type RouteDataTableColumnsProps = {
    selectedRouteRows: (number | null)[];
    setSelectedRouteRows: React.Dispatch<
        React.SetStateAction<(number | null)[]>
    >;
    handleDeleteItemAction: (code: number | null) => Promise<void>;
};

export const routeFilterColumnList: ("Origen" | "Destino")[] = [
    "Origen",
    "Destino",
];

export const routeColumns = ({
    selectedRouteRows,
    setSelectedRouteRows,
    handleDeleteItemAction,
}: RouteDataTableColumnsProps): ColumnDef<Route>[] => {
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

                        setSelectedRouteRows(
                            !!value
                                ? table
                                      .getCoreRowModel()
                                      .rows.map(
                                          (item) => item.original.route_code
                                      )
                                : []
                        );
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);

                        setSelectedRouteRows(
                            !!value
                                ? [
                                      ...selectedRouteRows,
                                      row.original.route_code ?? 0,
                                  ]
                                : selectedRouteRows.filter(
                                      (item) => item === row.original.route_code
                                  )
                        );
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
                        className="hover:bg-transparent hover:font-black"
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
                <div className="capitalize font-medium md:text-base">
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
                        className="hover:bg-transparent hover:font-black"
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
                <div className="capitalize font-medium md:text-base">
                    {row.getValue("Destino")}
                </div>
            ),
        },
        {
            id: "Precio",
            accessorFn: (row) => row.price,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:font-black"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="text-right md:text-lg">
                            Precio Flete
                        </span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("Precio"));

                const formatted = new Intl.NumberFormat("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(price);

                return (
                    <div className="text-right md:text-base">{formatted}</div>
                );
            },
        },
        {
            id: "Precio Liquidación",
            accessorFn: (row) => row.payroll_price,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:font-black"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="text-right md:text-lg">
                            Precio Liquidación
                        </span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const payrollPrice = parseFloat(
                    row.getValue("Precio Liquidación")
                );

                const formatted = new Intl.NumberFormat("es-ES", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(payrollPrice);

                return (
                    <div className="text-right md:text-base">{formatted}</div>
                );
            },
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
                        <DropdownMenuItem
                            onClick={() =>
                                handleDeleteItemAction(row.original.route_code)
                            }
                        >
                            <span className="text-red-500">Eliminar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <span className="text-indigo-500">Editar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];
};
