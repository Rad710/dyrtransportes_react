import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Route } from "../types";
import { CustomTableToolbar } from "@/components/CustomTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect } from "react";
import { RouteApi } from "../route_product_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

type RouteDataTableProps = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    routeList: Route[];
    selectedRows: GridRowSelectionModel;
    setRouteList: React.Dispatch<React.SetStateAction<Route[]>>;
    setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    setRouteToEdit: React.Dispatch<React.SetStateAction<Route | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RouteDataTable = ({
    loading,
    setLoading,
    routeList,
    selectedRows,
    setRouteList,
    setSelectedRows,
    setRouteToEdit,
    setEditFormDialogOpen,
}: RouteDataTableProps) => {
    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on route list rerender empty selection
        setSelectedRows([]);
    }, [routeList]);

    const paginationModel = { page: 0, pageSize: 5 };

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

                setLoading(true);
                const resp = await RouteApi.deleteRouteList(selectedRows as number[]);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Routes resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const routeListResp = await RouteApi.getRouteList();
                setRouteList(!isAxiosError(routeListResp) ? routeListResp : []);
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

                setLoading(true);
                const resp = await RouteApi.deleteRoute(row.route_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Route resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const routeListResp = await RouteApi.getRouteList();
                setRouteList(!isAxiosError(routeListResp) ? routeListResp : []);
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
            minWidth: 100,
            flex: 0.8,
        },
        {
            field: "payroll_price",
            headerName: "Payroll Price",
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
            <CustomTableToolbar
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={routeList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25]}
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
