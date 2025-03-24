import { useState, useEffect } from "react";
import { useMatch } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TableChartIcon from "@mui/icons-material/TableChart";

import { PageProps } from "@/types";
import { ShipmentPayroll as ShipmentPayrollType } from "../types";
import { isAxiosError } from "axios";

import { ShipmentPayrollApi } from "../utils";
import { ShipmentFormDialog } from "./components/ShipmentFormDialog";
import { GroupedShipmentsDataTable } from "./components/GroupedShipmentsDataTable";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { ProductApi, RouteApi } from "../../route-product/utils";
import { DriverApi } from "../../driver/utils";
import { Product, Route } from "../../route-product/types";
import { Driver } from "../../driver/types";
import { DateTime } from "luxon";
import { CustomSwitch } from "@/components/CustomSwitch";
import { downloadFile } from "@/utils/file";
import { useTranslation } from "react-i18next";
import { shipmentTranslationNamespace } from "../translations";
import type { GroupedShipments, Shipment } from "./types";
import { ShipmentApi } from "./utils";

export const ShipmentPayroll = ({ title }: Readonly<PageProps>) => {
    const { t } = useTranslation(shipmentTranslationNamespace);
    const match = useMatch("/shipment-payrolls/payroll/:payroll_code");
    const payrollCode = parseInt(match?.params?.payroll_code ?? "") || 0;

    // State
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [shipmentPayrollList, setShipmentPayrollList] = useState<ShipmentPayrollType[]>([]);
    const [groupedShipmentsList, setGroupedShipmentsList] = useState<GroupedShipments[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);
    const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);
    // used for autocomplete options for dialog form
    const [productList, setProductList] = useState<Product[]>([]);
    const [driverList, setDriverList] = useState<Driver[]>([]);
    const [routeList, setRouteList] = useState<Route[]>([]);

    // Context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentListAndAutocompleteOptions = async () => {
        setLoadingTable(true);
        const [shipmentPayrollsResp, shipmentsResp, routesResp, productsResp, driversResp] =
            await Promise.all([
                ShipmentPayrollApi.getShipmentPayrollList(),
                ShipmentApi.getGroupedShipmentsList(payrollCode),
                RouteApi.getRouteList(),
                ProductApi.getProductList(),
                DriverApi.getDriverList(),
            ]);
        setLoadingTable(false);

        if (!isAxiosError(shipmentPayrollsResp) && shipmentPayrollsResp) {
            setShipmentPayrollList(shipmentPayrollsResp);
        } else {
            showToastAxiosError(shipmentPayrollsResp);
            setShipmentPayrollList([]);
        }

        if (!isAxiosError(shipmentsResp) && shipmentsResp) {
            setGroupedShipmentsList(shipmentsResp);
        } else {
            showToastAxiosError(shipmentsResp);
            setGroupedShipmentsList([]);
        }

        if (!isAxiosError(routesResp) && routesResp) {
            setRouteList(routesResp);
        } else {
            showToastAxiosError(routesResp);
            setRouteList([]);
        }

        if (!isAxiosError(productsResp) && productsResp) {
            setProductList(productsResp);
        } else {
            showToastAxiosError(productsResp);
            setProductList([]);
        }

        if (!isAxiosError(driversResp) && driversResp) {
            setDriverList(driversResp.filter((item) => !item.deleted));
        } else {
            showToastAxiosError(driversResp);
            setDriverList([]);
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
            title: t("shipmentPayroll.exportDialog.title"),
            message: t("shipmentPayroll.exportDialog.message"),
            confirmText: t("shipmentPayroll.exportDialog.confirmText"),
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting Shipments...");
                }
                const resp = await ShipmentApi.exportShipmentList(payrollCode);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting Shipments resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        "cobranzas.xlsx",
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("shipmentPayroll.exportDialog.successMessage"));
                } else {
                    showToastError(t("shipmentPayroll.exportDialog.errorMessage"));
                }
            },
        });
    };

    const handleCollectionToggle = async (payroll: ShipmentPayrollType, collected: boolean) => {
        const newPayroll: ShipmentPayrollType = {
            ...payroll,
            collected: collected,
        };

        if (import.meta.env.VITE_DEBUG) {
            console.log(`Updating collection status for payroll, `, { payroll, newPayroll });
        }

        const resp = await ShipmentPayrollApi.updateCollectionStatus(newPayroll);
        if (isAxiosError(resp) || !resp) {
            showToastAxiosError(resp);
            return;
        }

        const payrollResp = await ShipmentPayrollApi.getShipmentPayroll(payroll.payroll_code ?? 0);
        if (!isAxiosError(payrollResp) && payrollResp) {
            setShipmentPayrollList(
                shipmentPayrollList.map((item) =>
                    item.payroll_code !== payroll.payroll_code ? item : payrollResp,
                ),
            );
        } else {
            showToastAxiosError(payrollResp);
        }

        const messageKey = collected
            ? "shipmentPayroll.notification.markedAsCollected"
            : "shipmentPayroll.notification.markedAsNotCollected";
        showToastSuccess(t(messageKey, { code: payroll.payroll_code ?? 0 }));
    };

    const currentShipmentPayroll =
        shipmentPayrollList.find((item) => item.payroll_code === payrollCode) ?? null;

    const shipmentPayrollDateString = DateTime.fromHTTP(
        currentShipmentPayroll?.payroll_timestamp ?? "",
    );

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
                    {t("shipmentPayroll.title")}
                    {shipmentPayrollDateString.isValid
                        ? " " +
                          t("shipmentPayroll.datePrefix") +
                          " " +
                          shipmentPayrollDateString.toFormat("dd/MM/yy")
                        : ""}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        paddingRight: 3,
                    }}
                >
                    <CustomSwitch
                        checked={currentShipmentPayroll?.collected}
                        onChange={
                            currentShipmentPayroll
                                ? (e) =>
                                      handleCollectionToggle(
                                          currentShipmentPayroll,
                                          e.target.checked,
                                      )
                                : undefined
                        }
                        textChecked={t("shipmentPayroll.collectionStatus.collected")}
                        checkedDescription={
                            currentShipmentPayroll?.collection_timestamp
                                ? DateTime.fromHTTP(
                                      currentShipmentPayroll.collection_timestamp,
                                  ).toFormat("dd/MM/yyyy")
                                : ""
                        }
                        textUnchecked={t("shipmentPayroll.collectionStatus.notCollected")}
                        sx={{
                            mr: 2,
                        }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddFormDialogOpen(true)}
                    >
                        {t("shipmentPayroll.buttons.add")}
                    </Button>

                    <ShipmentFormDialog
                        payrollCode={payrollCode}
                        loadShipmentList={loadShipmentListAndAutocompleteOptions}
                        open={addFormDialogOpen}
                        setOpen={setAddFormDialogOpen}
                        productList={productList}
                        driverList={driverList}
                        routeList={routeList}
                    />

                    <ShipmentFormDialog
                        payrollCode={payrollCode}
                        loadShipmentList={loadShipmentListAndAutocompleteOptions}
                        open={editFormDialogOpen}
                        setOpen={setEditFormDialogOpen}
                        productList={productList}
                        driverList={driverList}
                        routeList={routeList}
                        shipmentToEdit={shipmentToEdit}
                        setShipmentToEdit={setShipmentToEdit}
                        shipmentPayrollList={shipmentPayrollList}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={handleExportShipmentList}
                    >
                        {t("shipmentPayroll.buttons.export")}
                    </Button>
                </Box>
            </Box>

            <GroupedShipmentsDataTable
                loading={loadingTable}
                groupedShipmentsList={groupedShipmentsList}
                loadShipmentList={loadShipmentListAndAutocompleteOptions}
                payrollCode={payrollCode}
                setShipmentToEdit={setShipmentToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
                shipmentPayrollList={shipmentPayrollList}
            />
        </Box>
    );
};
