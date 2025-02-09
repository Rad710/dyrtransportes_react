import { useState, useEffect } from "react";
import { Link, useMatch } from "react-router";
import { Table2Icon } from "lucide-react";
import { DateTime } from "luxon";

import { PropsTitle } from "@/types";
import { ShipmentPayroll } from "./types";

import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Checkbox } from "@/components/ui/checkbox";

import { ShipmentPayrollApi } from "./shipment_payroll_utils";
import { ShipmentPayrollDialogForm } from "./components/ShipmentPayrollDialogForm";
import { ShipmentPayrollDialogDelete } from "./components/ShipmentPayrollDialogDelete";

export const ShipmentPayrollList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/:year");
    const year = parseInt(match?.params?.year ?? "") || 0;
    //State
    const [loading, setLoading] = useState(true);

    const [payrollList, setPayrollList] = useState<ShipmentPayroll[]>([]);
    const [selectedPayrollList, setSelectedPayrollList] = useState<number[]>([]);

    const [payrollToDelete, setPayrollToDelete] = useState<ShipmentPayroll | null>(null);

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
                    <ShipmentPayrollDialogForm
                        year={year}
                        setPayrollList={setPayrollList}
                        setSelectedPayrollList={setSelectedPayrollList}
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
                        onClickFunctionPromise={handleExportShipmentPayrollList}
                    >
                        <span className="md:text-lg">
                            {`Se exportarán todas las Cobranzas ${
                                selectedPayrollList.length > 0 ? "seleccionadas" : ""
                            }.`}
                        </span>
                    </AlertDialogConfirm>

                    <ShipmentPayrollDialogDelete
                        year={year}
                        setPayrollList={setPayrollList}
                        selectedPayrollList={selectedPayrollList}
                        setSelectedPayrollList={setSelectedPayrollList}
                        payrollToDelete={payrollToDelete}
                        setPayrollToDelete={setPayrollToDelete}
                    />
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
