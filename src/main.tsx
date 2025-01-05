import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "@radix-ui/themes/styles.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

//TODO remove react-icons, react-loader-spinner

import Layout from "./components/Layout";
import Index from "./pages/homepage/Index";
import Cobranzas from "./pages/cobranzas/Cobranzas";
import LiquidacionesChofer from "./pages/liquidaciones/LiquidacionesChofer";
import { RouteProduct } from "./pages/route_product/RouteProduct";
import { Drivers } from "./pages/driver/Drivers";
import ErrorPage from "./components/ErrorPage";

import { ShipmentPayrollYearList } from "./pages/shipment_payroll/ShipmentPayrollYearList";
import { ShipmentPayrollList } from "./pages/shipment_payroll/ShipmentPayrollList";

import ListaLiquidaciones from "./pages/liquidaciones/ListaLiquidaciones";
import Liquidacion from "./pages/liquidaciones/Liquidacion";
import Dinatran from "./pages/dinatran/Dinatran";
import AuthWrapper from "./hooks/AuthWrapper";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Index title="D y R Transportes" />,
            },
            {
                path: "/shipment-payroll-list",
                children: [
                    {
                        index: true,
                        element: <ShipmentPayrollYearList title="Planillas Años" />,
                    },
                    {
                        path: "/shipment-payroll-list/:year/",
                        element: <ShipmentPayrollList title="Lista de Planillas" />,
                    },
                    {
                        path: "/shipment-payroll-list/payroll/:payroll_code",
                        element: <Cobranzas title="Cobranzas" />,
                    },
                ],
            },
            {
                path: "/liquidaciones",
                children: [
                    {
                        index: true,
                        element: <ListaLiquidaciones title="Lista de Liquidaciones" />,
                    },
                    {
                        path: "/liquidaciones/:chofer",
                        element: <LiquidacionesChofer title="Lista de Liquidaciones - Chofer" />,
                    },
                    {
                        path: "/liquidaciones/:chofer/:fecha",
                        element: <Liquidacion title="Liquidación" />,
                    },
                ],
            },
            {
                path: "/routes",
                element: <RouteProduct title="Lista de Precios" />,
            },
            {
                path: "/drivers",
                element: <Drivers title="Nomina de Choferes" />,
            },
            {
                path: "/dinatran",
                element: <Dinatran title="DINATRAN" />,
            },
        ],
    },
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>
    </React.StrictMode>
);
