import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { DyRTransportesIcon } from "@/components/DyRTransportesIcon";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";
import { useAuthStore } from "@/stores/authStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { PageProps, type ApiResponse, type AuthResponse } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { signUpTranslationNamespace } from "./translations";
import { AuthCard } from "@/pages/auth/components/AuthCard";
import { AuthContainer } from "@/pages/auth/components/AuthContainer";
import { api } from "@/utils/axios";
import type { TFunction } from "i18next";
import { z } from "zod";

const getSignUpFormSchema = (t: TFunction<"signup">) =>
    z.object({
        name: z.string().min(1, { message: t("errors.nameRequired") }),
        email: z.string().email({ message: t("errors.emailRequired") }),
        password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
            message: t("errors.passwordRequired"),
        }),
    });

type SignUpFormData = z.infer<ReturnType<typeof getSignUpFormSchema>>;

const signUpUser = (formData: FormData) =>
    api
        .post(`/auth/sign-up`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response: AxiosResponse<AuthResponse | null>) => response.data ?? null)
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse ?? null;
        });

export const SignUp = ({ title }: PageProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    // store
    const setAuth = useAuthStore((state) => state.setAuth);

    // Using translations
    const { t } = useTranslation(signUpTranslationNamespace);

    const signUpFormSchema = useMemo(() => getSignUpFormSchema(t), [t]);

    // Initialize React Hook Form with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        document.title = title;
    }, [title]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: SignUpFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Register post: ", Object.fromEntries(formData));
        }

        const resp = await signUpUser(formData);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Register response: ", { resp });
        }

        if (!isAxiosError(resp) && resp) {
            setFormErrorMessage("");
            // Store in Zustand
            setAuth(resp.token, resp.user);
        } else {
            setFormErrorMessage(resp?.response?.data?.message ?? t("errors.creatingAccount"));
        }
    };

    return (
        <AuthContainer direction="column" justifyContent="space-between" overflow="auto">
            <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

            <AuthCard variant="outlined" sx={{ overflowY: "visible" }}>
                <DyRTransportesIcon />
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                    {t("title")}
                </Typography>
                {formErrorMessage && (
                    <Box component="span" sx={{ color: (theme) => theme.palette.error.main }}>
                        {formErrorMessage}
                    </Box>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <FormControl>
                        <FormLabel htmlFor="name">{t("fullName")}</FormLabel>
                        <TextField
                            id="name"
                            placeholder={t("fullNamePlaceholder")}
                            autoComplete="name"
                            fullWidth
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register("name")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">{t("email")}</FormLabel>
                        <TextField
                            id="email"
                            placeholder={t("emailPlaceholder")}
                            autoComplete="email"
                            fullWidth
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">{t("password")}</FormLabel>
                        <TextField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("passwordPlaceholder")}
                            autoComplete="new-password"
                            fullWidth
                            variant="outlined"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register("password")}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </FormControl>

                    <Button type="submit" fullWidth variant="contained">
                        {t("signUpButton")}
                    </Button>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};
