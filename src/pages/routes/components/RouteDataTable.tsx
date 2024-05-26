// import { Table, Checkbox } from "@radix-ui/themes"

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
import { DataTable } from "@/components/DataTable";
import { Route } from "../types";
import { RouteApi } from "../route_utils";
import { PropsUseState } from "@/types";

export const RouteDataTable = ({ data, setData }: PropsUseState<Route>) => {
    if (import.meta.env.VITE_DEBUG) {
        console.log("Route Table Data: ", { data });
    }

    const columns: ColumnDef<Route>[] = [
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

                        setData(
                            data.map((item) => ({
                                ...item,
                                checked: !!value,
                            }))
                        );
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.original.checked}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);

                        setData(
                            data.map((item) => {
                                if (
                                    item.route_code === row.original.route_code
                                ) {
                                    return {
                                        ...item,
                                        checked: !!value,
                                    };
                                }
                                return item;
                            })
                        );
                    }}
                    aria-label="Select row"
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
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="md:text-lg">Origen</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
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
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="md:text-lg">Destino</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
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
            header: () => (
                <div className="text-right md:text-lg">Precio Flete</div>
            ),
            cell: ({ row }) => {
                const price = parseFloat(row.getValue("Precio"));

                const formatted = new Intl.NumberFormat("en-ES", {
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
            header: (row) => (
                <div className="text-right md:text-lg">Precio Liquidación</div>
            ),
            cell: ({ row }) => {
                const payrollPrice = parseFloat(
                    row.getValue("Precio Liquidación")
                );

                const formatted = new Intl.NumberFormat("en-ES", {
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
            cell: ({ row }) => {
                const route = row.original;

                return (
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
                                onClick={async () =>
                                    RouteApi.deleteRouteList([
                                        row.original.route_code,
                                    ])
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
                );
            },
        },
    ];

    const filterColumnList = ["Origen", "Destino"];
    return (
        <DataTable
            data={data}
            columns={columns}
            pageSize={50}
            filterColumnList={filterColumnList}
        />
    );
};
