import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Box, CircularProgress, CssBaseline, StyledEngineProvider } from "@mui/material";

import AppTheme from "./theme/AppTheme";
import { LogIn } from "@/pages/auth/LogIn";
import { SignUp } from "@/pages/auth/SignUp";
import { Home } from "@/pages/home/Home";
import { ReactNode, useEffect, useState } from "react";
import { hydrateAuth, useAuthStore } from "./stores/authStore";
import { Layout } from "./components/Layout";
import { ErrorPage } from "./components/ErrorPage";
import { RouteProduct } from "./pages/route_product/RouteProduct";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { ToastProvider } from "@/context/ToastContext";
import { Driver } from "@/pages/driver/Driver";
import { ShipmentPayrollYearList } from "@/pages/shipment-payrolls/ShipmentPayrollYearList";
import { ShipmentPayrollList } from "@/pages/shipment-payrolls/ShipmentPayrollList";
import { UserProfile } from "@/pages/user_profile/UserProfile";
import { DriverList } from "@/pages/driver_payroll/DriverList";
import { DriverPayrollList } from "@/pages/driver_payroll/DriverPayrollList";
import { DriverPayroll } from "@/pages/driver_payroll/DriverPayroll";
import { ShipmentPayroll } from "./pages/shipment-payrolls/ShipmentPayroll";

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
