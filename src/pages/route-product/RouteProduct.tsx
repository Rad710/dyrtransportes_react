import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";
import { isAxiosError } from "axios";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { TabPanel } from "@/components/TabPanel";

import { RouteDataTable } from "./components/RouteDataTable";
import { RouteFormDialog } from "./components/RouteFormDialog";

import { PageProps } from "@/types";
import { Product, Route } from "./types";
import { ProductApi, RouteApi } from "./utils";
import { ProductDataTable } from "./components/ProductDataTable";
import { ProductFormDialog } from "./components/ProductFormDialog";
import { downloadFile } from "@/utils/file";
import { routeTranslationNamespace, productTranslationNamespace } from "./translations";

const RouteTabContent = () => {
    // Route-specific translations
    const { t } = useTranslation(routeTranslationNamespace);

    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    //Routes State
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    const loadRouteList = async () => {
        setLoading(true);
        const resp = await RouteApi.getRouteList();
        setLoading(false);
        if (!isAxiosError(resp) && resp) {
            setRouteList(resp);
        } else {
            showToastAxiosError(resp);
            setRouteList([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded routes: ", { resp });
        }
    };

    useEffect(() => {
        loadRouteList();
    }, []);

    const handleExportRouteList = () => {
        openConfirmDialog({
            title: t("exportDialog.title"),
            message: t("exportDialog.message"),
            confirmText: t("exportDialog.confirmText"),
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
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        t("fileName"),
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("notifications.exportSuccess"));
                } else {
                    showToastError(t("notifications.exportError"));
                }
            },
        });
    };

    return (
        <Box>
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
                    {t("buttons.add")}
                </Button>

                <RouteFormDialog
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                    loadRouteList={loadRouteList}
                />

                <RouteFormDialog
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    routeToEdit={routeToEdit}
                    setRouteToEdit={setRouteToEdit}
                    loadRouteList={loadRouteList}
                />

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportRouteList}
                >
                    {t("buttons.export")}
                </Button>
            </Box>

            <RouteDataTable
                loading={loading}
                routeList={routeList}
                loadRouteList={loadRouteList}
                setRouteToEdit={setRouteToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </Box>
    );
};

const ProductTabContent = () => {
    // Product-specific translations
    const { t } = useTranslation(productTranslationNamespace);

    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    //Product State
    const [productList, setProductList] = useState<Product[]>([]);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    const loadProductList = async () => {
        setLoading(true);
        const resp = await ProductApi.getProductList();
        setLoading(false);
        if (!isAxiosError(resp) && resp) {
            setProductList(resp);
        } else {
            showToastAxiosError(resp);
            setProductList([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded products: ", { resp });
        }
    };

    useEffect(() => {
        loadProductList();
    }, []);

    const handleExportProductList = () => {
        openConfirmDialog({
            title: t("exportDialog.title"),
            message: t("exportDialog.message"),
            confirmText: t("exportDialog.confirmText"),
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
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        t("fileName"),
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("notifications.exportSuccess"));
                } else {
                    showToastError(t("notifications.exportError"));
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
                    {t("buttons.add")}
                </Button>

                <ProductFormDialog
                    loadProductList={loadProductList}
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                />

                <ProductFormDialog
                    loadProductList={loadProductList}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    productToEdit={productToEdit}
                    setProductToEdit={setProductToEdit}
                />

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportProductList}
                >
                    {t("buttons.export")}
                </Button>
            </Box>

            <ProductDataTable
                loading={loading}
                productList={productList}
                loadProductList={loadProductList}
                setProductToEdit={setProductToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </>
    );
};

export const RouteProduct = ({ title }: Readonly<PageProps>) => {
    // Use route namespace for tabs (since it contains the tab translations)
    const { t } = useTranslation(routeTranslationNamespace);

    useEffect(() => {
        document.title = title;
    }, [title]);

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="route-product-tabs">
                    <Tab
                        label={t("tabs.routes")}
                        id="route-tab-0"
                        aria-controls="route-tabpanel-0"
                    />
                    <Tab
                        label={t("tabs.products")}
                        id="product-tab-1"
                        aria-controls="product-tabpanel-1"
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <RouteTabContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ProductTabContent />
            </TabPanel>
        </>
    );
};
