import { Box, Paper } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { getGlobalizeNumberFormatter } from "@/utils/globalize";
import { DateTime } from "luxon";
import { ShipmentExpense } from "../types";
import { ShipmentExpenseApi } from "../driver_payroll_utils";

type DriverPayrollShipmentExpenseDataTableProps = {
    loading: boolean;
    loadDriverPayrollShipmentExpenseList: () => Promise<void>;
    expenseList: ShipmentExpense[];
    setExpenseToEdit: React.Dispatch<React.SetStateAction<ShipmentExpense | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showReceiptColumn: boolean;
};

const formatter = getGlobalizeNumberFormatter(0, 2);

export const DriverPayrollShipmentExpenseDataTable = ({
    loading,
    loadDriverPayrollShipmentExpenseList,
    expenseList,
    setExpenseToEdit,
    setEditFormDialogOpen,
    showReceiptColumn,
}: DriverPayrollShipmentExpenseDataTableProps) => {
    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastAxiosError } = useToast();

    useEffect(() => {
        // on expense list rerender empty selection
        setSelectedRows([]);
    }, [expenseList]);

    const handleEditExpense = (row: ShipmentExpense) => {
        setExpenseToEdit(row);
        setEditFormDialogOpen(true);
    };

    const handleDeleteSelected = () => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: `Are you sure you want to delete all selected Expenses?`,
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Expenses...", selectedRows);
                }

                const resp = await ShipmentExpenseApi.deleteShipmentExpenseList(
                    selectedRows as number[],
                );
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Expenses resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverPayrollShipmentExpenseList();
            },
        });
    };

    const handleDeleteExpenseItem = (row: ShipmentExpense) => {
        openConfirmDialog({
            title: "Confirm Delete",
            message: (
                <>
                    Are you sure you want to delete Expense: <strong>{row.receipt}</strong> -
                    Amount: <strong>{formatter(parseFloat(row.amount))}</strong>?
                </>
            ),
            confirmText: "Delete",
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Expense", row);
                }

                const resp = await ShipmentExpenseApi.deleteShipmentExpense(row.expense_code ?? 0);
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Expense resp: ", { resp });
                }

                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }

                showToastSuccess(resp.message);

                await loadDriverPayrollShipmentExpenseList();
            },
        });
    };

    const columns: GridColDef<ShipmentExpense>[] = [
        {
            field: "expense_code",
            headerName: "Expense #",
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "expense_date",
            headerName: "Date",
            renderCell: ({ row }) =>
                DateTime.fromHTTP(row.expense_date, { zone: "local" }).toFormat("dd/MM/yyyy"),
            minWidth: 100,
            sortComparator: (v1, v2) => {
                // Convert both dates to timestamp for comparison
                const date1 = v1 ? DateTime.fromHTTP(v1, { zone: "local" }).toMillis() : null;
                const date2 = v2 ? DateTime.fromHTTP(v2, { zone: "local" }).toMillis() : null;

                // Handle null values (null values should come last in sorting)
                if (date1 === null && date2 === null) return 0;
                if (date1 === null) return 1;
                if (date2 === null) return -1;

                // Compare timestamps
                return date1 - date2;
            },
        },
        {
            field: "receipt",
            headerName: "Receipt",
            minWidth: 130,
            flex: 1,
        },
        {
            field: "reason",
            headerName: "Reason",
            minWidth: 120,
            flex: 1.5,
        },
        {
            field: "amount",
            headerName: "Amount",
            renderCell: ({ row }) => formatter(parseFloat(row.amount)),
            minWidth: 120,
            flex: 0.8,
            align: "right",
        },
        {
            field: "action",
            headerName: "Actions",
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => (
                <ActionsMenu
                    menuItems={[
                        {
                            text: "Edit",
                            handleClick: () => handleEditExpense(params.row),
                        },
                        {
                            text: "Delete",
                            handleClick: () => handleDeleteExpenseItem(params.row),
                        },
                    ]}
                />
            ),
        },
    ];

    const paginationModel = { page: 0, pageSize: -1 };

    const columnVisibilityModel = {
        expense_code: false,
        receipt: showReceiptColumn,
    };

    return (
        <Box component="div" sx={{ height: "100%", width: "100%" }}>
            <DataTableToolbar
                tableTitle="Payroll Expenses"
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
            />
            <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={expenseList}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    columnVisibilityModel={columnVisibilityModel}
                    pageSizeOptions={[{ label: "All", value: -1 }]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                    }}
                    loading={loading}
                    getRowId={(row: ShipmentExpense) => row.expense_code ?? 0}
                    onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
                        setSelectedRows(newSelection)
                    }
                    rowSelectionModel={selectedRows}
                />
            </Paper>
        </Box>
    );
};
