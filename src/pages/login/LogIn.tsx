import * as React from "react";
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
import { styled } from "@mui/material/styles";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { DyRTransportesIcon } from "@/components/CustomIcons";
import { LogInApi } from "./login_utils";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";

import { Link as RouterLink } from "react-router";

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

export const LogIn = () => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
    const [formErrorMessage, setFormErrorMessage] = React.useState("");

    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (emailError || passwordError) {
            return;
        }
        const data = new FormData(event.currentTarget);

        const resp = await LogInApi.loginUser(data);

        if (import.meta.env.VITE_DEBUG) {
            console.log("LogIn response: ", { resp });
        }

        if (!isAxiosError(resp)) {
            setFormErrorMessage("");
            // Store in Zustand
            setAuth(resp.token, resp.user);
        } else {
            setFormErrorMessage(resp?.response?.data?.message ?? "Error");
            setEmailError(true);
            setPasswordError(true);
        }
    };

    const validateInputs = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        return isValid;
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
                    Log in
                </Typography>
                {formErrorMessage && (
                    <Box component="span" sx={{ color: (theme) => theme.palette.error.main }}>
                        {formErrorMessage}
                    </Box>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            error={emailError}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={emailError ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            color={passwordError ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
                        Log in
                    </Button>
                </Box>
                <Divider>or</Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography sx={{ textAlign: "center" }}>
                        Don&apos;t have an account?{" "}
                        <MuiLink
                            to="/sign-up"
                            variant="body2"
                            sx={{ alignSelf: "center" }}
                            component={RouterLink}
                        >
                            Sign up
                        </MuiLink>
                    </Typography>
                </Box>
            </Card>
        </LogInContainer>
    );
};
