import { Box, Paper, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { numberFormatter } from "@/utils/i18n";
import type { StatisticRow } from "../types";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";

type StatisticsDataTableProps = {
    loading: boolean;
    statisticRows: StatisticRow[];
};

export const StatisticsDataTable = ({ loading, statisticRows }: StatisticsDataTableProps) => {
    const theme = useTheme();

    // Add translation hook
    const { t } = useTranslation(homeTranslationNamespace);

    const paginationModel = { page: 0, pageSize: 100 };

    const columns: GridColDef<StatisticRow>[] = [
        {
            field: "driver_name",
            headerName: t("statistics.dataTable.columns.driverName"),
            flex: 1,
            minWidth: 150,
            headerClassName: "wrap-header",
        },
        {
            field: "shipments",
            headerName: t("statistics.dataTable.columns.shipments"),
            flex: 1,
            headerClassName: "wrap-header",
        },
        {
            field: "total_origin_weight",
            headerName: t("statistics.dataTable.columns.totalOriginWeight"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_origin_weight)),
        },
        {
            field: "total_destination_weight",
            headerName: t("statistics.dataTable.columns.totalDestinationWeight"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_destination_weight)),
        },
        {
            field: "total_diff",
            headerName: t("statistics.dataTable.columns.diff"),
            flex: 1,
            minWidth: 50,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_diff)),
        },
        {
            field: "total_shipment_payroll",
            headerName: t("statistics.dataTable.columns.totalShipmentPayroll"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_shipment_payroll)),
        },
        {
            field: "total_driver_payroll",
            headerName: t("statistics.dataTable.columns.totalDriverPayroll"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_driver_payroll)),
        },
        {
            field: "total_expenses_amount_receipt",
            headerName: t("statistics.dataTable.columns.totalExpensesAmountReceipt"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_expenses_amount_receipt)),
        },
        {
            field: "total_expenses_amount_no_receipt",
            headerName: t("statistics.dataTable.columns.totalExpensesAmountNoReceipt"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) =>
                numberFormatter(parseFloat(row.total_expenses_amount_no_receipt)),
        },
        {
            field: "total_expenses_amount",
            headerName: t("statistics.dataTable.columns.totalExpensesAmount"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_expenses_amount)),
        },
        {
            field: "total_losses",
            headerName: t("statistics.dataTable.columns.totalLosses"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => {
                const totalDriverPayroll = parseFloat(row.total_driver_payroll);
                const totalExpensesAmount = parseFloat(row.total_expenses_amount);
                const totalLosses = totalExpensesAmount - totalDriverPayroll;

                return (
                    <Box
                        component="span"
                        sx={{ color: theme.palette.success.main, fontWeight: "bold" }}
                    >
                        {numberFormatter(totalLosses > 0 ? totalLosses : 0)}
                    </Box>
                );
            },
        },
        {
            field: "total_profits",
            headerName: t("statistics.dataTable.columns.totalProfits"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => (
                <Box component="span" sx={{ color: theme.palette.error.main, fontWeight: "bold" }}>
                    {numberFormatter(
                        parseFloat(row.total_shipment_payroll) -
                            parseFloat(row.total_driver_payroll),
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar tableTitle={t("statistics.dataTable.tableTitle")} />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={statisticRows}
                    columns={columns}
                    getRowId={(row: StatisticRow) => row.driver_name ?? ""}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        "& .wrap-header": {
                            whiteSpace: "normal",
                            lineHeight: "normal",
                            "& .MuiDataGrid-columnHeaderTitle": {
                                whiteSpace: "normal",
                                lineHeight: 1.2,
                                overflow: "visible",
                            },
                        },
                    }}
                    loading={loading}
                />
            </Paper>
        </Box>
    );
};
