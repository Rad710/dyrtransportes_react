import { Box, Button, TextField, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DateTime } from "luxon";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { TableChart as TableChartIcon } from "@mui/icons-material";
import { useConfirmation } from "@/context/ConfirmationContext";
import { downloadFile } from "@/utils/file";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";
import { exportStatisticData, getStatisticsData } from "./StatisticsTabContent";
import type { ProfitData } from "../types";
import { ProfitsChart } from "./ProfitsChart";

export const ProfitsTabContent = () => {
    // Add translation hook with home namespace
    const { t } = useTranslation(homeTranslationNamespace);

    // state
    const [loading, setLoading] = useState<boolean>(true);
    const [profitData, setProfitData] = useState<ProfitData | null>(null);

    const [startDate, setStartDate] = useState<DateTime>(
        DateTime.now().minus({ month: 1 }).startOf("day"),
    );
    const [endDate, setEndDate] = useState<DateTime>(
        DateTime.now().plus({ day: 1 }).startOf("day"),
    );

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadProfitData = async () => {
        setLoading(true);
        const resp = await getStatisticsData(startDate, endDate);
        setLoading(false);
        if (!isAxiosError(resp) && resp) {
            const totals = resp.reduce(
                (acc, item) => {
                    const totalShipmentPayroll = parseFloat(item.total_shipment_payroll);
                    const totalDriverPayroll = parseFloat(item.total_driver_payroll);
                    const totalExpensesAmount = parseFloat(item.total_expenses_amount);

                    const totalLosses = totalExpensesAmount - totalDriverPayroll;

                    // Add current item's values to the accumulator
                    acc.shipments += item.shipments || 0;
                    acc.totalOriginWeight += parseFloat(item.total_origin_weight) || 0;
                    acc.totalDestinationWeight += parseFloat(item.total_destination_weight) || 0;
                    acc.totalShipmentPayroll += totalShipmentPayroll || 0;
                    acc.totalDriverPayroll += totalDriverPayroll || 0;
                    acc.totalExpensesAmountReceipt +=
                        parseFloat(item.total_expenses_amount_receipt) || 0;
                    acc.totalExpensesAmountNoReceipt +=
                        parseFloat(item.total_expenses_amount_no_receipt) || 0;
                    acc.totalLosses += totalLosses > 0 ? totalLosses : 0;
                    acc.totalProfits += totalShipmentPayroll - totalDriverPayroll || 0;

                    return acc;
                },
                {
                    shipments: 0,
                    totalOriginWeight: 0,
                    totalDestinationWeight: 0,
                    totalShipmentPayroll: 0,
                    totalDriverPayroll: 0,
                    totalExpensesAmountReceipt: 0,
                    totalExpensesAmountNoReceipt: 0,
                    totalLosses: 0,
                    totalProfits: 0,
                },
            );

            setProfitData(totals);
        } else {
            showToastAxiosError(resp);
            setProfitData(null);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded Profit rows: ", { resp });
        }
    };

    useEffect(() => {
        loadProfitData();
    }, []);

    const onSearch = async () => {
        await loadProfitData();
    };

    const handleExportarProfit = () => {
        const startDateString = startDate.toLocaleString({
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const endDateString = endDate.toLocaleString({
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        openConfirmDialog({
            title: t("profits.exportDialog.title"),
            message: t("profits.exportDialog.message", {
                startDate: startDateString,
                endDate: endDateString,
            }),
            confirmText: t("profits.exportDialog.confirmText"),
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting profits...");
                }
                const resp = await exportStatisticData(startDate, endDate);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting profits resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        t("profits.fileName"),
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("profits.notifications.exportSuccess"));
                } else {
                    showToastError(t("profits.notifications.exportError"));
                }
            },
        });
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { sm: "center" },
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label={t("profits.searchControls.startDate")}
                        type="date"
                        fullWidth
                        value={startDate.toFormat("yyyy-MM-dd")}
                        onChange={(e) => {
                            const dateValue = e.target.value;
                            if (dateValue) {
                                setStartDate(DateTime.fromISO(dateValue));
                            }
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                        label={t("profits.searchControls.endDate")}
                        type="date"
                        fullWidth
                        value={endDate.toFormat("yyyy-MM-dd")}
                        onChange={(e) => {
                            const dateValue = e.target.value;
                            if (dateValue) {
                                setEndDate(DateTime.fromISO(dateValue));
                            }
                        }}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={onSearch}
                    size="medium"
                    sx={{
                        minWidth: "40px",
                        height: "40px",
                    }}
                >
                    <Box>{t("profits.searchControls.search")}</Box>
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportarProfit}
                >
                    {t("profits.searchControls.export")}
                </Button>
            </Box>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                {loading ? (
                    <>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {t("profits.loading")}
                        </Typography>
                    </>
                ) : (
                    <ProfitsChart profitData={profitData} startDate={startDate} endDate={endDate} />
                )}
            </Box>
        </Box>
    );
};
