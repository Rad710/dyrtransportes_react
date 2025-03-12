import { PageProps } from "@/types";
import { useEffect, useState } from "react";
import { Link, useMatch } from "react-router";
import { DriverPayroll } from "./types";
import { DriverPayrollApi } from "./utils";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { Box, Button, Checkbox, Divider, List, ListItem, Tooltip, Typography } from "@mui/material";
import {
    Add as AddIcon,
    TableChart as TableChartIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { Driver } from "../driver/types";
import { DriverApi } from "../driver/utils";
import { CustomSwitch } from "@/components/CustomSwitch";
import { DateTime } from "luxon";
import { downloadFile } from "@/utils/file";
import { DriverPayrollFormDialog } from "./components/DriverPayrollFormDialog";

export const DriverPayrollList = ({ title }: PageProps) => {
    const match = useMatch("/driver-payrolls/:driver_code/");
    const driverCode = parseInt(match?.params?.driver_code ?? "") || 0;

    // state
    const [loading, setLoading] = useState<boolean>(false);
    const [driver, setDriver] = useState<Driver | null>(null);
    const [driverPayrollList, setDriverPayrollList] = useState<DriverPayroll[]>([]);
    const [selectedPayrollList, setSelectedPayrollList] = useState<number[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);

    // context
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

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

    // handlers
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

    const handleCheckPayroll = (payrollCode: number | null, checked: boolean) => {
        if (payrollCode === null) return;

        let newSelectedPayrollList: number[] = [];

        if (checked) {
            newSelectedPayrollList = [...selectedPayrollList, payrollCode];
        } else {
            newSelectedPayrollList = selectedPayrollList.filter((item) => item !== payrollCode);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Select item code: ", payrollCode);
            console.log("Current selectedPayrollList: ", selectedPayrollList);
            console.log("New selectedPayrollList: ", newSelectedPayrollList);
        }

        setSelectedPayrollList(newSelectedPayrollList);
    };

    const handleExport = () => {
        openConfirmDialog({
            title: "Confirm Export",
            message: `All${selectedPayrollList.length > 0 ? " selected" : ""} driver payrolls will be exported.`,
            confirmText: "Export",
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                // Get the payrolls to export
                const payrollsToExport =
                    selectedPayrollList.length > 0
                        ? driverPayrollList.filter((p) =>
                              selectedPayrollList.includes(p.payroll_code || 0),
                          )
                        : driverPayrollList;

                if (payrollsToExport.length === 0) {
                    return;
                }

                // Sort by timestamp to get first and last
                const startDate = DateTime.fromHTTP(
                    payrollsToExport[payrollsToExport.length - 1].payroll_timestamp,
                    { zone: "local" },
                );
                const endDate = DateTime.fromHTTP(payrollsToExport[0].payroll_timestamp, {
                    zone: "local",
                });

                if (!startDate.isValid || !endDate.isValid) {
                    return;
                }

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting driver payrolls...");
                }

                const resp = await DriverPayrollApi.exportDriverPayrollList(
                    driverCode,
                    startDate,
                    endDate,
                );

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Export result...", { resp });
                }

                if (!isAxiosError(resp)) {
                    downloadFile(
                        new Blob([resp.data ?? ""]),
                        "driver_payroll_list.xlsx",
                        resp.headers?.["content-disposition"],
                    );

                    showToastSuccess("Driver payrolls exported successfully.");
                } else {
                    showToastError("Error exporting driver payrolls.");
                }
            },
        });
    };

    const handleDelete = () => {
        if (selectedPayrollList.length === 0) {
            return;
        }

        openConfirmDialog({
            title: "Confirm Deletion",
            message: `${selectedPayrollList.length} selected payroll(s) will be deleted.`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting payrolls...", selectedPayrollList);
                }

                const resp = await DriverPayrollApi.deleteDriverPayrollList(selectedPayrollList);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Delete result...", { resp });
                }

                if (!isAxiosError(resp) && resp) {
                    showToastSuccess(resp.message);
                    setSelectedPayrollList([]);
                    await loadDriverPayrollList();
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
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

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddFormDialogOpen(true)}
                    >
                        Add
                    </Button>
                    {/* Assuming you have a DriverPayrollFormDialog component */}
                    {addFormDialogOpen && (
                        <DriverPayrollFormDialog
                            open={addFormDialogOpen}
                            setOpen={setAddFormDialogOpen}
                            driverCode={driverCode}
                            setDriverPayrollList={setDriverPayrollList}
                            setSelectedPayrollList={setSelectedPayrollList}
                        />
                    )}

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>

                    <Tooltip
                        title={selectedPayrollList.length === 0 ? "Select payrolls to delete" : ""}
                    >
                        <Box component="span">
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                disabled={selectedPayrollList.length === 0}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {driverPayrollList.length === 0 ? (
                        <Box sx={{ textAlign: "center", my: 3 }}>
                            <Typography variant="body1">No driver Payrolls</Typography>
                        </Box>
                    ) : (
                        driverPayrollList.map((payroll) => {
                            const isChecked = selectedPayrollList.includes(
                                payroll.payroll_code || 0,
                            );

                            return (
                                <ListItem
                                    key={payroll.payroll_code ?? 0}
                                    sx={{
                                        bgcolor: isChecked ? "action.selected" : "background.paper",
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
                                        {/* Checkbox - on mobile, as a separate row with label */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: { xs: "flex-start", sm: "center" },
                                                alignItems: "center",
                                                width: { xs: "100%", sm: "auto" },
                                                mr: { xs: 0, sm: 1 },
                                            }}
                                        >
                                            <Checkbox
                                                checked={isChecked}
                                                onChange={(e) =>
                                                    handleCheckPayroll(
                                                        payroll.payroll_code ?? null,
                                                        e.target.checked,
                                                    )
                                                }
                                                inputProps={{ "aria-label": "Select payroll" }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    display: { xs: "inline", sm: "none" },
                                                }}
                                            >
                                                Select
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                width: { xs: "100%", sm: "300px" },
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
                            );
                        })
                    )}
                </List>
            )}
        </Box>
    );
};
