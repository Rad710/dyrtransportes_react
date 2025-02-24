import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { Route } from "@/pages/route_product/types";

interface ActionsMenuProps {
    row: Route;
    handleEditRoute: (row: Route) => void;
    handleDeleteRow: (row: Route) => void;
}

export const ActionsMenu = ({ row, handleEditRoute, handleDeleteRow }: ActionsMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleEditRoute(row);
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null);
                        handleDeleteRow(row);
                    }}
                >
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};
