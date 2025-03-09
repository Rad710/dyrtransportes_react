import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { getGlobalizeNumberFormatter } from "@/utils/globalize";
import { Shipment } from "@/pages/shipment_payroll/types";
import { ShipmentApi } from "@/pages/shipment_payroll/shipment_payroll_utils";
import { DateTime } from "luxon";

const formatter = getGlobalizeNumberFormatter(0, 2);

const DriverPayrollShipmentDataTableFooter = ({ shipmentList }: { shipmentList: Shipment[] }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Calculate totals with useMemo inside the component
    const totals = useMemo(() => {
        const totalOrigin = shipmentList.reduce(
            (sum, item) => sum + parseFloat(item.origin_weight),
            0,
        );
        const totalDestination = shipmentList.reduce(
            (sum, item) => sum + parseFloat(item.destination_weight),
            0,
        );
        const totalMoney = shipmentList.reduce(
            (sum, item) =>
                sum + parseFloat(item.destination_weight) * parseFloat(item.payroll_price),
            0,
        );
        return { totalOrigin, totalDestination, totalMoney };
    }, [shipmentList]);

    return (
        <Box
            sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: isMobile ? "column" : "row",
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
                    Origin:
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "right",
                        ml: "auto",
                        color: theme.palette.text.secondary,
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totals.totalOrigin)}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
                    Destination:
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "right",
                        ml: "auto",
                        color: theme.palette.text.secondary,
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totals.totalDestination)}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
                    Diff:
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "right",
                        ml: "auto",
                        color: theme.palette.text.secondary,
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totals.totalDestination - totals.totalOrigin)}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
                    Total:
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "right",
                        ml: "auto",
                        color: theme.palette.text.secondary,
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totals.totalMoney)}
                </Typography>
            </Box>
        </Box>
    );
};

type DriverPayrollShipmentDataTableProps = {
    loading: boolean;
    loadDriverPayrollShipmentList: () => Promise<void>;
    shipmentList: Shipment[];
    setShipmentToEdit: React.Dispatch<React.SetStateAction<Shipment | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DriverPayrollShipmentDataTable = ({
    loading,
    loadDriverPayrollShipmentList,
    shipmentList,
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

                const resp = await ShipmentApi.deleteShipmentList(selectedRows as number[]);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverPayrollShipmentList();
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

                const resp = await ShipmentApi.deleteShipment(row.shipment_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverPayrollShipmentList();
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
            sortComparator: (v1, v2) => {
                // Convert both dates to timestamp for comparison
                const date1 = v1 ? DateTime.fromHTTP(v1, { zone: "local" }).toMillis() : null;
                const date2 = v2 ? DateTime.fromHTTP(v2, { zone: "local" }).toMillis() : null;

                // Handle null values (null values should come last in sorting)
                if (date1 === null && date2 === null) return 0;
                if (date1 === null) return 1;
                if (date2 === null) return -1;

                // Compare timestamps
                return date1 - date2;
            },
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

                <DriverPayrollShipmentDataTableFooter shipmentList={shipmentList} />
            </Paper>
        </Box>
    );
};
