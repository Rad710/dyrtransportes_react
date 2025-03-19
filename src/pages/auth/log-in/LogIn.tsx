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
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { DyRTransportesIcon } from "@/components/DyRTransportesIcon";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router";
import { PageProps } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLoginFormSchema, LogInApi, type LoginFormData } from "./utils";
import { useTranslation } from "react-i18next";
import { loginTranslationNamespace } from "./translations";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const LogInContainer = styled(Stack)(({ theme }) => ({
    height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
    minHeight: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
}));

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

        const resp = await LogInApi.loginUser(formData);

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
        <LogInContainer direction="column" justifyContent="space-between" overflow="auto">
            <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
            <Card variant="outlined" sx={{ overflowY: "visible" }}>
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
            </Card>
        </LogInContainer>
    );
};
