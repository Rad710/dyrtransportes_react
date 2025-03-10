import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
    Box,
    Button,
    List,
    ListItem,
    Typography,
    TextField,
    InputAdornment,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { isAxiosError } from "axios";

import { PageProps } from "@/types";

import { useToast } from "@/context/ToastContext";
import { Driver } from "../driver/types";
import { DriverApi } from "../driver/utils";
import { CustomSwitch } from "@/components/CustomSwitch";

export const DriverList = ({ title }: Readonly<PageProps>) => {
    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [driverList, setDriverList] = useState<Driver[]>([]);
    const [filteredDriverList, setFilteredDriverList] = useState<Driver[]>([]);

    // CONTEXT
    const { showToastSuccess, showToastAxiosError } = useToast();

    const loadDriverList = async () => {
        setLoading(true);
        const resp = await DriverApi.getDriverList();
        setLoading(false);

        if (!isAxiosError(resp) && resp) {
            setDriverList(resp);
            setFilteredDriverList(resp); // Initialize filtered list with all drivers
        } else {
            showToastAxiosError(resp);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded drivers ", { resp });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadDriverList();
    }, []);

    //HANDLERS
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase().trim();

        if (query === "") {
            setFilteredDriverList(driverList);
        } else {
            const filtered = driverList.filter(
                (driver) =>
                    driver.driver_name?.toLowerCase().includes(query) ||
                    driver.driver_surname?.toLowerCase().includes(query),
            );
            setFilteredDriverList(filtered);
        }
    };

    const handleActiveToggle = async (driver: Driver, active: boolean) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log(`Updating active status for driver, `, { driver });
        }

        const resp = !active
            ? await DriverApi.deleteDriver(driver?.driver_code ?? 0)
            : await DriverApi.restoreDriver(driver?.driver_code ?? 0);
        if (isAxiosError(resp) || !resp) {
            showToastAxiosError(resp);
            return;
        }

        const driverResp = await DriverApi.getDriver(driver.driver_code ?? 0);
        if (!isAxiosError(driverResp) && driverResp) {
            const updatedDriverList = driverList.map((item) =>
                item.driver_code !== driver.driver_code ? item : driverResp,
            );
            setDriverList(updatedDriverList);

            // Also update the filtered list to reflect changes
            setFilteredDriverList(
                filteredDriverList.map((item) =>
                    item.driver_code !== driver.driver_code ? item : driverResp,
                ),
            );
        } else {
            showToastAxiosError(driverResp);
        }
        const driverName = `${driver.driver_name ?? ""} ${driver.driver_surname ?? ""}`;
        showToastSuccess(
            `Driver ${driverName.trim()} marked as ${active ? "active" : "deactivated"}`,
        );
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "flex-start", md: "center" },
                    justifyContent: "space-between",
                    mb: 4,
                }}
            >
                <Typography variant="h5" component="h2" sx={{ mb: { xs: 2, md: 0 } }}>
                    Lista de Conductores
                </Typography>

                <TextField
                    placeholder="Search drivers..."
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    sx={{
                        width: { xs: "100%", md: "300px" },
                        mt: { xs: 1, md: 0 },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {filteredDriverList.length === 0 ? (
                        <Box sx={{ textAlign: "center", my: 3 }}>
                            <Typography variant="body1">
                                No drivers found matching your search.
                            </Typography>
                        </Box>
                    ) : (
                        filteredDriverList.map((driver) => (
                            <ListItem
                                key={driver.driver_code}
                                sx={{
                                    bgcolor: "background.paper",
                                    borderRadius: 1,
                                    mb: 1,
                                    padding: { xs: 2, sm: 1 },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", sm: "row" },
                                        alignItems: { xs: "stretch", sm: "center" },
                                        width: "100%",
                                        justifyContent: "center",
                                        gap: { xs: 2, sm: 2 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "400px" },
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Button
                                                component={Link}
                                                to={`/driver-payrolls/${driver.driver_code ?? 0}`}
                                                variant="contained"
                                                color="info"
                                                sx={{
                                                    width: "100%",
                                                    py: 1,
                                                    fontWeight: "bold",
                                                    fontSize: "1.1rem",
                                                    whiteSpace: "normal",
                                                    height: "auto",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    lineHeight: "1.2",
                                                    minHeight: { xs: "60px", sm: "48px" },
                                                    px: 2,
                                                }}
                                            >
                                                {driver.driver_name} {driver.driver_surname}
                                            </Button>
                                            <Divider
                                                sx={{
                                                    width: "100%",
                                                    mt: 1,
                                                    borderBottomWidth: 2,
                                                    opacity: 0.7,
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Switch with fixed width container */}
                                    <Box
                                        sx={{
                                            width: { xs: "100%", sm: "180px" },
                                            display: "flex",
                                            justifyContent: { xs: "center", sm: "flex-start" },
                                        }}
                                    >
                                        <CustomSwitch
                                            checked={!driver.deleted}
                                            onChange={(e) =>
                                                handleActiveToggle(driver, e.target.checked)
                                            }
                                            textChecked="Active"
                                            textUnchecked="Deactivated"
                                        />
                                    </Box>
                                </Box>
                            </ListItem>
                        ))
                    )}
                </List>
            )}
        </Box>
    );
};
