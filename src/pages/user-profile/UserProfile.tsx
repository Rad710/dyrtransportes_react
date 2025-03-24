import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { ApiResponse, AuthResponse, PageProps } from "@/types";
import { useEffect, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { userProfileTranslationNamespace } from "./translations";
import type { TFunction } from "i18next";
import { UserProfileContainer } from "./components/UserProfileContainer";
import { UserProfileCard } from "./components/UserProfileCard";

const UserProfileEditApi = {
    putUserProfile: async (formData: FormData) =>
        api
            .put(`/user/profile`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response: AxiosResponse<AuthResponse | null>) => {
                return response.data ?? null;
            })
            .catch((errorResponse: AxiosError<ApiResponse | null>) => {
                return errorResponse ?? null;
            }),
};

const getUserProfileFormSchema = (t: TFunction) => {
    return z
        .object({
            name: z.string().min(1, { message: t("validation.nameRequired") }),
            email: z.string().email({ message: t("validation.emailInvalid") }),
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
            },
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
            },
        );
};
type UserProfileFormSchema = z.infer<ReturnType<typeof getUserProfileFormSchema>>;

// Remove fixed width from Card component

export const UserProfile = ({ title }: PageProps) => {
    // Translation
    const { t } = useTranslation(userProfileTranslationNamespace);

    // Define schema with Zod and translations
    const userProfileFormSchema = useMemo(() => getUserProfileFormSchema(t), [t]);

    //STATE
    const [formErrorMessage, setFormErrorMessage] = useState("");
    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Get user data from auth store
    const setAuth = useAuthStore((state) => state.setAuth);
    const user = useAuthStore((state) => state.user);

    // CONTEXT
    const { showToastSuccess, showToastAxiosError } = useToast();

    // Setup React Hook Form with Zod validation
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserProfileFormSchema>({
        resolver: zodResolver(userProfileFormSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            current_password: "",
            new_password: "",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        document.title = title;
    }, [title]); // Add title dependency

    const onSubmit = async (payload: UserProfileFormSchema) => {
        // Convert to FormData to maintain compatibility with the API
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        if (import.meta.env.VITE_DEBUG) {
            console.log("Profile update data: ", Object.fromEntries(formData.entries()));
        }

        const resp = await UserProfileEditApi.putUserProfile(formData);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Profile update response: ", { resp });
        }

        if (!isAxiosError(resp) && resp) {
            setFormErrorMessage("");
            showToastSuccess(resp.message);

            // Update user in auth store
            setAuth(sessionStorage.getItem("token") || "", resp.user);

            // Reset only the password fields after successful update
            reset({
                name: payload.name,
                email: payload.email,
                current_password: "",
                new_password: "",
            });
        } else {
            setFormErrorMessage(resp?.response?.data?.message ?? t("errors.generic"));
            showToastAxiosError(resp);
        }
    };

    // Toggle password visibility
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    return (
        <UserProfileContainer
            direction="column"
            justifyContent="space-between"
            overflow="auto"
            sx={{ position: "relative", maxWidth: "100%" }}
        >
            <ColorModeSelect sx={{ position: "absolute", top: "1rem", right: "1rem" }} />

            <UserProfileCard variant="outlined" sx={{ overflowY: "visible", maxWidth: "100%" }}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        width: "100%",
                        fontSize: "clamp(2rem, 10vw, 2.15rem)",
                        textAlign: "left",
                    }}
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
                    sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
                >
                    <FormControl fullWidth>
                        <FormLabel htmlFor="name">{t("fields.name.label")}</FormLabel>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoComplete="name"
                                    required
                                    fullWidth
                                    id="name"
                                    placeholder={t("fields.name.placeholder")}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    color={errors.name ? "error" : "primary"}
                                />
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel htmlFor="email">{t("fields.email.label")}</FormLabel>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    id="email"
                                    placeholder={t("fields.email.placeholder")}
                                    autoComplete="email"
                                    variant="outlined"
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                    color={errors.email ? "error" : "primary"}
                                />
                            )}
                        />
                    </FormControl>

                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        {t("passwordNote")}
                    </Typography>

                    <FormControl fullWidth>
                        <FormLabel htmlFor="current_password">
                            {t("fields.currentPassword.label")}
                        </FormLabel>
                        <Controller
                            name="current_password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    placeholder={t("fields.currentPassword.placeholder")}
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="current_password"
                                    autoComplete="current-password"
                                    variant="outlined"
                                    error={!!errors.current_password}
                                    helperText={errors.current_password?.message}
                                    color={errors.current_password ? "error" : "primary"}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={toggleCurrentPasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showCurrentPassword ? (
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
                            )}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel htmlFor="new_password">
                            {t("fields.newPassword.label")}
                        </FormLabel>
                        <Controller
                            name="new_password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    placeholder={t("fields.newPassword.placeholder")}
                                    type={showNewPassword ? "text" : "password"}
                                    id="new_password"
                                    autoComplete="new-password"
                                    variant="outlined"
                                    error={!!errors.new_password}
                                    helperText={errors.new_password?.message}
                                    color={errors.new_password ? "error" : "primary"}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={toggleNewPasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? (
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
                            )}
                        />
                    </FormControl>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button type="submit" fullWidth variant="contained">
                            {t("buttons.save")}
                        </Button>
                    </Stack>
                </Box>
            </UserProfileCard>
        </UserProfileContainer>
    );
};
