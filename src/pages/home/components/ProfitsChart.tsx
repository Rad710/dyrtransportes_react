import { Typography, Box, Stack, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BarChart } from "@mui/x-charts/BarChart";
import type { ProfitData } from "../types";
import type { DateTime } from "luxon";
import { homeTranslationNamespace } from "../translations";
import { numberToLocaleString } from "@/utils/i18n";

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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
            }}
        >
            <Box sx={{ width: "100%", height: "100%" }}>
                <BarChart
                    sx={{
                        height: { xs: 300, md: 400 },
                    }}
                    layout="horizontal"
                    title={t("profits.chart.title", {
                        startDate: startDateString,
                        endDate: endDateString,
                    })}
                    series={[
                        {
                            data: [profitData?.totalShipmentPayroll ?? 0],
                            label: t("profits.chart.labels.income"),
                            color: theme.palette.primary.main,
                            valueFormatter: (value) => numberToLocaleString(value ?? 0),
                        },
                        {
                            data: [profitData?.totalDriverPayroll ?? 0],
                            label: t("profits.chart.labels.expenses"),
                            color: theme.palette.warning.main,
                            valueFormatter: (value) => numberToLocaleString(value ?? 0),
                        },
                        {
                            data: [profitData?.totalLosses ?? 0],
                            label: t("profits.chart.labels.losses"),
                            color: theme.palette.error.main,
                            valueFormatter: (value) => numberToLocaleString(value ?? 0),
                        },
                        {
                            data: [profitData?.totalProfits ?? 0],
                            label: t("profits.chart.labels.profits"),
                            color: theme.palette.success.main,
                            valueFormatter: (value) => numberToLocaleString(value ?? 0),
                        },
                    ]}
                    yAxis={[
                        {
                            scaleType: "band",
                            data: [t("profits.chart.labels.summary")],
                        },
                    ]}
                    slotProps={{
                        legend: {
                            position: { vertical: "middle", horizontal: "start" },
                        },
                    }}
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
                        {numberToLocaleString(profitData?.totalShipmentPayroll ?? 0)}
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
                        {numberToLocaleString(profitData?.totalDriverPayroll ?? 0)}
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
                        {numberToLocaleString(profitData?.totalLosses ?? 0)}
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
                        {numberToLocaleString(profitData?.totalProfits ?? 0)}
                    </Typography>
                </Typography>

                <Typography variant="h5" fontWeight="900">
                    {t("profits.chart.totals.shipments")} {profitData?.shipments ?? 0}
                </Typography>
            </Stack>
        </Box>
    );
};
