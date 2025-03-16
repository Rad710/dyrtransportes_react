import { ApiResponse, AuthResponse } from "@/types";
import { api } from "@/utils/axios";
import { AxiosError, AxiosResponse } from "axios";
import { TFunction } from "i18next";
import { z } from "zod";

// Define signup form schema with Zod
export const getSignUpFormSchema = (t: TFunction<"signup">) =>
    z.object({
        name: z.string().min(1, { message: t("errors.nameRequired") }),
        email: z.string().email({ message: t("errors.emailRequired") }),
        password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
            message: t("errors.passwordRequired"),
        }),
    });

// Type inference for our form data
export type SignUpFormData = z.infer<ReturnType<typeof getSignUpFormSchema>>;

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
