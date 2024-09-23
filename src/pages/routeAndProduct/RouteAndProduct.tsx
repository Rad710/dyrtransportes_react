"use client";
"use strict";

import { useState, useEffect } from "react";

import { Table2Icon } from "lucide-react";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PropsTitle } from "@/types";

import { routeDataTableColumns, routeFilterColumnList } from "./components/RouteDataTableColumns";
import { RouteDialogForm } from "./components/RouteDialogForm";
import { RouteDialogDelete } from "./components/RouteDialogDelete";
import {
    productDataTableColumns,
    productFilterColumnList,
} from "./components/ProductDataTableColumns";
import { ProductDialogForm } from "./components/ProductDialogForm";
import { ProductDialogDelete } from "./components/ProductDialogDelete";

import { Product, Route } from "./types";

import { ProductApi, RouteApi } from "./route_utils";

const RouteTabContent = () => {
    //STATE
    const [loading, setLoading] = useState<boolean>(true);

    //Routes State
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRouteRows, setSelectedRouteRows] = useState<number[]>([]);
    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);
    const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);

    // EVENT HANDLERS
    // Route Handlers and Component
    const routeColumns = routeDataTableColumns(
        selectedRouteRows,
        setSelectedRouteRows,
        setRouteToEdit,
        setRouteToDelete,
    );

    useEffect(() => {
        const loadRoutes = async () => {
            const routes = await RouteApi.getRouteList().then((list) =>
                list.map((item) => ({
                    ...item,
                    price: parseFloat(item.price?.toString() ?? "") || 0,
                    payroll_price: parseFloat(item.payroll_price?.toString() ?? "") || 0,
                })),
            );

            setRouteList(routes);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded routes: ", { routes });
            }
        };

        loadRoutes();
    }, []);

    const pageSize = 20;
    return (
        <>
            <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                <RouteDialogForm
                    routeList={routeList}
                    setRouteList={setRouteList}
                    routeToEdit={routeToEdit}
                    setRouteToEdit={setRouteToEdit}
                />

                <AlertDialogConfirm
                    buttonContent={
                        <>
                            <Table2Icon className="w-6 h-6" />
                            Exportar
                        </>
                    }
                    variant="green"
                    size="md-lg"
                    onClickFunctionPromise={async () => {
                        await RouteApi.exportRouteList(
                            selectedRouteRows.length ? selectedRouteRows : undefined,
                        );
                    }}
                >
                    <span className="md:text-lg">
                        Se exportarán{" "}
                        <strong className="font-bold text-gray-700">
                            {selectedRouteRows.length > 0
                                ? "solo las Rutas seleccionadas."
                                : "todas las Rutas."}
                        </strong>
                    </span>
                </AlertDialogConfirm>

                <RouteDialogDelete
                    routeList={routeList}
                    setRouteList={setRouteList}
                    selectedRouteRows={selectedRouteRows}
                    setSelectedRouteRows={setSelectedRouteRows}
                    routeToDelete={routeToDelete}
                    setRouteToDelete={setRouteToDelete}
                />
            </div>

            {!loading && (
                <DataTable
                    data={routeList}
                    columns={routeColumns}
                    pageSize={pageSize}
                    filterColumnList={routeFilterColumnList}
                />
            )}
        </>
    );
};

const ProductTabContent = () => {
    //STATE
    const [loading, setLoading] = useState<boolean>(true);

    //Products State
    const [productList, setProductList] = useState<Product[]>([]);
    const [selectedProductRows, setSelectedProductRows] = useState<number[]>([]);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // EVENT HANDLERS
    // Product Handlers and Component
    const productColumns = productDataTableColumns(
        selectedProductRows,
        setSelectedProductRows,
        setProductToEdit,
        setProductToDelete,
    );

    // USE EFFECT
    useEffect(() => {
        const loadProducts = async () => {
            const products = await ProductApi.getProductList();
            setProductList(products);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded products: ", { products });
            }
        };

        loadProducts();
    }, []);

    const pageSize = 20;
    return (
        <>
            <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                <ProductDialogForm
                    productList={productList}
                    setProductList={setProductList}
                    productToEdit={productToEdit}
                    setProductToEdit={setProductToEdit}
                />

                <AlertDialogConfirm
                    buttonContent={
                        <>
                            <Table2Icon className="w-6 h-6" />
                            Exportar
                        </>
                    }
                    variant="green"
                    size="md-lg"
                    onClickFunctionPromise={async () => {
                        await ProductApi.exportProductList();
                    }}
                >
                    <span className="md:text-lg">
                        Se exportarán{" "}
                        <strong className="font-bold text-gray-700">todos los Productos</strong>
                    </span>
                </AlertDialogConfirm>

                <ProductDialogDelete
                    productList={productList}
                    setProductList={setProductList}
                    selectedProductRows={selectedProductRows}
                    setSelectedProductRows={setSelectedProductRows}
                    productToDelete={productToDelete}
                    setProductToDelete={setProductToDelete}
                />
            </div>

            {!loading && (
                <DataTable
                    data={productList}
                    columns={productColumns}
                    pageSize={pageSize}
                    filterColumnList={productFilterColumnList}
                />
            )}
        </>
    );
};

export const RouteAndProduct = ({ title }: Readonly<PropsTitle>) => {
    useEffect(() => {
        document.title = title;
    }, []);

    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <Tabs defaultValue="routes" className="w-full">
                    <TabsList>
                        <TabsTrigger
                            value="routes"
                            className="text-xl md:text-2xl text-left mb-2 md:mb-0"
                        >
                            Precios
                        </TabsTrigger>
                        <TabsTrigger
                            value="products"
                            className="text-xl md:text-2xl text-left mb-2 md:mb-0"
                        >
                            Productos
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="routes" className="md-lg:-mt-8">
                        <RouteTabContent />
                    </TabsContent>
                    <TabsContent value="products" className="md-lg:-mt-8">
                        <ProductTabContent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
