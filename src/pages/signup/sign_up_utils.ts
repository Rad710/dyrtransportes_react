import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse, AuthResponse } from "@/types";
import { api } from "@/utils/axios";

export const SignUpApi = {
    signUpUser: (formData: FormData) =>
        api
            .post(`/api/auth/sign-up`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response: AxiosResponse<AuthResponse>) => response.data)
            .catch((errorResponse: AxiosError<ApiResponse>) => {
                console.log({ errorResponse });
                return errorResponse;
            }),
};
