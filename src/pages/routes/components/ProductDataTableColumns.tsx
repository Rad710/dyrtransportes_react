import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "../types";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Button } from "@/components/ui/button";

export const productFilterColumnList = ["Producto"] as const;

export const productDataTableColumns = (
    handleDeleteItemAction: (code?: number | null) => Promise<void>,
    handleEditItemAction: (product: Product) => Promise<void>
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
            id: "Producto",
            accessorFn: (row) => row.product_name,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="hover:bg-transparent hover:text-black"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <span className="md:text-lg">Producto</span>
                        <ArrowUpDown className="ml-2 h-4 md:h-5 w-4 md:w-5" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium md:text-base">
                    {row.getValue("Producto")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <>
                    <AlertDialogConfirm
                        buttonClassName="w-fit"
                        buttonContent={
                            <span className="text-red-500">Eliminar</span>
                        }
                        onClickFunctionPromise={async () =>
                            handleDeleteItemAction(row.original.product_code)
                        }
                        variant="ghost"
                        size="default"
                    >
                        <span className="md:text-lg">
                            Esta acción es irreversible. Se{" "}
                            <strong className="font-bold text-gray-700">
                                eliminará:
                            </strong>
                            <br />
                            <strong className="font-bold text-gray-700">
                                {row.original.product_name}
                            </strong>
                        </span>
                    </AlertDialogConfirm>

                    <Button
                        variant="ghost"
                        size="default"
                        className="w-fit"
                        onClick={() => handleEditItemAction(row.original)}
                    >
                        <span className="text-indigo-500">Editar</span>
                    </Button>
                </>
            ),
        },
    ];
};
