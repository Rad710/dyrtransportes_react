import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { DownloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { Tabs, Box, Text, Button, TextField } from "@radix-ui/themes";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    getDatabaseBackup,
    getExportarFormato,
    getStatistics,
    uploadCobranzas,
} from "../../utils/homepage";

import { toast } from "@/components/ui/use-toast";

import { Bar } from "react-chartjs-2";
import FormDate from "../../components/FormDate";
import TableStatistics from "./components/TableStatistics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Index({ title }) {
    useEffect(() => {
        document.title = title;
    }, []);

    const [tab, setTab] = useState("ganancias");

    const [statistics, setStatistics] = useState({});

    const [barData, setBarData] = useState({
        viajes: 0,
        kgDestino: 0,
        kgOrigen: 0,
        totalFletes: 0,
        totalGastoFacturado: 0,
        totalGastoNoFacturado: 0,
        totalLiquidacionViajes: 0,
        totalPerdidas: 0,
    });

    const [loading, setLoading] = useState(true);
    const [disableUpload, setDisableUpload] = useState(true);

    const today = new Date();
    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Last month ago
    const lastMonthAgo = new Date(today);
    lastMonthAgo.setMonth(today.getMonth() - 1);

    const [startDate, setStartDate] = useState(lastMonthAgo);
    const [endDate, setEndDate] = useState(tomorrow);

    const [uploadDate, setUploadDate] = useState(null);

    const fileInputRef = useRef(null);

    const loadStatistics = async () => {
        setLoading(true);
        const result = await getStatistics(
            startDate?.toISOString()?.slice(0, 10),
            endDate?.toISOString()?.slice(0, 10)
        );
        if (!result?.response && !result?.message) {
            setStatistics(result.choferes);

            const barResult = {};
            for (const field in result.totales) {
                barResult[field] = Number(result.totales[field]);
            }

            setBarData(barResult);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatistics();
    }, []);

    const setUpChart = () => {
        const options = {
            indexAxis: "y",
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    position: "right",
                },
                title: {
                    display: true,
                    text: `Resumen de Ganancias de ${startDate.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        timeZone: "GMT",
                    })} hasta ${endDate.toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        timeZone: "GMT",
                    })}`,
                },
            },
        };

        const data = {
            labels: ["Resumen"],
            datasets: [
                {
                    label: "Ingresos",
                    data: [barData.totalFletes],
                    backgroundColor: "rgba(53, 162, 235, 0.8)",
                },
                {
                    label: "Egresos",
                    data: [barData.totalLiquidacionViajes],
                    backgroundColor: "rgba(255, 150, 80, 0.8)",
                },
                {
                    label: "Pérdidas",
                    data: [barData.totalPerdidas],
                    backgroundColor: "rgba(255, 80, 80, 0.8)",
                },
                {
                    label: "Ganancias",
                    data: [
                        barData.totalFletes -
                            (barData.totalLiquidacionViajes + barData.totalPerdidas),
                    ],
                    backgroundColor: "rgba(74, 184, 68, 0.8)",
                },
            ],
        };

        return { options, data };
    };

    const barProperties = useMemo(() => setUpChart(), [statistics]);

    const handleFileChange = async (event) => {
        setDisableUpload(true);
        document.body.style.cursor = "wait";
        const file = event.target.files[0];

        if (file && uploadDate) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fechaCreacion", uploadDate.toISOString().slice(0, 10));

            const response = await uploadCobranzas(formData);

            if (!response?.response && !response?.message) {
                toast({
                    description: "Archivo subido exitosamente",
                    variant: "success",
                });
            }
        }
        document.body.style.cursor = "default";
        setDisableUpload(false);
    };

    const handleDownloadFormat = async () => {
        await getExportarFormato();
    };

    const currencyFormatter = new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
    });

    const ganancia = barData.totalFletes - (barData.totalLiquidacionViajes + barData.totalPerdidas);

    return (
        <>
            <Tabs.Root value={tab} onValueChange={(value) => setTab(value)}>
                <Tabs.List>
                    <Tabs.Trigger value="ganancias">
                        <span className="text-xl">Ganancias</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="estadisticas">
                        <span className="text-xl">Estadisticas</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="cargarPlanillas">
                        <span className="text-xl">Cargar Planillas</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="baseDeDatos">
                        <span className="text-xl">Base de Datos</span>
                    </Tabs.Trigger>
                </Tabs.List>

                {!loading && (
                    <Box px="4" pt="3" pb="2">
                        <Tabs.Content value="ganancias">
                            <FormDate
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                onClick={async () => {
                                    await loadStatistics();
                                }}
                            />

                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-3/5">
                                    <Bar
                                        options={barProperties.options}
                                        data={barProperties.data}
                                        redraw={true}
                                        updateMode="resize"
                                    />
                                </div>
                                <div className="flex flex-col gap-10 ml-12 md:mt-10 mt-0 md:w-2/5">
                                    <Text size="6" className="font-black">
                                        Total{" "}
                                        <em className="text-blue-700">
                                            Ingresos:{" "}
                                            {currencyFormatter.format(barData.totalFletes)}
                                        </em>
                                    </Text>

                                    <Text size="6" className="font-black">
                                        Total{" "}
                                        <em className="text-orange-600">
                                            Egresos:{" "}
                                            {currencyFormatter.format(
                                                barData.totalLiquidacionViajes
                                            )}
                                        </em>
                                    </Text>

                                    <Text size="6" className="font-black">
                                        Total{" "}
                                        <em className="text-red-600">
                                            Pérdidas:{" "}
                                            {currencyFormatter.format(barData.totalPerdidas)}
                                        </em>
                                    </Text>

                                    <Text size="6" className="font-black">
                                        Total{" "}
                                        <em
                                            className={
                                                ganancia >= 0 ? "text-green-600" : "text-red-600"
                                            }
                                        >
                                            Ganancias: {currencyFormatter.format(ganancia)}
                                        </em>
                                    </Text>

                                    <Text size="6" className="font-black">
                                        Total Viajes: {barData.viajes}
                                    </Text>
                                </div>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="estadisticas">
                            <FormDate
                                startDate={startDate}
                                setStartDate={setStartDate}
                                endDate={endDate}
                                setEndDate={setEndDate}
                                onClick={async () => {
                                    await loadStatistics();
                                }}
                            />

                            <TableStatistics statistics={statistics} />
                            {Object.keys(statistics).length === 0 && (
                                <p className="text-center p-4 text-lg">No hay datos</p>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="cargarPlanillas">
                            <div className="mt-10 text-center">
                                <Text size="7">Cargar Cobranzas</Text>
                                <br />
                                <Text
                                    size="2"
                                    className=" text-blue-600 underline hover:cursor-pointer"
                                    onClick={handleDownloadFormat}
                                >
                                    Descargar formato
                                </Text>

                                <div className="flex flex-row gap-6 justify-center mt-10">
                                    <Text as="div" size="3" mb="1" weight="bold" mt="1">
                                        Ingrese Fecha de Planilla
                                    </Text>
                                    <TextField.Slot
                                        name="uploadDate"
                                        type="date"
                                        onChange={(e) => {
                                            const inputDate = new Date(e.target.value);
                                            if (!isNaN(inputDate)) {
                                                setUploadDate(inputDate);
                                                setDisableUpload(false);
                                            } else {
                                                setUploadDate(null);
                                                setDisableUpload(true);
                                            }
                                        }}
                                        value={uploadDate?.toISOString()?.slice(0, 10)}
                                    />
                                </div>

                                <div className="mt-9">
                                    <Button
                                        color="grass"
                                        variant="solid"
                                        size="4"
                                        onClick={() => {
                                            fileInputRef.current.click();
                                        }}
                                        disabled={disableUpload}
                                    >
                                        <UploadIcon width="20" height="20" /> Subir Planilla
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="baseDeDatos">
                            <div className="mt-10 text-center">
                                <Text size="7">
                                    Crea una Copia de Seguridad para respaldar los datos
                                </Text>

                                <br />
                                <Button
                                    mt="6"
                                    color="grass"
                                    variant="solid"
                                    size="4"
                                    onClick={async () => {
                                        await getDatabaseBackup();
                                    }}
                                >
                                    <DownloadIcon width="20" height="20" /> Descargar Copia
                                </Button>
                            </div>
                        </Tabs.Content>
                    </Box>
                )}
            </Tabs.Root>
        </>
    );
}

export default Index;
