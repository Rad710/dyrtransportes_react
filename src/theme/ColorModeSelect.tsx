import { useColorScheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { themeTranslationNamespace } from "./translations";

export default function ColorModeSelect(props: SelectProps) {
    const { mode, setMode } = useColorScheme();
    const { t } = useTranslation(themeTranslationNamespace);

    if (!mode) {
        return null;
    }

    return (
        <Select
            value={mode}
            onChange={(event) => setMode(event.target.value as "system" | "light" | "dark")}
            SelectDisplayProps={{
                // @ts-expect-error - data-screenshot attribute is not recognized by TypeScript
                "data-screenshot": "toggle-mode",
            }}
            {...props}
        >
            <MenuItem value="system">{t("colorMode.system")}</MenuItem>
            <MenuItem value="light">{t("colorMode.light")}</MenuItem>
            <MenuItem value="dark">{t("colorMode.dark")}</MenuItem>
        </Select>
    );
}
