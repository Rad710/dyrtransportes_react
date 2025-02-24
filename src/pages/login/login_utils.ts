import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse, AuthResponse } from "@/types";
import { api } from "@/utils/axios";

export const LogInApi = {
    loginUser: (formData: FormData) =>
        api
            .post(`/auth/log-in`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response: AxiosResponse<AuthResponse>) => response.data)
            .catch((errorResponse: AxiosError<ApiResponse>) => {
                console.log({ errorResponse });
                return errorResponse;
            }),
};
