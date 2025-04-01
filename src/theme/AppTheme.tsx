import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, shadows } from "./themePrimitives";

// locales
import { esES as dataGridEsEs, enUS as dataGridEnUs } from "@mui/x-data-grid/locales";
import { esES as coreEsES, enUS as coreEnUS } from "@mui/material/locale";
import { useMemo } from "react";
import i18n from "@/utils/i18n";

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions["components"];
}

export default function AppTheme({ children, disableCustomTheme, themeComponents }: AppThemeProps) {
    const theme = useMemo(() => {
        // Only run on client side
        const isSpanish = i18n.language.startsWith("es");
        const dataGridLanguage = isSpanish ? dataGridEsEs : dataGridEnUs;
        const coreLanguage = isSpanish ? coreEsES : coreEnUS;

        return disableCustomTheme
            ? createTheme({}, dataGridLanguage, coreLanguage)
            : createTheme(
                  {
                      // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
                      cssVariables: {
                          colorSchemeSelector: "data-mui-color-scheme",
                          cssVarPrefix: "template",
                      },
                      colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
                      shadows,
                      components: {
                          ...themeComponents,
                      },
                  },
                  dataGridLanguage,
                  coreLanguage
              );
    }, [disableCustomTheme, themeComponents]);

    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
