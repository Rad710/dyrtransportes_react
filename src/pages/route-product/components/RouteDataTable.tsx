import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Route } from "../types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { RouteApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { globalizeFormatter } from "@/utils/globalize";
import { useTranslation } from "react-i18next";
import { routeTranslationNamespace } from "../translations";

type RouteDataTableProps = {
    loading: boolean;
    routeList: Route[];
    loadRouteList: () => Promise<void>;
    setRouteToEdit: React.Dispatch<React.SetStateAction<Route | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RouteDataTable = ({
    loading,
    routeList,
    loadRouteList,
    setRouteToEdit,
    setEditFormDialogOpen,
}: RouteDataTableProps) => {
    // Translation
    const { t } = useTranslation(routeTranslationNamespace);

    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on route list rerender empty selection
        setSelectedRows([]);
    }, [routeList]);

    const paginationModel = { page: 0, pageSize: 25 };

    const handleEditRoute = (row: Route) => {
        setRouteToEdit(row);
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
                    console.log("Deleting Routes...", selectedRows);
                }

                const resp = await RouteApi.deleteRouteList(selectedRows as number[]);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Routes resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadRouteList();
            },
        });
    };

    const handleDeleteRouteItem = (row: Route) => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: (
                <>
                    {t("dataTable.confirmDelete.messageSingle")} <strong>{row.origin}</strong> -{" "}
                    <strong>{row.destination}</strong>?
                </>
            ),
            confirmText: t("dataTable.confirmDelete.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Route", row);
                }

                const resp = await RouteApi.deleteRoute(row.route_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Route resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadRouteList();
            },
        });
    };

    const columns: GridColDef<Route>[] = [
        {
            field: "route_code",
            headerName: t("dataTable.columns.code"),
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "origin",
            headerName: t("dataTable.columns.origin"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "destination",
            headerName: t("dataTable.columns.destination"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "price",
            headerName: t("dataTable.columns.price"),
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.price)),
            minWidth: 100,
            flex: 0.8,
        },
        {
            field: "payroll_price",
            headerName: t("dataTable.columns.payrollPrice"),
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.payroll_price)),
            minWidth: 120,
            flex: 0.8,
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
                            handleClick: () => handleEditRoute(params.row),
                        },
                        {
                            text: t("dataTable.actions.delete"),
                            handleClick: () => handleDeleteRouteItem(params.row),
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
                    rows={routeList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[25, 50, 100]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    getRowId={(row: Route) => row.route_code ?? 0}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
