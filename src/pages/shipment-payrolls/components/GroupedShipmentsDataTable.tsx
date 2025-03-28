import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import { Autocomplete, CircularProgress, Stack, TablePagination, TextField } from "@mui/material";

import React, { useEffect, useMemo, useState } from "react";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { isAxiosError } from "axios";
import { DateTime } from "luxon";
import { ActionsMenu } from "@/components/ActionsMenu";
import { AutocompleteOption } from "@/types";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { numberFormatter } from "@/utils/i18n";
import { useTranslation } from "react-i18next";
import { shipmentTranslationNamespace } from "../translations"; // Adjust path as needed
import type { GroupedShipments, Shipment, ShipmentPayroll } from "../types";
import { ShipmentApi } from "../utils";

type Column = {
    id: keyof Shipment | "diff" | "total" | "checkbox";
    label: string;
    rowValue: (row: Shipment) => string;
    groupedRowValue: (row: GroupedShipments) => string;
    minWidth?: number;
    align?: "right" | "left";
};

interface GroupedShipmentsTableHeadProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
    columns: readonly Column[];
}

const ShipmentTableHead = ({
    numSelected,
    onSelectAllClick,
    rowCount,
    columns,
}: Readonly<GroupedShipmentsTableHeadProps>) => {
    const { t } = useTranslation(shipmentTranslationNamespace);

    return (
        <TableHead>
            <TableRow>
                {columns.map((column) =>
                    column.id !== "checkbox" ? (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                        >
                            {column.label}
                        </TableCell>
                    ) : (
                        <TableCell padding="checkbox" key={column.id}>
                            <Checkbox
                                color="primary"
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onChange={onSelectAllClick}
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                            />
                        </TableCell>
                    ),
                )}
                <TableCell>{t("dataTable.columns.actions")}</TableCell>
            </TableRow>
        </TableHead>
    );
};

interface TableShipmentRowProps {
    selectedRows: number[];
    handleSelect: (row: Shipment) => void;
    handleEditShipment: (row: Shipment) => void;
    handleDeleteShipmentItem: (row: Shipment) => void;
    indexGroupedShipment: number;
    indexShipment: number;
    row: Shipment;
    columns: readonly Column[];
}

const TableShipmentRow = ({
    selectedRows,
    handleSelect,
    handleEditShipment,
    handleDeleteShipmentItem,
    indexGroupedShipment,
    indexShipment,
    row,
    columns,
}: Readonly<TableShipmentRowProps>) => {
    const { t } = useTranslation(shipmentTranslationNamespace);
    const isItemSelected = selectedRows.includes(row.shipment_code ?? 0);
    const labelId = `enhanced-table-checkbox-${indexGroupedShipment}-${indexShipment}`;

    // render rows
    return (
        <TableRow
            hover
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.shipment_code ?? 0}
            selected={isItemSelected}
            sx={{ cursor: "pointer" }}
        >
            {columns.map((column) =>
                // render columns
                column.id !== "checkbox" ? (
                    <TableCell key={column.id} align={column.align}>
                        {column.rowValue(row)}
                    </TableCell>
                ) : (
                    <TableCell padding="checkbox" key={column.id}>
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={() => handleSelect(row)}
                            inputProps={{
                                "aria-labelledby": labelId,
                            }}
                        />
                    </TableCell>
                ),
            )}
            <TableCell>
                <ActionsMenu
                    menuItems={[
                        {
                            text: t("dataTable.actions.edit"),
                            handleClick: () => handleEditShipment(row),
                        },
                        {
                            text: t("dataTable.actions.delete"),
                            handleClick: () => handleDeleteShipmentItem(row),
                        },
                    ]}
                />
            </TableCell>
        </TableRow>
    );
};

