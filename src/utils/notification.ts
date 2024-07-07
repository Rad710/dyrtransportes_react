import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

export const resetFormStyle = (inputStyles, setInputStyles) => {
    const defaultStyles = {};

    for (const field in inputStyles) {
        defaultStyles[field] = { color: "indigo", variant: "surface" };
    }

    setInputStyles(defaultStyles);
};

interface HasError {
    error?: string;
}

export const toastAxiosError = (errorResponse: AxiosError<HasError>) => {
    let errorMessage = "";

    if (errorResponse?.code === "ERR_NETWORK") {
        errorMessage = "Error de conexión con el Servidor";
    } else {
        errorMessage = `Error: ${errorResponse?.response?.data?.error} | ${errorResponse?.message}`;
    }
    toast({
        variant: "destructive",
        description: errorMessage,
    });
};

export const toastSuccess = (successMessage: string) => {
    toast({
        variant: "success",
        description: successMessage,
        duration: 5000,
    });
};

export const toastError = (errorMessage: string) => {
    toast({
        variant: "destructive",
        description: errorMessage,
    });
};
