import { alpha, Toolbar, Tooltip, Typography, IconButton, Box, Button } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

interface DataTableToolbar {
    tableTitle: string;
    numSelected: number;
    handleDelete?: () => void;
    handleMove?: () => void;
}

export const DataTableToolbar = ({
    tableTitle,
    numSelected,
    handleDelete,
    handleMove,
}: Readonly<DataTableToolbar>) => {
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
                {handleMove && numSelected > 0 && (
                    <Tooltip title="Move">
                        <Button variant="outlined" onClick={handleMove}>
                            Mover
                        </Button>
                    </Tooltip>
                )}

                {handleDelete && numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Toolbar>
    );
};
