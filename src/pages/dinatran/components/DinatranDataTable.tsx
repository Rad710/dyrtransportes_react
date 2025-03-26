import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { type DinatranRow } from "../types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useState } from "react";
import { numberFormatter } from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { dinatranTranslationNamespace } from "../translations";

type DinatranDataTableProps = {
    loading: boolean;
    dinatranRows: DinatranRow[];
};

export const DinatranDataTable = ({ loading, dinatranRows }: DinatranDataTableProps) => {
    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const { t } = useTranslation(dinatranTranslationNamespace);

    const paginationModel = { page: 0, pageSize: 100 };

    const columns: GridColDef<DinatranRow>[] = [
        {
            field: "truck_plate",
            headerName: t("dataTable.columns.truckPlate"),
            flex: 1,
            minWidth: 100,
        },
        {
            field: "shipments",
            headerName: t("dataTable.columns.shipments"),
            flex: 1,
            minWidth: 100,
        },
        {
            field: "totalOriginWeight",
            headerName: t("dataTable.columns.originWeight"),
            flex: 1,
            minWidth: 130,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_origin_weight)),
        },
        {
            field: "totalDestinationWeight",
            headerName: t("dataTable.columns.destinationWeight"),
            flex: 1,
            minWidth: 130,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_destination_weight)),
        },
        {
            field: "diff",
            headerName: t("dataTable.columns.difference"),
            flex: 1,
            minWidth: 100,
            renderCell: ({ row }) =>
                numberFormatter(
                    parseFloat(row.total_destination_weight) - parseFloat(row.total_origin_weight),
                ),
        },
        {
            field: "totalShipmentPayroll",
            headerName: t("dataTable.columns.shipmentPayroll"),
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_shipment_payroll)),
        },
        {
            field: "totalDriverPayroll",
            headerName: t("dataTable.columns.driverPayroll"),
            flex: 1,
            minWidth: 170,
            renderCell: ({ row }) => numberFormatter(parseFloat(row.total_driver_payroll)),
        },
    ];

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle={t("dataTable.tableTitle")}
                numSelected={selectedRows.length}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={dinatranRows}
                    columns={columns}
                    getRowId={(row: DinatranRow) => row.truck_plate ?? ""}
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
