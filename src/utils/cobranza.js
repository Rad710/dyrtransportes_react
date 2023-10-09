import { toast } from "@/components/ui/use-toast"
import axios from "axios"
import { saveAs } from "file-saver"

//creates a new planilla entry
const postPlanilla = async (fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/planillas/`

    const result = await axios.post(url, { fecha: fecha })
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}

//gets all planillas from the database
const getPlanillas = async () => {
    const url = `${import.meta.env.VITE_API_URL}/planillas/`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}

//gets all planillas from given year
const getYearlyPlanillas = async (year) => {
    const url = `${import.meta.env.VITE_API_URL}/planillas/${year}`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}

//delete given planilla from the database
const deletePlanilla = async (fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/planillas/${fecha}`

    const result = await axios.delete(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}


const getExportarInforme = async (fechaInicio, fechaFin) => {
    const url = `${import.meta.env.VITE_API_URL}/exportar_informe/${fechaInicio}/${fechaFin}`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response
            saveAs(new Blob([data]), `informe_${fechaInicio}-${fechaFin}.xlsx`);
            
        }).catch(function (error) {
            toast({
                variant: "destructive",
                description: 'Error: no se pudo descargar el archivo',
              })
            return error
        })

    return result
}


//creates a new planilla entry at the start of the next "new" year according to the database
const postCobranza = async (cobranza) => {
    const url = `${import.meta.env.VITE_API_URL}/cobranzas/`

    const result = await axios.post(url, { cobranza: cobranza })
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}

const getCobranza = async (fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/cobranzas/${fecha}`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })

    return result
}

const getExportarCobranza = async (fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/exportar_cobranza/${fecha}`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response
            saveAs(new Blob([data]), `cobranza_${fecha}.xlsx`);

        }).catch(function (error) {
            toast({
                variant: "destructive",
                description: 'Error: no se pudo descargar el archivo',
              })
            return error
        })

    return result
}

const putCobranza = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/cobranzas/${formData.id}`

    const result = await axios.put(url, {cobranza: formData})
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}

const deleteCobranza = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/cobranza/${id}`

    const result = await axios.delete(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })
    return result
}


const getKeywords = async () => {
    const url = `${import.meta.env.VITE_API_URL}/keywords/`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response

            return data
        })
        .catch(function (error) {
            console.log('Error', error.response.data)
            return error
        })

    return result
}


export {
    postPlanilla, getPlanillas, deletePlanilla, getYearlyPlanillas, getExportarInforme,
    postCobranza, getCobranza, putCobranza, deleteCobranza, getExportarCobranza, 
    getKeywords
}