import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import { alpha, Toolbar, Tooltip, Typography, IconButton, Button } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { Shipment, ShipmentAggregated, ShipmentPayroll } from "../types";
import { Autocomplete, CircularProgress, Stack, TablePagination, TextField } from "@mui/material";
import { getGlobalizeNumberFormatter } from "@/utils/globalize";
import React, { useEffect, useMemo, useState } from "react";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { ShipmentApi } from "../shipment_payroll_utils";
import { isAxiosError } from "axios";
import { DateTime } from "luxon";
import { ActionsMenu } from "@/components/ActionsMenu";
import { AutocompleteOption } from "@/types";

const formatter = getGlobalizeNumberFormatter(0, 2);

type Column = {
    id: keyof Shipment | "diff" | "total" | "checkbox";
    label: string;
    rowValue: (row: Shipment) => string;
    aggregatedRowValue: (row: ShipmentAggregated) => string;
    minWidth?: number;
    align?: "right" | "left";
};

const columns: readonly Column[] = [
    {
        id: "checkbox",
        label: "",
        rowValue: () => "",
        aggregatedRowValue: () => "",
    },
    {
        id: "shipment_date",
        label: "Date",
        rowValue: (row) =>
            DateTime.fromHTTP(row.shipment_date, { zone: "local" }).toFormat("dd/MM/yyyy"),
        aggregatedRowValue: () => "Subtotal",
        align: "left",
    },
    {
        id: "driver_name",
        label: "Driver",
        rowValue: (row) => row.driver_name,
        aggregatedRowValue: () => "",
        align: "left",
    },
    {
        id: "truck_plate",
        label: "Truck Plate",
        rowValue: (row) => row.truck_plate,
        aggregatedRowValue: () => "",
        align: "left",
    },
    {
        id: "product_name",
        label: "Product",
        rowValue: (row) => row.product_name,
        aggregatedRowValue: () => "",
        align: "left",
    },
    {
        id: "origin",
        label: "Origin",
        rowValue: (row) => row.origin,
        aggregatedRowValue: () => "",
        align: "left",
    },
    {
        id: "destination",
        label: "Destination",
        rowValue: (row) => row.destination,
        aggregatedRowValue: () => "",
        align: "left",
    },
    {
        id: "dispatch_code",
        label: "Dispatch",
        rowValue: (row) => row.dispatch_code,
        aggregatedRowValue: () => "",
        align: "right",
    },
    {
        id: "receipt_code",
        label: "Receipt",
        rowValue: (row) => row.receipt_code,
        aggregatedRowValue: () => "",
        align: "right",
    },
    {
        id: "origin_weight",
        label: "Origin Weight",
        rowValue: (row) => formatter(parseInt(row.origin_weight)),
        aggregatedRowValue: (aggregatedShipment) =>
            formatter(parseInt(aggregatedShipment.subtotalOrigin)),
        align: "right",
    },
    {
        id: "destination_weight",
        label: "Destination Weight",
        rowValue: (row) => formatter(parseInt(row.destination_weight)),
        aggregatedRowValue: (aggregatedShipment) =>
            formatter(parseInt(aggregatedShipment.subtotalDestination)),
        align: "right",
    },
    {
        id: "price",
        label: "Price",
        rowValue: (row) => formatter(parseFloat(row.price)),
        aggregatedRowValue: () => "",
        align: "right",
    },
    {
        id: "total",
        label: "Total",
        rowValue: (row) => formatter(parseInt(row.destination_weight) * parseFloat(row.price)),
        aggregatedRowValue: (aggregatedShipment) =>
            formatter(parseFloat(aggregatedShipment.subtotalMoney)),
        align: "right",
    },
];

interface ShipmentTableToolBar {
    tableTitle: string;
    numSelected: number;
    handleDelete: () => void;
    handleMove: () => void;
}
const ShipmentTableToolBar = ({
    tableTitle,
    numSelected,
    handleDelete,
    handleMove,
}: Readonly<ShipmentTableToolBar>) => {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
                    {tableTitle}
                </Typography>
            )}
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    paddingRight: 3,
                }}
            >
                {numSelected > 0 && (
                    <Tooltip title="Move">
                        <Button variant="outlined" onClick={handleMove}>
                            Mover
                        </Button>
                    </Tooltip>
                )}
                {numSelected > 0 && (
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Toolbar>
    );
};

