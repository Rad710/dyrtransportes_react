import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import { CustomTableToolbar } from "@/components/CustomTableToolbar";
import { Shipment, ShipmentAggregated } from "../types";
import { CircularProgress, TablePagination } from "@mui/material";
import { getGlobalizeNumberFormatter } from "@/utils/globalize";
import React, { useEffect, useState } from "react";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useToast } from "@/context/ToastContext";
import { ShipmentApi } from "../shipment_payroll_utils";
import { isAxiosError } from "axios";

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
        rowValue: (row) => row.shipment_date,
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
        id: "diff",
        label: "Diff",
        rowValue: (row) =>
            formatter(parseInt(row.destination_weight) - parseInt(row.origin_weight)),
        aggregatedRowValue: (aggregatedShipment) =>
            formatter(parseInt(aggregatedShipment.subtotalDifference)),
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
                                onChange={(e, val) => {
                                    onSelectAllClick(e);
                                    console.log(val);
                                }}
                                inputProps={{
                                    "aria-label": "select all desserts",
                                }}
                            />
                        </TableCell>
                    ),
                )}
            </TableRow>
        </TableHead>
    );
};

type ShipmentDataTableProps = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    shipmentAggregatedList: ShipmentAggregated[];
    setShipmentAggegatedList: React.Dispatch<React.SetStateAction<ShipmentAggregated[]>>;
    payrollCode: number;
};

export function ShipmentDataTable({
    loading,
    setLoading,
    shipmentAggregatedList,
    setShipmentAggegatedList,
    payrollCode,
}: Readonly<ShipmentDataTableProps>) {
    // state
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    // effect
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

                const shipmentAggregatedResp = await ShipmentApi.getShipmentAggregated(payrollCode);
                setShipmentAggegatedList(
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

    // rendering helper functions
    const renderShipmentRow = (indexAggregated: number, indexShipment: number, row: Shipment) => {
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
                onClick={() => console.log(row)}
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
            </TableRow>
        );
    };
    const renderShipmentAggregatedRow = (row: ShipmentAggregated) => {
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
            </TableRow>
        );
    };

    const renderTotalShipmentAggregatedTableRow = () => {
        const totalOrigin = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalOrigin),
            0,
        );
        const totalDestination = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalDestination),
            0,
        );
        const totalDifference = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalDifference),
            0,
        );
        const totalMoney = shipmentAggregatedList.reduce(
            (sum, item) => sum + parseFloat(item.subtotalMoney),
            0,
        );

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
                    sx={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totalOrigin)}
                </TableCell>
                <TableCell
                    sx={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totalDestination)}
                </TableCell>
                <TableCell
                    sx={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totalDifference)}
                </TableCell>
                <TableCell></TableCell>
                <TableCell
                    sx={{
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }}
                >
                    {formatter(totalMoney)}
                </TableCell>
            </TableRow>
        );
    };

    // values
    const rowCount = shipmentAggregatedList
        .map((item) => item.shipments.length)
        .reduce((sum, num) => sum + num, 0);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ mb: 2 }}>
                <CustomTableToolbar
                    numSelected={selectedRows.length}
                    tableTitle="Shipments"
                    handleDelete={handleDeleteSelected}
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
                                                (row, indexShipment) =>
                                                    renderShipmentRow(
                                                        indexAggregated,
                                                        indexShipment,
                                                        row,
                                                    ),
                                            )}
                                            {renderShipmentAggregatedRow(aggregatedShipment)}
                                        </React.Fragment>
                                    ),
                                )}

                            {!loading && shipmentAggregatedList.length ? (
                                renderTotalShipmentAggregatedTableRow()
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
