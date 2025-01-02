"use client";
"use strict";

import { useState, useEffect } from "react";

import { DateTime } from "luxon";

import { Link, useMatch } from "react-router-dom";

import { PropsTitle } from "@/types";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { PlusIcon, Table2Icon } from "lucide-react";
import { ShipmentPayrollApi } from "./shipment_payroll_utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ShipmentPayroll } from "./types";

export const ShipmentPayrollList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/:year");
    const year = parseInt(match?.params?.year ?? "") || 0;
    //State
    const [loading, setLoading] = useState(true);

    const [payrollList, setPayrollList] = useState<ShipmentPayroll[]>([]);
    const [selectedPayrollList, setSelectedPayrollList] = useState<number[]>([]);

    const loadShipmentPayrollListList = async () => {
        const shipmentPayrolls = await ShipmentPayrollApi.getShipmentPayrollList(year);

        setPayrollList(shipmentPayrolls);
        setLoading(false);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipment payrolls ", { shipmentPayrolls });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;

        loadShipmentPayrollListList();
    }, []);

    const handleAddPayroll = async () => {
        console.log("Testing...");
    };

    const handleExportShipmentPayrollList = async () => {
        console.log("Testing...");
    };

    return (
        <div className="px-4">
            <div className="flex flex-wrap gap-2">
                <h2 className="section-header text-xl md:text-2xl text-left md:mb-0 justify-start">
                    Lista de Planillas de {year}
                </h2>

                <div className="flex flex-wrap gap-6 md:justify-end ml-auto mb-6">
                    <AlertDialogConfirm
                        buttonContent={
                            <>
                                <PlusIcon className="w-6 h-6" />
                                Agregar Planilla
                            </>
                        }
                        variant="outline"
                        size="md-lg"
                        onClickFunctionPromise={handleAddPayroll}
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
                        onClickFunctionPromise={handleExportShipmentPayrollList}
                    >
                        <span className="md:text-lg">
                            {`Se exportarán todas las Cobranzas ${
                                selectedPayrollList.length > 0 ? "seleccionadas" : ""
                            }.`}
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
                    {payrollList.map((payroll) => {
                        const isChecked = selectedPayrollList.some(
                            (item) => item === payroll.payroll_code
                        );

                        return (
                            <li
                                className={`flex ${isChecked ? "bg-gray-200" : ""}`}
                                key={payroll.payroll_code}
                            >
                                <div className="flex flex-row gap-6 justify-center items-center px-4 py-3">
                                    <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(value) => {
                                            let newSelectedPayrollList: number[] = [];

                                            if (value) {
                                                newSelectedPayrollList = [
                                                    ...selectedPayrollList,
                                                    payroll.payroll_code ?? 0,
                                                ];
                                            } else {
                                                newSelectedPayrollList = selectedPayrollList.filter(
                                                    (item) => item !== payroll.payroll_code
                                                );
                                            }

                                            if (import.meta.env.VITE_DEBUG) {
                                                console.log("Select item value: ", { payroll });
                                                console.log(
                                                    "current selectedPayrollList: ",
                                                    selectedPayrollList
                                                );
                                                console.log(
                                                    "new selectedPayrollList: ",
                                                    newSelectedPayrollList
                                                );
                                            }

                                            setSelectedPayrollList(newSelectedPayrollList);
                                        }}
                                        aria-label="Seleccionar año"
                                    />

                                    <Link
                                        className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                                        to={`/shipment-payroll-list/payroll/${
                                            payroll.payroll_code ?? 0
                                        }`}
                                    >
                                        {DateTime.fromHTTP(payroll.payroll_timestamp, {
                                            zone: "utc",
                                        })
                                            .setLocale("es")
                                            .toLocaleString({
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        <span className=" text-gray-400">
                                            [#{payroll.payroll_code ?? 0}]
                                        </span>
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

// export const ShipmentPayrollList = ({ title }: Readonly<PropsTitle>) => {

//     // const handleDelete = async () => {
//     //     const yearsChecked = yearsList
//     //         .filter((planilla) => planilla.checked === true)
//     //         .map((planilla) => planilla.year);

//     //     const result = await getPlanillas();

//     //     const toDelete = result
//     //         ?.filter((fecha) => {
//     //             const year = Number(new Date(fecha).toISOString().slice(0, 4));
//     //             return yearsChecked.includes(year);
//     //         })
//     //         .map((fecha) => new Date(fecha).toISOString().slice(0, 10));

//     //     const deletePromises = toDelete.map(async (item) => await deletePlanilla(item));

//     //     const confirmDelete = await Promise.all(deletePromises);

//     //     confirmDelete.forEach((element) => {
//     //         if (element?.response || element?.message) {
//     //             setError(element.response?.data);
//     //         }
//     //     });

//     //     const newYears = years.filter((planilla) => planilla.checked !== true);
//     //     setYears(newYears);
//     // };

//     // const handleSubmit = async (newYear) => {
//     //     setDisableButton(true);
//     //     document.body.style.cursor = "wait";
//     //     const result = await postPlanilla(new Date(newYear, 0, 1));

//     //     if (!result?.response && !result?.message) {
//     //         setYears([{ year: newYear, checked: false }, ...years]);
//     //     } else {
//     //         setError(result.response?.data);
//     //     }
//     //     setDisableButton(false);
//     //     document.body.style.cursor = "default";
//     // };

//     const handleAddYear = async () => {
//         const latestYear = yearList.at(0) || 2023;
//         const newYear = DateTime.fromObject({ year: latestYear + 1 }, { zone: "utc" });

//         if (!newYear.isValid) {
//             return;
//         }

//         const payload: ShipmentPayroll = {
//             payroll_timestamp: newYear.toHTTP(),
//             collected: false,
//             deleted: false,
//         };

//         if (import.meta.env.VITE_DEBUG) {
//             console.log("Posting SHipmentPayroll...", { payload });
//         }
//         const result = await ShipmentPayrollApi.postShipmentPayroll(payload);
//         if (import.meta.env.VITE_DEBUG) {
//             console.log("Post result...", { result });
//         }

//         if (result?.success) {
//             toastSuccess(result.success);

//             await loadShipmentPayrollYearList();
//         }

//         if (result?.error) {
//             return;
//         }
//     };

//     const handleExportShipmentPayrollYearList = async () => {
//         const checkedYears = yearList;

//         const startDate = DateTime.fromObject(
//             {
//                 year: checkedYears?.at(0) ?? undefined,
//             },
//             { zone: "utc" }
//         );
//         const endDate = DateTime.fromObject(
//             {
//                 year: checkedYears?.at(-1) ?? undefined,
//             },
//             { zone: "utc" }
//         );

//         if (!startDate.isValid || !endDate.isValid) {
//             return;
//         }

//         await ShipmentPayrollApi.exportShipmentPayrollList(startDate, endDate);
//     };
// };
