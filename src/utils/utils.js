import { toast } from "@/components/ui/use-toast"

const resetFormStyle = (inputStyles, setInputStyles) => {
    const defaultStyles = {};

    for (const field in inputStyles) {
        defaultStyles[field] = { color: 'indigo', variant: 'surface' };
    }

    setInputStyles(defaultStyles)
}

const toastError = (error) => {
    let errorMessage = ''

    if (error?.code === "ERR_NETWORK") {
        errorMessage = "Error de conexión con el Servidor"
    } else {
        errorMessage = `Error: ${error?.response?.data?.error} | ${error?.message}`
    }
    toast({
        variant: "destructive",
        description: errorMessage,
    })
}


export {
    resetFormStyle, toastError
}