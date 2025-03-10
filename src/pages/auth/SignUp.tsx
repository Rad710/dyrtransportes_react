import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { DyRTransportesIcon } from "@/components/DyRTransportesIcon";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ApiResponse, AuthResponse, PageProps } from "@/types";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Define signup form schema with Zod
const signUpFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
            message:
                "Password must be at least 8 characters and include at least one number, one lowercase letter, and one uppercase letter",
        }),
});

// Type inference for our form data
type SignUpFormData = z.infer<typeof signUpFormSchema>;

const SignUpApi = {
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

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    [theme.breakpoints.up("sm")]: {
        width: "450px",
    },
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const RegisterContainer = styled(Stack)(({ theme }) => ({
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

export const SignUp = ({ title }: PageProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState("");

    // store
    const setAuth = useAuthStore((state) => state.setAuth);

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

        const resp = await SignUpApi.signUpUser(formData);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Register response: ", { resp });
        }

        if (!isAxiosError(resp) && resp) {
            setFormErrorMessage("");
            // Store in Zustand
            setAuth(resp.token, resp.user);
        } else {
            setFormErrorMessage(resp?.response?.data?.message ?? "Error creating account");
        }
    };

    return (
        <RegisterContainer direction="column" justifyContent="space-between" overflow="auto">
            <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

            <Card variant="outlined" sx={{ overflowY: "visible" }}>
                <DyRTransportesIcon />
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                    Sign up
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
                        <FormLabel htmlFor="name">Full name</FormLabel>
                        <TextField
                            id="name"
                            placeholder="Jon Snow"
                            autoComplete="name"
                            fullWidth
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            {...register("name")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            id="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            fullWidth
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email")}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••"
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
                        Sign up
                    </Button>
                </Box>
            </Card>
        </RegisterContainer>
    );
};
