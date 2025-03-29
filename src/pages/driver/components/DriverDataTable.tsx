import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Driver } from "../types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { DriverApi } from "../utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { driverTranslationNamespace } from "../translations";

type DriverTableMode = "active" | "deactivated";

type DriverDataTableProps = {
    mode: DriverTableMode;
    loading: boolean;
    driverList: Driver[];
    loadDriverList: () => Promise<void>;
    setDriverToEdit?: React.Dispatch<React.SetStateAction<Driver | null>>;
    setEditFormDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DriverDataTable = ({
    mode,
    loading,
    driverList,
    loadDriverList,
    setDriverToEdit,
    setEditFormDialogOpen,
}: DriverDataTableProps) => {
    // Translations
    const { t } = useTranslation(driverTranslationNamespace);

    //state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on driver list rerender empty selection
        setSelectedRows([]);
    }, [driverList]);

    const paginationModel = { page: 0, pageSize: 25 };

    const handleEditDriver = (row: Driver) => {
        if (setDriverToEdit && setEditFormDialogOpen) {
            setDriverToEdit(row);
            setEditFormDialogOpen(true);
        }
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
                    console.log("Deleting Drivers...", selectedRows);
                }

                const resp = await DriverApi.deleteDriverList(selectedRows as number[]);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Drivers resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverList();
            },
        });
    };

    const handleDeleteDriverItem = (row: Driver) => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: (
                <>
                    {t("dataTable.confirmDelete.messageSingle")} <strong>{row.driver_name}</strong>{" "}
                    <strong>{row.driver_surname}</strong>?
                </>
            ),
            confirmText: t("dataTable.confirmDelete.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Driver", row);
                }

                const resp = await DriverApi.deleteDriver(row.driver_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Driver resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverList();
            },
        });
    };

    const handleRestoreDriverItem = (row: Driver) => {
        openConfirmDialog({
            title: t("dataTable.confirmRestore.title"),
            message: (
                <>
                    {t("dataTable.confirmRestore.message")} <strong>{row.driver_name}</strong>{" "}
                    <strong>{row.driver_surname}</strong>?
                </>
            ),
            confirmText: t("dataTable.confirmRestore.confirmText"),
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Restoring Driver", row);
                }

                const resp = await DriverApi.restoreDriver(row.driver_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Restoring Driver resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverList();
            },
        });
    };

    const getActionMenuItems = (row: Driver) => {
        if (mode === "active") {
            return [
                {
                    text: t("dataTable.actions.edit"),
                    handleClick: () => handleEditDriver(row),
                },
                {
                    text: t("dataTable.actions.delete"),
                    handleClick: () => handleDeleteDriverItem(row),
                },
            ];
        } else {
            return [
                {
                    text: t("dataTable.actions.restore"),
                    handleClick: () => handleRestoreDriverItem(row),
                },
            ];
        }
    };

    const columns: GridColDef<Driver>[] = [
        {
            field: "driver_code",
            headerName: t("dataTable.columns.code"),
            minWidth: 70,
            flex: 0.5,
        },
        {
            field: "driver_id",
            headerName: t("dataTable.columns.id"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "driver_name",
            headerName: t("dataTable.columns.name"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "driver_surname",
            headerName: t("dataTable.columns.surname"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "truck_plate",
            headerName: t("dataTable.columns.truckPlate"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "trailer_plate",
            headerName: t("dataTable.columns.trailerPlate"),
            minWidth: 130,
            flex: 1,
        },
        // {
        //     field: "modification_user",
        //     headerName: t("dataTable.columns.modifiedBy"),
        //     minWidth: 130,
        //     flex: 1,
        // },
        {
            field: "action",
            headerName: t("dataTable.columns.actions"),
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => <ActionsMenu menuItems={getActionMenuItems(params.row)} />,
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle={t("dataTable.tableTitle")}
                numSelected={selectedRows.length}
                handleDelete={mode === "active" ? handleDeleteSelected : undefined}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={driverList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[25, 50, 100]}
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
