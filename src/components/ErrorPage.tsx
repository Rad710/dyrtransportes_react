import { useRouteError, Link as RouterLink } from "react-router";
import { Box, Typography, Container, Button, Paper, Divider, useTheme } from "@mui/material";
import { DyRTransportesIcon } from "./DyRTransportesIcon";
import { Home as HomeIcon, Refresh as RefreshIcon } from "@mui/icons-material";

export const ErrorPage = () => {
    const theme = useTheme();
    const error = useRouteError() as {
        statusText?: string;
        message?: string;
        status?: string;
    };

    console.error(error);

    // Get error status code to customize message
    const statusCode = error.status ? parseInt(error.status) : null;

    // Custom error message based on status code
    const getErrorMessage = () => {
        switch (statusCode) {
            case 404:
                return "No encontramos la página que estás buscando";
            case 500:
                return "Error interno del servidor";
            case 403:
                return "No tienes permiso para acceder a esta página";
            default:
                return "Ocurrió un error inesperado";
        }
    };

    const errorDetail = error.statusText || error.message || "Error desconocido";

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    gap: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
                        padding: 4,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                        <DyRTransportesIcon />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Typography
                        variant="h5"
                        color="error"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            fontWeight: "medium",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                        }}
                    >
                        {statusCode ? `Error ${statusCode}` : "Error"}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.primary"
                        textAlign="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        {getErrorMessage()}
                    </Typography>

                    {errorDetail && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            sx={{
                                mb: 3,
                                p: 1,
                                bgcolor: theme.palette.action.hover,
                                borderRadius: 1,
                            }}
                        >
                            Detalles técnicos: {errorDetail}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            component={RouterLink}
                            to="/"
                            startIcon={<HomeIcon />}
                        >
                            Ir al inicio
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => window.location.reload()}
                            startIcon={<RefreshIcon />}
                        >
                            Intentar de nuevo
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};
