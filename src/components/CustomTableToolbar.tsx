import { alpha, Toolbar, Tooltip, Typography, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

interface CustomTableToolbar {
    numSelected: number;
    handleDelete?: () => void;
    showDeleteButton?: boolean;
}

export const CustomTableToolbar = ({
    numSelected,
    handleDelete,
    showDeleteButton,
}: Readonly<CustomTableToolbar>) => {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    Prices List
                </Typography>
            )}
            {showDeleteButton && numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};
