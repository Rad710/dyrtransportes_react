import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import type { PageProps } from "@/types";
import { TabPanel } from "@/components/TabPanel";
import { StatisticsTabContent } from "./components/StatisticsTabContent";
import { useTranslation } from "react-i18next";
import { homeTranslationNamespace } from "./translations";

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
                        label={t("tabs.statistics")}
                        id="home-tab-0"
                        aria-controls="home-tabpanel-0"
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <StatisticsTabContent />
            </TabPanel>
        </Box>
    );
};
