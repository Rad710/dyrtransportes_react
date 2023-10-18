import { toastError } from "./utils"

import axios from "axios"
import { saveAs } from "file-saver"


const postLiquidacion = async (chofer) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion`

    const result = await axios.post(url, { chofer: chofer })
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

const getLiquidacion = async (chofer, fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion/${chofer}/${fecha}`

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

const putLiquidacion = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion/${formData.id}`

    const result = await axios.put(url, { liquidacion: formData })
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

const getLiquidaciones = async () => {
    const url = `${import.meta.env.VITE_API_URL}/liquidaciones`

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

const getLiquidacionesChofer = async (chofer) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidaciones/${chofer}`

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


const deleteLiquidaciones = async (chofer) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidaciones/${chofer}`

    const result = await axios.delete(url)
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

const deleteLiquidacionesChofer = async (chofer, fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidaciones/${chofer}/${fecha}`

    const result = await axios.delete(url)
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


const postLiquidacionViaje = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_viaje`

    const result = await axios.post(url, { liquidacionViaje: formData })
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


const getLiquidacionViajes = async (chofer, fecha_liquidacion) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_viajes/${chofer}/${fecha_liquidacion}`

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

const putLiquidacionViaje = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_viajes/${formData.id}`

    const result = await axios.put(url, { liquidacionViaje: formData })
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

const deleteLiquidacionViaje = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_viaje/${id}`

    const result = await axios.delete(url)
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


const postLiquidacionGasto = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_gasto`

    const result = await axios.post(url, { gasto: formData })
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

const getLiquidacionGastos = async (chofer, fecha_liquidacion) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_gastos/${chofer}/${fecha_liquidacion}`

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

const putLiquidacionGasto = async (formData) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_gasto/${formData.id}`

    const result = await axios.put(url, { gasto: formData })
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            toastError(error)
            console.log('Error', error)
            return error
        })
    return result
}

const deleteLiquidacionGasto = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/liquidacion_gasto/${id}`

    const result = await axios.delete(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error)
            console.log('Error', error)
            toastError(error)
            return error
        })
    return result
}

const getExportarLiquidacion = async (chofer, fecha) => {
    const url = `${import.meta.env.VITE_API_URL}/exportar_liquidacion/${chofer}/${fecha}`

    const result = await axios.get(url, { responseType: 'blob' })
        .then(function (response) {
            const { data } = response
            saveAs(new Blob([data]), `${chofer}_Liquidacion_${fecha}.xlsx`);

        }).catch(function (error) {
            console.log('Error', error)
            toastError(error)
            return error
        })

    return result
}

export {
    postLiquidacion, getLiquidacion, putLiquidacion,
    getLiquidaciones, deleteLiquidaciones,
    getLiquidacionesChofer, deleteLiquidacionesChofer,
    postLiquidacionViaje, getLiquidacionViajes,
    putLiquidacionViaje, deleteLiquidacionViaje,
    postLiquidacionGasto, getLiquidacionGastos,
    putLiquidacionGasto, deleteLiquidacionGasto,
    getExportarLiquidacion
}