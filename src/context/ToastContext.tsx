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
}

import { Snackbar, Alert } from "@mui/material";

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

import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
    id: number;
    message: string;
    severity: ToastSeverity;
}

interface ToastProviderProps {
    children: ReactNode;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => null,
});

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, severity: ToastSeverity = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, severity }]);
    };

    const closeToast = (id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
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
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
