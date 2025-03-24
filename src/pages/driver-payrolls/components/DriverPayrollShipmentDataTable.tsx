import {
    Autocomplete,
    Box,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { DateTime } from "luxon";
import { AutocompleteOption } from "@/types";
import { DriverPayroll } from "../types";
import { DriverPayrollApi } from "../utils";
import { globalizeFormatter } from "@/utils/globalize";
import type { Shipment } from "@/pages/shipment-payrolls/types";
import { ShipmentApi } from "@/pages/shipment-payrolls/utils";
import { driverPayrollTranslationNamespace } from "../translations";

const DriverPayrollShipmentDataTableFooter = ({ shipmentList }: { shipmentList: Shipment[] }) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);
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
                    {t("shipments.summary.origin")}
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
                    {globalizeFormatter(totals.totalOrigin)}
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
                    {t("shipments.summary.destination")}
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
                    {globalizeFormatter(totals.totalDestination)}
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
                    {t("shipments.summary.diff")}
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
                    {globalizeFormatter(totals.totalDestination - totals.totalOrigin)}
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
                    {t("shipments.summary.total")}
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
                    {globalizeFormatter(totals.totalMoney)}
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
    driverPayrollCode: number;
    driverPayrollList: DriverPayroll[];
};

export const DriverPayrollShipmentDataTable = ({
    loading,
    loadDriverPayrollShipmentList,
    shipmentList,
    setShipmentToEdit,
    setEditFormDialogOpen,
    driverPayrollCode,
    driverPayrollList,
}: DriverPayrollShipmentDataTableProps) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);

    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();

    // autocomplete options
    // Memoized option lists for better performance
    const driverPayrollOptionList: AutocompleteOption[] = useMemo(
        () =>
            driverPayrollList?.map((item) => ({
                id: item.payroll_code?.toString() ?? "",
                label: `${DateTime.fromHTTP(item.payroll_timestamp).toFormat("dd/MM/yy")} [#${item.payroll_code ?? 0}]`,
            })) ?? [],
        [driverPayrollList],
    );

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
            title: t("shipments.dialogs.delete.title"),
            message: t("shipments.dialogs.delete.messageMany"),
            confirmText: t("shipments.dialogs.delete.confirmText"),
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
            title: t("shipments.dialogs.delete.title"),
            message: t("shipments.dialogs.delete.messageSingle", {
                dispatch: row.dispatch_code,
                receipt: row.receipt_code,
            }),
            confirmText: t("shipments.dialogs.delete.confirmText"),
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

    const handleChangeShipmentListDriverPayroll = async () => {
        // Variable to store the selected value
        let selectedPayroll: number | null = null;

        const currentDriverPayrollOption =
            driverPayrollOptionList.find((item) => item.id === driverPayrollCode?.toString()) ??
            null;

        openConfirmDialog({
            title: t("shipments.dialogs.moveShipments.title"),
            message: (
                <Box>
                    <Box component="span">{t("shipments.dialogs.moveShipments.message")}</Box>
                    <Stack>
                        <Autocomplete
                            options={driverPayrollOptionList}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("shipments.dialogs.moveShipments.payrollLabel")}
                                    fullWidth
                                />
                            )}
                            onChange={(_, newValue) => {
                                // Update the captured value in the closure
                                selectedPayroll = parseInt(newValue?.id ?? "") || 0;
                            }}
                            defaultValue={currentDriverPayrollOption}
                            fullWidth
                        />
                    </Stack>
                </Box>
            ),
            confirmText: t("shipments.dialogs.moveShipments.confirmText"),
            confirmButtonProps: {
                color: "primary",
            },
            onConfirm: async () => {
                if (!selectedPayroll) {
                    showToastError(t("shipments.notifications.moveError"));
                    return;
                }

                const resp = await DriverPayrollApi.changeShipmentListDriverPayroll(
                    selectedPayroll,
                    selectedRows as number[],
                );
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Moving Shipment resp: ", { resp });
                }
                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(t("shipments.notifications.moveSuccess"));

                await loadDriverPayrollShipmentList();
            },
        });
    };

    const columns: GridColDef<Shipment>[] = [
        {
            field: "shipment_payroll_code",
            headerName: t("shipments.columns.payrollCode"),
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "shipment_date",
            headerName: t("shipments.columns.date"),
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
            headerName: t("shipments.columns.dispatch"),
            minWidth: 130,
            flex: 1,
            align: "right",
        },
        {
            field: "receipt_code",
            headerName: t("shipments.columns.receipt"),
            minWidth: 130,
            flex: 1,
            align: "right",
        },
        {
            field: "product_name",
            headerName: t("shipments.columns.product"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "origin",
            headerName: t("shipments.columns.origin"),
            minWidth: 130,
            flex: 1,
        },
        {
            field: "destination",
            headerName: t("shipments.columns.destination"),
            minWidth: 130,
            flex: 1,
        },

        {
            field: "origin_weight",
            headerName: t("shipments.columns.originWeight"),
            renderCell: ({ row }) => globalizeFormatter(parseInt(row.origin_weight)),
            minWidth: 100,
            flex: 0.8,
            align: "right",
        },
        {
            field: "destination_weight",
            headerName: t("shipments.columns.destinationWeight"),
            renderCell: ({ row }) => globalizeFormatter(parseInt(row.destination_weight)),
            minWidth: 100,
            flex: 0.8,
            align: "right",
        },
        {
            field: "price",
            headerName: t("shipments.columns.price"),
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.price)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "payroll_price",
            headerName: t("shipments.columns.payrollPrice"),
            renderCell: ({ row }) => globalizeFormatter(parseFloat(row.payroll_price)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "total",
            headerName: t("shipments.columns.total"),
            renderCell: ({ row }) =>
                globalizeFormatter(
                    parseInt(row.destination_weight) * parseFloat(row.payroll_price),
                ),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "action",
            headerName: t("shipments.columns.actions"),
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => (
                <ActionsMenu
                    menuItems={[
                        {
                            text: t("buttons.edit"),
                            handleClick: () => handleEditShipment(params.row),
                        },
                        {
                            text: t("buttons.delete"),
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
                tableTitle={t("shipments.tableTitle")}
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
                handleMove={handleChangeShipmentListDriverPayroll}
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
