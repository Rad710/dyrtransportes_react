import { useEffect, useState } from "react";

import { Button, Checkbox, Flex } from "@radix-ui/themes"
import { PlusIcon } from "@radix-ui/react-icons"
import { Link, useMatch } from "react-router-dom";

import AlertButton from "../../components/AlertButton"
import { deleteLiquidacionesChofer, getLiquidacionesChofer, postLiquidacion } from "../../utils/liquidaciones";

import { ColorRing } from "react-loader-spinner";

function LiquidacionesChofer({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const match = useMatch("/liquidaciones/:chofer");
  const { chofer } = match.params;

  const [liquidaciones, setLiquidaciones] = useState([])

  const [loading, setLoading] = useState(true)

  const loadLiquidaciones = async (chofer) => {
    const result = await getLiquidacionesChofer(chofer)

    if (!result?.response && !result?.message) {
      const formattedResult = result.map(fecha => (
        { fecha: new Date(fecha).toISOString().slice(0, 10), checked: false }
      ))

      setLiquidaciones(formattedResult)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadLiquidaciones(chofer)
  }, [])


  const handleAdd = async () => {
    const response = await postLiquidacion(chofer)
    if (!response?.response && !response?.message) {
      loadLiquidaciones(chofer)
    }
  }


  const handleCheckboxChange = (fecha) => {
    const newLiquidaciones = liquidaciones.map(liquidacion => (
      liquidacion.fecha === fecha ? { ...liquidacion, checked: !liquidacion.checked } : liquidacion
    ))

    setLiquidaciones(newLiquidaciones)
  }


  const handleDelete = async () => {
    const toDelete = liquidaciones.filter(liquidacion => liquidacion.checked)
      .map(liquidacion => liquidacion.fecha)

    const deletePromises = toDelete.map(async (fecha) => (await deleteLiquidacionesChofer(chofer, fecha)))

    const confirmDelete = await Promise.all(deletePromises);

    confirmDelete.forEach(element => {
      if (element?.response || element?.message) {
        return
      }
    });

    const newLiquidaciones = liquidaciones.filter(liquidacion => liquidacion.checked !== true)
    setLiquidaciones(newLiquidaciones)
  }


  return (
    <div className="p-4">
      <div className="md:flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-bold text-left md:w-1/3">
          {`Liquidación de ${chofer}`}
        </h2>

        <div className="gap-5 md:flex justify-end md:2/3">
          <Button color="indigo" variant="solid" size="4"
            onClick={handleAdd}
          >
            <PlusIcon width="20" height="20" />Agregar
          </Button>

          <AlertButton
            handleDelete={handleDelete}
            disabled={!liquidaciones.some(liquidacion => liquidacion.checked)}
          />
        </div>
      </div>

      {!loading && (
        <ul className="text-2xl font-bold items-center flex flex-col space-y-5">
          {liquidaciones.map(liquidacion => (
            <li className="flex"
              key={liquidacion.fecha}>
              <Flex align="center">
                <Checkbox mr="4"
                  checked={liquidacion.checked}
                  onCheckedChange={() => handleCheckboxChange(liquidacion.fecha)} />
                <Link
                  className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                  to={`/liquidaciones/${chofer}/${liquidacion.fecha}`}
                >{new Date(liquidacion.fecha).toLocaleDateString("es-ES",
                  { month: "long", day: "numeric", timeZone: "GMT" })}</Link>
              </Flex>
            </li>
          ))}
        </ul>
      )}

      <ColorRing
        visible={loading}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperClass="w-1/3 h-1/3 m-auto"
        colors={["#A2C0E8", "#8DABDF", "#7896D6", "#6381CD", "#6366F1"]}
      />
    </div>
  )
}

export default LiquidacionesChofer