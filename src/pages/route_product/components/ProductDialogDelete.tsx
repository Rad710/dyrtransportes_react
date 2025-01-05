import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";

import { Product } from "../types";
import { ProductApi } from "../route_product_utils";

type ProductDialogDeleteProps = {
    setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
    selectedProductRows: number[];
    setSelectedProductRows: React.Dispatch<React.SetStateAction<number[]>>;
    productToDelete?: Product | null;
    setProductToDelete: React.Dispatch<React.SetStateAction<Product | null>>;
};

export const ProductDialogDelete = ({
    setProductList,
    selectedProductRows,
    setSelectedProductRows,
    productToDelete,
    setProductToDelete,
}: ProductDialogDeleteProps) => {
    // STATE
    const [open, setOpen] = useState<boolean>(false);

    // USE EFFECT
    useEffect(() => {
        setOpen(!!productToDelete);
    }, [productToDelete]);

    // HANDLERS
    const handleDeleteProductItem = async () => {
        if (!productToDelete?.product_code) {
            return;
        }

        const result = await ProductApi.deleteProduct(productToDelete.product_code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log("Deleting... ", productToDelete.product_code);
        }

        if (result?.success) {
            const newProductList = await ProductApi.getProductList();
            setProductList(newProductList);
        }
    };

    const handleDeleteProductList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedProductRows });
        }

        const result = await ProductApi.deleteProductList(selectedProductRows);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ selectedProductRows });
        }

        setSelectedProductRows([]);

        if (result?.success) {
            const newProductList = await ProductApi.getProductList();
            setProductList(newProductList);
        }
    };

    const handleOnOpenChange = (open: boolean) => {
        setOpen(open);

        // timeout solves issue of dialog changing text/color when closing
        setTimeout(() => {
            setProductToDelete(null);
        }, 100);
    };

    return (
        <AlertDialogConfirm
            size="md-lg"
            variant="destructive"
            disabled={productToDelete ? false : selectedProductRows.length === 0}
            open={open}
            onOpenChange={handleOnOpenChange}
            buttonContent={
                <>
                    <Trash2Icon className="w-6 h-6" />
                    Eliminar
                </>
            }
            onClickFunctionPromise={
                productToDelete ? handleDeleteProductItem : handleDeleteProductList
            }
        >
            <span className="md:text-lg">
                Esta acción es irreversible. Se{" "}
                <strong className="font-bold text-gray-700">eliminará permanentemente:</strong>
                <br />
                <strong className="font-bold text-gray-700">
                    {productToDelete?.product_name
                        ? productToDelete.product_name
                        : "Todos los Productos seleccionados"}
                </strong>
            </span>
        </AlertDialogConfirm>
    );
};
