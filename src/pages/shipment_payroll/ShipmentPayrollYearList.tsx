"use client";
"use strict";

import { useState, useEffect } from "react";

import { DateTime } from "luxon";

import { Link, Form } from "react-router-dom";

// import {
//     getPlanillas,
//     postPlanilla,
//     deletePlanilla,
//     getExportarInforme,
// } from "../../utils/cobranza";

import { PropsTitle } from "@/types";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { PlusIcon, Table2Icon } from "lucide-react";
import { ShipmentPayrollApi } from "./shipment_payroll_utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPayroll } from "./types";
import { toastSuccess } from "@/utils/notification";

export const ShipmentPayrollYearList = ({ title }: Readonly<PropsTitle>) => {
    //State
    const [loading, setLoading] = useState(true);

    const [yearList, setYearList] = useState<number[]>([]);
    const [selectedYearList, setSelectedYearList] = useState<number[]>([]);

    const loadShipmentPayrollYearList = async () => {
        const shipmentPayrolls = await ShipmentPayrollApi.getShipmentPayrollList();

        let shipmentPayrollYearList: number[] =
            shipmentPayrolls
                ?.map((item) => DateTime.fromHTTP(item.creation_timestamp, { zone: "utc" }))
                ?.filter((item) => item?.isValid)
                ?.map((item) => item.year) ?? [];

        shipmentPayrollYearList = Array.from(new Set(shipmentPayrollYearList));
        shipmentPayrollYearList.sort((a, b) => b - a);

        setYearList(shipmentPayrollYearList);
        setLoading(false);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipment payrolls ", { shipmentPayrolls });
            console.log("Shipment payroll years", { shipmentPayrollYearList });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;

        loadShipmentPayrollYearList();
    }, []);

    // const handleDelete = async () => {
    //     const yearsChecked = yearsList
    //         .filter((planilla) => planilla.checked === true)
    //         .map((planilla) => planilla.year);

    //     const result = await getPlanillas();

    //     const toDelete = result
    //         ?.filter((fecha) => {
    //             const year = Number(new Date(fecha).toISOString().slice(0, 4));
    //             return yearsChecked.includes(year);
    //         })
    //         .map((fecha) => new Date(fecha).toISOString().slice(0, 10));

    //     const deletePromises = toDelete.map(async (item) => await deletePlanilla(item));

    //     const confirmDelete = await Promise.all(deletePromises);

    //     confirmDelete.forEach((element) => {
    //         if (element?.response || element?.message) {
    //             setError(element.response?.data);
    //         }
    //     });

    //     const newYears = years.filter((planilla) => planilla.checked !== true);
    //     setYears(newYears);
    // };

    // const handleSubmit = async (newYear) => {
    //     setDisableButton(true);
    //     document.body.style.cursor = "wait";
    //     const result = await postPlanilla(new Date(newYear, 0, 1));

    //     if (!result?.response && !result?.message) {
    //         setYears([{ year: newYear, checked: false }, ...years]);
    //     } else {
    //         setError(result.response?.data);
    //     }
    //     setDisableButton(false);
    //     document.body.style.cursor = "default";
    // };

    const handleAddYear = async () => {
        const latestYear = yearList.at(0) || 2023;
        const newYear = DateTime.fromObject({ year: latestYear + 1 }, { zone: "utc" });

        if (!newYear.isValid) {
            return;
        }

        const payload: ShipmentPayroll = {
            creation_timestamp: newYear.toHTTP(),
            collected: false,
            deleted: false,
        };

        if (import.meta.env.VITE_DEBUG) {
            console.log("Posting SHipmentPayroll...", { payload });
        }
        const result = await ShipmentPayrollApi.postShipmentPayroll(payload);
        if (import.meta.env.VITE_DEBUG) {
            console.log("Post result...", { result });
        }

        if (result?.success) {
            toastSuccess(result.success);

            await loadShipmentPayrollYearList();
        }

        if (result?.error) {
            return;
        }
    };

    const handleExportShipmentPayrollYearList = async () => {
        const checkedYears = yearList;

        const startDate = DateTime.fromObject(
            {
                year: checkedYears?.at(0) ?? undefined,
            },
            { zone: "utc" }
        );
        const endDate = DateTime.fromObject(
            {
                year: checkedYears?.at(-1) ?? undefined,
            },
            { zone: "utc" }
        );

        if (!startDate.isValid || !endDate.isValid) {
            return;
        }

        await ShipmentPayrollApi.exportShipmentPayrollList(startDate, endDate);
    };

    return (
        <div className="px-4">
            <div className="flex flex-wrap gap-2">
                <h2 className="section-header text-xl md:text-2xl text-left md:mb-0 justify-start">
                    Lista de Planillas
                </h2>

                <div className="flex flex-wrap gap-6 md:justify-end ml-auto mb-6">
                    {/* <div className="gap-5 flex flex-col justify-end md:2/3 md:flex-row">
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(years.at(0) ? years.at(0).year + 1 : 2023);
                        }}
                    >
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
                                Agregar Año
                            </Button>
                        )}
                    </Form>
                </div> */}

                    <AlertDialogConfirm
                        buttonContent={
                            <>
                                <PlusIcon className="w-6 h-6" />
                                Agregar Año
                            </>
                        }
                        variant="outline"
                        size="md-lg"
                        onClickFunctionPromise={handleAddYear}
                    >
                        <span className="md:text-lg">Se creará una nueva planilla.</span>
                    </AlertDialogConfirm>

                    <AlertDialogConfirm
                        buttonContent={
                            <>
                                <Table2Icon className="w-6 h-6" />
                                Exportar
                            </>
                        }
                        variant="green"
                        size="md-lg"
                        onClickFunctionPromise={handleExportShipmentPayrollYearList}
                    >
                        <span className="md:text-lg">
                            Se exportarán todas las Cobranzas del año.
                        </span>
                    </AlertDialogConfirm>

                    {/* <RouteDialogDelete
                    setRouteList={setRouteList}
                    selectedRouteRows={selectedRouteRows}
                    setSelectedRouteRows={setSelectedRouteRows}
                    routeToDelete={routeToDelete}
                    setRouteToDelete={setRouteToDelete}
                /> */}
                </div>
            </div>

            {!loading && (
                <ul className="text-2xl font-bold items-center flex flex-col space-y-3">
                    {yearList.map((year) => {
                        const isChecked = selectedYearList.includes(year);

                        return (
                            <li className={`flex ${isChecked ? "bg-gray-200" : ""}`} key={year}>
                                <div className="flex flex-row gap-6 justify-center items-center px-4 py-3">
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(value) => {
                                            let newSelectedYearList: number[] = [];

                                            if (value) {
                                                newSelectedYearList = [...selectedYearList, year];
                                            } else {
                                                newSelectedYearList = selectedYearList.filter(
                                                    (item) => item !== year
                                                );
                                            }

                                            if (import.meta.env.VITE_DEBUG) {
                                                console.log("Select item value: ", year);
                                                console.log(
                                                    "current selectedYearList: ",
                                                    selectedYearList
                                                );
                                                console.log(
                                                    "new selectedYearList: ",
                                                    newSelectedYearList
                                                );
                                            }

                                            setSelectedYearList(newSelectedYearList);
                                        }}
                                        aria-label="Seleccionar año"
                                    />

                                    <Link
                                        className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                                        to={`/shipment-payroll/${year}`}
                                    >
                                        {year}
                                    </Link>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
