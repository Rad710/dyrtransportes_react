export type PropsTitle = {
    title: string;
};

export type ApiResponse = {
    message: string;
};

export interface AuthResponse extends ApiResponse {
    token: string;
    user: User;
}

export interface User {
    user_id: number;
    email: string;
}
