import { useState, useEffect, useMemo } from "react";

import {
    routeColumns,
    routeFilterColumnList,
} from "./components/RouteDataTableColumns";
import { RouteApi } from "./route_utils";

import { ColorRing } from "react-loader-spinner";
import { PropsTitle } from "@/types";
import { Route } from "./types";
import { PlusIcon, Table2Icon, Trash2Icon } from "lucide-react";
import { toastSuccess } from "@/utils/notification";
import { DialogButtonConfirm } from "@/components/DialogButtonConfirm";
import { DataTable } from "@/components/DataTable";

export const Routes = ({ title }: Readonly<PropsTitle>) => {
    const [loading, setLoading] = useState<boolean>(true);

    const [routeList, setRouteList] = useState<Route[]>([]);
    const [selectedRouteRows, setSelectedRouteRows] = useState<
        (number | null)[]
    >([]);

    const [formData, setFormData] = useState<Route>({ route_code: null });

    useEffect(() => {
        document.title = title;

        const loadRoutes = async () => {
            const routes = await RouteApi.getRouteList();
            setRouteList(routes);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log({ routes });
            }
        };
        loadRoutes();
    }, []);

    const handleDeleteRouteList = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("To delete: ", { selectedRouteRows });
        }

        const result = await RouteApi.deleteRouteList(selectedRouteRows);

        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            console.log({ result });
            toastSuccess(result.success);
            setRouteList(
                routeList.filter(
                    (item) => !selectedRouteRows.includes(item.route_code ?? 0)
                )
            );
            setSelectedRouteRows([]);
        }
    };

    const handleDeleteItemAction = async (code: number | null) => {
        const result = await RouteApi.deleteRouteList([code]);

        if (import.meta.env.VITE_DEBUG) {
            console.log("handleDeleteItemAction: ", { result });
        }

        if (result?.success) {
            console.log({ result });
            toastSuccess(result.success);
            setRouteList(routeList.filter((item) => item.route_code !== code));
            setSelectedRouteRows(
                selectedRouteRows.filter((item) => item !== code)
            );
        }
    };

    const columns = useMemo(
        () =>
            routeColumns({
                selectedRouteRows,
                setSelectedRouteRows,
                handleDeleteItemAction,
            }),
        []
    );
    const pageSize = 20;

    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold text-left md:w-1/6 mb-2 md:mb-0">
                    Lista de Precios
                </h2>

                <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end md:w-5/6">
                    {/* <FormPrecios
                        formData={formData}
                        setFormData={setFormData}
                        listaPrecios={listaPrecios}
                        setListaPrecios={setListaPrecios}
                    /> */}

                    <DialogButtonConfirm
                        dialogContent={
                            <span className="md:text-lg">
                                Se exportarán{" "}
                                <strong className="font-bold text-gray-700">
                                    {selectedRouteRows.length > 0
                                        ? "solo las Rutas seleccionadas."
                                        : "todas las Rutas."}
                                </strong>
                            </span>
                        }
                        buttonContent={
                            <>
                                <PlusIcon className="w-6 h-6" />
                                Agregar
                            </>
                        }
                        variant="default"
                        size="md-lg"
                        onClickFunctionPromise={() =>
                            RouteApi.exportRouteList(selectedRouteRows)
                        }
                    />

                    {/* TODO set color */}
                    <DialogButtonConfirm
                        dialogContent={
                            <span className="md:text-lg">
                                Se exportarán{" "}
                                <strong className="font-bold text-gray-700">
                                    {selectedRouteRows.length > 0
                                        ? "solo las Rutas seleccionadas."
                                        : "todas las Rutas."}
                                </strong>
                            </span>
                        }
                        buttonContent={
                            <>
                                <Table2Icon className="w-6 h-6" />
                                Exportar
                            </>
                        }
                        variant="default"
                        size="md-lg"
                        onClickFunctionPromise={() =>
                            RouteApi.exportRouteList(selectedRouteRows)
                        }
                    />

                    <DialogButtonConfirm
                        dialogContent={
                            <span className="md:text-lg">
                                Esta acción es irreversible y se{" "}
                                <strong className="font-bold text-gray-700">
                                    eliminará
                                </strong>{" "}
                                la Ruta permanentemente.
                            </span>
                        }
                        buttonContent={
                            <>
                                <Trash2Icon className="w-6 h-6" />
                                Eliminar
                            </>
                        }
                        onClickFunctionPromise={handleDeleteRouteList}
                        disabled={selectedRouteRows.length == 0}
                        variant="destructive"
                        size="md-lg"
                    />
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
