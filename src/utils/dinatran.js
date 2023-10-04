import axios from "axios"

const getInformeDinatran = async (fecha_inicio, fecha_fin) => {
    const url = `${import.meta.env.VITE_API_URL}/dinatran/${fecha_inicio}/${fecha_fin}`

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
    getInformeDinatran
}