import type { TFunction } from "i18next";
import z from "zod";

export const getSignUpFormSchema = (t: TFunction<"signup">) =>
    z.object({
        name: z.string().min(1, { message: t("errors.nameRequired") }),
        email: z.email({ message: t("errors.emailRequired") }),
        password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
            message: t("errors.passwordRequired"),
        }),
    });

export type SignUpFormData = z.infer<ReturnType<typeof getSignUpFormSchema>>;
