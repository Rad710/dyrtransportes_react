import { ReactNode, useEffect, useState } from "react";

import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import AppTheme from "@/theme/AppTheme";
import { Box, CircularProgress, CssBaseline, StyledEngineProvider } from "@mui/material";

import { ToastProvider } from "@/context/ToastContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { cleanup, hydrateAuth, useAuthStore } from "@/stores/authStore";

import { ErrorPage } from "@/components/ErrorPage";
import { Layout } from "@/layout/Layout";
import { LogIn } from "@/pages/auth/log-in/LogIn";
import { SignUp } from "@/pages/auth/sign-up/SignUp";
import { Home } from "@/pages/home/Home";
import { RouteProduct } from "@/pages/route-product/RouteProduct";
import { Driver } from "@/pages/driver/Driver";
import { ShipmentPayrollYearList } from "@/pages/shipment-payrolls/ShipmentPayrollYearList";
import { ShipmentPayrollList } from "@/pages/shipment-payrolls/ShipmentPayrollList";
import { UserProfile } from "@/pages/user-profile/UserProfile";
import { DriverList } from "@/pages/driver-payrolls/DriverList";
import { DriverPayrollList } from "@/pages/driver-payrolls/DriverPayrollList";
import { DriverPayroll } from "@/pages/driver-payrolls/DriverPayroll";
import { ShipmentPayroll } from "@/pages/shipment-payrolls/ShipmentPayroll";
import { Dinatran } from "@/pages/dinatran/Dinatran";

import "@/utils/i18n";

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
            setIsLoading(true);
            await hydrateAuth();
            setIsLoading(false);
        };

        initAuth();

        return () => {
            cleanup();
        };
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
        errorElement: <ErrorPage />,
        element: (
            <PublicRoute>
                <LogIn title="Log in" />
            </PublicRoute>
        ),
    },
    {
        path: "/sign-up",
        errorElement: <ErrorPage />,
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
                path: "/shipment-payrolls",
                children: [
                    {
                        index: true,
                        element: <ShipmentPayrollYearList title="Shipment Payrolls" />,
                    },
                    {
                        path: ":year",
                        element: <ShipmentPayrollList title="Shipment Payrolls" />,
                    },
                    {
                        path: "payroll/:shipment_payroll_code",
                        element: <ShipmentPayroll title="Shipments" />,
                    },
                ],
            },
            {
                path: "/driver-payrolls",
                children: [
                    {
                        index: true,
                        element: <DriverList title="Driver Payrolls" />,
                    },
                    {
                        path: ":driver_code",
                        element: <DriverPayrollList title="Driver Payrolls" />,
                    },
                    {
                        path: ":driver_code/payroll/:driver_payroll_code",
                        element: <DriverPayroll title="Driver Payrolls" />,
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
                element: <UserProfile title="Profile" />,
            },
            {
                path: "/dinatran",
                element: <Dinatran title="DINATRAN" />,
            },
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