interface ShipmentTableHeadProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
}
const ShipmentTableHead = ({
    numSelected,
    onSelectAllClick,
    rowCount,
}: Readonly<ShipmentTableHeadProps>) => {
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
                <TableCell>Actions</TableCell>
            </TableRow>
        </TableHead>
    );
};

interface TableShipmentRowProps {
    selectedRows: number[];
    handleSelect: (row: Shipment) => void;
    handleEditShipment: (row: Shipment) => void;
    handleDeleteShipmentItem: (row: Shipment) => void;
    indexAggregated: number;
    indexShipment: number;
    row: Shipment;
}
const TableShipmentRow = ({
    selectedRows,
    handleSelect,
    handleEditShipment,
    handleDeleteShipmentItem,
    indexAggregated,
    indexShipment,
    row,
}: Readonly<TableShipmentRowProps>) => {
    const isItemSelected = selectedRows.includes(row.shipment_code ?? 0);
    const labelId = `enhanced-table-checkbox-${indexAggregated}-${indexShipment}`;

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
                            text: "Edit",
                            handleClick: () => handleEditShipment(row),
                        },
                        {
                            text: "Delete",
                            handleClick: () => handleDeleteShipmentItem(row),
                        },
                    ]}
                />
            </TableCell>
        </TableRow>
    );
};
const TableShipmentAggregatedRow = ({ row }: { row: ShipmentAggregated }) => {
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
                        {column.aggregatedRowValue(row)}
                    </TableCell>
                );
            })}
            <TableCell></TableCell>
        </TableRow>
    );
};

const TableShipmentAggregatedTableTotalRow = ({
    shipmentAggregatedList,
}: {
    shipmentAggregatedList: ShipmentAggregated[];
}) => {
    // Calculate totals with useMemo inside the component
    const totals = useMemo(() => {
        const totalOrigin = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalOrigin),
            0,
        );
        const totalDestination = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalDestination),
            0,
        );
        const totalMoney = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalMoney),
            0,
        );
        return { totalOrigin, totalDestination, totalMoney };
    }, [shipmentAggregatedList]);

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
                TOTAL
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
                {formatter(totals.totalOrigin)}
            </TableCell>
            <TableCell
                align="right"
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {formatter(totals.totalDestination)}
            </TableCell>
            <TableCell></TableCell>
            <TableCell
                align="right"
                sx={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                }}
            >
                {formatter(totals.totalMoney)}
            </TableCell>
            <TableCell></TableCell>
        </TableRow>
    );
};

