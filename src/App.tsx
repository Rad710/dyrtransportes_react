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
import { RouteProduct } from "./pages/route_product/RouteProduct";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { ToastProvider } from "@/context/ToastContext";
import { Driver } from "@/pages/driver/Driver";
import { ShipmentPayrollYearList } from "@/pages/shipment_payroll/ShipmentPayrollYearList";
import { ShipmentPayrollList } from "@/pages/shipment_payroll/ShipmentPayrollList";
import { ShipmentList } from "@/pages/shipment_payroll/ShipmentList";
import { Profile } from "@/pages/profile/Profile";
import { DriverList } from "@/pages/driver_payroll/DriverList";

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
                <LogIn title="Log in" />
            </PublicRoute>
        ),
    },
    {
        path: "/sign-up",
        element: (
            <PublicRoute>
                <SignUp title="Sign Up" />
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
                element: <Home title="D y R Transportes" />,
            },
            {
                path: "/shipment-payroll-list",
                children: [
                    {
                        index: true,
                        element: <ShipmentPayrollYearList title="Shipment Payrolls" />,
                    },
                    {
                        path: "/shipment-payroll-list/:year/",
                        element: <ShipmentPayrollList title="Shipment Payrolls" />,
                    },
                    {
                        path: "/shipment-payroll-list/payroll/:shipment_payroll_code",
                        element: <ShipmentList title="Shipments" />,
                    },
                ],
            },
            {
                path: "/driver-list",
                children: [
                    {
                        index: true,
                        element: <DriverList title="Driver Payrolls" />,
                    },
                ],
            },
            {
                path: "/routes",
                element: <RouteProduct title="Prices" />,
            },
            {
                path: "/drivers",
                element: <Driver title="Drivers" />,
            },
            {
                path: "/profile",
                element: <Profile title="Profile" />,
            },
            // {
            //     path: "/dinatran",
            //     element: <Dinatran title="DINATRAN" />,
            // },
        ],
    },
]);

export const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <AppTheme disableCustomTheme={true}>
                <CssBaseline enableColorScheme />

                <ConfirmationProvider>
                    <ToastProvider>
                        <RouterProvider router={router} />
                    </ToastProvider>
                </ConfirmationProvider>
            </AppTheme>
        </StyledEngineProvider>
    );
};
