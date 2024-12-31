import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PropsTitle } from "@/types";
import { Driver } from "./types";
import { DriverApi } from "./driver_utils";
import { DataTable } from "@/components/ui/data-table";
import {
    activeDriverDataTableColumns,
    activeDriverFilterColumnList,
} from "./components/ActiveDriverDataTableColumns";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Table2Icon } from "lucide-react";
import { DriverDialogForm } from "./components/DriverDialogForm";
import { ActiveDriverDialogDelete } from "./components/ActiveDriverDialogDelete";
import {
    deactivatedDriverDataTableColumns,
    deactivatedDriverFilterColumnList,
} from "./components/DeactivatedDriverDataTableColumns";

const ActiveDriverTabContent = () => {
    //STATE
    const [loading, setLoading] = useState<boolean>(true);

    //Drivers State
    const [activeDriverList, setActiveDriverList] = useState<Driver[]>([]);
    const [selectedActiveDriverRows, setSelectedActiveDriverRows] = useState<number[]>([]);
    const [activeDriverToEdit, setActiveDriverToEdit] = useState<Driver | null>(null);
    const [activeDriverToDelete, setActiveDriverToDelete] = useState<Driver | null>(null);

    // DATATABLE
    const activeDriverColumns = activeDriverDataTableColumns(
        selectedActiveDriverRows,
        setSelectedActiveDriverRows,
        setActiveDriverToEdit,
        setActiveDriverToDelete,
    );

    // USE EFFECTS
    useEffect(() => {
        const loadActiveDrivers = async () => {
            const drivers = await DriverApi.getDriverList();
            const filteredDrivers = drivers.filter((item) => !item.deleted);

            setActiveDriverList(filteredDrivers);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded filteredDrivers: ", { filteredDrivers });
            }
        };

        loadActiveDrivers();
    }, []);

    const pageSize = 20;

    return (
        <>
            <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                <DriverDialogForm
                    setActiveDriverList={setActiveDriverList}
                    activeDriverToEdit={activeDriverToEdit}
                    setActiveDriverToEdit={setActiveDriverToEdit}
                    setSelectedActiveDriverRows={setSelectedActiveDriverRows}
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
                    <span className="md:text-lg">Se exportará la Nómina de Choferes</span>
                </AlertDialogConfirm>

                <ActiveDriverDialogDelete
                    setActiveDriverList={setActiveDriverList}
                    selectedActiveDriverRows={selectedActiveDriverRows}
                    setSelectedActiveDriverRows={setSelectedActiveDriverRows}
                    activeDriverToDelete={activeDriverToDelete}
                    setActiveDriverToDelete={setActiveDriverToDelete}
                />
            </div>

            {!loading && (
                <DataTable
                    data={activeDriverList}
                    columns={activeDriverColumns}
                    pageSize={pageSize}
                    filterColumnList={activeDriverFilterColumnList}
                />
            )}
        </>
    );
};

const DeactivatedDriverTabContent = () => {
    //STATE
    const [loading, setLoading] = useState<boolean>(true);

    //Drivers State
    const [deactivatedDriverList, setDeactivatedDriverList] = useState<Driver[]>([]);
    const [selectedDeactivatedDriverRows, setSelectedDeactivatedDriverRows] = useState<number[]>(
        [],
    );

    // DATATABLE
    const deactivatedDriverColumns = deactivatedDriverDataTableColumns(
        selectedDeactivatedDriverRows,
        setSelectedDeactivatedDriverRows,
    );

    // USE EFFECTS
    useEffect(() => {
        const loadDeactivatedDrivers = async () => {
            const drivers = await DriverApi.getDriverList();
            const filteredDrivers = drivers.filter((item) => item.deleted);

            setDeactivatedDriverList(filteredDrivers);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded filteredDrivers: ", { filteredDrivers });
            }
        };

        loadDeactivatedDrivers();
    }, []);

    const pageSize = 20;

    return (
        <>
            {!loading && (
                <DataTable
                    data={deactivatedDriverList}
                    columns={deactivatedDriverColumns}
                    pageSize={pageSize}
                    filterColumnList={deactivatedDriverFilterColumnList}
                />
            )}
        </>
    );
};

export const Drivers = ({ title }: Readonly<PropsTitle>) => {
    useEffect(() => {
        document.title = title;
    }, []);

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
                        <ActiveDriverTabContent />
                    </TabsContent>
                    <TabsContent value="deactivated" className="md:mt-4">
                        <DeactivatedDriverTabContent />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
