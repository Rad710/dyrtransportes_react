import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import '@radix-ui/themes/styles.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { loader as cobranzasLoader } from './pages/cobranzas/Cobranzas'
import { loader as listaPlanillasLoader } from './pages/cobranzas/ListaPlanillas'
import { loader as YearlyPlanillasLoader } from './pages/cobranzas/YearlyPlanillas'
import { loader as ListaLiquidacionesLoader } from './pages/liquidaciones/ListaLiquidaciones'
import { loader as preciosLoader } from './pages/precios/Precios'
import { loader as nominaLoader } from './pages/nomina/Nomina'


import Layout from './components/Layout'
import Index from './pages/homepage/Index';
import Cobranzas from './pages/cobranzas/Cobranzas'
import LiquidacionesChofer from './pages/liquidaciones/LiquidacionesChofer'
import Precios from './pages/precios/Precios'
import Nomina from './pages/nomina/Nomina'
import ErrorPage from './components/ErrorPage'
import ListaPlanillas from './pages/cobranzas/ListaPlanillas'
import YearlyPlanillas from './pages/cobranzas/YearlyPlanillas'
import ListaLiquidaciones from './pages/liquidaciones/ListaLiquidaciones'
import Liquidacion from './pages/liquidaciones/Liquidacion'
import Dinatran from './pages/dinatran/Dinatran'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Index title="D y R Transportes" />,
      },
      {
        path: '/cobranzas',
        children: [
          {
            index: true,
            element: <ListaPlanillas title="Lista de Planillas" />,
            loader: listaPlanillasLoader
          },
          {
            path: '/cobranzas/:year/',
            element: <YearlyPlanillas title="Lista de Planillas" />,
            loader: YearlyPlanillasLoader,
          },
          {
            path: '/cobranzas/:year/:date',
            element: <Cobranzas title="Cobranzas" />,
            loader: cobranzasLoader
          },
        ]
      },
      {
        path: '/liquidaciones',
        children: [
          {
            index: true,
            element: <ListaLiquidaciones title="Lista de Liquidaciones" />,
            loader: ListaLiquidacionesLoader
          },
          {
            path: '/liquidaciones/:chofer',
            element: <LiquidacionesChofer title="Lista de Liquidaciones - Chofer" />,
          },
          {
            path: '/liquidaciones/:chofer/:fecha',
            element: <Liquidacion title="Liquidación" />,
          },
        ]
      },
      {
        path: '/precios',
        element: <Precios title="Lista de Precios" />,
        loader: preciosLoader
      },
      {
        path: '/nomina',
        element: <Nomina title="Nomina Choferes" />,
        loader: nominaLoader
      },
      {
        path: '/dinatran',
        element: <Dinatran title="DINATRAN" />,
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
