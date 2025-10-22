import type { TFunction } from "i18next";
import z from "zod";

export const getLoginFormSchema = (t: TFunction<"login">) => {
    return z.object({
        email: z.email({ message: t("errors.emailRequired") }),
        password: z.string(),
        remember_me: z.boolean().optional(),
    });
};

export type LoginFormData = z.infer<ReturnType<typeof getLoginFormSchema>>;
