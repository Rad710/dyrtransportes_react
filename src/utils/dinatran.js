import axios from "axios"
import { toast } from "@/components/ui/use-toast"

const getInformeDinatran = async (fecha_inicio, fecha_fin) => {
    const url = `${import.meta.env.VITE_API_URL}/dinatran/${fecha_inicio}/${fecha_fin}`

    const result = await axios.get(url)
        .then(function (response) {
            const { data } = response
            return data
        })
        .catch(function (error) {
            console.log('Error', error)
            toast({
                variant: "destructive",
                description: `Error: ${error?.response?.data?.error} | ${error?.message}`,
              })
            return error
        })

    return result
}

export {
    getInformeDinatran
}