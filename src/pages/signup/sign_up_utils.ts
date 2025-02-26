import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse, AuthResponse } from "@/types";
import { api } from "@/utils/axios";

export const SignUpApi = {
    signUpUser: (formData: FormData) =>
        api
            .post(`/auth/sign-up`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response: AxiosResponse<AuthResponse | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
};
