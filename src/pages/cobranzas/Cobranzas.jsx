import { useMatch } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"

import { Button } from "@radix-ui/themes"

import { TableIcon } from "@radix-ui/react-icons";

import AlertButton from "../../components/AlertButton"
import FormCobranzas from "./components/FormCobranzas";

import { getCobranza, getExportarCobranza, deleteCobranza } from "../../utils/cobranza";
import TableCobranzas from "./components/TableCobranzas"

import { ColorRing } from "react-loader-spinner";

function Cobranzas({ title }) {

  const match = useMatch("/cobranzas/:year/:date");
  const { year, date } = match.params;

  const [month, day] = date.split("-")
  const planillaDate = new Date(year, month - 1, day)

  const [cobranzas, setCobranzas] = useState([])


  const [formData, setFormData] = useState({
    id: "", fechaCreacion: planillaDate.toISOString().slice(0, 10),
    fechaViaje: new Date().toISOString().slice(0, 10), chofer: "", chapa: "", producto: "",
    origen: "", destino: "", tiquet: "", precio: "",
    kgOrigen: "", kgDestino: ""
  })

  const [tracker, setTracker] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = title;

    const fetchData = async () => {
      const response = await getCobranza(planillaDate.toISOString().slice(0, 10))

      if (!response?.response && !response?.message) {
        const result = response.map(grupo => ({ ...grupo, viajes: grupo.viajes.map((viaje) => ({ viaje: viaje, checked: false })) }))
        setCobranzas(result)
        setLoading(false)
      }
    }

    fetchData()
  }, [match]);



  const handleExportar = async () => {
    document.body.style.cursor = 'wait'
    await getExportarCobranza(planillaDate.toISOString().slice(0, 10))
    document.body.style.cursor = 'default'
  }

  const handleDelete = async () => {
    const deletePromises = tracker.map(async (cobranza) => (await deleteCobranza(cobranza.id)))

    const results = await Promise.all(deletePromises);

    results.forEach(element => {
      if (element?.response) {
        return
      }
    });

    const responseUpdate = await getCobranza(planillaDate.toISOString().slice(0, 10))
    if (responseUpdate?.response) {
      return
    }

    const result = responseUpdate.map(grupo => ({ ...grupo, viajes: grupo.viajes.map((viaje) => ({ viaje: viaje, checked: false })) }))
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

      {!loading && (
        <>
          <TableCobranzas
            cobranzas={cobranzas}
            setCobranzas={setCobranzas}
            tracker={tracker}
            setTracker={setTracker}
          />

          {cobranzas.length === 0 && (
            <p className="text-center p-4 text-lg">
              No hay datos ingresados
            </p>
          )}
        </>
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

export default Cobranzas