import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Route } from "../types";
import { CustomTableToolbar } from "@/components/CustomTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";

type RouteDataTableProps = {
    routeList: Route[];
    selectedRows: GridRowSelectionModel;
    setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    loading: boolean;
};

export const RouteDataTable = ({
    routeList,
    selectedRows,
    setSelectedRows,
    loading,
}: RouteDataTableProps) => {
    //     const handleDeleteRouteItem = async () => {
    //         if (!routeToDelete?.route_code) {
    //             return;
    //         }

    //         const result = await RouteApi.deleteRoute(routeToDelete.route_code);
    //         if (import.meta.env.VITE_DEBUG) {
    //             console.log("Deleting... ", routeToDelete.route_code);
    //             console.log({ result });
    //         }
    //         setSelectedRouteRows([]);

    //         if (result?.success) {
    //             const newRouteList = await RouteApi.getRouteList();
    //             setRouteList(newRouteList);
    //         }
    //     };

    //     const handleDeleteRouteList = async () => {
    //         const result = await RouteApi.deleteRouteList(selectedRouteRows);
    //         if (import.meta.env.VITE_DEBUG) {
    //             console.log("Deleting...: ", { selectedRouteRows });
    //             console.log({ result });
    //         }
    //         setSelectedRouteRows([]);

    //         if (result?.success) {
    //             const newRouteList = await RouteApi.getRouteList();
    //             setRouteList(newRouteList);
    //         }
    //     };

    const { openConfirmDialog } = useConfirmation();

    const paginationModel = { page: 0, pageSize: 5 };

    const handleEditRoute = (row: Route) => {
        console.log("Editing...");
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
                try {
                    console.log("Deleting...", row);
                    // Update your table data
                } catch (error) {
                    console.error("Delete failed:", error);
                }
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
                    row={params.row}
                    handleEditRoute={handleEditRoute}
                    handleDeleteRow={handleDeleteRouteItem}
                />
            ),
        },
    ];

    const handleSelectedDelete = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Routes?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                try {
                    console.log("Deleting...", selectedRows);
                    // Update your table data
                } catch (error) {
                    console.error("Delete failed:", error);
                }
            },
        });
    };

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <CustomTableToolbar
                numSelected={selectedRows.length}
                handleDelete={handleSelectedDelete}
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
                />
            </Paper>
        </Box>
    );
};
