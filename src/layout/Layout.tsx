import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import { ResponsiveAppBar } from "./components/ResponsiveAppBar";

export const Layout = () => {
    return (
        <>
            <Box component="header">
                <Box component="nav">
                    <ResponsiveAppBar />
                </Box>
            </Box>
            <Container maxWidth={false} sx={{ padding: 3 }}>
                <Outlet />
            </Container>
        </>
    );
};
