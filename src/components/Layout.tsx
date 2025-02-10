import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router";
import { ResponsiveAppBar } from "./ResponsiveAppBar";

export const Layout = () => {
    const [_, pathPrimary] = useLocation()?.pathname?.split("/") ?? [];
    const path = "/" + pathPrimary;

    return (
        <>
            <Box component="header">
                <Box component="nav">
                    <ResponsiveAppBar />
                </Box>
            </Box>
            <Container>
                <Outlet />
            </Container>
        </>
    );
};
