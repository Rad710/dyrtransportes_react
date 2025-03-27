import { useRouteError, Link as RouterLink } from "react-router";
import { Box, Typography, Container, Button, Paper, Divider, useTheme } from "@mui/material";
import { DyRTransportesIcon } from "./DyRTransportesIcon";
import { Home as HomeIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            pageNotFound: "We couldn't find the page you're looking for",
            internalServerError: "Internal server error",
            forbiddenError: "You don't have permission to access this page",
            unexpectedError: "An unexpected error occurred",
            error: "Error",
            unknownError: "Unknown error",
            technicalDetails: "Technical details:",
            goHome: "Go home",
            tryAgain: "Try again",
        },
    },
    es: {
        translation: {
            pageNotFound: "No encontramos la página que estás buscando",
            internalServerError: "Error interno del servidor",
            forbiddenError: "No tienes permiso para acceder a esta página",
            unexpectedError: "Ocurrió un error inesperado",
            error: "Error",
            unknownError: "Error desconocido",
            technicalDetails: "Detalles técnicos:",
            goHome: "Ir al inicio",
            tryAgain: "Intentar de nuevo",
        },
    },
};

const errorPageTranslationNamespace = "errorPage";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, errorPageTranslationNamespace)) {
        i18n.addResourceBundle(lang, errorPageTranslationNamespace, resources[lang].translation);
    }
});

export const ErrorPage = () => {
    const theme = useTheme();
    const { t } = useTranslation(errorPageTranslationNamespace);
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
                return t("pageNotFound");
            case 500:
                return t("internalServerError");
            case 403:
                return t("forbiddenError");
            default:
                return t("unexpectedError");
        }
    };

    const errorDetail = error.statusText || error.message || t("unknownError");

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
                        {statusCode ? `${t("error")} ${statusCode}` : t("error")}
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
                            {t("technicalDetails")} {errorDetail}
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
                            {t("goHome")}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => window.location.reload()}
                            startIcon={<RefreshIcon />}
                        >
                            {t("tryAgain")}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};
