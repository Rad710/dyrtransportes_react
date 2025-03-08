import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { getGlobalizeNumberFormatter } from "@/utils/globalize";
import { Shipment } from "@/pages/shipment_payroll/types";
import { ShipmentApi } from "@/pages/shipment_payroll/shipment_payroll_utils";
import { DriverPayrollApi } from "../driver_payroll_utils";
import { DateTime } from "luxon";

type DriverPayrollShipmentDataTableProps = {
    driverPayrollCode: number;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    shipmentList: Shipment[];
    setShipmentList: React.Dispatch<React.SetStateAction<Shipment[]>>;
    setShipmentToEdit: React.Dispatch<React.SetStateAction<Shipment | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formatter = getGlobalizeNumberFormatter(0, 2);

export const DriverPayrollShipmentDataTable = ({
    driverPayrollCode,
    loading,
    setLoading,
    shipmentList,
    setShipmentList,
    setShipmentToEdit,
    setEditFormDialogOpen,
}: DriverPayrollShipmentDataTableProps) => {
    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on shipment list rerender empty selection
        setSelectedRows([]);
    }, [shipmentList]);

    const handleEditShipment = (row: Shipment) => {
        setShipmentToEdit(row);
        setEditFormDialogOpen(true);
    };

    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Shipments?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments...", selectedRows);
                }

                setLoading(true);
                const resp = await ShipmentApi.deleteShipmentList(selectedRows as number[]);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const shipmentsResp =
                    await DriverPayrollApi.getDriverPayrollShipmentList(driverPayrollCode);
                setShipmentList(!isAxiosError(shipmentsResp) ? shipmentsResp : []);
            },
        });
    };

    const handleDeleteShipmentItem = (row: Shipment) => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Shipment: <strong>{row.dispatch_code}</strong> -{" "}
                    <strong>{row.receipt_code}</strong>?
                </>
            ),
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment", row);
                }

                setLoading(true);
                const resp = await ShipmentApi.deleteShipment(row.shipment_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                const shipmentsResp =
                    await DriverPayrollApi.getDriverPayrollShipmentList(driverPayrollCode);
                setShipmentList(!isAxiosError(shipmentsResp) ? shipmentsResp : []);
            },
        });
    };

    const columns: GridColDef<Shipment>[] = [
        {
            field: "shipment_payroll_code",
            headerName: "Payroll #",
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "shipment_date",
            headerName: "Date",
            renderCell: ({ row }) =>
                DateTime.fromHTTP(row.shipment_date, { zone: "local" }).toFormat("dd/MM/yyyy"),
            minWidth: 70,
        },
        {
            field: "dispatch_code",
            headerName: "Dispatch",
            minWidth: 130,
            flex: 1,
            align: "right",
        },
        {
            field: "receipt_code",
            headerName: "Receipt",
            minWidth: 130,
            flex: 1,
            align: "right",
        },
        {
            field: "product_name",
            headerName: "Product",
            minWidth: 130,
            flex: 1,
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
            field: "origin_weight",
            headerName: "Origin Weight",
            renderCell: ({ row }) => formatter(parseInt(row.origin_weight)),
            minWidth: 100,
            flex: 0.8,
            align: "right",
        },
        {
            field: "destination_weight",
            headerName: "Destination Weight",
            renderCell: ({ row }) => formatter(parseInt(row.destination_weight)),
            minWidth: 100,
            flex: 0.8,
            align: "right",
        },
        {
            field: "price",
            headerName: "Price",
            renderCell: ({ row }) => formatter(parseFloat(row.price)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "payroll_price",
            headerName: "Payroll Price",
            renderCell: ({ row }) => formatter(parseFloat(row.payroll_price)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "total",
            headerName: "Total",
            renderCell: ({ row }) =>
                formatter(parseInt(row.destination_weight) * parseFloat(row.payroll_price)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
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
                            handleClick: () => handleEditShipment(params.row),
                        },
                        {
                            text: "Delete",
                            handleClick: () => handleDeleteShipmentItem(params.row),
                        },
                    ]}
                />
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: -1 };

    const columnVisibilityModel = {
        price: false,
        dispatch_code: false,
    };

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle="Payroll Shipments"
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={shipmentList}
                    columns={columns}
                    columnVisibilityModel={columnVisibilityModel}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[{ label: "All", value: -1 }]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    getRowId={(row: Shipment) => row.shipment_code ?? 0}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
