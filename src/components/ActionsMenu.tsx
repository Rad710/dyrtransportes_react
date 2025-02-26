import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface ActionsMenuItem {
    handleClick: () => void;
    text: string;
}

interface ActionsMenuProps {
    menuItems: ActionsMenuItem[];
}

export const ActionsMenu = ({ menuItems }: ActionsMenuProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="actions menu">
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.text}
                        onClick={() => {
                            setAnchorEl(null);
                            item.handleClick();
                        }}
                    >
                        {item.text}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
