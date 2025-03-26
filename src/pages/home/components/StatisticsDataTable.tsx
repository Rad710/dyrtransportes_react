import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useState } from "react";
import { numberFormatter } from "@/utils/i18n";
import type { StatisticRow } from "../types";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";

type StatisticsDataTableProps = {
    loading: boolean;
    statisticRows: StatisticRow[];
};

export const StatisticsDataTable = ({ loading, statisticRows }: StatisticsDataTableProps) => {
    // Add translation hook
    const { t } = useTranslation(homeTranslationNamespace);

    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    const paginationModel = { page: 0, pageSize: 100 };

    const columns: GridColDef<StatisticRow>[] = [
        {
            field: "driver_code",
            headerName: t("statistics.dataTable.columns.driverCode"),
            flex: 1,
        },
        {
            field: "driver_name",
            headerName: t("statistics.dataTable.columns.driverName"),
            flex: 1,
            minWidth: 150,
        },
        {
            field: "shipments",
            headerName: t("statistics.dataTable.columns.shipments"),
            flex: 1,
        },
        {
            field: "total_origin_weight",
            headerName: t("statistics.dataTable.columns.totalOriginWeight"),
            flex: 1,
            minWidth: 130,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_origin_weight)),
        },
        {
            field: "total_destination_weight",
            headerName: t("statistics.dataTable.columns.totalDestinationWeight"),
            flex: 1,
            minWidth: 130,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_destination_weight)),
        },
        {
            field: "total_diff",
            headerName: t("statistics.dataTable.columns.diff"),
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_diff)),
        },
        {
            field: "total_shipment_payroll",
            headerName: t("statistics.dataTable.columns.totalShipmentPayroll"),
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_shipment_payroll)),
        },
        {
            field: "total_driver_payroll",
            headerName: t("statistics.dataTable.columns.totalDriverPayroll"),
            flex: 1,
            minWidth: 170,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_driver_payroll)),
        },
        {
            field: "total_expenses_amount_receipt",
            headerName: t("statistics.dataTable.columns.totalExpensesAmountReceipt"),
            flex: 1,
            minWidth: 170,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_expenses_amount_receipt)),
        },
        {
            field: "total_expenses_amount_no_receipt",
            headerName: t("statistics.dataTable.columns.totalExpensesAmountNoReceipt"),
            flex: 1,
            minWidth: 170,
            renderCell: ({ row }) =>
                numberFormatter(parseFloat(row.total_expenses_amount_no_receipt)),
        },
        {
            field: "total_expenses_amount",
            headerName: t("statistics.dataTable.columns.totalExpensesAmount"),
            flex: 1,
            minWidth: 170,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_expenses_amount)),
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle={t("statistics.dataTable.tableTitle")}
                numSelected={selectedRows.length}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={statisticRows}
                    columns={columns}
                    getRowId={(row: StatisticRow) => row.driver_name ?? ""}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[25, 50, 100]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
