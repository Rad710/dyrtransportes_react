import { useState } from "react";
import { Box, Paper, CircularProgress, Typography, IconButton, Collapse } from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { Shipment, ShipmentAggregated } from "../types";
import { ShipmentApi } from "../shipment_payroll_utils";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";

interface ShipmentDataTableProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    shipmentAggregatedList: ShipmentAggregated[];
    selectedRows: GridRowSelectionModel;
    setShipmentAggegatedList: (shipments: ShipmentAggregated[]) => void;
    setSelectedRows: (model: GridRowSelectionModel) => void;
    setShipmentToDelete: (shipment: Shipment | null) => void;
}

export const ShipmentDataTable = ({
    loading,
    setLoading,
    shipmentAggregatedList,
    selectedRows,
    setShipmentAggegatedList,
    setSelectedRows,
    setShipmentToDelete,
}: ShipmentDataTableProps) => {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const { showToastSuccess, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const handleDeleteShipment = (shipment: Shipment) => {
        openConfirmDialog({
            title: "Confirmar Eliminación",
            message: `¿Está seguro que desea eliminar la carga con recibo #${shipment.receipt_code}?`,
            confirmText: "Eliminar",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                setLoading(true);
                // TODO: Implement actual deletion via API
                // const resp = await ShipmentApi.deleteShipment(shipment.shipment_code);

                // Mock successful deletion for this example
                const updatedList = shipmentAggregatedList
                    .map((group) => {
                        return {
                            ...group,
                            shipments: group.shipments.filter(
                                (s) => s.shipment_code !== shipment.shipment_code,
                            ),
                        };
                    })
                    .filter((group) => group.shipments.length > 0);

                setShipmentAggegatedList(updatedList);
                setLoading(false);
                showToastSuccess("Carga eliminada exitosamente");
            },
        });
    };

    const toggleGroupExpand = (groupKey: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupKey]: !prev[groupKey],
        }));
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (shipmentAggregatedList.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6">No hay cargas disponibles</Typography>
            </Box>
        );
    }

    return (
        <Paper sx={{ width: "100%", mb: 2 }}>
            {shipmentAggregatedList.map((group, index) => {
                const groupKey = `${group.product}-${group.origin}-${group.destination}-${index}`;
                const isExpanded = expandedGroups[groupKey] || false;

                return (
                    <Box key={groupKey} sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                p: 2,
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                borderRadius: "4px 4px 0 0",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => toggleGroupExpand(groupKey)}
                        >
                            <IconButton size="small" sx={{ color: "inherit", mr: 1 }}>
                                {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>

                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                                {group.product} | {group.origin} → {group.destination}
                            </Typography>

                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Typography variant="body2">
                                    Origen: {group.subtotalOrigin} kg
                                </Typography>
                                <Typography variant="body2">
                                    Destino: {group.subtotalDestination} kg
                                </Typography>
                                <Typography variant="body2">
                                    Diferencia: {group.subtotalDifference} kg
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    Total: ${group.subtotalMoney}
                                </Typography>
                            </Box>
                        </Box>

                        <Collapse in={isExpanded}>
                            <DataGrid
                                rows={group.shipments.map((shipment) => ({
                                    id: shipment.shipment_code,
                                    ...shipment,
                                }))}
                                columns={[
                                    { field: "receipt_code", headerName: "Recibo", flex: 1 },
                                    { field: "shipment_date", headerName: "Fecha", flex: 1 },
                                    { field: "truck_plate", headerName: "Placa", flex: 1 },
                                    {
                                        field: "origin_weight",
                                        headerName: "Peso Origen",
                                        flex: 1,
                                        valueFormatter: (params) => `${params.value} kg`,
                                    },
                                    {
                                        field: "destination_weight",
                                        headerName: "Peso Destino",
                                        flex: 1,
                                        valueFormatter: (params) => `${params.value} kg`,
                                    },
                                    {
                                        field: "actions",
                                        headerName: "Acciones",
                                        sortable: false,
                                        width: 120,
                                        renderCell: (params) => (
                                            <Box sx={{ display: "flex" }}>
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteShipment(params.row)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ),
                                    },
                                ]}
                                autoHeight
                                hideFooter
                                disableRowSelectionOnClick
                                checkboxSelection
                                onRowSelectionModelChange={setSelectedRows}
                                rowSelectionModel={selectedRows}
                                sx={{
                                    "& .MuiDataGrid-columnHeaders": {
                                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                                    },
                                }}
                            />
                        </Collapse>
                    </Box>
                );
            })}
        </Paper>
    );
};
