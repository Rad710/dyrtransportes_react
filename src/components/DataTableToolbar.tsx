import { alpha, Toolbar, Tooltip, Typography, IconButton, Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import i18n, { appLanguages } from "@/utils/i18n";

interface DataTableToolbar {
    tableTitle: string;
    numSelected?: number;
    handleDelete?: () => void;
    handleMove?: () => void;
}

const resources = {
    en: {
        translation: {
            selected: "selected",
            move: "Move",
            delete: "Delete",
        },
    },
    es: {
        translation: {
            selected: "seleccionados",
            move: "Mover",
            delete: "Eliminar",
        },
    },
};

const dataTableToolbarTranslationNamespace = "dataTableToolbar";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, dataTableToolbarTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            dataTableToolbarTranslationNamespace,
            resources[lang].translation,
        );
    }
});

export const DataTableToolbar = ({
    tableTitle,
    numSelected,
    handleDelete,
    handleMove,
}: Readonly<DataTableToolbar>) => {
    const { t } = useTranslation(dataTableToolbarTranslationNamespace);

    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                (numSelected ?? 0) > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {(numSelected ?? 0) > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} {t("selected")}
                </Typography>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    {tableTitle}
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    paddingRight: 3,
                }}
            >
                {handleMove && (numSelected ?? 0) > 0 && (
                    <Tooltip title={t("move")}>
                        <Button variant="outlined" onClick={handleMove}>
                            {t("move")}
                        </Button>
                    </Tooltip>
                )}

                {handleDelete && (numSelected ?? 0) > 0 && (
                    <Tooltip title={t("delete")}>
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Toolbar>
    );
};
