import { useState, useEffect } from "react";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";

import { isAxiosError } from "axios";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { TabPanel } from "@/components/TabPanel";

import { DriverFormDialog } from "./components/DriverFormDialog";

import { PageProps } from "@/types";
import { Driver as DriverType } from "./types";
import { DriverApi } from "./utils";
import { DriverDataTable } from "./components/DriverDataTable";
import { downloadFile } from "@/utils/file";

const ActiveDriverTabContent = () => {
    // STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);
    const [editFormDialogOpen, setEditFormDialogOpen] = useState<boolean>(false);

    // Drivers State
    const [activeDriverList, setActiveDriverList] = useState<DriverType[]>([]);
    const [driverToEdit, setDriverToEdit] = useState<DriverType | null>(null);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // USE EFFECTS
    const loadActiveDriverList = async () => {
        setLoadingTable(true);
        const resp = await DriverApi.getDriverList();
        setLoadingTable(false);
        if (!isAxiosError(resp) && resp) {
            const filteredDrivers = resp.filter((item) => !item.deleted);
            setActiveDriverList(filteredDrivers);
        } else {
            showToastAxiosError(resp);
            setActiveDriverList([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded active drivers: ", { resp });
        }
    };

    useEffect(() => {
        loadActiveDriverList();
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
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        "nomina_de_choferes.xlsx",
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastError("Error al exportar planilla.");
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
                    startIcon={<AddIcon />}
                    onClick={() => setAddFormDialogOpen(true)}
                >
                    Add
                </Button>

                <DriverFormDialog
                    loadDriverList={loadActiveDriverList}
                    open={addFormDialogOpen}
                    setOpen={setAddFormDialogOpen}
                />

                <DriverFormDialog
                    loadDriverList={loadActiveDriverList}
                    open={editFormDialogOpen}
                    setOpen={setEditFormDialogOpen}
                    driverToEdit={driverToEdit}
                    setDriverToEdit={setDriverToEdit}
                />

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportDriverList}
                >
                    Export
                </Button>
            </Box>

            <DriverDataTable
                loadDriverList={loadActiveDriverList}
                loading={loadingTable}
                driverList={activeDriverList}
                setDriverToEdit={setDriverToEdit}
                setEditFormDialogOpen={setEditFormDialogOpen}
                mode="active"
            />
        </>
    );
};

const DeactivatedDriverTabContent = () => {
    // STATE
    const [loadingTable, setLoadingTable] = useState<boolean>(true);

    // Drivers State
    const [deactivatedDriverList, setDeactivatedDriverList] = useState<DriverType[]>([]);

    // context
    const { showToastAxiosError } = useToast();

    const loadDeactivatedDriverList = async () => {
        setLoadingTable(true);
        const resp = await DriverApi.getDriverList();
        setLoadingTable(false);
        if (!isAxiosError(resp) && resp) {
            const filteredDrivers = resp.filter((item) => item.deleted);
            setDeactivatedDriverList(filteredDrivers);
        } else {
            showToastAxiosError(resp);
            setDeactivatedDriverList([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded deactivated drivers: ", { resp });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        loadDeactivatedDriverList();
    }, []);

    return (
        <Box
            sx={{
                marginTop: "2.5rem",
            }}
        >
            <DriverDataTable
                loading={loadingTable}
                driverList={deactivatedDriverList}
                loadDriverList={loadDeactivatedDriverList}
                mode="deactivated"
            />
        </Box>
    );
};

export const Driver = ({ title }: Readonly<PageProps>) => {
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
            <TabPanel value={value} index={0}>
                <ActiveDriverTabContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DeactivatedDriverTabContent />
            </TabPanel>
        </>
    );
};
