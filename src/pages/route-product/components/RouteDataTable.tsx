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
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Routes?`,
            confirmText: "Delete",
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
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Route: <strong>{row.origin}</strong> -{" "}
                    <strong>{row.destination}</strong>?
                </>
            ),
            confirmText: "Delete",
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
            headerName: "Code",
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "origin",
            headerName: "Origin",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "destination",
            headerName: "Destination",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "price",
            headerName: "Price",
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.price)),
            minWidth: 100,
            flex: 0.8,
        },
        {
            field: "payroll_price",
            headerName: "Payroll Price",
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.payroll_price)),
            minWidth: 120,
            flex: 0.8,
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
                            handleClick: () => handleEditRoute(params.row),
                        },
                        {
                            text: "Delete",
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
                tableTitle="Routes"
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
