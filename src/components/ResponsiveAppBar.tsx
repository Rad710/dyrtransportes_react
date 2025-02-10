import * as React from "react";
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
import { Link } from "react-router";
import { styled } from "@mui/material";
import { DyRTransportesIcon } from "./CustomIcons";

type NavBarPage = {
    name: string;
    url: string;
};

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;

    &:visited {
        color: inherit;
    }

    &:hover {
        color: inherit;
    }
`;

const pages: NavBarPage[] = [
    {
        name: "Products",
        url: "/product",
    },
    {
        name: "Pricing",
        url: "/product",
    },
    {
        name: "Blog",
        url: "/product",
    },
];
const settings: NavBarPage[] = [
    {
        name: "Profile",
        url: "/product",
    },
    {
        name: "Account",
        url: "/product",
    },
    {
        name: "Logout",
        url: "/product",
    },
];

export const ResponsiveAppBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

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

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <StyledLink
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".2rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            <DyRTransportesIcon />
                        </Typography>
                    </StyledLink>

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
                                    <StyledLink to={page.url}>
                                        <Typography sx={{ textAlign: "center" }} component="div">
                                            {page.name}
                                        </Typography>
                                    </StyledLink>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <StyledLink
                        to="/"
                        sx={{
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                        }}
                    >
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            <DyRTransportesIcon />
                        </Typography>
                    </StyledLink>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                        {pages.map((page) => (
                            <StyledLink to={page.url} key={page.name}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: "white", display: "block" }}
                                >
                                    <Typography sx={{ textAlign: "center" }} component="div">
                                        {page.name}
                                    </Typography>
                                </Button>
                            </StyledLink>
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
                                    <StyledLink to={setting.url} key={setting.name}>
                                        <Typography sx={{ textAlign: "center" }} component="div">
                                            {setting.name}
                                        </Typography>
                                    </StyledLink>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
