import { useState, useEffect } from "react"
import { Checkbox, Flex } from "@radix-ui/themes"
import { Link, useLoaderData } from "react-router-dom"
import { deleteLiquidaciones, getLiquidaciones } from "../../utils/liquidaciones"

import AlertButton from "../../components/AlertButton"
import FormListaLiquidaciones from "./components/FormListaLiquidaciones"

export async function loader() {
  const response = await getLiquidaciones()

  return response.map(liquidacion => ({ chofer: liquidacion, checked: false }))
}


function ListaLiquidaciones({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [liquidaciones, setLiquidaciones] = useState(useLoaderData())

  const handleCheckboxChange = (chofer) => {
    const newLiquidaciones = liquidaciones.map(liquidacion => (
      liquidacion.chofer === chofer ? { ...liquidacion, checked: !liquidacion.checked } : liquidacion
    ))

    setLiquidaciones(newLiquidaciones)
  }

  const handleDelete = async () => {

    const toDelete = liquidaciones.filter(liquidacion => liquidacion.checked)
      .map(liquidacion => liquidacion.chofer)

    const deletePromises = toDelete.map(async (chofer) => (await deleteLiquidaciones(chofer)))

    const confirmDelete = await Promise.all(deletePromises);

    confirmDelete.forEach(element => {
      if (element?.response) {
        alert(`Error${element.response.data}`)
      }
    });

    const newLiquidaciones = liquidaciones.filter(liquidacion => liquidacion.checked !== true)
    setLiquidaciones(newLiquidaciones)
  }

  return (
    <div className="p-4">
      <div className="md:flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-bold text-left md:w-1/3">
          Lista de Liquidaciones
        </h2>

        <div className="gap-5 md:flex justify-end md:2/3">
          <FormListaLiquidaciones
            liquidaciones={liquidaciones}
            setLiquidaciones={setLiquidaciones}
          />

          <AlertButton
            handleDelete={handleDelete}
            disabled={!liquidaciones.some(liquidacion => liquidacion.checked)}
          />
        </div>
      </div>

      <ul className="text-2xl font-bold items-center flex flex-col space-y-5">
        {liquidaciones.map(liquidacion => (
          <li className="flex"
            key={liquidacion.chofer}>
            <Flex align="center">
              <Checkbox mr="4"
                checked={liquidacion.checked}
                onCheckedChange={() => handleCheckboxChange(liquidacion.chofer)} />
              <Link
                className="bg-blue-700 hover:bg-blue-600 text-white text-center rounded-md shadow-md px-10 py-2"
                to={`/liquidaciones/${liquidacion.chofer}`}
              >{liquidacion.chofer}</Link>
            </Flex>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default ListaLiquidaciones