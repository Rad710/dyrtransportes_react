import { useState, useEffect } from "react";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";

import { isAxiosError } from "axios";
import { saveAs } from "file-saver";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { CustomTabPanel } from "@/components/CustomTabPanel";

import { ActiveDriverDataTable } from "./components/ActiveDriverDataTable";
import { DeactivatedDriverDataTable } from "./components/DeactivatedDriverDataTable";
import { DriverFormDialog } from "./components/DriverFormDialog";

import { PropsTitle } from "@/types";
import { Driver } from "./types";
import { DriverApi } from "./driver_utils";

const ActiveDriverTabContent = () => {
    // STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    // Drivers State
    const [activeDriverList, setActiveDriverList] = useState<Driver[]>([]);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    useEffect(() => {
        const loadDrivers = async () => {
            setLoadingTable(true);
            const resp = await DriverApi.getDriverList();
            setLoadingTable(false);
            if (!isAxiosError(resp) && resp) {
                const filteredDrivers = resp.filter((item) => !item.deleted);
                setActiveDriverList(filteredDrivers);
            } else {
                showToastAxiosError(resp);
            }

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded active drivers: ", { resp });
            }
        };

        loadDrivers();
    }, []);

    const handleExportDriverList = () => {
        openConfirmDialog({
            title: "Confirm Export",
            message: "All active drivers will be exported.",
            confirmText: "Export",
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting drivers...");
                }
                const resp = await DriverApi.exportDriverList();
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting drivers resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    saveAs(new Blob([resp ?? ""]), "nomina_de_choferes.xlsx");

                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => setAddFormDialogOpen(true)}
                >
                    Add
                </Button>
                <DriverFormDialog
                    setDriverList={setActiveDriverList}
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                    setLoading={setLoadingTable}
                />

                <DriverFormDialog
                    setDriverList={setActiveDriverList}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    setLoading={setLoadingTable}
                    driverToEdit={driverToEdit}
                    setDriverToEdit={setDriverToEdit}
                />

                <Button variant="contained" color="info" onClick={handleExportDriverList}>
                    Exportar
                </Button>
            </Box>

            <ActiveDriverDataTable
                loading={loadingTable}
                setLoading={setLoadingTable}
                driverList={activeDriverList}
                selectedRows={selectedRows}
                setDriverList={setActiveDriverList}
                setSelectedRows={setSelectedRows}
                setDriverToEdit={setDriverToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
            />
        </>
    );
};

const DeactivatedDriverTabContent = () => {
    // STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);

    // Drivers State
    const [deactivatedDriverList, setDeactivatedDriverList] = useState<Driver[]>([]);
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { showToastAxiosError } = useToast();

    // USE EFFECTS
    useEffect(() => {
        const loadDrivers = async () => {
            setLoadingTable(true);
            const resp = await DriverApi.getDriverList();
            setLoadingTable(false);
            if (!isAxiosError(resp) && resp) {
                const filteredDrivers = resp.filter((item) => item.deleted);
                setDeactivatedDriverList(filteredDrivers);
            } else {
                showToastAxiosError(resp);
            }

            if (import.meta.env.VITE_DEBUG) {
                console.log("Loaded deactivated drivers: ", { resp });
            }
        };

        loadDrivers();
    }, []);

    return (
        <>
            <DeactivatedDriverDataTable
                loading={loadingTable}
                setLoading={setLoadingTable}
                driverList={deactivatedDriverList}
                selectedRows={selectedRows}
                setDriverList={setDeactivatedDriverList}
                setSelectedRows={setSelectedRows}
            />
        </>
    );
};

export const Drivers = ({ title }: Readonly<PropsTitle>) => {
    useEffect(() => {
        document.title = title;
    }, []);

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Nómina" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                    <Tab
                        label="Deshabilitados"
                        id="simple-tab-1"
                        aria-controls="simple-tabpanel-1"
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ActiveDriverTabContent />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <DeactivatedDriverTabContent />
            </CustomTabPanel>
        </>
    );
};
