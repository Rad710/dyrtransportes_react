import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { Link as MuiLink } from "@mui/material";
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
import { Link as RouterLink } from "react-router";
import { PageProps, type ApiResponse, type AuthResponse } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { loginTranslationNamespace } from "./translations";
import { api } from "@/utils/axios";
import type { TFunction } from "i18next";
import { z } from "zod";
import { AuthCard } from "@/pages/auth/components/AuthCard";
import { AuthContainer } from "@/pages/auth/components/AuthContainer";

const loginUser = (formData: FormData) =>
    api
        .post(`/auth/log-in`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response: AxiosResponse<AuthResponse | null>) => response.data ?? null)
        .catch((errorResponse: AxiosError<ApiResponse | null>) => {
            return errorResponse ?? null;
        });

const getLoginFormSchema = (t: TFunction<"login">) => {
    return z.object({
        email: z.string().email({ message: t("errors.emailRequired") }),
        password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
            message: t("errors.passwordRequired"),
        }),
        remember_me: z.boolean().optional(),
    });
};

type LoginFormData = z.infer<ReturnType<typeof getLoginFormSchema>>;

export const LogIn = ({ title }: PageProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const setAuth = useAuthStore((state) => state.setAuth);

    // Initialize React Hook Form with Zod resolver
    // Then within your component:
    // Using default namespace
    const { t } = useTranslation(loginTranslationNamespace);

    const loginFormSchema = useMemo(() => getLoginFormSchema(t), [t]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
            remember_me: false,
        },
    });

    useEffect(() => {
        document.title = title;
    }, [title]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: LoginFormData) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        if (data.remember_me) {
            formData.append("remember_me", "on");
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Login post: ", Object.fromEntries(formData));
        }

        const resp = await loginUser(formData);

        if (import.meta.env.VITE_DEBUG) {
            console.log("LogIn response: ", { resp });
        }

        if (!isAxiosError(resp) && resp) {
            setFormErrorMessage("");
            // Store in Zustand
            setAuth(resp.token, resp.user, !!data.remember_me);
        } else {
            setFormErrorMessage(resp?.response?.data?.message ?? t("errors.invalidCredentials"));
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
                    noValidate
                    autoComplete="on"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">{t("email")}</FormLabel>
                        <TextField
                            id="email"
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            autoComplete="email"
                            autoFocus
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
                            autoComplete="current-password"
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
                    <FormControlLabel
                        control={<Checkbox color="primary" {...register("remember_me")} />}
                        label={t("rememberMe")}
                    />
                    <Button type="submit" fullWidth variant="contained">
                        {t("loginButton")}
                    </Button>
                </Box>
                <Divider>{t("or")}</Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography sx={{ textAlign: "center" }}>
                        {t("noAccount")}{" "}
                        <MuiLink
                            to="/sign-up"
                            variant="body2"
                            sx={{ alignSelf: "center" }}
                            component={RouterLink}
                        >
                            {t("signUp")}
                        </MuiLink>
                    </Typography>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};
