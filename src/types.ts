export type PropsTitle = {
    title: string;
};

export type ApiResponse = {
    message: string;
};

export type FormSubmitResult = {
    success?: string;
    error?: string;
};

export interface AuthResponse extends ApiResponse {
    token: string;
    user: User;
}

export interface User {
    email: string;
    name: string;
}

export interface FormDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AutocompleteOption {
    label: string;
    id: string;
}
