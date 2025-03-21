import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router";
import { DateTime } from "luxon";
import {
    Add as AddIcon,
    TableChart as TableChartIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { Box, Button, List, ListItem, Checkbox, Typography, Tooltip } from "@mui/material";
import { isAxiosError } from "axios";

import { PageProps } from "@/types";
import { ShipmentPayroll } from "./types";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ShipmentPayrollApi } from "./utils";
import { ShipmentPayrollFormDialog } from "./components/ShipmentPayrollFormDialog";
import { CustomSwitch } from "@/components/CustomSwitch";
import { downloadFile } from "@/utils/file";
import { shipmentPayrollListTranslationNamespace } from "./translations";

export const ShipmentPayrollList = ({ title }: Readonly<PageProps>) => {
    // Translation
    const { t } = useTranslation(shipmentPayrollListTranslationNamespace);

    const match = useMatch("/shipment-payrolls/:year");
    const year = parseInt(match?.params?.year ?? "") || 0;

    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [payrollList, setPayrollList] = useState<ShipmentPayroll[]>([]);
    const [selectedPayrollList, setSelectedPayrollList] = useState<number[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);

    // CONTEXT
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentPayrollList = async () => {
        setLoading(true);
        const resp = await ShipmentPayrollApi.getShipmentPayrollList(year);
        setLoading(false);

        if (!isAxiosError(resp) && resp) {
            setPayrollList(resp);
        } else {
            showToastAxiosError(resp);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipment payrolls ", { resp });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadShipmentPayrollList();
    }, [title]);

    const handleExport = () => {
        openConfirmDialog({
            title: t("exportDialog.title"),
            message:
                selectedPayrollList.length > 0
                    ? t("exportDialog.messageSelected")
                    : t("exportDialog.message"),
            confirmText: t("exportDialog.confirmText"),
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                // Get start and end dates from the selected payrolls or all payrolls
                const payrollsToExport =
                    selectedPayrollList.length > 0
                        ? payrollList.filter((p) =>
                              selectedPayrollList.includes(p.payroll_code || 0),
                          )
                        : payrollList;

                if (payrollsToExport.length === 0) {
                    return;
                }

                // Sort by timestamp to get first and last
                const startDate = DateTime.fromHTTP(
                    payrollsToExport[payrollsToExport.length - 1].payroll_timestamp,
                    { zone: "local" },
                );
                const endDate = DateTime.fromHTTP(payrollsToExport[0].payroll_timestamp, {
                    zone: "local",
                });

                if (!startDate.isValid || !endDate.isValid) {
                    return;
                }

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting shipment payrolls...");
                }

                const resp = await ShipmentPayrollApi.exportShipmentPayrollList(startDate, endDate);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Export result...", { resp });
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

    const handleDelete = () => {
        if (selectedPayrollList.length === 0) {
            return;
        }

        openConfirmDialog({
            title: t("deleteDialog.title"),
            message: t("deleteDialog.message", { count: selectedPayrollList.length }),
            confirmText: t("deleteDialog.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting payrolls...", selectedPayrollList);
                }

                const resp =
                    await ShipmentPayrollApi.deleteShipmentPayrollList(selectedPayrollList);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Delete result...", { resp });
                }

                if (!isAxiosError(resp) && resp) {
                    showToastSuccess(resp.message);
                    setSelectedPayrollList([]);
                    await loadShipmentPayrollList();
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
    };

    const handleCheckPayroll = (payrollCode: number | null, checked: boolean) => {
        if (payrollCode === null) return;

        let newSelectedPayrollList: number[] = [];

        if (checked) {
            newSelectedPayrollList = [...selectedPayrollList, payrollCode];
        } else {
            newSelectedPayrollList = selectedPayrollList.filter((item) => item !== payrollCode);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Select item code: ", payrollCode);
            console.log("Current selectedPayrollList: ", selectedPayrollList);
            console.log("New selectedPayrollList: ", newSelectedPayrollList);
        }

        setSelectedPayrollList(newSelectedPayrollList);
    };

    const handleCollectionToggle = async (payroll: ShipmentPayroll, collected: boolean) => {
        const newPayroll: ShipmentPayroll = {
            ...payroll,
            collected: collected,
        };

        if (import.meta.env.VITE_DEBUG) {
            console.log(`Updating collection status for payroll, `, { payroll, newPayroll });
        }

        const resp = await ShipmentPayrollApi.updateCollectionStatus(newPayroll);
        if (isAxiosError(resp) || !resp) {
            showToastAxiosError(resp);
            return;
        }

        const payrollResp = await ShipmentPayrollApi.getShipmentPayroll(payroll.payroll_code ?? 0);
        if (!isAxiosError(payrollResp) && payrollResp) {
            setPayrollList(
                payrollList.map((item) =>
                    item.payroll_code !== payroll.payroll_code ? item : payrollResp,
                ),
            );
        } else {
            showToastAxiosError(payrollResp);
        }

        showToastSuccess(
            t("notifications.collectionStatus", {
                code: payroll.payroll_code ?? 0,
                status: collected
                    ? t("collectionStatus.collected")
                    : t("collectionStatus.notCollected"),
            }),
        );
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    mb: 4,
                }}
            >
                <Typography variant="h5" component="h2" sx={{ mb: { xs: 2, md: 0 } }}>
                    {t("yearList", { year: year })}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddFormDialogOpen(true)}
                    >
                        {t("buttons.add")}
                    </Button>
                    <ShipmentPayrollFormDialog
                        open={addFormDialogOpen}
                        setOpen={setAddFormDialogOpen}
                        year={year}
                        setPayrollList={setPayrollList}
                        setSelectedPayrollList={setSelectedPayrollList}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={handleExport}
                    >
                        {t("buttons.export")}
                    </Button>

                    <Tooltip
                        title={
                            selectedPayrollList.length === 0
                                ? t("tooltips.selectPayrollsToDelete")
                                : ""
                        }
                    >
                        <Box component="span">
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                disabled={selectedPayrollList.length === 0}
                            >
                                {t("buttons.delete")}
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {payrollList.map((payroll) => {
                        const isChecked = selectedPayrollList.includes(payroll.payroll_code || 0);
                        const payrollDate = DateTime.fromHTTP(payroll.payroll_timestamp, {
                            zone: "local",
                        }).setLocale("es");
                        const collectionDate = payroll.collection_timestamp
                            ? DateTime.fromHTTP(payroll.collection_timestamp, {
                                  zone: "local",
                              }).setLocale("es")
                            : null;

                        return (
                            <ListItem
                                key={payroll.payroll_code}
                                sx={{
                                    bgcolor: isChecked ? "action.selected" : "background.paper",
                                    borderRadius: 1,
                                    mb: 1,
                                    display: "flex",
                                    flexDirection: { xs: "column", sm: "row" },
                                    alignItems: "center",
                                    justifyContent: { xs: "flex-start", sm: "center" },
                                    padding: { xs: 2, sm: 1 },
                                    gap: { xs: 2, sm: 0 },
                                }}
                            >
                                {/* Responsive container */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        alignItems: { xs: "stretch", sm: "center" },
                                        width: "100%",
                                        justifyContent: { xs: "center", sm: "center" },
                                        gap: { xs: 2, sm: 0 },
                                    }}
                                >
                                    {/* Checkbox - on mobile, as a separate row with label */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: { xs: "flex-start", sm: "center" },
                                            alignItems: "center",
                                            width: { xs: "100%", sm: "auto" },
                                            mr: { xs: 0, sm: 1 },
                                        }}
                                    >
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={(e) =>
                                                handleCheckPayroll(
                                                    payroll.payroll_code ?? null,
                                                    e.target.checked,
                                                )
                                            }
                                            inputProps={{
                                                "aria-label": t("accessibility.selectPayroll"),
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                display: { xs: "inline", sm: "none" },
                                            }}
                                        >
                                            {t("select")}
                                        </Typography>
                                    </Box>

                                    {/* Button - full width on mobile */}
                                    <Button
                                        component={Link}
                                        to={`/shipment-payrolls/payroll/${payroll.payroll_code ?? 0}`}
                                        variant="contained"
                                        color="info"
                                        sx={{
                                            width: { xs: "100%", sm: "260px" },
                                            py: 1,
                                            fontWeight: "bold",
                                            fontSize: "1.1rem",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {payrollDate.toLocaleString({
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        <Typography
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                color: "text.secondary",
                                                opacity: 0.7,
                                                fontWeight: "normal",
                                            }}
                                        >
                                            [#{payroll.payroll_code ?? 0}]
                                        </Typography>
                                    </Button>

                                    {/* Collection Switch - on mobile, as a row with more space */}
                                    <CustomSwitch
                                        checked={payroll.collected}
                                        onChange={(e) =>
                                            handleCollectionToggle(payroll, e.target.checked)
                                        }
                                        textChecked={t("switch.collected")}
                                        checkedDescription={
                                            collectionDate?.toFormat("dd/MM/yyyy") ?? ""
                                        }
                                        textUnchecked={t("switch.uncollected")}
                                    />
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};
