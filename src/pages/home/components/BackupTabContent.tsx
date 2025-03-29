import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { api } from "@/utils/axios";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "../translations";
import { downloadFile } from "@/utils/file";

const exportDatabaseBackup = async () =>
    api
        .get(`/protected/database-backup`, {
            responseType: "blob",
        })
        .then((response: AxiosResponse<BlobPart | null>) => {
            return response ?? null;
        })
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse;
        });

export const BackupTabContent = () => {
    // Add translation hook with database namespace
    const { t } = useTranslation(homeTranslationNamespace);

    // state
    const [loading, setLoading] = useState<boolean>(false);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();

    const handleDatabaseBackup = async () => {
        if (import.meta.env.VITE_DEBUG) {
            console.log("Creating database database.backup...");
        }
        setLoading(true);
        const resp = await exportDatabaseBackup();
        setLoading(false);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Database backup response: ", { resp });
        }

        if (!isAxiosError(resp)) {
            downloadFile(
                new Blob([resp.data ?? ""]),
                "dump_filename.sql",
                resp.headers?.["content-disposition"],
            );

            showToastSuccess(t("database.backup.notifications.success"));
        } else {
            showToastAxiosError(resp);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 10,
                    textAlign: "center",
                }}
            >
                <Typography variant="h5">
                    {t("database.backup.title", "Create a backup to safeguard your data")}
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    startIcon={<DownloadIcon />}
                    onClick={handleDatabaseBackup}
                    disabled={loading}
                    sx={{ mt: 6 }}
                >
                    {loading
                        ? t("database.backup.button.loading", "Creating database.backup...")
                        : t("database.backup.button.default", "Download Backup")}
                </Button>
            </Box>
        </Box>
    );
};
