import { useLoaderData, useMatch } from "react-router-dom"
import { useState, useEffect } from "react"

import { Button } from "@radix-ui/themes"

import { TableIcon } from "@radix-ui/react-icons";

import AlertButton from "../../components/AlertButton"
import FormCobranzas from "./components/FormCobranzas";

import { getCobranza, getExportarCobranza, deleteCobranza } from "../../utils/cobranza";
import TableCobranzas from "./components/TableCobranzas"
import { toast } from "@/components/ui/use-toast";


export async function loader({ params }) {
  const year = params.year
  const [month, day] = params.date.split('-')
  const fecha = new Date(year, month - 1, day).toISOString().slice(0, 10)

  const response = await getCobranza(fecha)

  const result = {}
  for (const grupo in response) {
    result[grupo] = {
      ...response[grupo], viajes: response[grupo].viajes.map((viaje) => ({ viaje: viaje, checked: false }))
    }
  }

  return result
}


function Cobranzas({ title }) {
  useEffect(() => {
    document.title = title;
  }, []);

  const match = useMatch("/cobranzas/:year/:date");
  const { year, date } = match.params;

  const [month, day] = date.split("-")
  const planillaDate = new Date(year, month - 1, day)

  const [cobranzas, setCobranzas] = useState(useLoaderData())

  const [formData, setFormData] = useState({
    id: "", fechaCreacion: planillaDate.toISOString().slice(0, 10),
    fechaViaje: new Date().toISOString().slice(0, 10), chofer: "", chapa: "", producto: "",
    origen: "", destino: "", tiquet: "", precio: "",
    kgOrigen: "", kgDestino: ""
  })
  console.log(formData)
  const [tracker, setTracker] = useState([])


  const handleExportar = async () => {
    await getExportarCobranza(planillaDate.toISOString().slice(0, 10))
  }

  const handleDelete = async () => {
    const deletePromises = tracker.map(async (cobranza) => (await deleteCobranza(cobranza.id)))

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

    const responseUpdate = await getCobranza(planillaDate.toISOString().slice(0, 10))
    const result = {}
    for (const grupo in responseUpdate) {
      result[grupo] = {
        ...responseUpdate[grupo], viajes: responseUpdate[grupo].viajes
          .map((viaje) => ({ viaje: viaje, checked: false }))
      }
    }
    setCobranzas(result)

    setTracker([])
  }

  return (
    <div className="p-4">
      <div className="md:flex justify-between mb-8 items-center">
        <h2 className="text-3xl font-bold text-left md:w-1/3">{`Cobranza del 
          ${(planillaDate.toLocaleDateString("es-ES",
          { year: "numeric", month: "numeric", day: "numeric", timeZone: "GMT" }))
          }`}
        </h2>

        <div className="gap-5 md:flex justify-end md:2/3">
          <FormCobranzas
            fechaCreacion={planillaDate}
            cobranzas={cobranzas}
            setCobranzas={setCobranzas}
            formData={formData}
            setFormData={setFormData}
            tracker={tracker}
            setTracker={setTracker}
          />

          <Button color="grass" variant="solid" size="4"
            onClick={handleExportar}>
            <TableIcon width="20" height="20" />Exportar
          </Button>

          <AlertButton
            handleDelete={handleDelete}
            disabled={tracker.length <= 0}
          />
        </div>
      </div>

      <TableCobranzas
        cobranzas={cobranzas}
        setCobranzas={setCobranzas}
        tracker={tracker}
        setTracker={setTracker}
      />

      {Object.keys(cobranzas).length === 0 && (
        <p className="text-center p-4 text-lg">
          No hay datos ingresados
        </p>
      )}
    </div>
  )
}

export default Cobranzas