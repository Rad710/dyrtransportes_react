"use client";

import { useState, useEffect } from "react";

import {
    routeColumns,
    routeFilterColumnList,
} from "./components/RouteDataTableColumns";
import { RouteDialogForm, routeFormSchema } from "./components/RouteDialogForm";

import { RouteApi } from "./route_utils";

import { ColorRing } from "react-loader-spinner";
import { PropsTitle } from "@/types";
import { Route } from "./types";
import { Table2Icon, Trash2Icon } from "lucide-react";
import { toastSuccess } from "@/utils/notification";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { DataTable } from "@/components/ui/data-table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Globalize from "globalize";
import cldrDataES from "cldr-data/main/es/numbers.json";
import cldrDataEN from "cldr-data/main/en/numbers.json";
import cldrDataSupplementSubTags from "cldr-data/supplemental/likelySubtags.json";

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

    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRouteRows, setSelectedRouteRows] = useState<number[]>([]);

    const form = useForm<z.infer<typeof routeFormSchema>>({
        resolver: zodResolver(routeFormSchema),
    });

    const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

    useEffect(() => {
        document.title = title;

        const loadRoutes = async () => {
            const routes = await RouteApi.getRouteList().then((list) =>
                list.map((item) => ({
                    ...item,
                    price: parseFloat(item.price?.toString() ?? "") || 0,
                    payroll_price:
                        parseFloat(item.payroll_price?.toString() ?? "") || 0,
                }))
            );

            setRouteList(routes);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log({ routes });
            }
        };

        loadRoutes();
    }, []);

    useEffect(() => {
        if (selectedRouteRows.length === 1) {
            setRouteToEdit(
                routeList?.find(
                    (item) => item.route_code === selectedRouteRows?.at(0)
                ) ?? null
            );
        } else {
            setRouteToEdit(null);
        }
    }, [selectedRouteRows]);

    useEffect(() => {
        if (routeToEdit) {
            form.setValue("routeCode", routeToEdit?.route_code ?? undefined);
            form.setValue("origin", routeToEdit?.origin ?? "");
            form.setValue("destination", routeToEdit?.destination ?? "");
            form.setValue(
                "priceString",
                formatter(
                    typeof routeToEdit?.price === "number"
                        ? routeToEdit?.price
                        : 0
                ) || ""
            );
            form.setValue(
                "payrollPriceString",
                formatter(
                    typeof routeToEdit?.payroll_price === "number"
                        ? routeToEdit.payroll_price
                        : 0
                ) || ""
            );
        } else {
            form.reset({
                routeCode: undefined,
                origin: "",
                destination: "",
                payrollPriceString: "",
                priceString: "",
            });
        }
    }, [routeToEdit]);

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
            form.setValue("successMessage", result.success);
            form.setValue("errorMessage", undefined);
            form.reset({
                routeCode: undefined,
                origin: "",
                destination: "",
                payrollPriceString: "",
                priceString: "",
            });
        }

        if (result?.error) {
            form.setValue("errorMessage", result.error);
            form.setValue("successMessage", undefined);
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
            form.setValue("successMessage", result.success);
            form.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            form.setValue("errorMessage", result.error);
            form.setValue("successMessage", undefined);
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

    const handleDeleteItemAction = async (code?: number | null) => {
        if (code) {
            await handleDeleteRouteList([code]);
        }
    };

    const handleEditItemAction = (code?: number | null) => {
        if (!code) {
            return;
        }

        const itemToEdit =
            routeList?.find((item) => item.route_code === code) ?? null;
        if (import.meta.env.VITE_DEBUG) {
            console.log({ routeList });
            console.log({ code, itemToEdit });
        }
        setRouteToEdit(itemToEdit);

        //Use dialog button trigger and manually handle event changes
        const dialogTrigger = document.getElementById("dialog-form-trigger");
        dialogTrigger?.click();

        const observer = new MutationObserver(() => {
            if (!document.body.querySelector(":scope > #dialog-form-content")) {
                observer.disconnect();

                if (selectedRouteRows.length === 1) {
                    setRouteToEdit(
                        routeList?.find(
                            (item) =>
                                item.route_code === selectedRouteRows?.at(0)
                        ) ?? null
                    );
                } else {
                    setRouteToEdit(null);
                }

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

    const columns = routeColumns(
        selectedRouteRows,
        setSelectedRouteRows,
        handleDeleteItemAction,
        handleEditItemAction
    );

    const pageSize = 20;
    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold text-left mb-2 md:mb-0">
                    Lista de Precios
                </h2>

                <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                    <RouteDialogForm
                        form={form}
                        handleSubmit={
                            form.getValues("routeCode")
                                ? handleEditRoute
                                : handleCreateRoute
                        }
                        routeToEdit={routeToEdit}
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
            </div>

            {!loading && (
                <DataTable
                    data={routeList}
                    columns={columns}
                    pageSize={pageSize}
                    filterColumnList={routeFilterColumnList}
                />
            )}

            <ColorRing
                visible={loading}
                height="80"
                width="80"
                ariaLabel="blocks-loading"
                wrapperClass="w-1/3 h-1/3 m-auto"
                colors={["#A2C0E8", "#8DABDF", "#7896D6", "#6381CD", "#6366F1"]}
            />
        </div>
    );
};
