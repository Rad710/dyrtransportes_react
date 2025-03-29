import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { colorSchemes, shadows } from "./themePrimitives";

// locales
import { esES, enUS } from "@mui/x-data-grid/locales";
import { esES as coreEsES, enUS as coreEnUS } from "@mui/material/locale";

interface AppThemeProps {
    children: React.ReactNode;
    /**
     * This is for the docs site. You can ignore it or remove it.
     */
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions["components"];
}

export default function AppTheme({ children, disableCustomTheme, themeComponents }: AppThemeProps) {
    // Check if client's language is Spanish
    const isSpanish = React.useMemo(() => {
        // Only run on client side
        if (typeof window !== "undefined") {
            const userLanguage = navigator.language || (navigator as any).userLanguage;
            return userLanguage.startsWith("es");
        }
        return false;
    }, []);

    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? createTheme({}, isSpanish ? esES : enUS, isSpanish ? coreEsES : coreEnUS)
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
                  isSpanish ? esES : enUS,
                  isSpanish ? coreEsES : coreEnUS,
              );
    }, [disableCustomTheme, themeComponents]);

    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
