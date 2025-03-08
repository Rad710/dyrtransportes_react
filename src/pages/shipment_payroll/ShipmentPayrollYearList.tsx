import { useState, useEffect } from "react";
import { Link } from "react-router";
import { DateTime } from "luxon";
import { Add as AddIcon, TableChart as TableChartIcon } from "@mui/icons-material";
import { Box, Button, List, ListItem, Checkbox, Typography, Tooltip } from "@mui/material";
import { isAxiosError } from "axios";
import { saveAs } from "file-saver";

import { PropsTitle } from "@/types";
import { ShipmentPayroll } from "./types";

import { useToast } from "@/context/ToastContext";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ShipmentPayrollApi } from "./shipment_payroll_utils";

export const ShipmentPayrollYearList = ({ title }: Readonly<PropsTitle>) => {
    // STATE
    const [loading, setLoading] = useState<boolean>(true);
    const [yearList, setYearList] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    // CONTEXT
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();
    const { openConfirmDialog } = useConfirmation();

    const loadShipmentPayrollYearList = async () => {
        setLoading(true);
        const resp = await ShipmentPayrollApi.getShipmentPayrollList();
        setLoading(false);

        if (!isAxiosError(resp) && resp) {
            const shipmentPayrollYearSet: Set<number> = new Set(
                resp
                    ?.map((item) => DateTime.fromHTTP(item.payroll_timestamp, { zone: "local" }))
                    ?.filter((item) => item?.isValid)
                    ?.map((item) => item.year) ?? [],
            );

            const shipmentPayrollYearList = Array.from(shipmentPayrollYearSet).sort(
                (a, b) => b - a,
            );
            setYearList(shipmentPayrollYearList);
        } else {
            showToastAxiosError(resp);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Loaded shipment payrolls ", { resp });
            console.log("Shipment payroll years", { yearList });
        }
    };

    // USE EFFECTS
    useEffect(() => {
        document.title = title;
        loadShipmentPayrollYearList();
    }, []);

    const handleAddYear = () => {
        openConfirmDialog({
            title: "Confirmar Creación",
            message: "Se creará una nueva planilla.",
            confirmText: "Crear",
            confirmButtonProps: {
                color: "success",
            },
            onConfirm: async () => {
                const latestYear = yearList.at(0) || 2023;
                const newYear = DateTime.fromObject({ year: latestYear + 1 }, { zone: "local" });

                if (!newYear.isValid) {
                    return;
                }

                const payload: ShipmentPayroll = {
                    payroll_timestamp: newYear.toHTTP(),
                    collected: false,
                    deleted: false,
                };

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Posting ShipmentPayroll...", { payload });
                }

                const resp = await ShipmentPayrollApi.postShipmentPayroll(payload);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Post result...", { resp });
                }

                setSelectedYear(null);

                if (!isAxiosError(resp) && resp) {
                    showToastSuccess(resp.message);
                    await loadShipmentPayrollYearList();
                } else {
                    showToastAxiosError(resp);
                }
            },
        });
    };

    const handleExportList = () => {
        openConfirmDialog({
            title: "Confirmar Exportación",
            message: "Se exportarán todas las Cobranzas del año.",
            confirmText: "Exportar",
            confirmButtonProps: {
                color: "info",
            },
            onConfirm: async () => {
                if (!selectedYear) {
                    return;
                }

                const startDate = DateTime.fromObject({ year: selectedYear }, { zone: "local" });

                const endDate = DateTime.fromObject(
                    { year: selectedYear + 1 },
                    { zone: "local" },
                ).minus({ days: 1 });

                if (!startDate.isValid || !endDate.isValid) {
                    return;
                }

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Exporting shipment payrolls...", { startDate, endDate });
                }

                const resp = await ShipmentPayrollApi.exportShipmentPayrollList(startDate, endDate);

                if (import.meta.env.VITE_DEBUG) {
                    console.log("Export result...", { resp });
                }

                if (!isAxiosError(resp)) {
                    saveAs(new Blob([resp ?? ""]), "lista_de_cobranzas.xlsx");
                    showToastSuccess("Planilla exportada exitosamente.");
                } else {
                    showToastError("Error al exportar planilla.");
                }
            },
        });
    };

    const handleToggleYear = (year: number, checked: boolean) => {
        // If checked, set this year as the selected one
        // If unchecked and this was the selected year, set to null
        if (checked) {
            setSelectedYear(year);
        } else if (selectedYear === year) {
            setSelectedYear(null);
        }

        if (import.meta.env.VITE_DEBUG) {
            console.log("Select item value: ", year);
            console.log("current selectedYear: ", selectedYear);
        }
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
                    Lista de Planillas
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddYear}>
                        Add
                    </Button>

                    <Tooltip title={!selectedYear ? "Seleccione planillas para exportar" : ""}>
                        <Box component="span">
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<TableChartIcon />}
                                onClick={handleExportList}
                                disabled={!selectedYear}
                            >
                                Export
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </Box>

            {!loading && (
                <List sx={{ width: "100%" }}>
                    {yearList.map((year) => {
                        const isChecked = selectedYear === year;

                        return (
                            <ListItem
                                key={year}
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
                                    onChange={(e) => handleToggleYear(year, e.target.checked)}
                                    inputProps={{ "aria-label": "Seleccionar año" }}
                                    sx={{ mr: 2 }}
                                />

                                <Button
                                    component={Link}
                                    to={`/shipment-payrolls/${year}`}
                                    variant="contained"
                                    color="info"
                                    sx={{
                                        px: 4,
                                        py: 1,
                                        fontWeight: "bold",
                                        fontSize: "1.25rem",
                                    }}
                                >
                                    {year}
                                </Button>
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Box>
    );
};
