import type { TFunction } from "i18next";
import z from "zod";

export const getUserProfileFormSchema = (t: TFunction) => {
    return z
        .object({
            name: z.string().min(1, { message: t("validation.nameRequired") }),
            email: z.email({ message: t("validation.emailInvalid") }),
            current_password: z.string().optional(),
            new_password: z.string().optional(),
        })
        .refine(
            (data) => {
                // If new password is provided, current password must also be provided
                return !data.new_password || !!data.current_password;
            },
            {
                message: t("validation.currentPasswordRequired"),
                path: ["current_password"],
            }
        )
        .refine(
            (data) => {
                // If new password is provided, it must meet complexity requirements
                if (!data.new_password) return true;

                const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                return passwordRegex.test(data.new_password);
            },
            {
                message: t("validation.passwordComplexity"),
                path: ["new_password"],
            }
        );
};

export type UserProfileFormSchema = z.infer<ReturnType<typeof getUserProfileFormSchema>>;
