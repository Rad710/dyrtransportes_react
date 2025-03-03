import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

import { useAuthStore } from "@/stores/authStore";
import { DyRTransportesIcon } from "./DyRTransportesIcon";

interface AppMenuLink {
    name: string;
    url: string;
    onClick?: () => void;
}

export const ResponsiveAppBar = () => {
    // STATE
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const location = useLocation();
    const currentPath = location.pathname;

    const logout = useAuthStore((state) => state.logout);

    // HANDLERS
    const handleLogout = () => {
        logout();
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Function to check if a path is active
    const isActive = (path: string) => {
        return currentPath.includes(path);
    };

    // pages urls
    const pages: AppMenuLink[] = [
        {
            name: "Shipment Payrolls",
            url: "/shipment-payroll-list",
        },
        {
            name: "Driver Payrolls",
            url: "/driver-payroll-list",
        },
        {
            name: "Routes",
            url: "/routes",
        },
        {
            name: "Drivers",
            url: "/drivers",
        },
    ];

    const settings: AppMenuLink[] = [
        {
            name: "Profile",
            url: "/profile",
        },
        {
            name: "Logout",
            url: "/log-out",
            onClick: handleLogout,
        },
    ];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        to="/"
                        component={RouterLink}
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".2rem",
                            color: "inherit",
                            textDecoration: "none",
                            "&:visited": { color: "inherit" },
                            "&:hover": { color: "inherit" },
                        }}
                    >
                        <DyRTransportesIcon />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: "block", md: "none" } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography
                                        to={page.url}
                                        sx={{
                                            textAlign: "center",
                                            textDecoration: "none",
                                            color: "inherit",
                                            "&:visited": { color: "inherit" },
                                            "&:hover": { color: "inherit" },
                                        }}
                                        component={RouterLink}
                                    >
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Typography
                        to="/"
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                            flexGrow: 1,
                            "&:visited": { color: "inherit" },
                            "&:hover": { color: "inherit" },
                        }}
                    >
                        <DyRTransportesIcon />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <Button
                                to={page.url}
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                    textDecoration: "none",
                                    fontWeight: isActive(page.url) ? "bold" : "normal",
                                    borderBottom: isActive(page.url) ? "2px solid" : "none",
                                    "&:visited": { color: "inherit" },
                                    "&:hover": { color: "inherit" },
                                }}
                                component={RouterLink}
                            >
                                <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                                    <Typography
                                        to={setting.url}
                                        key={setting.name}
                                        component={RouterLink}
                                        sx={{
                                            textAlign: "center",
                                            textDecoration: "none",
                                            color: "inherit",
                                            "&:visited": { color: "inherit" },
                                            "&:hover": { color: "inherit" },
                                        }}
                                        onClick={setting.onClick}
                                    >
                                        {setting.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
