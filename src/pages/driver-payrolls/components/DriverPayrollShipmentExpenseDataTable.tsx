import {
    Autocomplete,
    Box,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { useConfirmation } from "@/context/ConfirmationContext";
import { ActionsMenu } from "@/components/ActionsMenu";
import { useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { useToast } from "@/context/ToastContext";
import { useTranslation } from "react-i18next";
import { numberFormatter } from "@/utils/i18n";
import { DateTime } from "luxon";
import { DriverPayroll, ShipmentExpense } from "../types";
import { ShipmentExpenseApi } from "../utils";
import { AutocompleteOption } from "@/types";
import { driverPayrollTranslationNamespace } from "../translations";

const DriverPayrollShipmentExpenseDataTableFooter = ({
    expenseList,
}: {
    expenseList: ShipmentExpense[];
}) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const totalAmount = expenseList.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
        <Box
            sx={{
                p: 2,
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: isMobile ? "column" : "row",
                backgroundColor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    pr: 2,
                }}
            >
                <Typography variant="body1" sx={{ mr: 1, fontWeight: "bold" }}>
                    {t("expenses.summary.total")}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: "right",
                        ml: "auto",
                        color: theme.palette.text.secondary,
                        fontWeight: "bold",
                    }}
                >
                    {numberFormatter(totalAmount)}
                </Typography>
            </Box>
        </Box>
    );
};

type DriverPayrollShipmentExpenseDataTableProps = {
    loading: boolean;
    loadDriverPayrollShipmentExpenseList: () => Promise<void>;
    expenseList: ShipmentExpense[];
    setExpenseToEdit: React.Dispatch<React.SetStateAction<ShipmentExpense | null>>;
    setEditFormDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showReceiptColumn: boolean;
    driverPayrollCode: number;
    driverPayrollList: DriverPayroll[];
    title: string;
};

export const DriverPayrollShipmentExpenseDataTable = ({
    loading,
    loadDriverPayrollShipmentExpenseList,
    expenseList,
    setExpenseToEdit,
    setEditFormDialogOpen,
    showReceiptColumn,
    driverPayrollCode,
    driverPayrollList,
    title,
}: DriverPayrollShipmentExpenseDataTableProps) => {
    const { t } = useTranslation(driverPayrollTranslationNamespace);

    // state
    const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

    // context
    const { openConfirmDialog } = useConfirmation();
    const { showToastSuccess, showToastError, showToastAxiosError } = useToast();

    // autocomplete options
    // Memoized option lists for better performance
    const driverPayrollOptionList: AutocompleteOption[] = useMemo(
        () =>
            driverPayrollList?.map((item) => ({
                id: item.payroll_code?.toString() ?? "",
                label: `${DateTime.fromHTTP(item.payroll_timestamp).toFormat("dd/MM/yy")} [#${
                    item.payroll_code ?? 0
                }]`,
            })) ?? [],
        [driverPayrollList]
    );

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
            title: t("expenses.dialogs.delete.title"),
            message: t("expenses.dialogs.delete.messageMany"),
            confirmText: t("expenses.dialogs.delete.confirmText"),
            confirmButtonProps: {
                color: "error",
            },
            onConfirm: async () => {
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Deleting Expenses...", selectedRows);
                }

                const resp = await ShipmentExpenseApi.deleteShipmentExpenseList(
                    selectedRows as number[]
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
            title: t("expenses.dialogs.delete.title"),
            message: t("expenses.dialogs.delete.messageSingle", {
                receipt: row.receipt,
                amount: numberFormatter(parseFloat(row.amount)),
            }),
            confirmText: t("expenses.dialogs.delete.confirmText"),
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

    const handleChangeShipmentExpenseListDriverPayroll = async () => {
        // Variable to store the selected value
        let selectedPayroll: number | null = null;

        const currentDriverPayrollOption =
            driverPayrollOptionList.find((item) => item.id === driverPayrollCode?.toString()) ??
            null;

        openConfirmDialog({
            title: t("expenses.dialogs.moveExpenses.title"),
            message: (
                <Box>
                    <Box component="span">{t("expenses.dialogs.moveExpenses.message")}</Box>
                    <Stack>
                        <Autocomplete
                            options={driverPayrollOptionList}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("expenses.dialogs.moveExpenses.payrollLabel")}
                                    fullWidth
                                />
                            )}
                            onChange={(_, newValue) => {
                                // Update the captured value in the closure
                                selectedPayroll = parseInt(newValue?.id ?? "") || 0;
                            }}
                            defaultValue={currentDriverPayrollOption}
                            fullWidth
                        />
                    </Stack>
                </Box>
            ),
            confirmText: t("expenses.dialogs.moveExpenses.confirmText"),
            confirmButtonProps: {
                color: "primary",
            },
            onConfirm: async () => {
                if (!selectedPayroll) {
                    showToastError(t("expenses.notifications.moveError"));
                    return;
                }

                const resp = await ShipmentExpenseApi.changeShipmentListDriverPayroll(
                    selectedPayroll,
                    selectedRows as number[]
                );
                if (import.meta.env.VITE_DEBUG) {
                    console.log("Moving Shipment Expense resp: ", { resp });
                }
                if (isAxiosError(resp) || !resp) {
                    showToastAxiosError(resp);
                    return;
                }
                showToastSuccess(t("expenses.notifications.moveSuccess"));

                await loadDriverPayrollShipmentExpenseList();
            },
        });
    };

    const columns: GridColDef<ShipmentExpense>[] = [
        {
            field: "expense_code",
            headerName: t("expenses.columns.expenseCode"),
            minWidth: 70,
            flex: 0.5, // smallest flex value for the smallest column
        },
        {
            field: "expense_date",
            headerName: t("expenses.columns.date"),
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
            headerName: t("expenses.columns.receipt"),
            minWidth: 100,
            flex: 1,
        },
        {
            field: "reason",
            headerName: t("expenses.columns.reason"),
            minWidth: 100,
            flex: 1.5,
        },
        {
            field: "amount",
            headerName: t("expenses.columns.amount"),
            renderCell: ({ row }) => numberFormatter(parseFloat(row.amount)),
            minWidth: 110,
            flex: 0.8,
            align: "right",
        },
        {
            field: "action",
            headerName: t("expenses.columns.actions"),
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            renderCell: (params) => (
                <ActionsMenu
                    menuItems={[
                        {
                            text: t("buttons.edit"),
                            handleClick: () => handleEditExpense(params.row),
                        },
                        {
                            text: t("buttons.delete"),
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
                tableTitle={title}
                numSelected={selectedRows.length}
                handleDelete={handleDeleteSelected}
                handleMove={handleChangeShipmentExpenseListDriverPayroll}
            />
            <Paper sx={{ width: "100%" }}>
                <DataGrid
                    rows={expenseList}
                    columns={columns}
                    columnVisibilityModel={columnVisibilityModel}
                    initialState={{ pagination: { paginationModel } }}
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

                <DriverPayrollShipmentExpenseDataTableFooter expenseList={expenseList} />
            </Paper>
        </Box>
    );
};
