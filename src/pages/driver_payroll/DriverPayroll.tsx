import { PropsTitle } from "@/types";
import { useEffect, useState } from "react";
import { useMatch } from "react-router";
import { DriverApi } from "../driver/driver_utils";
import { DriverPayrollApi } from "./driver_payroll_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { DriverPayroll as DriverPayrollType } from "./types";
import { Driver } from "../driver/types";
import { Shipment } from "../shipment_payroll/types";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { TabPanel } from "@/components/TabPanel";

import { saveAs } from "file-saver";

import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";
import { useConfirmation } from "@/context/ConfirmationContext";
import { CustomSwitch } from "@/components/CustomSwitch";
import { DateTime } from "luxon";
import { DriverPayrollShipmentDataTable } from "./components/DriverPayrollShipmentDataTable";
import { ShipmentFormDialog } from "../shipment_payroll/components/ShipmentFormDialog";
import { ProductApi, RouteApi } from "../route_product/route_product_utils";
import { Product, Route } from "../route_product/types";

interface DriverPayrollShipmentsTabProps {
    driverPayrollCode: number;
    driverCode: number;
}

const DriverPayrollShipmentsTab = ({
    driverPayrollCode,
    driverCode,
}: DriverPayrollShipmentsTabProps) => {
    // //STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);

    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    const [payrollShipmentList, setPayrollShipmentList] = useState<Shipment[]>([]);

    // used for autocomplete options for dialog form
    const [driverPayrollList, setDriverPayrollList] = useState<DriverPayrollType[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);
    const [driverList, setDriverList] = useState<Driver[]>([]);
    const [routeList, setRouteList] = useState<Route[]>([]);

    const [shipmentToEdit, setShipmentToEdit] = useState<Shipment | null>(null);

    // context
    const { showToastAxiosError } = useToast();

    // USE EFFECTS
    const loadDriverPayrollShipments = async () => {
        setLoadingTable(true);
        const [driverPayrollsResp, shipmentsResp, routesResp, productsResp, driversResp] =
            await Promise.all([
                DriverPayrollApi.getDriverPayrollList(driverCode),
                DriverPayrollApi.getDriverPayrollShipmentList(driverPayrollCode),
                RouteApi.getRouteList(),
                ProductApi.getProductList(),
                DriverApi.getDriverList(),
            ]);
        setLoadingTable(false);

        if (!isAxiosError(driverPayrollsResp) && driverPayrollsResp) {
            setDriverPayrollList(driverPayrollsResp);
        } else {
            showToastAxiosError(driverPayrollsResp);
            setDriverPayrollList([]);
        }

        if (!isAxiosError(shipmentsResp) && shipmentsResp) {
            setPayrollShipmentList(shipmentsResp);
        } else {
            showToastAxiosError(shipmentsResp);
            setPayrollShipmentList([]);
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
            console.log("Loaded driver driverPayrollList", { driverPayrollList });
            console.log("Loaded driver shipmentsResp", { shipmentsResp });
            console.log("Loaded driver routesResp", { routesResp });
            console.log("Loaded driver productsResp", { productsResp });
            console.log("Loaded driver driversResp", { driversResp });
        }
    };

    useEffect(() => {
        loadDriverPayrollShipments();
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                }}
            >
                <ShipmentFormDialog
                    payrollCode={shipmentToEdit?.shipment_payroll_code ?? 0}
                    loadShipmentList={loadDriverPayrollShipments}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    productList={productList}
                    driverList={driverList}
                    routeList={routeList}
                    shipmentToEdit={shipmentToEdit}
                    setShipmentToEdit={setShipmentToEdit}
                    driverPayrollList={driverPayrollList}
                />
            </Box>

            <DriverPayrollShipmentDataTable
                driverPayrollCode={driverPayrollCode}
                loading={loadingTable}
                setLoading={setLoadingTable}
                shipmentList={payrollShipmentList}
                setShipmentList={setPayrollShipmentList}
                setShipmentToEdit={setShipmentToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </>
    );
};

