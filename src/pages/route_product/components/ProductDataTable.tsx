import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Product } from "../types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { ProductApi } from "../route_product_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

type ProductDataTableProps = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    productList: Product[];
    setProductList: React.Dispatch<React.SetStateAction<Product[]>>;
    setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductDataTable = ({
    loading,
    setLoading,
    productList,
    setProductList,
    setProductToEdit,
    setEditFormDialogOpen,
}: ProductDataTableProps) => {
    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on product list rerender empty selection
        setSelectedRows([]);
    }, [productList]);

    const paginationModel = { page: 0, pageSize: 5 };

    const handleEditProduct = (row: Product) => {
        setProductToEdit(row);
        setEditFormDialogOpen(true);
    };

    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Products?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Products...", selectedRows);
                }

                setLoading(true);
                const resp = await ProductApi.deleteProductList(selectedRows as number[]);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Products resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const productListResp = await ProductApi.getProductList();
                setProductList(!isAxiosError(productListResp) ? productListResp : []);
            },
        });
    };

    const handleDeleteProductItem = (row: Product) => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Product: <strong>{row.product_name}</strong>?
                </>
            ),
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Product", row);
                }

                setLoading(true);
                const resp = await ProductApi.deleteProduct(row.product_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Product resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const productListResp = await ProductApi.getProductList();
                setProductList(!isAxiosError(productListResp) ? productListResp : []);
            },
        });
    };

    const columns: GridColDef<Product>[] = [
        {
            field: "product_code",
            headerName: "Code",
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "product_name",
            headerName: "Product Name",
            minWidth: 200,
            flex: 1.5,
        },
        {
            field: "modification_user",
            headerName: "Modified by",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "action",
            headerName: "Actions",
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => (
                <ActionsMenu
                    menuItems={[
                        {
                            text: "Edit",
                            handleClick: () => handleEditProduct(params.row),
                        },
                        {
                            text: "Delete",
                            handleClick: () => handleDeleteProductItem(params.row),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle="Products"
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={productList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    getRowId={(row: Product) => row.product_code ?? 0}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
