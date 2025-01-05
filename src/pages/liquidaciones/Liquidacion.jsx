import { useEffect, useState } from "react";
import { useMatch } from "react-router-dom";

import { Box, Button, Strong, Tabs, Text } from "@radix-ui/themes";
import { TableIcon, UpdateIcon } from "@radix-ui/react-icons";

import AlertButton from "../../components/AlertButton";
import FormLiquidacionViajes from "./components/FormLiquidacionViajes";
import TableLiquidacionViajes from "./components/TableLiquidacionViajes";
import FormLiquidacionGastos from "./components/FormLiquidacionGastos";
import TableLiquidacionGastos from "./components/TableLiquidacionGastos";
import { RouteApi } from "../route_product/route_product_utils";
import {
    deleteLiquidacionGasto,
    deleteLiquidacionViaje,
    getExportarLiquidacion,
    getLiquidacion,
    getLiquidacionGastos,
    getLiquidacionViajes,
    postLiquidacion,
    putLiquidacion,
    putLiquidacionViaje,
} from "../../utils/liquidaciones";
import { toast } from "@/components/ui/use-toast";
import AlertSwitch from "./components/AlertSwitch";
import { ColorRing } from "react-loader-spinner";

function Liquidacion({ title }) {
    useEffect(() => {
        document.title = title;
    }, []);

    const match = useMatch("/liquidaciones/:chofer/:fecha");
    const { chofer, fecha } = match.params;

    const [tab, setTab] = useState("viajes");

    const [liquidacionViajes, setLiquidacionViajes] = useState([]);

    const currentDate = new Date().toISOString().slice(0, 10);
    const [formDataViajes, setFormDataViajes] = useState({
        id: "",
        fechaCreacion: null,
        tiquet: "",
        fechaViaje: currentDate,
        chofer: chofer,
        chapa: "",
        producto: "",
        origen: "",
        destino: "",
        precio: "",
        precioLiquidacion: "",
        kgOrigen: "",
        kgDestino: "",
        fechaLiquidacion: fecha,
    });

    const [liquidacionGastos, setLiquidacionGastos] = useState({
        conBoleta: [],
        sinBoleta: [],
    });

    const [formDataGastos, setFormDataGastos] = useState({
        id: "",
        fecha: currentDate,
        chofer: chofer,
        boleta: null,
        importe: "",
        fechaLiquidacion: fecha,
        razon: "",
    });

    const [liquidacion, setLiquidacion] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLiquidacion = async () => {
            const [resultViajes, resultGastos, resultLiquidacion] = await Promise.all([
                getLiquidacionViajes(chofer, fecha),
                getLiquidacionGastos(chofer, fecha),
                getLiquidacion(chofer, fecha),
            ]);

            const newViajes = resultViajes?.map((viaje) => ({
                ...viaje,
                checked: false,
            }));
            setLiquidacionViajes(newViajes ?? []);

            const conBoleta = resultGastos
                ?.filter((gasto) => gasto.boleta !== null)
                ?.map((gasto) => ({ ...gasto, checked: false }));
            const sinBoleta = resultGastos
                ?.filter((gasto) => gasto.boleta === null)
                ?.map((gasto) => ({ ...gasto, checked: false }));
            setLiquidacionGastos({
                conBoleta: conBoleta ?? [],
                sinBoleta: sinBoleta ?? [],
            });

            setLiquidacion(resultLiquidacion);
            setLoading(false);
        };

        loadLiquidacion();
    }, []);

    const handleDelete = async () => {
        if (tab === "viajes") {
            const toDelete = liquidacionViajes.filter((entry) => entry.checked);

            const deletePromises = toDelete.map(
                async (entrada) => await deleteLiquidacionViaje(entrada.id)
            );

            const results = await Promise.all(deletePromises);

            results.forEach((element) => {
                if (element?.response || element?.message) {
                    return;
                }
            });

            setLiquidacionViajes(liquidacionViajes.filter((entry) => entry.checked === false));
        }

        if (tab === "gastos") {
            const toDeleteConBoleta = liquidacionGastos.conBoleta.filter((entry) => entry.checked);
            const toDeleteSinBoleta = liquidacionGastos.sinBoleta.filter((entry) => entry.checked);

            const deletePromisesConBoleta = toDeleteConBoleta.map(
                async (entrada) => await deleteLiquidacionGasto(entrada.id)
            );
            const deletePromisesSinBoleta = toDeleteSinBoleta.map(
                async (entrada) => await deleteLiquidacionGasto(entrada.id)
            );

            const results = await Promise.all([
                ...deletePromisesConBoleta,
                ...deletePromisesSinBoleta,
            ]);

            results.forEach((element) => {
                if (element?.response || element?.message) {
                    return;
                }
            });

            setLiquidacionGastos({
                conBoleta: liquidacionGastos.conBoleta.filter((entry) => entry.checked === false),
                sinBoleta: liquidacionGastos.sinBoleta.filter((entry) => entry.checked === false),
            });
        }
    };

    const handleExportar = async () => {
        await getExportarLiquidacion(chofer, fecha);
    };

    const onCheckedChange = async () => {
        const newLiquidacion = { ...liquidacion, pagado: !liquidacion.pagado };
        await putLiquidacion(newLiquidacion);

        const result = await postLiquidacion(chofer);
        if (result?.response || result?.message) {
            newLiquidacion.pagado = false;
            await putLiquidacion(newLiquidacion);
        }
        setLiquidacion(newLiquidacion);
    };

    const sincronizePrecios = async () => {
        const newPrecios = await RouteApi.getRoutes();

        if (newPrecios?.response || newPrecios?.message) {
            return;
        }

        const preciosJSON = {};
        for (const entrada of newPrecios) {
            preciosJSON[`${entrada.origen}/${entrada.destino}`] = entrada.precioLiquidacion;
        }

        const updatedViajes = liquidacionViajes.map((viaje) => ({
            ...viaje,
            precioLiquidacion: preciosJSON[`${viaje.origen}/${viaje.destino}`] ?? 0,
            fechaViaje: new Date(viaje.fechaViaje).toISOString().slice(0, 10),
            chofer: chofer,
        }));
        const putPromises = updatedViajes.map(
            async (entrada) =>
                await putLiquidacionViaje({
                    ...entrada,
                    fechaLiquidacion: fecha,
                })
        );

        const result = await Promise.all(putPromises);

        result.forEach((element) => {
            if (element?.response || element?.message) {
                return;
            }
        });

        const resultViajes = await getLiquidacionViajes(chofer, fecha);

        if (!resultViajes?.response && !resultViajes?.message) {
            const newViajes = resultViajes.map((viaje) => ({
                ...viaje,
                checked: false,
            }));
            setLiquidacionViajes(newViajes);
            toast({
                description: "Precios actualizados exitosamente",
                variant: "success",
            });
        }
    };

    return (
        <div className="p-4">
            <div className="md:flex justify-between items-center">
                <h2 className="text-3xl font-bold text-left md:w-1/2">
                    {`${chofer} - ${new Date(fecha).toLocaleDateString("es-ES", {
                        month: "long",
                        day: "numeric",
                        timeZone: "GMT",
                    })}`}
                </h2>

                <div className="gap-5 md:flex justify-end md:1/2">
                    {tab === "viajes" ? (
                        <FormLiquidacionViajes
                            formData={formDataViajes}
                            setFormData={setFormDataViajes}
                            chofer={chofer}
                            fecha={fecha}
                            liquidacionViajes={liquidacionViajes}
                            setLiquidacionViajes={setLiquidacionViajes}
                        />
                    ) : (
                        <FormLiquidacionGastos
                            formData={formDataGastos}
                            setFormData={setFormDataGastos}
                            chofer={chofer}
                            fecha={fecha}
                            liquidacionGastos={liquidacionGastos}
                            setLiquidacionGastos={setLiquidacionGastos}
                        />
                    )}
                    <Button color="grass" variant="solid" size="4" onClick={handleExportar}>
                        <TableIcon width="20" height="20" />
                        Exportar
                    </Button>

                    <AlertButton
                        handleDelete={handleDelete}
                        disabled={
                            !(
                                liquidacionViajes.some((viaje) => viaje.checked) ||
                                liquidacionGastos.conBoleta.some((gasto) => gasto.checked) ||
                                liquidacionGastos.sinBoleta.some((gasto) => gasto.checked)
                            )
                        }
                    />
                </div>
            </div>

            <Tabs.Root value={tab} onValueChange={(value) => setTab(value)}>
                <Tabs.List>
                    <Tabs.Trigger value="viajes">
                        <span className="text-lg">Viajes</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="gastos">
                        <span className="text-lg">Gastos</span>
                    </Tabs.Trigger>

                    <div className="ml-10">
                        <Button color="cyan" onClick={sincronizePrecios}>
                            <UpdateIcon width="16" height="16" />
                            Sincronizar Precios
                        </Button>
                    </div>

                    <div className="pt-1 ml-10">
                        <Text size="3">
                            <Strong>Pagado: </Strong>
                        </Text>
                        <AlertSwitch
                            checked={liquidacion.pagado}
                            onCheckedChange={onCheckedChange}
                        />
                    </div>
                </Tabs.List>

                {!loading && (
                    <Box px="4" pt="3" pb="2">
                        <Tabs.Content value="viajes">
                            <TableLiquidacionViajes
                                liquidacionViajes={liquidacionViajes}
                                setLiquidacionViajes={setLiquidacionViajes}
                            />
                            {liquidacionViajes.length === 0 && (
                                <p className="text-center p-4 text-lg">No hay datos ingresados</p>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="gastos">
                            <TableLiquidacionGastos
                                liquidacionGastos={liquidacionGastos}
                                setLiquidacionGastos={setLiquidacionGastos}
                            />
                        </Tabs.Content>
                    </Box>
                )}

                <ColorRing
                    visible={loading}
                    height="80"
                    width="80"
                    ariaLabel="blocks-loading"
                    wrapperClass="w-1/3 h-1/3 m-auto"
                    colors={["#A2C0E8", "#8DABDF", "#7896D6", "#6381CD", "#6366F1"]}
                />
            </Tabs.Root>
        </div>
    );
}

export default Liquidacion;
