import { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import { TableIcon } from "@radix-ui/react-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import AlertButton from "../../components/AlertButton";
// import { deleteNomina, getNomina } from "../../utils/nomina";
// import TableNomina from "./components/TableNomina";

import { ColorRing } from "react-loader-spinner";
import { PropsTitle } from "@/types";
import { Driver } from "./types";
import { DriverApi } from "./driver_utils";
import { DataTable } from "@/components/ui/data-table";
import {
    driverDataTableColumns,
    driverFilterColumnList,
} from "./components/DriverDataTableColumns";
import { toastSuccess } from "@/utils/notification";
import { AlertDialogConfirm } from "@/components/AlertDialogConfirm";
import { Table2Icon } from "lucide-react";
import {
    DriverDialogForm,
    driverFormSchema,
} from "./components/DriverDialogForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const Drivers = ({ title }: Readonly<PropsTitle>) => {
    const [driverList, setDriverList] = useState<Driver[]>([]);

    const driverForm = useForm<z.infer<typeof driverFormSchema>>({
        resolver: zodResolver(driverFormSchema),
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = title;

        const loadDrivers = async () => {
            const drivers = await DriverApi.getDriverList();

            setDriverList(drivers);
            setLoading(false);

            if (import.meta.env.VITE_DEBUG) {
                console.log({ drivers });
            }
        };

        loadDrivers();
    }, []);

    const handleCreateDriver = async (formData: Driver) => {
        if (formData.driver_code) {
            return;
        }

        const result = await DriverApi.postDriver(formData);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setDriverList([
                {
                    driver_code: result.driver_code,
                    driver_id: result.driver_id,
                    driver_name: result.driver_name,
                    driver_surname: result.driver_surname,
                    truck_plate: result.truck_plate,
                    trailer_plate: result.trailer_plate,
                },
                ...driverList,
            ]);
            driverForm.reset({
                driverCode: undefined,
                driverId: "",
                driverName: "",
                driverSurname: "",
                truckPlate: "",
                trailerPlate: "",
            });

            driverForm.setValue("successMessage", result.success);
            driverForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            driverForm.setValue("errorMessage", result.error);
            driverForm.setValue("successMessage", undefined);
        }
    };

    const handleEditDriver = async (formData: Driver) => {
        if (!formData.driver_code) {
            return;
        }

        const result = await DriverApi.putDriver(
            formData.driver_code,
            formData
        );
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setDriverList(
                driverList.map((item) =>
                    formData.driver_code === item.driver_code
                        ? {
                              driver_code: result.driver_code,
                              driver_id: result.driver_id,
                              driver_name: result.driver_name,
                              driver_surname: result.driver_surname,
                              truck_plate: result.truck_plate,
                              trailer_plate: result.trailer_plate,
                          }
                        : item
                )
            );
            driverForm.setValue("successMessage", result.success);
            driverForm.setValue("errorMessage", undefined);
        }

        if (result?.error) {
            driverForm.setValue("errorMessage", result.error);
            driverForm.setValue("successMessage", undefined);
        }
    };

    const handleDeleteDriverItem = async (code?: number | null) => {
        if (!code) {
            return;
        }

        const result = await DriverApi.deleteDriver(code);
        if (import.meta.env.VITE_DEBUG) {
            console.log({ result });
        }

        if (result?.success) {
            toastSuccess(result.success);
            setDriverList(
                driverList.map((item) =>
                    item.driver_code !== code
                        ? item
                        : { ...item, deleted: true }
                )
            );
        }
    };

    const handleEditDriverItem = async (driver: Driver) => {
        console.log("editing...", driver);
    };

    const handleReactivateItemAction = async (code?: number | null) => {
        console.log("Activating...", code);
    };

    const driverColumns = driverDataTableColumns(
        handleDeleteDriverItem,
        handleEditDriverItem,
        handleReactivateItemAction
    );

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
                            value="deleted"
                            className="text-xl md:text-2xl text-left mb-2 md:mb-0"
                        >
                            Deshabilitados
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="drivers" className="md-lg:-mt-8">
                        <div className="flex flex-wrap gap-6 md:gap-x-14 md:justify-end">
                            <DriverDialogForm
                                form={driverForm}
                                handleSubmit={
                                    driverForm.getValues("driverCode")
                                        ? handleEditDriver
                                        : handleCreateDriver
                                }
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
                                onClickFunctionPromise={async () =>
                                    DriverApi.exportDriverList()
                                }
                            >
                                <span className="md:text-lg">
                                    Se exportará la Nómina de Choferes
                                </span>
                            </AlertDialogConfirm>
                        </div>

                        {!loading && (
                            <DataTable
                                data={driverList.filter(
                                    (item) => !item.deleted
                                )}
                                columns={driverColumns}
                                pageSize={pageSize}
                                filterColumnList={driverFilterColumnList}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="deleted" className="md:mt-4">
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
