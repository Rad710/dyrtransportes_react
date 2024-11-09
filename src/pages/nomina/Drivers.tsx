import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PropsTitle } from "@/types";
import { Driver } from "./types";
import { DriverApi } from "./driver_utils";
import { DataTable } from "@/components/ui/data-table";
import {
    driverDataTableColumns,
    driverFilterColumnList,
} from "./components/DriverDataTableColumns";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Table2Icon } from "lucide-react";
import { DriverDialogForm } from "./components/DriverDialogForm";
import { DriverDialogDelete } from "./components/DriverDialogDelete";

export const Drivers = ({ title }: Readonly<PropsTitle>) => {
    //STATE
    const [loading, setLoading] = useState<boolean>(true);

    //Routes State
    const [driverList, setDriverList] = useState<Driver[]>([]);
    const [selectedDriverRows, setSelectedDriverRows] = useState<number[]>([]);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
    const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

    // DATATABLE
    const driverColumns = driverDataTableColumns(
        selectedDriverRows,
        setSelectedDriverRows,
        setDriverToEdit,
        setDriverToDelete,
    );

    // USE EFFECTS
    useEffect(() => {
        document.title = title;

        const loadDrivers = async () => {
            const drivers = await DriverApi.getDriverList();

            setDriverList(drivers);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded drivers: ", { drivers });
            }
        };

        loadDrivers();
    }, []);

    const pageSize = 20;
    return (
        <div className="px-4">
            <div className="md:flex justify-between items-center">
                <Tabs defaultValue="drivers" className="w-full">
                    <TabsList>
                        <TabsTrigger
                            value="drivers"
                            className="text-xl md:text-2xl text-left mb-2 md:mb-0"
                        >
                            Nómina
                        </TabsTrigger>
                        <TabsTrigger
                            value="deactivated"
                            className="text-xl md:text-2xl text-left mb-2 md:mb-0"
                        >
                            Deshabilitados
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="drivers" className="md-lg:-mt-8">
                        <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                            <DriverDialogForm
                                setDriverList={setDriverList}
                                driverToEdit={driverToEdit}
                                setDriverToEdit={setDriverToEdit}
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
                                onClickFunctionPromise={DriverApi.exportDriverList}
                            >
                                <span className="md:text-lg">
                                    Se exportará la Nómina de Choferes
                                </span>
                            </AlertDialogConfirm>

                            <DriverDialogDelete
                                setDriverList={setDriverList}
                                selectedDriverRows={selectedDriverRows}
                                setSelectedDriverRows={setSelectedDriverRows}
                                driverToDelete={driverToDelete}
                                setDriverToDelete={setDriverToDelete}
                            />
                        </div>

                        {!loading && (
                            <DataTable
                                data={driverList.filter((item) => !item.deleted)}
                                columns={driverColumns}
                                pageSize={pageSize}
                                filterColumnList={driverFilterColumnList}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="deactivated" className="md:mt-4">
                        <DataTable
                            data={driverList.filter((item) => item.deleted)}
                            columns={driverColumns}
                            pageSize={pageSize}
                            filterColumnList={driverFilterColumnList}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
