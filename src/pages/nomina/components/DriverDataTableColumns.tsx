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

export const driverFilterColumnList = ["C.I.", "Nombre", "Chapa Camón", "Chapa Carreta"] as const;

export const driverDataTableColumns = (
    selectedDriverRows: number[],
    setSelectedDriverRows: React.Dispatch<React.SetStateAction<number[]>>,
    setDriverToEdit: React.Dispatch<React.SetStateAction<Driver | null>>,
    setDriverToDelete: React.Dispatch<React.SetStateAction<Driver | null>>,
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

                        const newSelectedRows = !!value
                            ? table
                                  .getPaginationRowModel()
                                  .rows.map((item) => item.original.driver_code ?? 0)
                            : [];

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select all value: ", !!value);
                            console.log("current selectedDriverRows: ", selectedDriverRows);
                            console.log("new newSelectedRows: ", newSelectedRows);
                        }

                        setSelectedDriverRows(newSelectedRows);
                    }}
                    aria-label="Seleccionar todos"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                        const newSelectedRows = !!value
                            ? [...selectedDriverRows, row.original.driver_code ?? 0]
                            : selectedDriverRows.filter(
                                  (item) => item !== row.original.driver_code,
                              );

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select item value: ", !!value);
                            console.log("current selectedDriverRows: ", selectedDriverRows);
                            console.log("new newSelectedRows: ", newSelectedRows);
                        }

                        setSelectedDriverRows(newSelectedRows);
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <span className="md:text-lg">C.I.</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const driverIdString = formatter(parseInt(row.getValue("C.I.")) || 0);

                return (
                    <div className="text-right font-medium md:text-base">
                        {driverIdString === "0" ? row.getValue("C.I.") : driverIdString}
                    </div>
                );
            },
        },
        {
            id: "Nombre",
            accessorFn: (row) => `${row.driver_name ?? ""} ${row.driver_surname ?? ""}`,
            header: ({ column }) => {
                return (
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <span className="md:text-lg">Nombre</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">{row.getValue("Nombre")}</div>
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <span className="md:text-lg">Chapa Camión</span>
                            <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="text-left md:text-base">{row.getValue("Chapa Camión")}</div>
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
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDriverToDelete(row.original)}
                            >
                                <span className="text-red-600">Eliminar</span>
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDriverToEdit(row.original)}
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
