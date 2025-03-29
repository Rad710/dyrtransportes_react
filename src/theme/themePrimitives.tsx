import { createTheme, alpha, Shadows } from "@mui/material/styles";

// locales
import { enUS } from "@mui/x-data-grid/locales";
import { enUS as coreEnUS } from "@mui/material/locale";

// Create the default theme to use its light mode palette
const defaultTheme = createTheme({}, enUS, coreEnUS);

// Keep your custom colors for the dark mode
export const brand = {
    50: "hsl(210, 100%, 95%)",
    100: "hsl(210, 100%, 92%)",
    200: "hsl(210, 100%, 80%)",
    300: "hsl(210, 100%, 65%)",
    400: "hsl(210, 98%, 48%)",
    500: "hsl(210, 98%, 42%)",
    600: "hsl(210, 98%, 55%)",
    700: "hsl(210, 100%, 35%)",
    800: "hsl(210, 100%, 16%)",
    900: "hsl(210, 100%, 21%)",
};

export const gray = {
    50: "hsl(220, 35%, 97%)",
    100: "hsl(220, 30%, 94%)",
    200: "hsl(220, 20%, 88%)",
    300: "hsl(220, 20%, 80%)",
    400: "hsl(220, 20%, 65%)",
    500: "hsl(220, 20%, 42%)",
    600: "hsl(220, 20%, 35%)",
    700: "hsl(220, 20%, 25%)",
    800: "hsl(220, 30%, 6%)",
    900: "hsl(220, 35%, 3%)",
};

export const green = {
    50: "hsl(120, 80%, 98%)",
    100: "hsl(120, 75%, 94%)",
    200: "hsl(120, 75%, 87%)",
    300: "hsl(120, 61%, 77%)",
    400: "hsl(120, 44%, 53%)",
    500: "hsl(120, 59%, 30%)",
    600: "hsl(120, 70%, 25%)",
    700: "hsl(120, 75%, 16%)",
    800: "hsl(120, 84%, 10%)",
    900: "hsl(120, 87%, 6%)",
};

export const orange = {
    50: "hsl(45, 100%, 97%)",
    100: "hsl(45, 92%, 90%)",
    200: "hsl(45, 94%, 80%)",
    300: "hsl(45, 90%, 65%)",
    400: "hsl(45, 90%, 40%)",
    500: "hsl(45, 90%, 35%)",
    600: "hsl(45, 91%, 25%)",
    700: "hsl(45, 94%, 20%)",
    800: "hsl(45, 95%, 16%)",
    900: "hsl(45, 93%, 12%)",
};

export const red = {
    50: "hsl(0, 100%, 97%)",
    100: "hsl(0, 92%, 90%)",
    200: "hsl(0, 94%, 80%)",
    300: "hsl(0, 90%, 65%)",
    400: "hsl(0, 90%, 40%)",
    500: "hsl(0, 90%, 30%)",
    600: "hsl(0, 91%, 25%)",
    700: "hsl(0, 94%, 18%)",
    800: "hsl(0, 95%, 12%)",
    900: "hsl(0, 93%, 6%)",
};

export const colorSchemes = {
    // Use the default theme's light mode
    light: {
        // Just use the default theme's palette for light mode
        palette: {
            mode: "light",
        },
    },
    // Keep your only dark mode
    dark: {
        palette: {
            primary: {
                contrastText: brand[50],
                light: brand[300],
                main: brand[400],
                dark: brand[700],
            },
            info: {
                contrastText: brand[300],
                light: brand[500],
                main: brand[700],
                dark: brand[900],
            },
            warning: {
                light: orange[400],
                main: orange[500],
                dark: orange[700],
            },
            error: {
                light: red[400],
                main: red[500],
                dark: red[700],
            },
            success: {
                light: green[400],
                main: green[500],
                dark: green[700],
            },
            grey: {
                ...gray,
            },
            divider: alpha(gray[700], 0.6),
            background: {
                default: gray[900],
                paper: "hsl(220, 30%, 7%)",
            },
            text: {
                primary: "hsl(0, 0%, 100%)",
                secondary: gray[400],
            },
            action: {
                hover: alpha(gray[600], 0.2),
                selected: alpha(gray[600], 0.3),
            },
            baseShadow:
                "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
        },
    },
};

// @ts-expect-error following mui library example
const defaultShadows: Shadows = [
    "none",
    "var(--template-palette-baseShadow)",
    ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
