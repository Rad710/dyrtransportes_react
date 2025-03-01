import { useState, useEffect } from "react";
import { useMatch } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TableChartIcon from "@mui/icons-material/TableChart";

import { PropsTitle } from "@/types";
import { Shipment, ShipmentAggregated } from "./types";
import { isAxiosError } from "axios";

import { ShipmentApi } from "./shipment_payroll_utils";
import { ShipmentDialogForm } from "./components/ShipmentDialogForm";
import { ShipmentDataTable } from "./components/ShipmentDataTable";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";

export const ShipmentList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/payroll/:payroll_code");
    const payrollCode = parseInt(match?.params?.payroll_code ?? "") || 0;

    // State
    const [loading, setLoading] = useState<boolean>(true);
    const [shipmentAggregatedList, setShipmentAggegatedList] = useState<ShipmentAggregated[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);

    // Context
    const { showToastSuccess, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentList = async () => {
        setLoading(true);
        const shipments = await ShipmentApi.getShipmentAggregated(payrollCode);

        if (!isAxiosError(shipments) && shipments) {
            setShipmentAggegatedList(shipments);
        } else {
            showToastAxiosError(shipments);
        }

        setLoading(false);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipments ", { shipments });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadShipmentList();
    }, []);

    const handleExportShipmentList = () => {
        openConfirmDialog({
            title: "Confirm Export",
            message: "The shipment data will be exported.",
            confirmText: "Export",
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting Shipments...");
                }

                // TODO: Implement the export functionality similar to RouteApi.exportRouteList()
                console.log("Export functionality to be implemented");
                showToastSuccess("Planilla exportada exitosamente.");
            },
        });
    };

    return (
        <Box sx={{ paddingTop: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Typography variant="h5" component="h2">
                    Lista de Cargas de fecha
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        paddingRight: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddFormDialogOpen(true)}
                    >
                        Add
                    </Button>

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={handleExportShipmentList}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* ShipmentDialogForm Component */}
            {/* <ShipmentDialogForm
                payrollCode={payrollCode}
                setShipmentAggegatedList={setShipmentAggegatedList}
                open={addFormDialogOpen}
                setOpen={setAddFormDialogOpen}
            /> */}

            <ShipmentDataTable
                loading={loading}
                setLoading={setLoading}
                shipmentAggregatedList={shipmentAggregatedList}
                setShipmentAggegatedList={setShipmentAggegatedList}
                payrollCode={payrollCode}
            />
        </Box>
    );
};
