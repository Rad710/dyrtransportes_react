import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DateTime } from "luxon";
import { api } from "@/utils/axios";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";
import { useToast } from "@/context/ToastContext";
import { TableChart as TableChartIcon } from "@mui/icons-material";
import { useConfirmation } from "@/context/ConfirmationContext";
import { downloadFile } from "@/utils/file";
import type { StatisticRow } from "../types";
import { StatisticsDataTable } from "./StatisticsDataTable";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";

const getStatisticsData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/statistics?start_date=${startDate}&end_date=${endDate}`)
        .then((response: AxiosResponse<StatisticRow[] | null>) => response.data ?? [])
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse ?? null;
        });

const exportStatisticData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/statistics/export-excel?start_date=${startDate}&end_date=${endDate}`, {
            responseType: "blob",
        })
        .then((response: AxiosResponse<BlobPart | null>) => {
            return response ?? null;
        })
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse;
        });

export const StatisticsTabContent = () => {
    // Add translation hook with home namespace
    const { t } = useTranslation(homeTranslationNamespace);

    // state
    const [loading, setLoading] = useState<boolean>(true);
    const [statisticRows, setStatisticRows] = useState<StatisticRow[]>([]);

    const [startDate, setStartDate] = useState<DateTime>(DateTime.now().startOf("day"));
    const [endDate, setEndDate] = useState<DateTime>(
        DateTime.now().plus({ day: 1 }).startOf("day"),
    );

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadStatisticsRows = async () => {
        setLoading(true);
        const resp = await getStatisticsData(startDate, endDate);
        setLoading(false);
        if (!isAxiosError(resp) && resp) {
            setStatisticRows(resp);
        } else {
            showToastAxiosError(resp);
            setStatisticRows([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded statistics rows: ", { resp });
        }
    };

    useEffect(() => {
        loadStatisticsRows();
    }, []);

    const onSearch = async () => {
        setLoading(true);
        await loadStatisticsRows();
    };

    const handleExportarStatistics = () => {
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
            title: t("statistics.exportDialog.title"),
            message: t("statistics.exportDialog.message", {
                startDate: startDateString,
                endDate: endDateString,
            }),
            confirmText: t("statistics.exportDialog.confirmText"),
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting statistics...");
                }
                const resp = await exportStatisticData(startDate, endDate);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting statistics resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        t("statistics.fileName"),
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess(t("statistics.notifications.exportSuccess"));
                } else {
                    showToastError(t("statistics.notifications.exportError"));
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
                        label={t("statistics.searchControls.startDate")}
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
                        label={t("statistics.searchControls.endDate")}
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
                    <Box>{t("statistics.searchControls.search")}</Box>
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportarStatistics}
                >
                    {t("statistics.searchControls.export")}
                </Button>
            </Box>

            <StatisticsDataTable loading={loading} statisticRows={statisticRows} />
        </Box>
    );
};
