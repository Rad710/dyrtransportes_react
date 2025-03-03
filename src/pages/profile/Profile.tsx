import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import ColorModeSelect from "@/theme/ColorModeSelect";
import { DyRTransportesIcon } from "@/components/DyRTransportesIcon";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";
import { PropsTitle } from "@/types";
import { useEffect, useState } from "react";

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

const ProfileContainer = styled(Stack)(({ theme }) => ({
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

export const Profile = ({ title }: PropsTitle) => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [nameError, setNameError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [formErrorMessage, setFormErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Get user data from auth store
    const setAuth = useAuthStore((state) => state.setAuth);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        document.title = title;
    }, []);

    const validateInputs = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const name = document.getElementById("name") as HTMLInputElement;

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage("Name is required.");
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");

        // Validate inputs first
        if (!validateInputs()) {
            return;
        }

        const data = new FormData(event.currentTarget);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Profile update data: ", Object.fromEntries(data.entries()));
        }

        const resp = await ProfileEditApi.updateUserProfile(data);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Profile update response: ", { resp });
        }

        if (!isAxiosError(resp) && resp?.user) {
            setFormErrorMessage("");
            setSuccessMessage("Profile updated successfully!");

            // Update user in auth store
            setAuth(resp.token || sessionStorage.getItem("token"), resp.user);
        } else {
            setFormErrorMessage(
                resp?.response?.data?.message || resp?.message || "Error updating profile",
            );
            setSuccessMessage("");
        }
    };

    return (
        <ProfileContainer
            direction="column"
            justifyContent="space-between"
            overflow="auto"
            sx={{ position: "relative" }}
        >
            <ColorModeSelect sx={{ position: "absolute", top: "1rem", right: "1rem" }} />

            <Card variant="outlined" sx={{ overflowY: "visible" }}>
                <DyRTransportesIcon />
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                    Edit Profile
                </Typography>

                {formErrorMessage && (
                    <Alert severity="error" sx={{ width: "100%" }}>
                        {formErrorMessage}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ width: "100%" }}>
                        {successMessage}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <FormControl>
                        <FormLabel htmlFor="name">Full name</FormLabel>
                        <TextField
                            autoComplete="name"
                            name="name"
                            required
                            fullWidth
                            id="name"
                            placeholder="Jon Snow"
                            defaultValue={user?.name || ""}
                            error={nameError}
                            helperText={nameErrorMessage}
                            color={nameError ? "error" : "primary"}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder="your@email.com"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            defaultValue={user?.email || ""}
                            error={emailError}
                            helperText={emailErrorMessage}
                            color={emailError ? "error" : "primary"}
                        />
                    </FormControl>

                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                        Leave password fields blank if you don&apos;t want to change your password.
                    </Typography>

                    <FormControl>
                        <FormLabel htmlFor="current_password">Current Password</FormLabel>
                        <TextField
                            fullWidth
                            name="current_password"
                            placeholder="••••••"
                            type="password"
                            id="current_password"
                            autoComplete="current-password"
                            variant="outlined"
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="new_password">New Password</FormLabel>
                        <TextField
                            fullWidth
                            name="new_password"
                            placeholder="••••••"
                            type="password"
                            id="new_password"
                            autoComplete="new-password"
                            variant="outlined"
                        />
                    </FormControl>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button type="submit" fullWidth variant="contained">
                            Save Changes
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </ProfileContainer>
    );
};
