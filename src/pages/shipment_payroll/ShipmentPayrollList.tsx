import { useState, useEffect } from "react";
import { Link, useMatch } from "react-router";
import { DateTime } from "luxon";
import {
    Add as AddIcon,
    TableChart as TableChartIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { Box, Button, List, ListItem, Checkbox, Typography, Tooltip } from "@mui/material";
import { isAxiosError } from "axios";
import { saveAs } from "file-saver";

import { PropsTitle } from "@/types";
import { ShipmentPayroll } from "./types";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ShipmentPayrollApi } from "./shipment_payroll_utils";
import { ShipmentPayrollFormDialog } from "./components/ShipmentPayrollFormDialog";

export const ShipmentPayrollList = ({ title }: Readonly<PropsTitle>) => {
    const match = useMatch("/shipment-payroll-list/:year");
    const year = parseInt(match?.params?.year ?? "") || 0;

    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [payrollList, setPayrollList] = useState<ShipmentPayroll[]>([]);
    const [selectedPayrollList, setSelectedPayrollList] = useState<number[]>([]);
    const [addFormDialogOpen, setAddFormDialogOpen] = useState<boolean>(false);

    // CONTEXT
    const { showToastSuccess, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentPayrollList = async () => {
        setLoading(true);
        const resp = await ShipmentPayrollApi.getShipmentPayrollList(year);
        setLoading(false);

        if (!isAxiosError(resp) && resp) {
            setPayrollList(resp);
        } else {
            showToastAxiosError(resp);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipment payrolls ", { resp });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadShipmentPayrollList();
    }, []);

    const handleExport = () => {
        openConfirmDialog({
            title: "Confirmar Exportación",
            message: `Se exportarán todas las Cobranzas ${
                selectedPayrollList.length > 0 ? "seleccionadas" : ""
            }.`,
            confirmText: "Exportar",
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                // Get start and end dates from the selected payrolls or all payrolls
                const payrollsToExport =
                    selectedPayrollList.length > 0
                        ? payrollList.filter((p) =>
                              selectedPayrollList.includes(p.payroll_code || 0),
                          )
                        : payrollList;

                if (payrollsToExport.length === 0) {
                    return;
                }

                // Sort by timestamp to get first and last
                const sortedPayrolls = [...payrollsToExport].sort((a, b) =>
                    a.payroll_timestamp.localeCompare(b.payroll_timestamp),
                );

                const startDate = DateTime.fromHTTP(sortedPayrolls[0].payroll_timestamp, {
                    zone: "local",
                });
                const endDate = DateTime.fromHTTP(
                    sortedPayrolls[sortedPayrolls.length - 1].payroll_timestamp,
                    { zone: "local" },
                );

                if (!startDate.isValid || !endDate.isValid) {
                    return;
                }

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting shipment payrolls...");
                }

                const resp = await ShipmentPayrollApi.exportShipmentPayrollList(startDate, endDate);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Export result...", { resp });
                }

                if (!isAxiosError(resp)) {
                    saveAs(new Blob([resp ?? ""]), "lista_de_cobranzas.xlsx");
                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
    };

    const handleDelete = () => {
        if (selectedPayrollList.length === 0) {
            return;
        }

        openConfirmDialog({
            title: "Confirmar Eliminación",
            message: `Se eliminarán ${selectedPayrollList.length} planilla(s) seleccionada(s).`,
            confirmText: "Eliminar",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting payrolls...", selectedPayrollList);
                }

                const resp =
                    await ShipmentPayrollApi.deleteShipmentPayrollList(selectedPayrollList);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Delete result...", { resp });
                }

                if (!isAxiosError(resp) && resp) {
                    showToastSuccess(resp.message);
                    setSelectedPayrollList([]);
                    await loadShipmentPayrollList();
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
    };

    const handleTogglePayroll = (payrollCode: number | null, checked: boolean) => {
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

    return (
        <Box sx={{ padding: 3 }}>
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
                    Lista de Planillas de {year}
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
                    <ShipmentPayrollFormDialog
                        open={addFormDialogOpen}
                        setOpen={setAddFormDialogOpen}
                        year={year}
                        setPayrollList={setPayrollList}
                        setSelectedPayrollList={setSelectedPayrollList}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<TableChartIcon />}
                        onClick={handleExport}
                    >
                        Exportar
                    </Button>

                    <Tooltip
                        title={
                            selectedPayrollList.length === 0
                                ? "Seleccione planillas para eliminar"
                                : ""
                        }
                    >
                        <span>
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                disabled={selectedPayrollList.length === 0}
                            >
                                Eliminar
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {payrollList.map((payroll) => {
                        const isChecked = selectedPayrollList.includes(payroll.payroll_code || 0);
                        const payrollDate = DateTime.fromHTTP(payroll.payroll_timestamp, {
                            zone: "local",
                        }).setLocale("es");

                        return (
                            <ListItem
                                key={payroll.payroll_code}
                                sx={{
                                    bgcolor: isChecked ? "action.selected" : "background.paper",
                                    borderRadius: 1,
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) =>
                                        handleTogglePayroll(
                                            payroll.payroll_code ?? null,
                                            e.target.checked,
                                        )
                                    }
                                    inputProps={{ "aria-label": "Seleccionar planilla" }}
                                    sx={{ mr: 2 }}
                                />

                                <Button
                                    component={Link}
                                    to={`/shipment-payroll-list/payroll/${payroll.payroll_code ?? 0}`}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {payrollDate.toLocaleString({
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
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};
