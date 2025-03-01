import { useState, useEffect } from "react";
import { useMatch } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TableChartIcon from "@mui/icons-material/TableChart";

import { PropsTitle } from "@/types";
import { Shipment, ShipmentAggregated } from "./types";
import { isAxiosError } from "axios";

import { ShipmentApi } from "./shipment_payroll_utils";
import { ShipmentFormDialog } from "./components/ShipmentFormDialog";
import { ShipmentDataTable } from "./components/ShipmentDataTable";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { ProductApi, RouteApi } from "../route_product/route_product_utils";
import { DriverApi } from "../driver/driver_utils";
import { Product, Route } from "../route_product/types";
import { Driver } from "../driver/types";

export const ShipmentList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/payroll/:payroll_code");
    const payrollCode = parseInt(match?.params?.payroll_code ?? "") || 0;

    // State
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [shipmentAggregatedList, setShipmentAggregatedList] = useState<ShipmentAggregated[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);
    const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);
    // used for autocomplete options for dialog form
    const [productList, setProductList] = useState<Product[]>([]);
    const [driverList, setDriverList] = useState<Driver[]>([]);
    const [routeList, setRouteList] = useState<Route[]>([]);

    // Context
    const { showToastSuccess, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentListAndAutocompleteOptions = async () => {
        setLoadingTable(true);
        const [shipmentsResp, routesResp, productsResp, driversResp] = await Promise.all([
            ShipmentApi.getShipmentAggregated(payrollCode),
            RouteApi.getRouteList(),
            ProductApi.getProductList(),
            DriverApi.getDriverList(),
        ]);
        setLoadingTable(false);

        if (!isAxiosError(shipmentsResp) && shipmentsResp) {
            setShipmentAggregatedList(shipmentsResp);
        } else {
            showToastAxiosError(shipmentsResp);
        }

        if (!isAxiosError(routesResp) && routesResp) {
            setRouteList(routesResp);
        } else {
            showToastAxiosError(routesResp);
        }

        if (!isAxiosError(productsResp) && productsResp) {
            setProductList(productsResp);
        } else {
            showToastAxiosError(productsResp);
        }

        if (!isAxiosError(driversResp) && driversResp) {
            setDriverList(driversResp);
        } else {
            showToastAxiosError(driversResp);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipments ", { shipmentsResp });
            console.log("Loaded routeList ", { routesResp });
            console.log("Loaded productList ", { productsResp });
            console.log("Loaded driverList ", { driversResp });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadShipmentListAndAutocompleteOptions();
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

                    <ShipmentFormDialog
                        payrollCode={payrollCode}
                        setShipmentAggregatedList={setShipmentAggregatedList}
                        open={addFormDialogOpen}
                        setOpen={setAddFormDialogOpen}
                        setLoading={setLoadingTable}
                        productList={productList}
                        driverList={driverList}
                        routeList={routeList}
                    />

                    <ShipmentFormDialog
                        payrollCode={payrollCode}
                        setShipmentAggregatedList={setShipmentAggregatedList}
                        open={editFormDialogOpen}
                        setOpen={setEditFormDialogOpen}
                        setLoading={setLoadingTable}
                        productList={productList}
                        driverList={driverList}
                        routeList={routeList}
                        shipmentToEdit={shipmentToEdit}
                        setShipmentToEdit={setShipmentToEdit}
                    />

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

            <ShipmentDataTable
                loading={loadingTable}
                setLoading={setLoadingTable}
                shipmentAggregatedList={shipmentAggregatedList}
                setShipmentAggregatedList={setShipmentAggregatedList}
                payrollCode={payrollCode}
                setShipmentToEdit={setShipmentToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </Box>
    );
};
