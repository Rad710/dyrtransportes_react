import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { DateTime } from "luxon";
import { api } from "@/utils/axios";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";
import type { DinatranRow } from "./types";
import type { ApiResponse, PageProps } from "@/types";
import { DinatranDataTable } from "./components/DinatranDataTable";
import { useToast } from "@/context/ToastContext";
import { TableChart as TableChartIcon } from "@mui/icons-material";
import { useConfirmation } from "@/context/ConfirmationContext";
import { downloadFile } from "@/utils/file";
import { useTranslation } from "react-i18next";
import { dinatranTranslationNamespace } from "./translations";

const getDinatranData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/dinatran?start_date=${startDate}&end_date=${endDate}`)
        .then((response: AxiosResponse<DinatranRow[] | null>) => response.data ?? [])
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse ?? null;
        });

const exportDinatranData = async (startDate: DateTime, endDate: DateTime) =>
    api
        .get(`/dinatran/export-excel?start_date=${startDate}&end_date=${endDate}`, {
            responseType: "blob",
        })
        .then((response: AxiosResponse<BlobPart | null>) => {
            return response ?? null;
        })
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse;
        });

export const Dinatran = ({ title }: PageProps) => {
    // state
    const [loading, setLoading] = useState<boolean>(true);
    const [dinatranRows, setDinatranRows] = useState<DinatranRow[]>([]);

    const [startDate, setStartDate] = useState<DateTime>(
        DateTime.now().minus({ month: 1 }).startOf("day"),
    );
    const [endDate, setEndDate] = useState<DateTime>(
        DateTime.now().plus({ day: 1 }).startOf("day"),
    );

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    // translations
    const { t } = useTranslation(dinatranTranslationNamespace);

    // USE EFFECT
    useEffect(() => {
        document.title = title;
    }, [title]);

    const loadDinatranRows = async () => {
        setLoading(true);
        const resp = await getDinatranData(startDate, endDate);
        setLoading(false);
        if (!isAxiosError(resp) && resp) {
            setDinatranRows(resp);
        } else {
            showToastAxiosError(resp);
            setDinatranRows([]);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded DINATRAN rows: ", { resp });
        }
    };

    useEffect(() => {
        loadDinatranRows();
    }, []);

    const onSearch = async () => {
        setLoading(true);
        await loadDinatranRows();
    };

    const handleExportarDinatran = () => {
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
            title: t("exportDialog.title"),
            message: t("exportDialog.message", {
                startDate: startDateString,
                endDate: endDateString,
            }),
            confirmText: t("exportDialog.confirmText"),
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting DINATRAN...");
                }
                const resp = await exportDinatranData(startDate, endDate);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting DINATRAN resp: ", { resp });
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
        <Box sx={{ p: 2 }}>
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
                        label={t("searchControls.startDate")}
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
                        label={t("searchControls.endDate")}
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
                    <Box>{t("searchControls.search")}</Box>
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<TableChartIcon />}
                    onClick={handleExportarDinatran}
                >
                    {t("searchControls.export")}
                </Button>
            </Box>

            <DinatranDataTable loading={loading} dinatranRows={dinatranRows} />
        </Box>
    );
};
