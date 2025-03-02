import { useState, useEffect } from "react";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";
import { isAxiosError } from "axios";
import { saveAs } from "file-saver";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { CustomTabPanel } from "@/components/CustomTabPanel";

import { RouteDataTable } from "./components/RouteDataTable";
import { RouteFormDialog } from "./components/RouteFormDialog";

import { PropsTitle } from "@/types";
import { Product, Route } from "./types";
import { ProductApi, RouteApi } from "./route_product_utils";
import { ProductDataTable } from "./components/ProductDataTable";
import { ProductFormDialog } from "./components/ProductFormDialog";

const RouteTabContent = () => {
    // //STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    //Routes State
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    useEffect(() => {
        const loadRoutes = async () => {
            setLoadingTable(true);
            const resp = await RouteApi.getRouteList();
            setLoadingTable(false);
            if (!isAxiosError(resp) && resp) {
                setRouteList(resp);
            } else {
                showToastAxiosError(resp);
            }

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded routes: ", { resp });
            }
        };

        loadRoutes();
    }, []);

    const handleExportRouteList = () => {
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
                const resp = await RouteApi.exportRouteList();
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

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddFormDialogOpen(true)}
                >
                    Add
                </Button>

                <RouteFormDialog
                    setRouteList={setRouteList}
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                    setLoading={setLoadingTable}
                />

                <RouteFormDialog
                    setRouteList={setRouteList}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    setLoading={setLoadingTable}
                    routeToEdit={routeToEdit}
                    setRouteToEdit={setRouteToEdit}
                />

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportRouteList}
                >
                    Export
                </Button>
            </Box>

            <RouteDataTable
                loading={loadingTable}
                setLoading={setLoadingTable}
                routeList={routeList}
                setRouteList={setRouteList}
                setRouteToEdit={setRouteToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </>
    );
};

const ProductTabContent = () => {
    // //STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    //Product State
    const [productList, setProductList] = useState<Product[]>([]);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    useEffect(() => {
        const loadProducts = async () => {
            setLoadingTable(true);
            const resp = await ProductApi.getProductList();
            setLoadingTable(false);
            if (!isAxiosError(resp) && resp) {
                setProductList(resp);
            } else {
                showToastAxiosError(resp);
            }

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded products: ", { resp });
            }
        };

        loadProducts();
    }, []);

    const handleExportProductList = () => {
        openConfirmDialog({
            title: "Confirm Export",
            message: "All products will be exported.",
            confirmText: "Export",
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting products...");
                }
                const resp = await ProductApi.exportProductList();
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting products resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    saveAs(new Blob([resp ?? ""]), "lista_de_product.xlsx");

                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastError("Error al exportar planilla.");
                }
            },
        });
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddFormDialogOpen(true)}
                >
                    Add
                </Button>

                <ProductFormDialog
                    setProductList={setProductList}
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                    setLoading={setLoadingTable}
                />

                <ProductFormDialog
                    setProductList={setProductList}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    setLoading={setLoadingTable}
                    productToEdit={productToEdit}
                    setProductToEdit={setProductToEdit}
                />

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportProductList}
                >
                    Export
                </Button>
            </Box>

            <ProductDataTable
                loading={loadingTable}
                setLoading={setLoadingTable}
                productList={productList}
                setProductList={setProductList}
                setProductToEdit={setProductToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </>
    );
};

export const RouteProduct = ({ title }: Readonly<PropsTitle>) => {
    useEffect(() => {
        document.title = title;
    }, []);

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Prices" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                    <Tab label="Products" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <RouteTabContent />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ProductTabContent />
            </CustomTabPanel>
        </>
    );
};
