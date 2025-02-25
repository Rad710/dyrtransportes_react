import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface ActionsMenuProps<T> {
    row: T;
    handleEditRow?: (row: T) => void;
    handleDeleteRow: (row: T) => void;
}

export const ActionsMenu = <T,>({ row, handleEditRow, handleDeleteRow }: ActionsMenuProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {handleEditRow && (
                    <MenuItem
                        onClick={() => {
                            setAnchorEl(null);
                            handleEditRow(row);
                        }}
                    >
                        Edit
                    </MenuItem>
                )}
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
