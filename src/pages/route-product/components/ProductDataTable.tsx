import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Product } from "../types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { ProductApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { productTranslationNamespace } from "../translations";

type ProductDataTableProps = {
    loading: boolean;
    productList: Product[];
    loadProductList: () => Promise<void>;
    setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductDataTable = ({
    loading,
    productList,
    loadProductList,
    setProductToEdit,
    setEditFormDialogOpen,
}: ProductDataTableProps) => {
    // Translation
    const { t } = useTranslation(productTranslationNamespace);

    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on product list rerender empty selection
        setSelectedRows([]);
    }, [productList]);

    const paginationModel = { page: 0, pageSize: 25 };

    const handleEditProduct = (row: Product) => {
        setProductToEdit(row);
        setEditFormDialogOpen(true);
    };

    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: t("dataTable.confirmDelete.messageMany"),
            confirmText: t("dataTable.confirmDelete.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Products...", selectedRows);
                }

                const resp = await ProductApi.deleteProductList(selectedRows as number[]);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Products resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadProductList();
            },
        });
    };

    const handleDeleteProductItem = (row: Product) => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: (
                <>
                    {t("dataTable.confirmDelete.messageSingle")} <strong>{row.product_name}</strong>
                    ?
                </>
            ),
            confirmText: t("dataTable.confirmDelete.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Product", row);
                }

                const resp = await ProductApi.deleteProduct(row.product_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Product resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadProductList();
            },
        });
    };

    const columns: GridColDef<Product>[] = [
        {
            field: "product_code",
            headerName: t("dataTable.columns.code"),
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "product_name",
            headerName: t("dataTable.columns.productName"),
            minWidth: 200,
            flex: 1.5,
        },
        {
            field: "modification_user",
            headerName: t("dataTable.columns.modifiedBy"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "action",
            headerName: t("dataTable.columns.actions"),
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => (
                <ActionsMenu
                    menuItems={[
                        {
                            text: t("dataTable.actions.edit"),
                            handleClick: () => handleEditProduct(params.row),
                        },
                        {
                            text: t("dataTable.actions.delete"),
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
                tableTitle={t("dataTable.tableTitle")}
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={productList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[25, 50, 100]}
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
