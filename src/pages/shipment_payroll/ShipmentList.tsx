import { useState, useEffect } from "react";
import { useMatch } from "react-router";
import { Table2Icon } from "lucide-react";

import { PropsTitle } from "@/types";
import { Shipment, ShipmentAggregated } from "./types";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";

import { ShipmentApi } from "./shipment_payroll_utils";
import { ShipmentDialogForm } from "./components/ShipmentDialogForm";

export const ShipmentList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/payroll/:payroll_code");
    const payrollCode = parseInt(match?.params?.payroll_code ?? "") || 0;
    //State
    const [loading, setLoading] = useState(true);

    const [shipmentAggregatedList, setShipmentAggegatedList] = useState<ShipmentAggregated[]>([]);
    const [selectedShipmentList, setSelectedShipmentList] = useState<number[]>([]);

    const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);

    const loadShipmentList = async () => {
        const shipments = await ShipmentApi.getShipmentAggregated(payrollCode);
        setShipmentAggegatedList(shipments);
        setLoading(false);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipments ", { shipments });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;

        loadShipmentList();
    }, []);

    const handleExportShipmentList = async () => {
        console.log("Testing...");
    };

    return (
        <div className="px-4">
            <div className="flex flex-wrap gap-2">
                <h2 className="section-header text-xl md:text-2xl text-left md:mb-0 justify-start">
                    Lista de Cargas del fecha
                </h2>

                <div className="flex flex-wrap gap-6 md:justify-end ml-auto mb-6">
                    <ShipmentDialogForm
                        payrollCode={payrollCode}
                        setShipmentAggegatedList={setShipmentAggegatedList}
                        setSelectedShipmentList={setSelectedShipmentList}
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
                        onClickFunctionPromise={handleExportShipmentList}
                    >
                        <span className="md:text-lg">Se exportará la Planilla</span>
                    </AlertDialogConfirm>
                    {/* 
                    <ShipmentPayrollDialogDelete
                        year={year}
                        setPayrollList={setPayrollList}
                        selectedPayrollList={selectedPayrollList}
                        setSelectedPayrollList={setSelectedPayrollList}
                        payrollToDelete={payrollToDelete}
                        setPayrollToDelete={setPayrollToDelete}
                    /> */}
                </div>
            </div>

            {!loading && (
                <ul className="text-2xl font-bold items-center flex flex-col space-y-3">
                    {shipmentAggregatedList.map((shipment) => {
                        const isChecked = selectedShipmentList.some(
                            (item) => item === shipment.shipment_code
                        );

                        return (
                            <li
                                className={`flex ${isChecked ? "bg-gray-200" : ""}`}
                                key={shipment.shipment_code}
                            >
                                <div className="flex flex-row gap-6 justify-center items-center px-4 py-3">
                                    {shipment.receipt_code}

                                    {/* <Checkbox
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
                                                    (item) => item !== payroll.payroll_code,
                                                );
                                            }

                                            if (import.meta.env.VITE_DEBUG) {
                                                console.log("Select item value: ", { payroll });
                                                console.log(
                                                    "current selectedPayrollList: ",
                                                    selectedPayrollList,
                                                );
                                                console.log(
                                                    "new selectedPayrollList: ",
                                                    newSelectedPayrollList,
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
                                            zone: "local",
                                        })
                                            .setLocale("es")
                                            .toLocaleString({
                                                month: "long",
                                                day: "numeric",
                                            })}{" "}
                                        <span className=" text-gray-400">
                                            [#{payroll.payroll_code ?? 0}]
                                        </span>
                                    </Link> */}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};
