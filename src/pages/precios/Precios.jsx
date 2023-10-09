import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"

import { Button } from "@radix-ui/themes"
import { TableIcon } from "@radix-ui/react-icons"

import FormPrecios from "./components/FormPrecios"
import TablePrecios from "./components/TablePrecios"
import AlertButton from "../../components/AlertButton"
import { deletePrecio, getExportarPrecios, getPrecios } from "../../utils/precio"
import { toast } from "@/components/ui/use-toast"


export async function loader() {
  const response = await getPrecios()
  
  const result = response.map(entrada => ({ ...entrada, checked: false }))

  return result
}


function Precios({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const [listaPrecios, setListaPrecios] = useState(useLoaderData())

  const [formData, setFormData] = useState({
    origen: '', destino: '', precio: '', precioLiquidacion: '', id: ''
  })

  const handleExportar = async () => {
    await getExportarPrecios()
  }

  const handleDelete = async () => {
    const toDelete = listaPrecios.filter(entry => entry.checked)

    const deletePromises = toDelete.map(async (entrada) => (await deletePrecio(entrada.id)))

    const results = await Promise.all(deletePromises);

    results.forEach(element => {
      if (element?.response) {
        toast({
          variant: "destructive",
          description: `Error: ${element.response.data}`,
        })
        return
      }
    });

    setListaPrecios(listaPrecios.filter(entry => entry.checked === false))
  }

  return (
    <div className="p-4">
      <div className="md:flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-bold text-left md:w-1/3">
          Lista de Precios
        </h2>

        <div className="gap-5 md:flex justify-end md:2/3">
          <FormPrecios
            formData={formData}
            setFormData={setFormData}
            listaPrecios={listaPrecios}
            setListaPrecios={setListaPrecios}
          />

          <Button color="grass" variant="solid" size="4"
            onClick={handleExportar}>
            <TableIcon width="20" height="20" />Exportar
          </Button>

          <AlertButton
            handleDelete={handleDelete}
            disabled={!listaPrecios.some(entry => entry.checked)}
          />
        </div>
      </div>

      <TablePrecios
        listaPrecios={listaPrecios}
        setListaPrecios={setListaPrecios}
      />
      
      {listaPrecios.length === 0 && (
        <p className="text-center p-4 text-lg">
          No hay datos ingresados
        </p>
      )}
    </div>
  )
}

export default Precios