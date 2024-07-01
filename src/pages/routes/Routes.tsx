"use client";

import { useState, useEffect, useReducer } from "react";

import {
    routeColumns,
    routeFilterColumnList,
} from "./components/RouteDataTableColumns";
import { RouteDialogForm, routeFormSchema } from "./components/RouteDialogForm";

import { ProductApi, RouteApi } from "./route_utils";

import { ColorRing } from "react-loader-spinner";
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

import Globalize from "globalize";
import cldrDataES from "cldr-data/main/es/numbers.json";
import cldrDataEN from "cldr-data/main/en/numbers.json";
import cldrDataSupplementSubTags from "cldr-data/supplemental/likelySubtags.json";
import {
    productColumns,
    productFilterColumnList,
} from "./components/ProductDataTableColumns";
import {
    ProductDialogForm,
    productFormSchema,
} from "./components/ProductDialogForm";

Globalize.load(cldrDataSupplementSubTags);
Globalize.load(cldrDataEN);
Globalize.load(cldrDataES);
Globalize.locale("es");

const formatter = Globalize.numberFormatter({
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const Routes = ({ title }: Readonly<PropsTitle>) => {
    const [loading, setLoading] = useState<boolean>(true);

    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    //Routes
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRouteRows, setSelectedRouteRows] = useState<number[]>([]);

    const routeForm = useForm<z.infer<typeof routeFormSchema>>({
        resolver: zodResolver(routeFormSchema),
    });

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

    const setRouteEditFormData = () => {
        if (selectedRouteRows.length === 1) {
            const routeToEdit = routeList.find(
                (item) => item.route_code === selectedRouteRows?.at(0)
            );

            routeForm.setValue(
                "routeCode",
                routeToEdit?.route_code ?? undefined
            );
            routeForm.setValue("origin", routeToEdit?.origin ?? "");
            routeForm.setValue("destination", routeToEdit?.destination ?? "");
            routeForm.setValue(
                "priceString",
                formatter(
                    typeof routeToEdit?.price === "number"
                        ? routeToEdit?.price
                        : 0
                ) || ""
            );
            routeForm.setValue(
                "payrollPriceString",
                formatter(
                    typeof routeToEdit?.payroll_price === "number"
                        ? routeToEdit.payroll_price
                        : 0
                ) || ""
            );
            forceUpdate();
        } else {
            routeForm.reset({
                routeCode: undefined,
                origin: "",
                destination: "",
                payrollPriceString: "",
                priceString: "",
            });
        }
    };

    useEffect(() => {
        setRouteEditFormData();
    }, [selectedRouteRows]);

    const handleCreateRoute = async (formData: Route) => {
        if (formData.route_code) {
            return;
        }

        const result = await RouteApi.postRoute(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setRouteList([
                {
                    route_code: result.route_code,
                    origin: result.origin,
                    destination: result.destination,
                    price: parseFloat(result.price?.toString() ?? "") || 0,
                    payroll_price:
                        parseFloat(result.payroll_price?.toString() ?? "") || 0,
                },
                ...routeList,
            ]);
            routeForm.reset({
                routeCode: undefined,
                origin: "",
                destination: "",
                payrollPriceString: "",
                priceString: "",
            });

            routeForm.setValue("successMessage", result.success);
            routeForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            routeForm.setValue("errorMessage", result.error);
            routeForm.setValue("successMessage", undefined);
        }
    };

    const handleEditRoute = async (formData: Route) => {
        if (!formData.route_code) {
            return;
        }

        const result = await RouteApi.patchRoute(formData.route_code, formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setRouteList(
                routeList.map((item) =>
                    formData.route_code === item.route_code
                        ? {
                              route_code: result.route_code,
                              origin: result.origin,
                              destination: result.destination,
                              price:
                                  parseFloat(result.price?.toString() ?? "") ||
                                  0,
                              payroll_price:
                                  parseFloat(
                                      result.payroll_price?.toString() ?? ""
                                  ) || 0,
                          }
                        : item
                )
            );
            routeForm.setValue("successMessage", result.success);
            routeForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            routeForm.setValue("errorMessage", result.error);
            routeForm.setValue("successMessage", undefined);
        }
    };

    const handleDeleteRouteList = async (toDeleteRouteList: number[]) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { toDeleteRouteList });
        }

        const result = await RouteApi.deleteRouteList(toDeleteRouteList);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            const selectedRoutesSet = new Set<number>(toDeleteRouteList);

            console.log({ selectedRoutesSet });
            console.log({ result });
            toastSuccess(result.success);
            setRouteList(
                routeList.filter(
                    (item) => !selectedRoutesSet.has(item.route_code ?? 0)
                )
            );
            setSelectedRouteRows([]);
        }
    };

    const handleDeleteRouteItemAction = async (code?: number | null) => {
        if (code) {
            await handleDeleteRouteList([code]);
        }
    };

    const handleEditRouteItemAction = (routeToEdit?: Route | null) => {
        if (!routeToEdit) {
            return;
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log({ routeList });
            console.log({ routeToEdit });
        }
        routeForm.setValue("routeCode", routeToEdit?.route_code ?? undefined);
        routeForm.setValue("origin", routeToEdit?.origin ?? "");
        routeForm.setValue("destination", routeToEdit?.destination ?? "");
        routeForm.setValue(
            "priceString",
            formatter(
                typeof routeToEdit?.price === "number" ? routeToEdit?.price : 0
            ) || ""
        );
        routeForm.setValue(
            "payrollPriceString",
            formatter(
                typeof routeToEdit?.payroll_price === "number"
                    ? routeToEdit.payroll_price
                    : 0
            ) || ""
        );
        forceUpdate();

        //Use dialog button trigger and manually handle event changes
        const dialogTrigger = document.getElementById(
            "dialog-form-route-trigger"
        );
        dialogTrigger?.click();

        const observer = new MutationObserver(() => {
            if (
                !document.body.querySelector(
                    ":scope > #dialog-form-route-content"
                )
            ) {
                observer.disconnect();
                setRouteEditFormData();
                forceUpdate();

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

    const routeDataTableColumns = routeColumns(
        selectedRouteRows,
        setSelectedRouteRows,
        handleDeleteRouteItemAction,
        handleEditRouteItemAction
    );

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
        forceUpdate();

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
                forceUpdate();

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
            setProductList(
                productList.filter((item) => item.product_code !== code)
            );
        }
    };

    const productDataTableColumns = productColumns(
        handleDeleteProductItem,
        handleEditProductItem
    );

    const pageSize = 20;
    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <ColorRing
                    visible={loading}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperClass="w-1/3 h-1/3 m-auto"
                    colors={[
                        "#A2C0E8",
                        "#8DABDF",
                        "#7896D6",
                        "#6381CD",
                        "#6366F1",
                    ]}
                />

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
                                form={routeForm}
                                handleSubmit={
                                    routeForm.getValues("routeCode")
                                        ? handleEditRoute
                                        : handleCreateRoute
                                }
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
                                onClickFunctionPromise={async () =>
                                    RouteApi.exportRouteList(selectedRouteRows)
                                }
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
                                columns={routeDataTableColumns}
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
                                columns={productDataTableColumns}
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
