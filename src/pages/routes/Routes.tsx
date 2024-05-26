import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import FormPrecios from "./components/FormPrecios";
import { RouteDataTable } from "./components/RouteDataTable";
import { DialogConfirm } from "@/components/DialogConfirm";
import { RouteApi } from "./route_utils";

import { ColorRing } from "react-loader-spinner";
import { PropsTitle } from "@/types";
import { Route } from "./types";
import { Table2Icon, Trash2Icon } from "lucide-react";
import { toastSuccess } from "@/utils/notification";

export function Routes({ title }: Readonly<PropsTitle>) {
    const [routeList, setRouteList] = useState<Route[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<Route>({ route_code: null });

    const hasChecked = routeList.some((item) => item.checked);

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
        const toDeleteRouteCodeList = routeList
            .filter((item) => item.checked)
            .map((item) => item.route_code);

        if (import.meta.env.VITE_DEBUG) {
            console.log({ toDeleteRouteCodeList });
        }

        const result = await RouteApi.deleteRouteList(toDeleteRouteCodeList);

        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            console.log({ result });
            toastSuccess(result.success);
            setRouteList(routeList.filter((item) => !item.checked));
        }
    };

    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold text-left md:w-1/3 mb-2 md:mb-0">
                    Lista de Precios
                </h2>

                <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end md:w-2/3">
                    {/* <FormPrecios
                        formData={formData}
                        setFormData={setFormData}
                        listaPrecios={listaPrecios}
                        setListaPrecios={setListaPrecios}
                    /> */}

                    {/* TODO set color */}
                    <DialogConfirm
                        buttonText="Exportar"
                        dialogText="Se exportarán solo las Rutas seleccionadas."
                        handler={async () =>
                            RouteApi.exportRouteList(
                                routeList
                                    .filter((item) => item.checked)
                                    .map((item) => item.route_code)
                            )
                        }
                        disabled={!hasChecked}
                    >
                        <Button
                            variant="default"
                            size="md-lg"
                            onClick={async () =>
                                !hasChecked
                                    ? RouteApi.exportRouteList()
                                    : void 0
                            }
                        >
                            <Table2Icon className="w-8 h-8 mr-2" />
                            Exportar
                        </Button>
                    </DialogConfirm>

                    <DialogConfirm
                        buttonText="Eliminar"
                        dialogText="Esta acción es irreversible y se eliminará la Ruta permanentemente."
                        handler={handleDeleteRouteList}
                        disabled={!hasChecked}
                    >
                        <Button
                            variant="destructive"
                            size="md-lg"
                            disabled={!hasChecked}
                        >
                            <Trash2Icon className="w-8 h-8 mr-2" />
                            Eliminar
                        </Button>
                    </DialogConfirm>
                </div>
            </div>

            {!loading && (
                <RouteDataTable data={routeList} setData={setRouteList} />
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
}
