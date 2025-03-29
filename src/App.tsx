import { ReactNode, useEffect, useState, lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Box, CircularProgress, CssBaseline, StyledEngineProvider } from "@mui/material";

import AppTheme from "@/theme/AppTheme";
import { ToastProvider } from "@/context/ToastContext";
import { ConfirmationProvider } from "@/context/ConfirmationContext";
import { cleanup, hydrateAuth, useAuthStore } from "@/stores/authStore";
import { ErrorPage } from "@/components/ErrorPage";
import { Layout } from "@/layout/Layout";

import "@/utils/i18n";

// Lazy load all page components
const LogIn = lazy(() =>
    import("@/pages/auth/log-in/LogIn").then((module) => ({ default: module.LogIn })),
);
const SignUp = lazy(() =>
    import("@/pages/auth/sign-up/SignUp").then((module) => ({ default: module.SignUp })),
);
const Home = lazy(() => import("@/pages/home/Home").then((module) => ({ default: module.Home })));
const RouteProduct = lazy(() =>
    import("@/pages/route-product/RouteProduct").then((module) => ({
        default: module.RouteProduct,
    })),
);
const Driver = lazy(() =>
    import("@/pages/driver/Driver").then((module) => ({ default: module.Driver })),
);
const ShipmentPayrollYearList = lazy(() =>
    import("@/pages/shipment-payrolls/ShipmentPayrollYearList").then((module) => ({
        default: module.ShipmentPayrollYearList,
    })),
);
const ShipmentPayrollList = lazy(() =>
    import("@/pages/shipment-payrolls/ShipmentPayrollList").then((module) => ({
        default: module.ShipmentPayrollList,
    })),
);
const ShipmentPayroll = lazy(() =>
    import("@/pages/shipment-payrolls/ShipmentPayroll").then((module) => ({
        default: module.ShipmentPayroll,
    })),
);
const UserProfile = lazy(() =>
    import("@/pages/user-profile/UserProfile").then((module) => ({ default: module.UserProfile })),
);
const DriverList = lazy(() =>
    import("@/pages/driver-payrolls/DriverList").then((module) => ({ default: module.DriverList })),
);
const DriverPayrollList = lazy(() =>
    import("@/pages/driver-payrolls/DriverPayrollList").then((module) => ({
        default: module.DriverPayrollList,
    })),
);
const DriverPayroll = lazy(() =>
    import("@/pages/driver-payrolls/DriverPayroll").then((module) => ({
        default: module.DriverPayroll,
    })),
);
const Dinatran = lazy(() =>
    import("@/pages/dinatran/Dinatran").then((module) => ({ default: module.Dinatran })),
);

// Loading component for Suspense
const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

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
        return <LoadingFallback />;
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
                <Suspense fallback={<LoadingFallback />}>
                    <LogIn title="Log in" />
                </Suspense>
            </PublicRoute>
        ),
    },
    {
        path: "/sign-up",
        errorElement: <ErrorPage />,
        element: (
            <PublicRoute>
                <Suspense fallback={<LoadingFallback />}>
                    <SignUp title="Sign Up" />
                </Suspense>
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
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <Home title="D y R Transportes" />
                    </Suspense>
                ),
            },
            {
                path: "/shipment-payrolls",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <ShipmentPayrollYearList title="Shipment Payrolls" />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":year",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <ShipmentPayrollList title="Shipment Payrolls" />
                            </Suspense>
                        ),
                    },
                    {
                        path: "payroll/:shipment_payroll_code",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <ShipmentPayroll title="Shipments" />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "/driver-payrolls",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <DriverList title="Driver Payrolls" />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":driver_code",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <DriverPayrollList title="Driver Payrolls" />
                            </Suspense>
                        ),
                    },
                    {
                        path: ":driver_code/payroll/:driver_payroll_code",
                        element: (
                            <Suspense fallback={<LoadingFallback />}>
                                <DriverPayroll title="Driver Payrolls" />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "/routes",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <RouteProduct title="Prices" />
                    </Suspense>
                ),
            },
            {
                path: "/drivers",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <Driver title="Drivers" />
                    </Suspense>
                ),
            },
            {
                path: "/profile",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <UserProfile title="Profile" />
                    </Suspense>
                ),
            },
            {
                path: "/dinatran",
                element: (
                    <Suspense fallback={<LoadingFallback />}>
                        <Dinatran title="DINATRAN" />
                    </Suspense>
                ),
            },
        ],
    },
]);

export const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <AppTheme>
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
