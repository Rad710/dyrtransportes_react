import { createContext, useContext, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button, { ButtonProps } from "@mui/material/Button";

interface ConfirmationOptions {
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmButtonProps?: Partial<ButtonProps>;
    onConfirm: () => void | Promise<void>;
}

interface ConfirmationContextType {
    openConfirmDialog: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

interface ConfirmationProviderProps {
    children: React.ReactNode;
}

interface DialogState extends ConfirmationOptions {
    open: boolean;
}

export const ConfirmationProvider = ({ children }: ConfirmationProviderProps) => {
    const [dialogState, setDialogState] = useState<DialogState>({
        open: false,
        title: "",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        confirmButtonProps: {},
        onConfirm: () => {},
    });

    const openConfirmDialog = (options: ConfirmationOptions) => {
        setDialogState({
            ...options,
            open: true,
        });
    };

    const closeConfirmDialog = () => {
        setDialogState((prev) => ({ ...prev, open: false }));
    };

    const handleConfirm = async () => {
        try {
            await dialogState.onConfirm();
            closeConfirmDialog();
        } catch (error) {
            console.error("Confirmation action failed:", error);
            // You might want to show an error message here
        }
    };

    return (
        <ConfirmationContext.Provider value={{ openConfirmDialog }}>
            {children}
            <Dialog
                open={dialogState.open}
                onClose={closeConfirmDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogState.title}</DialogTitle>
                <DialogContent id="alert-dialog-description">{dialogState.message}</DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDialog}>{dialogState.cancelText}</Button>
                    <Button onClick={handleConfirm} {...dialogState.confirmButtonProps} autoFocus>
                        {dialogState.confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmationContext.Provider>
    );
};

export const useConfirmation = (): ConfirmationContextType => {
    const context = useContext(ConfirmationContext);
    if (context === undefined) {
        throw new Error("useConfirmation must be used within a ConfirmationProvider");
    }
    return context;
};
