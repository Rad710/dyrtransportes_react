import axios from "axios"
import { saveAs } from "file-saver"

import { toastError } from "./utils"


const getDatabaseBackup = async () => {
    const url = `${import.meta.env.VITE_API_URL}/database_backup`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response

            const timestamp = new Date().toISOString().replace(/[-:.]/g, '_');

            const blob = new Blob([data], { type: 'application/octet-stream' });
            saveAs(blob, `backup_${timestamp}.sql`);

        }).catch(function (error) {
            console.log('Error', error)
            toastError(error)
            return error
        })

    return result
}

const getStatistics = async (fecha_inicio, fecha_fin) => {
    const url = `${import.meta.env.VITE_API_URL}/statistics/${fecha_inicio}/${fecha_fin}`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error)

            toastError(error)
            return error
        })

    return result
}

const uploadCobranzas = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/importar_cobranza`

    const result = await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error)
            toastError(error)
            return error
        })
    return result
}

const getExportarFormato = async () => {
    const url = `${import.meta.env.VITE_API_URL}/exportar_formato_cobranza`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response
            saveAs(new Blob([data]), 'planilla_formato.xlsx');

        }).catch(function (error) {
            console.log('Error', error)
            toastError(error)
            return error
        })

    return result
}

export {
    getDatabaseBackup, getStatistics, uploadCobranzas, getExportarFormato
}