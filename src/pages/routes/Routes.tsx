"use client";
"use strict";

import { useState, useEffect } from "react";

import {
    routeDataTableColumns,
    routeFilterColumnList,
} from "./components/RouteDataTableColumns";
import { RouteDialogForm } from "./components/RouteDialogForm";

import { ProductApi, RouteApi } from "./route_utils";

import { PropsTitle } from "@/types";
import { Product, Route } from "./types";
import { Table2Icon, Trash2Icon } from "lucide-react";
import { toastSuccess } from "@/utils/notification";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { DataTable } from "@/components/ui/data-table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
    productDataTableColumns,
    productFilterColumnList,
} from "./components/ProductDataTableColumns";
import {
    ProductDialogForm,
    productFormSchema,
} from "./components/ProductDialogForm";

export const Routes = ({ title }: Readonly<PropsTitle>) => {
    const [loading, setLoading] = useState<boolean>(true);

    //Routes
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRouteRows, setSelectedRouteRows] = useState<number[]>([]);
    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

    const routeColumns = routeDataTableColumns(
        selectedRouteRows,
        setSelectedRouteRows,
        routeList,
        setRouteList,
        setRouteToEdit
    );

    useEffect(() => {
        document.title = title;

        const loadRoutesAndProducts = async () => {
            const [routes, products] = await Promise.all([
                RouteApi.getRouteList().then((list) =>
                    list.map((item) => ({
                        ...item,
                        price: parseFloat(item.price?.toString() ?? "") || 0,
                        payroll_price:
                            parseFloat(item.payroll_price?.toString() ?? "") ||
                            0,
                    }))
                ),
                ProductApi.getProductList(),
            ]);

            setRouteList(routes);
            setProductList(products);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log({ routes });
                console.log({ products });
            }
        };

        loadRoutesAndProducts();
    }, []);

    const handleDeleteRouteList = async (toDeleteRouteList: number[]) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { toDeleteRouteList });
        }

        const result = await RouteApi.deleteRouteList(toDeleteRouteList);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
            console.log({ toDeleteRouteList });
        }

        if (result?.success) {
            const selectedRoutesSet = new Set<number>(toDeleteRouteList);

            toastSuccess(result.success);
            setRouteList(
                routeList.filter(
                    (item) => !selectedRoutesSet.has(item.route_code ?? 0)
                )
            );
            setSelectedRouteRows([]);
        }
    };

    //Products
    const [productList, setProductList] = useState<Product[]>([]);

    const productForm = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
    });

    const handleCreateProduct = async (formData: Product) => {
        if (formData.product_code) {
            return;
        }

        const result = await ProductApi.postProduct(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setProductList([
                {
                    product_code: result.product_code,
                    product_name: result.product_name,
                },
                ...productList,
            ]);
            productForm.reset({
                productCode: undefined,
                productName: "",
            });

            productForm.setValue("successMessage", result.success);
            productForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            productForm.setValue("errorMessage", result.error);
            productForm.setValue("successMessage", undefined);
        }
    };

    const handleEditProduct = async (formData: Product) => {
        if (!formData.product_code) {
            return;
        }

        const result = await ProductApi.patchProduct(
            formData.product_code,
            formData
        );
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setProductList(
                productList.map((item) =>
                    formData.product_code === item.product_code
                        ? {
                              product_code: result.product_code,
                              product_name: result.product_name,
                          }
                        : item
                )
            );
            productForm.setValue("successMessage", result.success);
            productForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            productForm.setValue("errorMessage", result.error);
            productForm.setValue("successMessage", undefined);
        }
    };

    const handleEditProductItem = async (productToEdit: Product | null) => {
        if (!productToEdit) {
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log({ productList });
            console.log({ productToEdit });
        }
        productForm.setValue(
            "productCode",
            productToEdit?.product_code ?? undefined
        );
        productForm.setValue("productName", productToEdit?.product_name ?? "");

        //Use dialog button trigger and manually handle event changes
        const dialogTrigger = document.getElementById(
            "dialog-form-product-trigger"
        );
        dialogTrigger?.click();

        const observer = new MutationObserver(() => {
            if (
                !document.body.querySelector(
                    ":scope > #dialog-form-product-content"
                )
            ) {
                observer.disconnect();
                productForm.reset({
                    productCode: undefined,
                    productName: "",
                });

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Dialog was removed");
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: false,
        });
    };

    const handleDeleteProductItem = async (code?: number | null) => {
        if (!code) {
            return;
        }

        const result = await ProductApi.deleteProduct(code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setProductList(
                productList.filter((item) => item.product_code !== code)
            );
        }
    };

    const productColumns = productDataTableColumns(
        handleDeleteProductItem,
        handleEditProductItem
    );

    const pageSize = 20;
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
                                    if (selectedRouteRows.length === 0) {
                                        RouteApi.exportRouteList();
                                    } else {
                                        RouteApi.exportRouteList(
                                            selectedRouteRows
                                        );
                                    }
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

                            <AlertDialogConfirm
                                buttonContent={
                                    <>
                                        <Trash2Icon className="w-6 h-6" />
                                        Eliminar
                                    </>
                                }
                                onClickFunctionPromise={async () =>
                                    handleDeleteRouteList(selectedRouteRows)
                                }
                                disabled={selectedRouteRows.length === 0}
                                variant="destructive"
                                size="md-lg"
                            >
                                <span className="md:text-lg">
                                    Esta acción es irreversible. Se{" "}
                                    <strong className="font-bold text-gray-700">
                                        eliminarán permanentemente
                                    </strong>{" "}
                                    las Rutas seleccionadas.
                                </span>
                            </AlertDialogConfirm>
                        </div>

                        {!loading && (
                            <DataTable
                                data={routeList}
                                columns={routeColumns}
                                pageSize={pageSize}
                                filterColumnList={routeFilterColumnList}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="products" className="md-lg:-mt-8">
                        <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                            <ProductDialogForm
                                form={productForm}
                                handleSubmit={
                                    productForm.getValues("productCode")
                                        ? handleEditProduct
                                        : handleCreateProduct
                                }
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
