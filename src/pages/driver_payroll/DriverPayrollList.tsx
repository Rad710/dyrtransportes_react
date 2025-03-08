import { PropsTitle } from "@/types";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router";
import { DriverPayroll } from "./types";
import { DriverPayrollApi } from "./driver_payroll_utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import { Driver } from "../driver/types";
import { DriverApi } from "../driver/driver_utils";
import { CustomSwitch } from "@/components/CustomSwitch";
import { DateTime } from "luxon";

export const DriverPayrollList = ({ title }: PropsTitle) => {
    const match = useMatch("/driver-payrolls/:driver_code/");
    const driverCode = parseInt(match?.params?.driver_code ?? "") || 0;

    // state
    const [loading, setLoading] = useState<boolean>(false);
    const [driver, setDriver] = useState<Driver | null>(null);
    const [driverPayrollList, setDriverPayrollList] = useState<DriverPayroll[]>([]);

    // context
    const { showToastSuccess, showToastAxiosError } = useToast();

    const loadDriverPayrollList = async () => {
        setLoading(true);
        const [respDriver, respPayrollList] = await Promise.all([
            DriverApi.getDriver(driverCode),
            DriverPayrollApi.getDriverPayrollList(driverCode),
        ]);
        setLoading(false);

        if (isAxiosError(respDriver) || !respDriver) {
            showToastAxiosError(respDriver);
            return;
        }

        if (isAxiosError(respPayrollList) || !respPayrollList) {
            showToastAxiosError(respPayrollList);
            return;
        }

        setDriver(respDriver);
        setDriverPayrollList(respPayrollList);

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded driver", { respDriver });
            console.log("Loaded drivers payrolls", { respPayrollList });
        }
    };

    // use effect
    useEffect(() => {
        document.title = title;

        loadDriverPayrollList();
    }, []);

    //handlers
    const handlePaidToggle = async (payroll: DriverPayroll, paid: boolean) => {
        if (import.meta.env.VITE_DEBUG) {
            console.log(`Updating paid status for payroll, `, { payroll });
        }

        const newPayload: DriverPayroll = {
            ...payroll,
            paid: paid,
        };

        const resp = await DriverPayrollApi.updateCollectionStatus(newPayload);
        if (isAxiosError(resp) || !resp) {
            showToastAxiosError(resp);
            return;
        }

        const payrollResp = await DriverPayrollApi.getDriverPayroll(payroll.payroll_code ?? 0);
        if (!isAxiosError(payrollResp) && payrollResp) {
            const updatedPayrollList = driverPayrollList.map((item) =>
                item.payroll_code !== payroll.payroll_code ? item : payrollResp,
            );
            setDriverPayrollList(updatedPayrollList);
        } else {
            showToastAxiosError(payrollResp);
        }

        showToastSuccess(
            `Driver Payroll #${payroll.payroll_code ?? 0} marked as ${paid ? "paid" : "unpaid"}`,
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
                    Lista de Liquidaciones de{" "}
                    {((driver?.driver_name ?? "") + " " + (driver?.driver_surname ?? "")).trim()}
                </Typography>
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {driverPayrollList.length === 0 ? (
                        <Box sx={{ textAlign: "center", my: 3 }}>
                            <Typography variant="body1">No driver Payrolls</Typography>
                        </Box>
                    ) : (
                        driverPayrollList.map((payroll) => (
                            <ListItem
                                key={payroll.payroll_code ?? 0}
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
                                                to={`/driver-payrolls/${driver?.driver_code ?? 0}/payroll/${payroll?.payroll_code ?? 0}`}
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
                                                {DateTime.fromHTTP(
                                                    payroll.payroll_timestamp,
                                                ).toLocaleString({
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        ml: 1,
                                                        color: "text.secondary",
                                                        opacity: 0.7,
                                                        fontWeight: "normal",
                                                    }}
                                                >
                                                    [#{payroll.payroll_code ?? 0}]
                                                </Typography>
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
                                            checked={payroll.paid}
                                            onChange={(e) =>
                                                handlePaidToggle(payroll, e.target.checked)
                                            }
                                            textChecked="Paid"
                                            textUnchecked="Unpaid"
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
