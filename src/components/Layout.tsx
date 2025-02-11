import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import { ResponsiveAppBar } from "./ResponsiveAppBar";

export const Layout = () => {
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