interface DriverPayrollExpensesTabProps {
    driverPayrollCode: number;
    driver: Driver | null;
    addFormDialogOpen: boolean;
    setAddFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DriverPayrollExpensesTab = ({
    driverPayrollCode,
    addFormDialogOpen,
    setAddFormDialogOpen,
}: DriverPayrollExpensesTabProps) => {
    return <></>;
};

export const DriverPayroll = ({ title }: PropsTitle) => {
    const match = useMatch("/driver-payrolls/:driver_code/payroll/:driver_payroll_code");
    const driverCode = parseInt(match?.params?.driver_code ?? "") || 0;
    const driverPayrollCode = parseInt(match?.params?.driver_payroll_code ?? "") || 0;

    // state
    const [tabValue, setTabValue] = useState(0);

    const [driver, setDriver] = useState<Driver | null>(null);
    const [driverPayroll, setDriverPayroll] = useState<DriverPayrollType | null>(null);

    const [addExpenseFormDialogOpen, setAddExpenseFormDialogOpen] = useState<boolean>(false);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();

    // USE EFFECTS
    useEffect(() => {
        document.title = title;

        const loadDriverPayroll = async () => {
            const [respDriver, respPayroll] = await Promise.all([
                DriverApi.getDriver(driverCode),
                DriverPayrollApi.getDriverPayroll(driverPayrollCode),
                DriverPayrollApi.getDriverPayrollShipmentList(driverPayrollCode),
            ]);

            if (isAxiosError(respDriver) || !respDriver) {
                showToastAxiosError(respDriver);
                return;
            }

            if (isAxiosError(respPayroll) || !respPayroll) {
                showToastAxiosError(respPayroll);
                return;
            }

            setDriver(respDriver);
            setDriverPayroll(respPayroll);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded driver", { respDriver });
                console.log("Loaded driver payroll", { respPayroll });
            }
        };

        loadDriverPayroll();
    }, []);

    // HANDLERS
    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handlePaidToggle = (driverPayroll: DriverPayrollType, paid: boolean) => {
        console.log("paid...");
    };

    const handleExportDriverPayroll = () => {
        openConfirmDialog({
            title: "Confirm Export",
            message: "All Routes will be exported.",
            confirmText: "Export",
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting Routes...");
                }
                const resp = await DriverPayrollApi.exportDriverPayroll(driverPayrollCode);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting Routes resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    saveAs(new Blob([resp ?? ""]), "lista_de_precios.xlsx");

                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastError("Error al exportar planilla");
                }
            },
        });
    };

    const tabShipments = 0;
    const tabExpenses = 1;

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        paddingRight: 3,
                        justifyContent: { xs: "flex-start", md: "space-between" },
                        alignItems: { xs: "flex-start", md: "center" },
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ mb: { xs: 2, md: 0 } }}>
                        {(
                            (driver?.driver_name ?? "") +
                            " " +
                            (driver?.driver_surname ?? "")
                        ).trim()}{" "}
                        -{" "}
                        {driverPayroll
                            ? DateTime.fromHTTP(driverPayroll?.payroll_timestamp).toLocaleString({
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                              })
                            : ""}
                    </Typography>

                    <Box display="flex" gap={2} sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}>
                        <CustomSwitch
                            checked={driverPayroll?.paid}
                            onChange={
                                driverPayroll
                                    ? (e) => handlePaidToggle(driverPayroll, e.target.checked)
                                    : undefined
                            }
                            textChecked="Paid"
                            checkedDescription={
                                driverPayroll?.paid_timestamp
                                    ? DateTime.fromHTTP(driverPayroll.paid_timestamp).toFormat(
                                          "dd/MM/yyyy",
                                      )
                                    : ""
                            }
                            textUnchecked="Unpaid"
                            sx={{
                                mr: 2,
                            }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() =>
                                tabValue === tabExpenses
                                    ? setAddExpenseFormDialogOpen(true)
                                    : undefined
                            }
                            sx={{
                                visibility: tabValue === tabShipments ? "hidden" : "visible",
                            }}
                        >
                            Add
                        </Button>

                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<TableChartIcon />}
                            onClick={handleExportDriverPayroll}
                        >
                            Export
                        </Button>
                    </Box>
                </Box>

                <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Shipments" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                    <Tab label="Expenses" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={tabShipments}>
                <DriverPayrollShipmentsTab
                    driverPayrollCode={driverPayrollCode}
                    driverCode={driverCode}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={tabExpenses}>
                <DriverPayrollExpensesTab
                    driverPayrollCode={driverPayrollCode}
                    driver={driver}
                    addFormDialogOpen={addExpenseFormDialogOpen}
                    setAddFormDialogOpen={setAddExpenseFormDialogOpen}
                />
            </TabPanel>
        </Box>
    );
};
