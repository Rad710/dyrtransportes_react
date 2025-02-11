import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Box, CircularProgress, CssBaseline, StyledEngineProvider } from "@mui/material";

import AppTheme from "./theme/AppTheme";
import { LogIn } from "@/pages/login/LogIn";
import { SignUp } from "@/pages/signup/SignUp";
import { Home } from "@/pages/home/Home";
import { ReactNode, useEffect, useState } from "react";
import { hydrateAuth, useAuthStore } from "./stores/authStore";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./components/ErrorPage";

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const token = useAuthStore((state) => state.token);

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        const initAuth = async () => {
            await hydrateAuth();
            setIsLoading(false);
        };

        initAuth();
    }, []);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!token) {
        return <Navigate to="/log-in" replace />;
    }

    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: "/log-in",
        element: (
            <PublicRoute>
                <LogIn />
            </PublicRoute>
        ),
    },
    {
        path: "/sign-up",
        element: (
            <PublicRoute>
                <SignUp />
            </PublicRoute>
        ),
    },

    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
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
    return (
        <StyledEngineProvider injectFirst>
            <AppTheme disableCustomTheme={true}>
                <CssBaseline enableColorScheme />

                <RouterProvider router={router} />
            </AppTheme>
        </StyledEngineProvider>
    );
};