const TableShipmentAggregatedRow = ({
    row,
    columns,
}: {
    row: GroupedShipments;
    columns: readonly Column[];
}) => {
    return (
        <TableRow
            sx={{
                fontStyle: "italic",
                fontWeight: "bold",
                color: "text.secondary",
                backgroundColor: "grey.200",
            }}
        >
            {columns.map((column) => {
                // render columns
                return (
                    <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{
                            fontStyle: "italic",
                            fontWeight: "bold",
                            color: "text.secondary",
                        }}
                    >
                        {column.groupedRowValue(row)}
                    </TableCell>
                );
            })}
            <TableCell></TableCell>
        </TableRow>
    );
};

const TableGroupedShipmentsTableTotalRow = ({
    groupedShipmentsList,
}: {
    groupedShipmentsList: GroupedShipments[];
}) => {
    const { t } = useTranslation(shipmentTranslationNamespace);

    // Calculate totals with useMemo inside the component
    const totals = useMemo(() => {
        const totalOrigin = groupedShipmentsList.reduce(
            (sum, item) => sum + parseFloat(item.subtotal_origin_weight),
            0,
        );
        const totalDestination = groupedShipmentsList.reduce(
            (sum, item) => sum + parseFloat(item.subtotal_destination_weight),
            0,
        );
        const totalMoney = groupedShipmentsList.reduce(
            (sum, item) => sum + parseFloat(item.subtotal_money),
            0,
        );
        return { totalOrigin, totalDestination, totalMoney };
    }, [groupedShipmentsList]);

    return (
        <TableRow
            sx={{
                backgroundColor: "grey.400",
            }}
        >
            <TableCell></TableCell>
            <TableCell
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {t("dataTable.total")}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell
                align="right"
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {numberFormatter(totals.totalOrigin)}
            </TableCell>
            <TableCell
                align="right"
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {numberFormatter(totals.totalDestination)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell
                align="right"
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {numberFormatter(totals.totalMoney)}
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

type GroupedShipmentsDataTableProps = {
    loading: boolean;
    groupedShipmentsList: GroupedShipments[];
    loadShipmentList: () => Promise<void>;
    payrollCode: number;
    setShipmentToEdit: React.Dispatch<React.SetStateAction<Shipment | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    shipmentPayrollList: ShipmentPayroll[];
};

export function GroupedShipmentsDataTable({
    loading,
    groupedShipmentsList,
    loadShipmentList,
    payrollCode,
    setShipmentToEdit,
    setEditFormDialogOpen,
    shipmentPayrollList,
}: Readonly<GroupedShipmentsDataTableProps>) {
    const { t } = useTranslation(shipmentTranslationNamespace);

    // Define columns with translations
    const columns: readonly Column[] = [
        {
            id: "checkbox",
            label: "",
            rowValue: () => "",
            groupedRowValue: () => "",
        },
        {
            id: "shipment_date",
            label: t("dataTable.columns.shipment_date"),
            rowValue: (row) =>
                DateTime.fromHTTP(row.shipment_date, { zone: "local" }).toFormat("dd/MM/yyyy"),
            groupedRowValue: () => t("dataTable.subtotal"),
            align: "left",
        },
        {
            id: "driver_name",
            label: t("dataTable.columns.driver_name"),
            rowValue: (row) => row.driver_name,
            groupedRowValue: () => "",
            align: "left",
        },
        {
            id: "truck_plate",
            label: t("dataTable.columns.truck_plate"),
            rowValue: (row) => row.truck_plate,
            groupedRowValue: () => "",
            align: "left",
        },
        {
            id: "product_name",
            label: t("dataTable.columns.product_name"),
            rowValue: (row) => row.product_name,
            groupedRowValue: () => "",
            align: "left",
        },
        {
            id: "origin",
            label: t("dataTable.columns.origin"),
            rowValue: (row) => row.origin,
            groupedRowValue: () => "",
            align: "left",
        },
        {
            id: "destination",
            label: t("dataTable.columns.destination"),
            rowValue: (row) => row.destination,
            groupedRowValue: () => "",
            align: "left",
        },
        {
            id: "dispatch_code",
            label: t("dataTable.columns.dispatch_code"),
            rowValue: (row) => row.dispatch_code,
            groupedRowValue: () => "",
            align: "right",
        },
        {
            id: "receipt_code",
            label: t("dataTable.columns.receipt_code"),
            rowValue: (row) => row.receipt_code,
            groupedRowValue: () => "",
            align: "right",
        },
        {
            id: "origin_weight",
            label: t("dataTable.columns.origin_weight"),
            rowValue: (row) => numberFormatter(parseInt(row.origin_weight)),
            groupedRowValue: (groupedShipments) =>
                numberFormatter(parseInt(groupedShipments.subtotal_origin_weight)),
            align: "right",
        },
        {
            id: "destination_weight",
            label: t("dataTable.columns.destination_weight"),
            rowValue: (row) => numberFormatter(parseInt(row.destination_weight)),
            groupedRowValue: (groupedShipments) =>
                numberFormatter(parseInt(groupedShipments.subtotal_destination_weight)),
            align: "right",
        },
        {
            id: "price",
            label: t("dataTable.columns.price"),
            rowValue: (row) => numberFormatter(parseFloat(row.price)),
            groupedRowValue: () => "",
            align: "right",
        },
        {
            id: "total",
            label: t("dataTable.columns.total"),
            rowValue: (row) =>
                numberFormatter(parseInt(row.destination_weight) * parseFloat(row.price)),
            groupedRowValue: (groupedShipments) =>
                numberFormatter(parseFloat(groupedShipments.subtotal_money)),
            align: "right",
        },
    ];

    // state
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();

    // autocomplete options
    // Memoized option lists for better performance
    const shipmentPayrollOptionList: AutocompleteOption[] = useMemo(
        () =>
            shipmentPayrollList?.map((item) => ({
                id: item.payroll_code?.toString() ?? "",
                label: `${DateTime.fromHTTP(item.payroll_timestamp).toFormat("dd/MM/yy")} [#${item.payroll_code ?? 0}]`,
            })) ?? [],
        [shipmentPayrollList],
    );

    // USE EFFECT
    useEffect(() => {
        // on change list rerender empty selection
        setSelectedRows([]);
    }, [groupedShipmentsList]);

    // HANDLERS
    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: t("dataTable.confirmDelete.messageMany"),
            confirmText: t("dataTable.actions.delete"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments...", selectedRows);
                }

                const resp = await ShipmentApi.deleteShipmentList(selectedRows);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadShipmentList();
            },
        });
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = groupedShipmentsList
                .map((shipmentList) =>
                    shipmentList.shipments.map((n: Shipment): number => n.shipment_code ?? 0),
                )
                .flat();
            setSelectedRows(newSelected);
            return;
        }
        setSelectedRows([]);
    };

    const handleSelect = (row: Shipment) => {
        if (!row.shipment_code) {
            return;
        }

        const selectedIndex = selectedRows.indexOf(row.shipment_code);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, row.shipment_code);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }
        setSelectedRows(newSelected);
    };

    const handleEditShipment = (row: Shipment) => {
        setShipmentToEdit(row);
        setEditFormDialogOpen(true);
    };

    const handleDeleteShipmentItem = (row: Shipment) => {
        openConfirmDialog({
            title: t("dataTable.confirmDelete.title"),
            message: (
                <>
                    {t("dataTable.confirmDelete.messageSingle")}{" "}
                    <strong>{row.dispatch_code}</strong> - <strong>{row.receipt_code}</strong>?
                </>
            ),
            confirmText: t("dataTable.actions.delete"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment", row);
                }

                const resp = await ShipmentApi.deleteShipment(row.shipment_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(t("notifications.deleteSuccess"));

                await loadShipmentList();
            },
        });
    };

    const handleChangeShipmentListShipmentPayroll = async () => {
        // Variable to store the selected value
        let selectedPayroll: number | null = null;

        const currentShipmentPayrollOption =
            shipmentPayrollOptionList.find((item) => item.id === payrollCode?.toString()) ?? null;

        openConfirmDialog({
            title: t("moveDialog.title"),
            message: (
                <Box>
                    <Box component="span">{t("moveDialog.message")}</Box>
                    <Stack>
                        <Autocomplete
                            options={shipmentPayrollOptionList}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("moveDialog.payrollLabel")}
                                    fullWidth
                                />
                            )}
                            onChange={(_, newValue) => {
                                // Update the captured value in the closure
                                selectedPayroll = parseInt(newValue?.id ?? "") || 0;
                            }}
                            defaultValue={currentShipmentPayrollOption}
                            fullWidth
                        />
                    </Stack>
                </Box>
            ),
            confirmText: t("moveDialog.confirmText"),
            confirmButtonProps: {
                color: "primary",
            },
            onConfirm: async () => {
                if (!selectedPayroll) {
                    showToastError(t("notifications.moveError"));
                    return;
                }

                const resp = await ShipmentApi.changeShipmentListShipmentPayroll(
                    selectedRows,
                    selectedPayroll,
                    null,
                );
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Moving Shipment resp: ", { resp });
                }
                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(t("notifications.moveSuccess"));

                await loadShipmentList();
            },
        });
    };

    // values
    const rowCount = groupedShipmentsList
        .map((item) => item.shipments.length)
        .reduce((sum, num) => sum + num, 0);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ mb: 2 }}>
                <DataTableToolbar
                    numSelected={selectedRows.length}
                    tableTitle={t("dataTable.tableTitle")}
                    handleDelete={handleDeleteSelected}
                    handleMove={handleChangeShipmentListShipmentPayroll}
                />
                <TableContainer>
                    <Table
                        stickyHeader
                        sx={{ minWidth: "100%" }}
                        aria-labelledby={t("dataTable.tableTitle")}
                        size={"medium"}
                    >
                        <ShipmentTableHead
                            numSelected={selectedRows.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rowCount}
                            columns={columns}
                        />
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        align="center"
                                        sx={{
                                            py: 6,
                                        }}
                                    >
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading &&
                                groupedShipmentsList.map(
                                    (groupedShipments, indexGroupedShipment) => (
                                        <React.Fragment
                                            key={`${groupedShipments.product}|${groupedShipments.origin}|${groupedShipments.destination}`}
                                        >
                                            {groupedShipments.shipments.map(
                                                (row, indexShipment) => (
                                                    <TableShipmentRow
                                                        selectedRows={selectedRows}
                                                        handleSelect={handleSelect}
                                                        handleEditShipment={handleEditShipment}
                                                        handleDeleteShipmentItem={
                                                            handleDeleteShipmentItem
                                                        }
                                                        indexGroupedShipment={indexGroupedShipment}
                                                        indexShipment={indexShipment}
                                                        row={row}
                                                        columns={columns}
                                                        key={row.shipment_code ?? 0}
                                                    />
                                                ),
                                            )}
                                            <TableShipmentAggregatedRow
                                                key={`${groupedShipments.product}|${groupedShipments.origin}|${groupedShipments.destination}`}
                                                row={groupedShipments}
                                                columns={columns}
                                            />
                                        </React.Fragment>
                                    ),
                                )}

                            {!loading && groupedShipmentsList.length ? (
                                <TableGroupedShipmentsTableTotalRow
                                    groupedShipmentsList={groupedShipmentsList}
                                />
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        align="center"
                                        sx={{
                                            py: 6,
                                        }}
                                    >
                                        {t("dataTable.noDataFound")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={rowCount}
                    rowsPerPage={rowCount}
                    page={0}
                    onPageChange={() => {}}
                />
            </Paper>
        </Box>
    );
}
