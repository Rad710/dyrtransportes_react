import axios from "axios"

import { toastError } from "./utils"


const getNomina = async () => {
    const url = `${import.meta.env.VITE_API_URL}/nomina/`

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

const deleteNomina = async (id) => {
    const url = `${import.meta.env.VITE_API_URL}/nomina/${id}`

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

export {
    getNomina, deleteNomina
}