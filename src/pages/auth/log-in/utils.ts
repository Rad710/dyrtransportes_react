import { ApiResponse, AuthResponse } from "@/types";
import { api } from "@/utils/axios";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { TFunction } from "i18next";

// Define login form schema with Zod

export const getLoginFormSchema = (t: TFunction<"login">) => {
    return z.object({
        email: z.string().email({ message: t("errors.emailRequired") }),
        password: z.string().min(8, { message: t("errors.passwordRequired") }),
        remember_me: z.boolean().optional(),
    });
};

// Type inference for our form data
export type LoginFormData = z.infer<ReturnType<typeof getLoginFormSchema>>;

export const LogInApi = {
    loginUser: (formData: FormData) =>
        api
            .post(`/auth/log-in`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response: AxiosResponse<AuthResponse | null>) => response.data ?? null)
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
};
