import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

export const resetFormStyle = (inputStyles, setInputStyles) => {
    const defaultStyles = {};

    for (const field in inputStyles) {
        defaultStyles[field] = { color: "indigo", variant: "surface" };
    }

    setInputStyles(defaultStyles);
};

export const toastError = (errorResponse: AxiosError<{ error: string }>) => {
    let errorMessage = "";

    if (errorResponse?.code === "ERR_NETWORK") {
        errorMessage = "Error de conexión con el Servidor";
    } else {
        errorMessage = `Error: ${errorResponse?.response?.data?.error} | ${errorResponse?.message}`;
    }
    toast({
        variant: "success",
        description: errorMessage,
    });
};