type ShipmentDataTableProps = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    shipmentAggregatedList: ShipmentAggregated[];
    setShipmentAggregatedList: React.Dispatch<React.SetStateAction<ShipmentAggregated[]>>;
    payrollCode: number;
    setShipmentToEdit: React.Dispatch<React.SetStateAction<Shipment | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    shipmentPayrollList: ShipmentPayroll[];
};
export function ShipmentDataTable({
    loading,
    setLoading,
    shipmentAggregatedList,
    setShipmentAggregatedList,
    payrollCode,
    setShipmentToEdit,
    setEditFormDialogOpen,
    shipmentPayrollList,
}: Readonly<ShipmentDataTableProps>) {
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
    }, [shipmentAggregatedList]);

    // HANDLERS
    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Shipments?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments...", selectedRows);
                }

                setLoading(true);
                const resp = await ShipmentApi.deleteShipmentList(selectedRows);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipments resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                setLoading(true);
                const shipmentAggregatedResp = await ShipmentApi.getShipmentAggregated(payrollCode);
                setLoading(false);
                setShipmentAggregatedList(
                    !isAxiosError(shipmentAggregatedResp) ? shipmentAggregatedResp : [],
                );
            },
        });
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = shipmentAggregatedList
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
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Shipment: <strong>{row.dispatch_code}</strong> -{" "}
                    <strong>{row.receipt_code}</strong>?
                </>
            ),
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment", row);
                }

                setLoading(true);
                const resp = await ShipmentApi.deleteShipment(row.shipment_code ?? 0);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Shipment resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(resp.message);

                setLoading(true);
                const shipmentListResp = await ShipmentApi.getShipmentAggregated(payrollCode);
                setLoading(false);
                setShipmentAggregatedList(!isAxiosError(shipmentListResp) ? shipmentListResp : []);
            },
        });
    };

    const handleMoveShipmentList = async () => {
        // Variable to store the selected value
        let selectedPayroll: number | null = null;

        const currentShipmentPayrollOption =
            shipmentPayrollOptionList.find((item) => item.id === payrollCode?.toString()) ?? null;

        openConfirmDialog({
            title: "Confirm Move Shipments",
            message: (
                <Box>
                    <Box component="span">Move all shipments to:</Box>
                    <Stack>
                        <Autocomplete
                            options={shipmentPayrollOptionList}
                            renderInput={(params) => (
                                <TextField {...params} label="Planilla" fullWidth />
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
            confirmText: "Move",
            confirmButtonProps: {
                color: "primary",
            },
            onConfirm: async () => {
                if (!selectedPayroll) {
                    showToastError("No Shipment Payroll was selected.");
                    return;
                }

                setLoading(true);
                const resp = await ShipmentApi.moveShipmentList(selectedPayroll, selectedRows);
                setLoading(false);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Moving Shipment resp: ", { resp });
                }
                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(resp.message);

                setLoading(true);
                // Use selectedPayroll in your API call
                const shipmentListResp = await ShipmentApi.getShipmentAggregated(payrollCode);
                setLoading(false);
                setShipmentAggregatedList(!isAxiosError(shipmentListResp) ? shipmentListResp : []);
            },
        });
    };
    // rendering helper functions

    // values
    const rowCount = shipmentAggregatedList
        .map((item) => item.shipments.length)
        .reduce((sum, num) => sum + num, 0);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ mb: 2 }}>
                <ShipmentTableToolBar
                    numSelected={selectedRows.length}
                    tableTitle="Shipments"
                    handleDelete={handleDeleteSelected}
                    handleMove={handleMoveShipmentList}
                />
                <TableContainer>
                    <Table
                        stickyHeader
                        sx={{ minWidth: "100%" }}
                        aria-labelledby="Shipments"
                        size={"medium"}
                    >
                        <ShipmentTableHead
                            numSelected={selectedRows.length}
                            onSelectAllClick={handleSelectAllClick}
                            rowCount={rowCount}
                        />
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
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
                                shipmentAggregatedList.map(
                                    (aggregatedShipment, indexAggregated) => (
                                        <React.Fragment
                                            key={`${aggregatedShipment.product}|${aggregatedShipment.origin}|${aggregatedShipment.destination}`}
                                        >
                                            {aggregatedShipment.shipments.map(
                                                (row, indexShipment) => (
                                                    <TableShipmentRow
                                                        selectedRows={selectedRows}
                                                        handleSelect={handleSelect}
                                                        handleEditShipment={handleEditShipment}
                                                        handleDeleteShipmentItem={
                                                            handleDeleteShipmentItem
                                                        }
                                                        indexAggregated={indexAggregated}
                                                        indexShipment={indexShipment}
                                                        row={row}
                                                        key={row.shipment_code ?? 0}
                                                    />
                                                ),
                                            )}
                                            <TableShipmentAggregatedRow
                                                key={`${aggregatedShipment.product}|${aggregatedShipment.origin}|${aggregatedShipment.destination}`}
                                                row={aggregatedShipment}
                                            />
                                        </React.Fragment>
                                    ),
                                )}

                            {!loading && shipmentAggregatedList.length ? (
                                <TableShipmentAggregatedTableTotalRow
                                    shipmentAggregatedList={shipmentAggregatedList}
                                />
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        align="center"
                                        sx={{
                                            py: 6,
                                        }}
                                    >
                                        No data found.
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
