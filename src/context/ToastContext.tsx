import { AxiosError, isAxiosError } from "axios";
import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ApiResponse } from "@/types";
import { useTranslation } from "react-i18next";
import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            unexpectedError: "An unexpected error occurred",
            connectionError: "Connection error with the server",
            noResponse: "No response received from server",
            error: "Error",
            mustBeUsedWithin: "must be used within a",
        },
    },
    es: {
        translation: {
            unexpectedError: "Ocurrió un error inesperado",
            connectionError: "Error de conexión con el Servidor",
            noResponse: "No se recibió respuesta del servidor",
            error: "Error",
            mustBeUsedWithin: "debe usarse dentro de un",
        },
    },
};

const toastTranslationNamespace = "toast";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, toastTranslationNamespace)) {
        i18n.addResourceBundle(lang, toastTranslationNamespace, resources[lang].translation);
    }
});

export type ToastSeverity = "success" | "error" | "warning" | "info";

export interface ToastProps {
    open: boolean;
    message: string;
    severity: ToastSeverity;
    onClose: () => void;
    autoHideDuration?: number;
}

export interface ToastContextType {
    showToast: (message: string, severity?: ToastSeverity) => void;
    showToastSuccess: (message: string) => void;
    showToastError: (message: string) => void;
    showToastAxiosError: (error?: AxiosError | Error | null) => void;
}

interface Toast {
    id: number;
    message: string;
    severity: ToastSeverity;
}

interface ToastProviderProps {
    children: ReactNode;
}

// Toast component
export const Toast = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 6000,
}: ToastProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

// Updated context with translations
const ToastContext = createContext<ToastContextType>({
    showToast: () => null,
    showToastSuccess: () => null,
    showToastError: () => null,
    showToastAxiosError: () => null,
});

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { t } = useTranslation(toastTranslationNamespace);

    const showToast = (message: string, severity: ToastSeverity = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, severity }]);
    };

    // Helper functions
    const showToastSuccess = (message: string) => {
        showToast(message, "success");
    };

    const showToastError = (message: string) => {
        showToast(message, "error");
    };

    const showToastAxiosError = (error?: AxiosError<ApiResponse> | Error | null) => {
        console.error(error);

        let errorMessage = t("unexpectedError");

        if (error instanceof Error) {
            // Handle general Error objects
            errorMessage = error.message;
        }

        if (isAxiosError(error)) {
            if (error?.code === "ERR_NETWORK") {
                errorMessage = t("connectionError");
            }

            // Handle Axios specific errors
            if (error.response) {
                errorMessage = `${t("error")}: ${error?.response?.data?.message} | ${error?.message}`;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = t("noResponse");
            }
        }

        showToast(errorMessage, "error");
    };

    const closeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider
            value={{
                showToast,
                showToastSuccess,
                showToastError,
                showToastAxiosError,
            }}
        >
            {children}
            {toasts.map((toast) => (
                <Snackbar
                    key={toast.id}
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => closeToast(toast.id)}
                >
                    <Alert
                        onClose={() => closeToast(toast.id)}
                        severity={toast.severity}
                        variant="filled"
                    >
                        {toast.message}
                    </Alert>
                </Snackbar>
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const { t } = useTranslation(toastTranslationNamespace);
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error(`useToast ${t("mustBeUsedWithin")} ToastProvider`);
    }
    return context;
};
