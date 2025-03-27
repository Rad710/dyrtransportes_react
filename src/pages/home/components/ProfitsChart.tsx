import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
    type ChartData,
} from "chart.js";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Typography, Box, Stack, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ProfitData } from "../types";
import type { DateTime } from "luxon";
import { numberFormatter } from "@/utils/i18n";
import { homeTranslationNamespace } from "../translations";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ProfitsChartProps = {
    profitData: ProfitData | null;
    startDate: DateTime;
    endDate: DateTime;
};

export const ProfitsChart = ({ profitData, startDate, endDate }: ProfitsChartProps) => {
    const theme = useTheme();
    const { t } = useTranslation(homeTranslationNamespace);

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

    const setUpChart = () => {
        const options: ChartOptions<"bar"> = {
            indexAxis: "y",
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },
            responsive: true,
            plugins: {
                legend: {
                    position: "right",
                },
                title: {
                    display: true,
                    text: t("profits.chart.title", {
                        startDate: startDateString,
                        endDate: endDateString,
                    }),
                    font: {
                        family: theme.typography.fontFamily,
                        size: 16,
                        weight: "bold",
                    },
                },
            },
        };

        const data: ChartData<"bar"> = {
            labels: [t("profits.chart.labels.summary")],
            datasets: [
                {
                    label: t("profits.chart.labels.income"),
                    data: [profitData?.totalShipmentPayroll ?? 0],
                    backgroundColor: theme.palette.primary.main + "CC", // Adding transparency
                    borderColor: theme.palette.primary.dark,
                },
                {
                    label: t("profits.chart.labels.expenses"),
                    data: [profitData?.totalDriverPayroll ?? 0],
                    backgroundColor: theme.palette.warning.main + "CC",
                    borderColor: theme.palette.warning.dark,
                },
                {
                    label: t("profits.chart.labels.losses"),
                    data: [profitData?.totalLosses ?? 0],
                    backgroundColor: theme.palette.error.main + "CC",
                    borderColor: theme.palette.error.dark,
                },
                {
                    label: t("profits.chart.labels.profits"),
                    data: [profitData?.totalProfits ?? 0],
                    backgroundColor: theme.palette.success.main + "CC",
                    borderColor: theme.palette.success.dark,
                },
            ],
        };

        return { options, data };
    };

    const barProperties = useMemo(() => setUpChart(), [profitData, theme, t]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
            }}
        >
            <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Bar
                    options={barProperties.options}
                    data={barProperties.data}
                    redraw={true}
                    updateMode="resize"
                />
            </Box>

            <Stack
                spacing={4}
                sx={{
                    ml: { xs: 0, md: 6 },
                    mt: { xs: 4, md: 2 },
                    width: { xs: "100%", md: "40%" },
                }}
            >
                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.income")}{" "}
                    <Typography
                        component="em"
                        variant="h5"
                        fontWeight="900"
                        sx={{ color: theme.palette.primary.main }}
                    >
                        {numberFormatter(profitData?.totalShipmentPayroll ?? 0)}
                    </Typography>
                </Typography>

                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.expenses")}{" "}
                    <Typography
                        component="em"
                        variant="h5"
                        fontWeight="900"
                        sx={{ color: theme.palette.warning.main }}
                    >
                        {numberFormatter(profitData?.totalDriverPayroll ?? 0)}
                    </Typography>
                </Typography>

                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.losses")}{" "}
                    <Typography
                        component="em"
                        variant="h5"
                        fontWeight="900"
                        sx={{ color: theme.palette.error.main }}
                    >
                        {numberFormatter(profitData?.totalLosses ?? 0)}
                    </Typography>
                </Typography>

                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.profits")}{" "}
                    <Typography
                        component="em"
                        variant="h5"
                        fontWeight="900"
                        sx={{
                            color:
                                (profitData?.totalProfits ?? 0) >= 0
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                        }}
                    >
                        {numberFormatter(profitData?.totalProfits ?? 0)}
                    </Typography>
                </Typography>

                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.shipments")} {profitData?.shipments ?? 0}
                </Typography>
            </Stack>
        </Box>
    );
};
