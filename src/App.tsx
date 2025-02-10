import { createBrowserRouter, RouterProvider } from "react-router";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

import AppTheme from "./theme/AppTheme";
import { LogIn } from "@/pages/login/LogIn";
import { SignUp } from "@/pages/signup/SignUp";
import { Home } from "@/pages/home/Home";
import { useEffect } from "react";
import { hydrateAuth } from "./stores/authStore";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./components/ErrorPage";

const router = createBrowserRouter([
    {
        path: "/log-in",
        element: <LogIn />,
    },
    {
        path: "/sign-up",
        element: <SignUp />,
    },

    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
]);

export const App = () => {
    useEffect(() => {
        hydrateAuth();
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <AppTheme disableCustomTheme={true}>
                <CssBaseline enableColorScheme />

                <RouterProvider router={router} />
            </AppTheme>
        </StyledEngineProvider>
    );
};
