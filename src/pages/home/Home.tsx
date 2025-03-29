import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import type { PageProps } from "@/types";
import { TabPanel } from "@/components/TabPanel";
import { StatisticsTabContent } from "./components/StatisticsTabContent";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "./translations";
import { ProfitsTabContent } from "./components/ProfitsTabContent";
import { BackupTabContent } from "./components/BackupTabContent";

export const Home = ({ title }: Readonly<PageProps>) => {
    const { t } = useTranslation(homeTranslationNamespace);

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
                        label={t("statistics.tabs")}
                        id="home-tab-1"
                        aria-controls="home-tabpanel-1"
                    />
                    <Tab
                        label={t("database.tabs")}
                        id="home-tab-2"
                        aria-controls="home-tabpanel-2"
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ProfitsTabContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StatisticsTabContent />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <BackupTabContent />
            </TabPanel>
        </Box>
    );
};
