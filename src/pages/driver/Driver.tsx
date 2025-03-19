import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";

import { isAxiosError } from "axios";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { TabPanel } from "@/components/TabPanel";

import { DriverFormDialog } from "./components/DriverFormDialog";

import { PageProps } from "@/types";
import type { Driver as DriverType } from "./types";
import { DriverApi } from "./utils";
import { DriverDataTable } from "./components/DriverDataTable";
import { downloadFile } from "@/utils/file";
import { driverTranslationNamespace } from "./translations";

const ActiveDriverTabContent = () => {
    // Translations
    const { t } = useTranslation(driverTranslationNamespace);

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
            title: t("exportDialog.title"),
            message: t("exportDialog.message"),
            confirmText: t("exportDialog.confirmText"),
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
                        t("fileName"),
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("notifications.exportSuccess"));
                } else {
                    showToastError(t("notifications.exportError"));
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
                    {t("buttons.add")}
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
                    {t("buttons.export")}
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
    // Translations
    const { t } = useTranslation(driverTranslationNamespace);

    useEffect(() => {
        document.title = title;
    }, [title]);

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="driver tabs">
                    <Tab
                        label={t("tabs.active")}
                        id="driver-tab-0"
                        aria-controls="driver-tabpanel-0"
                    />
                    <Tab
                        label={t("tabs.deactivated")}
                        id="driver-tab-1"
                        aria-controls="driver-tabpanel-1"
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
