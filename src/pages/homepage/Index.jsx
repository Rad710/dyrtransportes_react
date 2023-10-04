import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

import { DownloadIcon } from "@radix-ui/react-icons";
import { Tabs, Box, Text, Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { getDatabaseBackup, getStatistics } from "../../utils/homepage";


import { Bar } from 'react-chartjs-2';
import FormDate from "../../components/FormDate";
import TableStatistics from "./components/TableStatistics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Index({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [tab, setTab] = useState('ganancias')

  const [statistics, setStatistics] = useState({})

  const [barData, setBarData] = useState({})

  const [legend, setLegend] = useState('')

  const today = new Date()
    // Tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Last month ago
  const lastMonthAgo = new Date(today);
  lastMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(lastMonthAgo)
  const [endDate, setEndDate] = useState(tomorrow)


  const loadStatistics = async () => {

    const result = await getStatistics(startDate.toISOString().slice(0, 10),
      endDate.toISOString().slice(0, 10))
    if (!result?.response) {
      setStatistics(result.choferes)

      setBarData(result.totales)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])

  useEffect(() => {
    const newLegend = `Resumen de Ganancias de ${startDate.toLocaleDateString("es-ES", {
      year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
    })} hasta ${endDate.toLocaleDateString("es-ES", {
      year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT"
    })}`

    setLegend(newLegend)
  }, [statistics])

  const handleDescargar = async () => {
    await getDatabaseBackup()
  }

  const onClick = async () => {
    await loadStatistics()
  }

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: legend,
      },
    },
  };

  const data = {
    labels: ['Resumen'],
    datasets: [
      {
        label: 'Ingresos',
        data: [barData.totalFletes],
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
      },
      {
        label: 'Egresos',
        data: [barData.totalLiquidacionViajes],
        backgroundColor: 'rgba(255, 150, 80, 0.8)',
      },
      {
        label: 'Pérdidas',
        data: [barData.totalPerdidas],
        backgroundColor: 'rgba(255, 80, 80, 0.8)',
      },
      {
        label: 'Ganancias',
        data: [barData.totalFletes - (barData.totalLiquidacionViajes + barData.totalPerdidas)],
        backgroundColor: 'rgba(74, 184, 68, 0.8)',
      },
    ],
  };

  const currencyFormatter = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG"
  })

  const ganancia = barData.totalFletes ? barData.totalFletes - (barData.totalLiquidacionViajes + barData.totalPerdidas) : 0
  return (
    <>
      <Tabs.Root value={tab} onValueChange={(value) => setTab(value)}>
        <Tabs.List>
          <Tabs.Trigger value="ganancias">
            <span className="text-xl">Ganancias</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="estadisticas">
            <span className="text-xl">Estadisticas</span>
          </Tabs.Trigger>
          <Tabs.Trigger value="baseDeDatos">
            <span className="text-xl">Base de Datos</span>
          </Tabs.Trigger>
        </Tabs.List>


        <Box px="4" pt="3" pb="2">
          <Tabs.Content value="ganancias">
              <FormDate
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onClick={onClick}
              />


            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5">
                <Bar
                  options={options}
                  data={data}
                  updateMode="resize"
                />
              </div>
              <div className="flex flex-col gap-10 ml-12 md:mt-10 mt-0">
                <Text size="6" className="font-black">
                  Total <em className="text-blue-700">Ingresos:{' '}
                    {currencyFormatter.format(barData.totalFletes ?? 0)}
                  </em>
                </Text>

                <Text size="6" className="font-black">
                  Total <em className="text-orange-600">Egresos:{' '}
                    {currencyFormatter.format(barData.totalLiquidacionViajes ?? 0)}
                  </em>
                </Text>

                <Text size="6" className="font-black">
                  Total <em className="text-red-600">Pérdidas:{' '}
                    {currencyFormatter.format(barData.totalPerdidas ?? 0)}
                  </em>
                </Text>

                <Text size="6" className="font-black">
                  Total <em className={ganancia >= 0 ? "text-green-600" : "text-red-600"}>Ganancias:{' '}
                    {currencyFormatter.format(ganancia)}
                  </em>
                </Text>
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="estadisticas">
              <FormDate
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onClick={onClick}
              />

            <TableStatistics
              statistics={statistics}
            />
            {Object.keys(statistics).length === 0 && (
              <p className="text-center p-4 text-lg">
                No hay datos
              </p>
            )}
          </Tabs.Content>

          <Tabs.Content value="baseDeDatos">
            <div className="mt-10 text-center">
              <Text size="7">Crea una Copia de Seguridad para respaldar los datos</Text>

              <br />
              <Button mt="6" color="grass" variant="solid" size="4"
                onClick={handleDescargar}
              >
                <DownloadIcon width="20" height="20" /> Descargar Copia
              </Button>
            </div>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
}

export default Index;
