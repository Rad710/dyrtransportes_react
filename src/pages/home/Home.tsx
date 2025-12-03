import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import type { PageProps } from "@/types";
import { TabPanel } from "@/components/TabPanel";
import { DriverStatisticsTabContent } from "./components/DriverStatisticsTabContent";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "./translations";
import { ProfitsTabContent } from "./components/ProfitsTabContent";
import { BackupTabContent } from "./components/BackupTabContent";
import { useAuthStore } from "@/stores/authStore";
import { ProductStatisticsTabContent } from "./components/ProductStatisticsTabContent";

export const Home = ({ title }: Readonly<PageProps>) => {
    const { t } = useTranslation(homeTranslationNamespace);

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        document.title = title;
    }, [title]);

    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="home-tabs">
                    <Tab
                        label={t("profits.tabs")}
                        id="home-tab-0"
                        aria-controls="home-tabpanel-0"
                    />
                    <Tab
                        label={t("driverStatistics.tabs")}
                        id="home-tab-1"
                        aria-controls="home-tabpanel-1"
                    />
                    <Tab
                        label={t("productStatistics.tabs")}
                        id="home-tab-2"
                        aria-controls="home-tabpanel-2"
                    />
                    {user?.admin && (
                        <Tab
                            label={t("database.tabs")}
                            id="home-tab-3"
                            aria-controls="home-tabpanel-3"
                        />
                    )}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ProfitsTabContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DriverStatisticsTabContent />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ProductStatisticsTabContent />
            </TabPanel>
            {user?.admin && (
                <TabPanel value={value} index={3}>
                    <BackupTabContent />
                </TabPanel>
            )}
        </Box>
    );
};
