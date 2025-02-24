import { useState, useEffect } from "react";

import { PropsTitle } from "@/types";

import { Product, Route } from "./types";
import { saveAs } from "file-saver";
import { ProductApi, RouteApi } from "./route_product_utils";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { CustomTabPanel } from "@/components/CustomTabPanel";

import { GridRowSelectionModel } from "@mui/x-data-grid";

import { RouteDataTable } from "./components/RouteDataTable";
import { useConfirmation } from "@/context/ConfirmationContext";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { RouteFormDialog } from "./components/RouteFormDialog";

const RouteTabContent = () => {
    // //STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [addDialogFormOpen, setAddDialogFormOpen] = useState<boolean>(false);

    //Routes State
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

    // context
    const { showToast } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    useEffect(() => {
        const loadRoutes = async () => {
            const routes = await RouteApi.getRouteList();
            setRouteList(routes);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded routes: ", { routes });
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
                try {
                    console.log("Exporting...");
                    const resp = await RouteApi.exportRouteList();

                    if (!isAxiosError(resp) && resp) {
                        saveAs(new Blob([resp]), "lista_de_precios.xlsx");

                        showToast("Planilla exportada exitosamente.", "success");
                    } else {
                        showToast("Error al exportar planilla.", "error");
                    }

                    // Update your table data
                } catch (error) {
                    console.error("Export failed:", error);
                }
            },
        });
    };

    // return (
    //     <>
    //         <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
    //             <RouteDialogForm
    //                 setRouteList={setRouteList}
    //                 routeToEdit={routeToEdit}
    //                 setRouteToEdit={setRouteToEdit}
    //                 setSelectedRouteRows={setSelectedRouteRows}
    //             />
    //         </div>

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button onClick={() => setAddDialogFormOpen(true)}>Add</Button>
                <Button onClick={handleExportRouteList}>Exportar</Button>
            </Box>

            <RouteFormDialog
                setRouteList={setRouteList}
                setSelectedRows={setSelectedRows}
                open={addDialogFormOpen}
                setOpen={setAddDialogFormOpen}
            />

            <RouteDataTable
                routeList={routeList}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                loading={loading}
            />
        </>
    );
};

const ProductTabContent = () => {
    // //STATE
    // const [loading, setLoading] = useState<boolean>(true);

    // //Products State
    // const [productList, setProductList] = useState<Product[]>([]);
    // const [selectedProductRows, setSelectedProductRows] = useState<number[]>([]);
    // const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    // const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // // EVENT HANDLERS
    // // Product Handlers and Component
    // const productColumns = productDataTableColumns(
    //     selectedProductRows,
    //     setSelectedProductRows,
    //     setProductToEdit,
    //     setProductToDelete,
    // );

    // // USE EFFECT
    // useEffect(() => {
    //     const loadProducts = async () => {
    //         const products = await ProductApi.getProductList();
    //         setProductList(products);
    //         setLoading(false);

    //         if (import.meta.env.VITE_DEBUG) {
    //             console.log("Loaded products: ", { products });
    //         }
    //     };

    //     loadProducts();
    // }, []);

    // const pageSize = 20;
    // return (
    //     <>
    //         <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
    //             <ProductDialogForm
    //                 setProductList={setProductList}
    //                 productToEdit={productToEdit}
    //                 setProductToEdit={setProductToEdit}
    //                 setSelectedProductRows={setSelectedProductRows}
    //             />

    //             <AlertDialogConfirm
    //                 buttonContent={
    //                     <>
    //                         <Table2Icon className="w-6 h-6" />
    //                         Exportar
    //                     </>
    //                 }
    //                 variant="green"
    //                 size="md-lg"
    //                 onClickFunctionPromise={ProductApi.exportProductList}
    //             >
    //                 <span className="md:text-lg">
    //                     Se exportarán{" "}
    //                     <strong className="font-bold text-gray-700">todos los Productos</strong>
    //                 </span>
    //             </AlertDialogConfirm>

    //             <ProductDialogDelete
    //                 setProductList={setProductList}
    //                 selectedProductRows={selectedProductRows}
    //                 setSelectedProductRows={setSelectedProductRows}
    //                 productToDelete={productToDelete}
    //                 setProductToDelete={setProductToDelete}
    //             />
    //         </div>

    //         {!loading && (
    //             <DataTable
    //                 data={productList}
    //                 columns={productColumns}
    //                 pageSize={pageSize}
    //                 filterColumnList={productFilterColumnList}
    //             />
    //         )}
    //     </>
    // );

    return <></>;
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
