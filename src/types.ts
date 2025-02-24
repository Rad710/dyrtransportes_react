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
    user_id: number;
    email: string;
}

export interface FormDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
