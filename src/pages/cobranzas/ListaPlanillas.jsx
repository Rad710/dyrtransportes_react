import { useState, useEffect } from "react";

import { Link, Form, useMatch } from "react-router-dom";
import { Checkbox, Flex, Button } from "@radix-ui/themes";
import { PlusIcon, TableIcon } from "@radix-ui/react-icons";

import AlertButton from "../../components/AlertButton";
import CalloutMessage from "../../components/CalloutMessage";

import {
    getPlanillasOfYear,
    deletePlanilla,
    postPlanilla,
    getExportarInforme,
} from "../../utils/cobranza";

function ListaPlanillas({ title }) {
    const [planillas, setPlanillas] = useState([]);
    const [error, setError] = useState(null);

    const match = useMatch("/cobranzas/:year");
    const { year } = match.params;

    const [disableButton, setDisableButton] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = title;

        const fetchData = async () => {
            const response = await getPlanillasOfYear(year);

            if (!response?.response && !response?.message) {
                setPlanillas(response.map((planilla) => ({ fecha: planilla, checked: false })));
                setLoading(false);
            } else {
                setError(response?.response?.data);
            }
        };
        fetchData();
    }, [match]);

    const handleDelete = async () => {
        const planillasChecked = planillas
            .filter((planilla) => planilla.checked === true)
            .map((planilla) => new Date(planilla.fecha).toISOString().slice(0, 10));

        const deletePromises = planillasChecked.map(async (item) => await deletePlanilla(item));

        const confirmDelete = await Promise.all(deletePromises);

        confirmDelete.forEach((element) => {
            if (element?.response || element?.message) {
                setError(element.response.data);
            }
        });

        const newPlanillas = planillas.filter((planilla) => planilla.checked !== true);
        setPlanillas(newPlanillas);
    };

    const handleCheckboxChange = (fecha) => {
        const newPlanillas = planillas.map((planilla) => {
            if (planilla.fecha === fecha) {
                return { ...planilla, checked: !planilla.checked };
            }
            return planilla;
        });
        setPlanillas(newPlanillas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisableButton(true);
        document.body.style.cursor = "wait";

        const currentFecha = new Date();
        const newFecha = new Date(year, currentFecha.getMonth(), currentFecha.getDate());
        const result = await postPlanilla(newFecha);
        if (!result?.response && !result?.message) {
            setPlanillas([{ fecha: newFecha, checked: false }, ...planillas]);
        } else {
            setError(result?.response?.data);
        }
        setDisableButton(false);
        document.body.style.cursor = "default";
    };

    const handleExportar = async () => {
        const checkedPlanillas = planillas
            .filter((planilla) => planilla.checked)
            .map((planilla) => new Date(planilla.fecha).toISOString().slice(0, 10))
            .sort();

        const fechaInicio = checkedPlanillas.at(0);
        const fechaFin = checkedPlanillas.at(-1);

        if (fechaInicio && fechaFin) {
            await getExportarInforme(fechaInicio, fechaFin);
        }
    };

    return (
        <div className="p-4">
            <div className="md:flex justify-between mb-8 items-center">
                <h2 className="text-3xl font-bold text-left md:w-1/3">{`Planillas del ${year}`}</h2>

                <div className="gap-5 flex flex-col justify-end md:2/3 md:flex-row">
                    <Form onSubmit={handleSubmit}>
                        {error ? (
                            <CalloutMessage color="red" size="3">
                                A ocurrido un error
                            </CalloutMessage>
                        ) : (
                            <Button
                                color="grass"
                                variant="surface"
                                size="4"
                                type="submit"
                                ml="6"
                                disabled={disableButton}
                            >
                                <PlusIcon width="20" height="20" />
                                Agregar Planilla
                            </Button>
                        )}
                    </Form>

                    <Button
                        color="grass"
                        variant="solid"
                        size="4"
                        onClick={handleExportar}
                        disabled={planillas.filter((planilla) => planilla.checked).length > 2}
                    >
                        <TableIcon width="20" height="20" />
                        Exportar
                    </Button>

                    <AlertButton
                        handleDelete={handleDelete}
                        disabled={!planillas.some((planilla) => planilla.checked === true)}
                    />
                </div>
            </div>

            {!loading && (
                <ul className="text-2xl font-bold items-center flex flex-col space-y-5">
                    {planillas.map((planilla) => (
                        <li className="flex" key={planilla.fecha}>
                            <Flex align="center">
                                <Checkbox
                                    mr="4"
                                    checked={planilla.checked}
                                    onCheckedChange={() => handleCheckboxChange(planilla.fecha)}
                                />
                                <Link
                                    className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                                    to={`/cobranzas/${year}/${new Date(planilla.fecha)
                                        .toISOString()
                                        .slice(5, 10)}`}
                                >
                                    {new Date(planilla.fecha).toLocaleDateString("es-ES", {
                                        month: "long",
                                        day: "numeric",
                                        timeZone: "GMT",
                                    })}
                                </Link>
                            </Flex>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaPlanillas;
