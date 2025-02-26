import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Driver } from "../types";
import { CustomTableToolbar } from "@/components/CustomTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect } from "react";
import { DriverApi } from "../driver_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";

type DriverTableMode = "active" | "deactivated";

type DriverDataTableProps = {
    mode: DriverTableMode;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    driverList: Driver[];
    selectedRows: GridRowSelectionModel;
    setDriverList: React.Dispatch<React.SetStateAction<Driver[]>>;
    setSelectedRows: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    setDriverToEdit?: React.Dispatch<React.SetStateAction<Driver | null>>;
    setEditFormDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DriverDataTable = ({
    mode,
    loading,
    setLoading,
    driverList,
    selectedRows,
    setDriverList,
    setSelectedRows,
    setDriverToEdit,
    setEditFormDialogOpen,
}: DriverDataTableProps) => {
    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on driver list rerender empty selection
        setSelectedRows([]);
    }, [driverList]);

    const paginationModel = { page: 0, pageSize: 5 };

    const handleEditDriver = (row: Driver) => {
        if (setDriverToEdit && setEditFormDialogOpen) {
            setDriverToEdit(row);
            setEditFormDialogOpen(true);
        }
    };

    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Drivers?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Drivers...", selectedRows);
                }

                setLoading(true);
                const resp = await DriverApi.deleteDriverList(selectedRows as number[]);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Drivers resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                refreshDriverList();
            },
        });
    };

    const refreshDriverList = async () => {
        const driverListResp = await DriverApi.getDriverList();
        if (!isAxiosError(driverListResp)) {
            const filteredDrivers = driverListResp.filter((item) =>
                mode === "active" ? !item.deleted : item.deleted,
            );
            setDriverList(filteredDrivers);
        } else {
            setDriverList([]);
        }
    };

    const handleDeleteDriverItem = (row: Driver) => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Driver: <strong>{row.driver_name}</strong>{" "}
                    <strong>{row.driver_surname}</strong>?
                </>
            ),
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Driver", row);
                }

                setLoading(true);
                const resp = await DriverApi.deleteDriver(row.driver_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Driver resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                refreshDriverList();
            },
        });
    };

    const handleRestoreDriverItem = (row: Driver) => {
        openConfirmDialog({
            title: "Confirm Restore",
            message: (
                <>
                    Are you sure you want to restore Driver: <strong>{row.driver_name}</strong>{" "}
                    <strong>{row.driver_surname}</strong>?
                </>
            ),
            confirmText: "Restore",
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Restoring Driver", row);
                }

                setLoading(true);
                const resp = await DriverApi.restoreDriver(row.driver_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Restoring Driver resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                refreshDriverList();
            },
        });
    };

    const getActionMenuItems = (row: Driver) => {
        if (mode === "active") {
            return [
                {
                    text: "Edit",
                    handleClick: () => handleEditDriver(row),
                },
                {
                    text: "Delete",
                    handleClick: () => handleDeleteDriverItem(row),
                },
            ];
        } else {
            return [
                {
                    text: "Restore",
                    handleClick: () => handleRestoreDriverItem(row),
                },
            ];
        }
    };

    const columns: GridColDef<Driver>[] = [
        {
            field: "driver_code",
            headerName: "Code",
            minWidth: 70,
            flex: 0.5,
        },
        {
            field: "driver_id",
            headerName: "ID",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "driver_name",
            headerName: "Name",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "driver_surname",
            headerName: "Surname",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "truck_plate",
            headerName: "Truck Plate",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "trailer_plate",
            headerName: "Trailer Plate",
            minWidth: 130,
            flex: 1,
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
            renderCell: (params) => <ActionsMenu menuItems={getActionMenuItems(params.row)} />,
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <CustomTableToolbar
                numSelected={selectedRows.length}
                handleDelete={mode === "active" ? handleDeleteSelected : undefined}
                showDeleteButton={mode === "active"}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={driverList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    getRowId={(row: Driver) => row.driver_code ?? 0}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
