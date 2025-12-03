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
import type { ProductStatisticRow } from "../types";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";
import { ProductStatisticsDataTable } from "./ProductStatisticsDataTable";

export const getStatisticsData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/statistics/product?start_date=${startDate}&end_date=${endDate}`)
        .then((response: AxiosResponse<ProductStatisticRow[] | null>) => response.data ?? [])
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse ?? null;
        });

export const exportStatisticData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/statistics/product/export-excel?start_date=${startDate}&end_date=${endDate}`, {
            responseType: "blob",
        })
        .then((response: AxiosResponse<BlobPart | null>) => {
            return response ?? null;
        })
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse;
        });

export const ProductStatisticsTabContent = () => {
    // Add translation hook with home namespace
    const { t } = useTranslation(homeTranslationNamespace);

    // state
    const [loading, setLoading] = useState<boolean>(true);
    const [statisticRows, setStatisticRows] = useState<ProductStatisticRow[]>([]);

    const [startDate, setStartDate] = useState<DateTime>(
        DateTime.now().minus({ month: 1 }).startOf("day")
    );
    const [endDate, setEndDate] = useState<DateTime>(
        DateTime.now().plus({ day: 1 }).startOf("day")
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
            title: t("productStatistics.exportDialog.title"),
            message: t("productStatistics.exportDialog.message", {
                startDate: startDateString,
                endDate: endDateString,
            }),
            confirmText: t("productStatistics.exportDialog.confirmText"),
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting productStatistics...");
                }
                const resp = await exportStatisticData(startDate, endDate);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting statistics resp: ", { resp });
                }

                if (!isAxiosError(resp)) {
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        t("productStatistics.fileName"),
                        resp.headers?.["content-disposition"]
                    );

                    showToastSuccess(t("productStatistics.notifications.exportSuccess"));
                } else {
                    showToastError(t("productStatistics.notifications.exportError"));
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
                        label={t("productStatistics.searchControls.startDate")}
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
                        label={t("productStatistics.searchControls.endDate")}
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
                    <Box>{t("productStatistics.searchControls.search")}</Box>
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportarStatistics}
                >
                    {t("productStatistics.searchControls.export")}
                </Button>
            </Box>

            <ProductStatisticsDataTable loading={loading} statisticRows={statisticRows} />
        </Box>
    );
};
