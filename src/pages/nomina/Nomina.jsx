import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import { Button } from "@radix-ui/themes"
import { TableIcon } from "@radix-ui/react-icons"

import AlertButton from "../../components/AlertButton"
import { deleteNomina, getNomina } from "../../utils/nomina"
import TableNomina from "./components/TableNomina"

export async function loader() {
  const response = await getNomina()

  return response.map(entrada => ({ ...entrada, checked: false }))
}



function Nomina({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [nomina, setNomina] = useState(useLoaderData())

  const handleDelete = async () => {
    const toDelete = nomina.filter(entry => entry.checked)

    const deletePromises = toDelete.map(async (entrada) => (await deleteNomina(entrada.id)))

    const results = await Promise.all(deletePromises);

    results.forEach(element => {
      if (element?.response) {
        alert(element.response.data)
        return
      }
    });

    setNomina(nomina.filter(entry => entry.checked === false))
  }

  return (
    <div className="p-4">
      <div className="md:flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-bold text-left md:w-1/3">
          Nómina de Choferes
        </h2>

        <div className="gap-5 md:flex justify-end md:2/3">
          {/* <FormNomina
            formData={formData}
            setFormData={setFormData}
            listaPrecios={listaPrecios}
            setListaPrecios={setListaPrecios}
          /> */}

          <Button color="grass" variant="solid" size="4"
            onClick={() => { }}
            disabled={true}  
          >
            <TableIcon width="20" height="20" />Exportar
          </Button>

          <AlertButton
            handleDelete={handleDelete}
            disabled={!nomina.some(entry => entry.checked)}
          />
        </div>
      </div>

      <TableNomina
        nomina={nomina}
        setNomina={setNomina}
      />

      {nomina.length === 0 && (
        <p className="text-center p-4 text-lg">
          No hay datos ingresados
        </p>
      )}
    </div>
  )
}

export default Nomina