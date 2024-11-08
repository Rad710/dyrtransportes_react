import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { Product } from "../types";

export const productFilterColumnList = ["Producto"] as const;

export const productDataTableColumns = (
    selectedProductRows: number[],
    setSelectedProductRows: React.Dispatch<React.SetStateAction<number[]>>,
    setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>,
    setProductToDelete: React.Dispatch<React.SetStateAction<Product | null>>,
): ColumnDef<Product>[] => {
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

                        const newSelectedProductRows = !!value
                            ? table
                                  .getPaginationRowModel()
                                  .rows.map((item) => item.original.product_code ?? 0)
                            : [];

                        if (import.meta.env.VITE_DEBUG) {
                            console.log("Select all value: ", !!value);
                            console.log("current selectedRouteRows: ", selectedProductRows);
                            console.log("new selectedRouteRows: ", newSelectedProductRows);
                        }

                        setSelectedProductRows(newSelectedProductRows);
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
                            const newSelectedProductRows = !!value
                                ? [...selectedProductRows, row.original.product_code ?? 0]
                                : selectedProductRows.filter(
                                      (item) => item !== row.original.product_code,
                                  );

                            if (import.meta.env.VITE_DEBUG) {
                                console.log("Select item value: ", !!value);
                                console.log("current selectedProductRows: ", selectedProductRows);
                                console.log("new selectedProductRows: ", newSelectedProductRows);
                            }

                            setSelectedProductRows(newSelectedProductRows);
                        }}
                        aria-label="Seleccionar fila"
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Producto",
            accessorFn: (row) => row.product_name,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:text-black"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <span className="md:text-lg">Producto</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">{row.getValue("Producto")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <>
                    <Button
                        variant="ghost"
                        size="default"
                        onClick={() => setProductToDelete(row.original)}
                    >
                        <span className="text-red-600">Eliminar</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="default"
                        onClick={() => setProductToEdit(row.original)}
                    >
                        <span className="text-cyan-600">Editar</span>
                    </Button>
                </>
            ),
        },
    ];
};
