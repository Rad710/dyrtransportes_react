import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import type { ProductStatisticRow } from "../types";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";
import { defaultToLocaleNumberString } from "@/utils/i18n";

type ProductStatisticsDataTableProps = {
    loading: boolean;
    statisticRows: ProductStatisticRow[];
};

export const ProductStatisticsDataTable = ({
    loading,
    statisticRows,
}: ProductStatisticsDataTableProps) => {
    // Add translation hook
    const { t } = useTranslation(homeTranslationNamespace);

    const paginationModel = { page: 0, pageSize: 100 };

    const columns: GridColDef<ProductStatisticRow>[] = [
        {
            field: "product_code",
            headerName: t("productStatistics.dataTable.columns.productCode"),
            flex: 1,
            minWidth: 150,
            headerClassName: "wrap-header",
        },
        {
            field: "product_name",
            headerName: t("productStatistics.dataTable.columns.productName"),
            flex: 1,
            minWidth: 150,
            headerClassName: "wrap-header",
        },
        {
            field: "shipments",
            headerName: t("productStatistics.dataTable.columns.shipments"),
            flex: 1,
            headerClassName: "wrap-header",
        },
        {
            field: "total_origin_weight",
            headerName: t("productStatistics.dataTable.columns.totalOriginWeight"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => defaultToLocaleNumberString(row.total_origin_weight),
        },
        {
            field: "total_destination_weight",
            headerName: t("productStatistics.dataTable.columns.totalDestinationWeight"),
            flex: 1,
            minWidth: 100,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => defaultToLocaleNumberString(row.total_destination_weight),
        },
        {
            field: "total_diff",
            headerName: t("productStatistics.dataTable.columns.diff"),
            flex: 1,
            minWidth: 50,
            headerClassName: "wrap-header",
            renderCell: ({ row }) => defaultToLocaleNumberString(row.total_diff),
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar tableTitle={t("productStatistics.dataTable.tableTitle")} />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={statisticRows}
                    columns={columns}
                    getRowId={(row: ProductStatisticRow) => row.product_name ?? ""}
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
