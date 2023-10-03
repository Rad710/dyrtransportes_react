import axios from "axios"
import { saveAs } from "file-saver"

//creates a new planilla entry at the start of the next "new" year according to the database
const postPrecio = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/precios/`

    const result = await axios.post(url, { viaje: formData })
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

const getPrecios = async () => {
    const url = `${import.meta.env.VITE_API_URL}/precios/`

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

const getPrecio = async (origen, destino) => {
    const url = `${import.meta.env.VITE_API_URL}/precios/${origen}-${destino}`

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

const putPrecio = async (id, formData) => {
    const url = `${import.meta.env.VITE_API_URL}/precios/${id}`

    const result = await axios.put(url, {viaje: formData})
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

const deletePrecio = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/precios/${id}`

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

const getExportarPrecios = async () => {
    const url = `${import.meta.env.VITE_API_URL}/exportar_precios`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response
            saveAs(new Blob([data]), 'lista_de_precios.xlsx');

        }).catch(function (error) {
            alert('No se pudo descargar el archivo')
            return error
        })

    return result
}

export {
    postPrecio, getPrecios, getPrecio, putPrecio, deletePrecio, getExportarPrecios
}