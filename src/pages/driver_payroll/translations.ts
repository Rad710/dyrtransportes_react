import i18n, { appLanguages } from "@/utils/i18n";

// Driver translations
const driverResources = {
    en: {
        translation: {
            title: "Drivers",
            listTitle: "Driver List",
            searchPlaceholder: "Search drivers...",
            noDriversFound: "No drivers found matching your search.",
            driver: {
                status: {
                    active: "Active",
                    deactivated: "Deactivated",
                },
            },
            notifications: {
                statusChanged: "Driver {{name}} marked as {{status}}",
            },
        },
    },
    es: {
        translation: {
            title: "Conductores",
            listTitle: "Lista de Conductores",
            searchPlaceholder: "Buscar conductores...",
            noDriversFound: "No se encontraron conductores que coincidan con tu búsqueda.",
            driver: {
                status: {
                    active: "Activo",
                    deactivated: "Desactivado",
                },
            },
            notifications: {
                statusChanged: "Conductor {{name}} marcado como {{status}}",
            },
        },
    },
};

// Add resources to i18n
const driverListTranslationNamespace = "driverList";

appLanguages.forEach((lang) => {
    // Add driver translations
    if (!i18n.hasResourceBundle(lang, driverListTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            driverListTranslationNamespace,
            driverResources[lang].translation,
        );
    }
});

export { driverListTranslationNamespace };

// Driver Payroll translations
const driverPayrollListResources = {
    en: {
        translation: {
            title: "Payrolls",
            listTitle: "Payroll List for {{driverName}}",
            noPayrolls: "No driver Payrolls",
            buttons: {
                add: "Add",
                export: "Export",
                delete: "Delete",
                close: "Close",
                addPayroll: "Add Payroll",
                editPayroll: "Edit Payroll",
            },
            select: "Select",
            tooltips: {
                selectToDelete: "Select payrolls to delete",
            },
            payroll: {
                status: {
                    paid: "Paid",
                    unpaid: "Unpaid",
                },
            },
            confirmations: {
                export: {
                    title: "Confirm Export",
                    message: "All{{selectedCount}} driver payrolls will be exported.",
                    confirmText: "Export",
                },
                delete: {
                    title: "Confirm Deletion",
                    message: "{{count}} selected payroll(s) will be deleted.",
                    confirmText: "Delete",
                },
            },
            notifications: {
                statusChanged: "Driver Payroll #{{code}} marked as {{status}}",
                exportSuccess: "Driver payrolls exported successfully.",
                exportError: "Error exporting driver payrolls.",
            },
            formDialog: {
                addTitle: "Add Driver Payroll",
                editTitle: "Edit Driver Payroll",
                selectNewDate: "Select a date for the new Driver Payroll",
                selectEditDate: "Select a date for the Driver Payroll to edit",
                reviewFields: "Please review the required fields",
                dateLabel: "Payroll Date",
                errors: {
                    alreadyExists: "Payroll already exists",
                    cannotEdit: "Payroll cannot be edited",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Liquidaciones",
            listTitle: "Lista de Liquidaciones de {{driverName}}",
            noPayrolls: "No hay liquidaciones de conductor",
            buttons: {
                add: "Agregar",
                export: "Exportar",
                delete: "Eliminar",
                close: "Cerrar",
                addPayroll: "Agregar Liquidación",
                editPayroll: "Editar Liquidación",
            },
            select: "Seleccionar",
            tooltips: {
                selectToDelete: "Seleccione liquidaciones para eliminar",
            },
            payroll: {
                status: {
                    paid: "Pagado",
                    unpaid: "No Pagado",
                },
            },
            confirmations: {
                export: {
                    title: "Confirmar Exportación",
                    message:
                        "Todas{{selectedCount}} las liquidaciones del conductor serán exportadas.",
                    confirmText: "Exportar",
                },
                delete: {
                    title: "Confirmar Eliminación",
                    message: "{{count}} liquidación(es) seleccionada(s) será(n) eliminada(s).",
                    confirmText: "Eliminar",
                },
            },
            notifications: {
                statusChanged: "Liquidación de conductor #{{code}} marcada como {{status}}",
                exportSuccess: "Liquidaciones de conductor exportadas exitosamente.",
                exportError: "Error al exportar liquidaciones de conductor.",
            },
            formDialog: {
                addTitle: "Agregar Liquidación de Conductor",
                editTitle: "Editar Liquidación de Conductor",
                selectNewDate: "Seleccione una fecha para la nueva Liquidación",
                selectEditDate: "Seleccione una fecha para la Liquidación a editar",
                reviewFields: "Por favor revise los campos requeridos",
                dateLabel: "Fecha de Liquidación",
                errors: {
                    alreadyExists: "La Liquidación ya existe",
                    cannotEdit: "La Liquidación no puede ser editada",
                },
            },
        },
    },
};

// Add resources to i18n
const driverPayrollListTranslationNamespace = "driverPayrollList";

appLanguages.forEach((lang) => {
    // Add driver payroll translations
    if (!i18n.hasResourceBundle(lang, driverPayrollListTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            driverPayrollListTranslationNamespace,
            driverPayrollListResources[lang].translation,
        );
    }
});

export { driverPayrollListTranslationNamespace };

// Driver Payroll Detail translations
const driverPayrollDetailResources = {
    en: {
        translation: {
            title: "Driver Payroll",
            tabs: {
                shipments: "Shipments",
                expenses: "Expenses",
            },
            buttons: {
                add: "Add",
                export: "Export",
                edit: "Edit",
                delete: "Delete",
                move: "Move",
                close: "Close",
                addExpense: "Add Expense",
                editExpense: "Edit Expense",
            },
            payroll: {
                status: {
                    paid: "Paid",
                    unpaid: "Unpaid",
                },
            },
            expenses: {
                sections: {
                    withReceipt: "With Receipt",
                    withoutReceipt: "Without Receipt",
                },
                tableTitle: "Payroll Expenses",
                columns: {
                    expenseCode: "Expense #",
                    date: "Date",
                    receipt: "Receipt",
                    reason: "Reason",
                    amount: "Amount",
                    actions: "Actions",
                },
                summary: {
                    total: "Total:",
                },
                dialogs: {
                    moveExpenses: {
                        title: "Confirm Move Shipment Expenses",
                        message: "Move all shipment expenses to:",
                        confirmText: "Move",
                        payrollLabel: "Payroll",
                    },
                    delete: {
                        title: "Confirm Delete",
                        messageMany: "Are you sure you want to delete all selected Expenses?",
                        messageSingle:
                            "Are you sure you want to delete Expense: {{receipt}} - Amount: {{amount}}?",
                        confirmText: "Delete",
                    },
                    form: {
                        addTitle: "Add Expense",
                        editTitle: "Edit Expense",
                        description: "Complete expense information",
                        reviewFields: "Review the required fields",
                        fields: {
                            date: "Date",
                            receipt: "Receipt",
                            payroll: "Payroll",
                            amount: "Amount",
                            reason: "Reason",
                        },
                        errors: {
                            cannotEdit: "Expense cannot be edited",
                            dateRequired: "The Date field is required.",
                            invalidValue: "Invalid value.",
                            receiptRequired: "The Receipt field is required.",
                            amountRequired: "The Amount field is required.",
                            amountEmpty: "Amount cannot be empty.",
                            invalidNumber: "Invalid number",
                            reasonRequired: "The Reason field is required.",
                            payrollCodeRequired: "The Payroll code is required.",
                        },
                        defaultSuccess: "Operation successful",
                    },
                },
                notifications: {
                    moveSuccess: "Expenses moved successfully.",
                    moveError: "No Driver Payroll was selected.",
                },
            },
            shipments: {
                tableTitle: "Payroll Shipments",
                columns: {
                    payrollCode: "Payroll #",
                    date: "Date",
                    dispatch: "Dispatch",
                    receipt: "Receipt",
                    product: "Product",
                    origin: "Origin",
                    destination: "Destination",
                    originWeight: "Origin Weight",
                    destinationWeight: "Destination Weight",
                    price: "Price",
                    payrollPrice: "Payroll Price",
                    total: "Total",
                    actions: "Actions",
                },
                summary: {
                    origin: "Origin:",
                    destination: "Destination:",
                    diff: "Diff:",
                    total: "Total:",
                },
                dialogs: {
                    moveShipments: {
                        title: "Confirm Move Shipments",
                        message: "Move all shipments to:",
                        confirmText: "Move",
                        payrollLabel: "Payroll",
                    },
                    delete: {
                        title: "Confirm Delete",
                        messageMany: "Are you sure you want to delete all selected Shipments?",
                        messageSingle:
                            "Are you sure you want to delete Shipment: {{dispatch}} - {{receipt}}?",
                        confirmText: "Delete",
                    },
                },
                notifications: {
                    moveSuccess: "Shipments moved successfully.",
                    moveError: "No Shipment Payroll was selected.",
                },
            },
            confirmations: {
                export: {
                    title: "Confirm Export",
                    message: "All Routes will be exported.",
                    confirmText: "Export",
                },
            },
            notifications: {
                statusChanged: "Driver Payroll #{{code}} marked as {{status}}",
                exportSuccess: "Spreadsheet exported successfully.",
                exportError: "Error exporting spreadsheet.",
            },
            fileName: "payroll.xlsx",
        },
    },
    es: {
        translation: {
            title: "Liquidación de Conductor",
            tabs: {
                shipments: "Envíos",
                expenses: "Gastos",
            },
            buttons: {
                add: "Agregar",
                export: "Exportar",
                edit: "Editar",
                delete: "Eliminar",
                move: "Mover",
                close: "Cerrar",
                addExpense: "Agregar Gasto",
                editExpense: "Editar Gasto",
            },
            payroll: {
                status: {
                    paid: "Pagado",
                    unpaid: "No Pagado",
                },
            },
            expenses: {
                sections: {
                    withReceipt: "Con Boleta",
                    withoutReceipt: "Sin Boleta",
                },
                tableTitle: "Gastos de Liquidación",
                columns: {
                    expenseCode: "Gasto #",
                    date: "Fecha",
                    receipt: "Boleta",
                    reason: "Razón",
                    amount: "Monto",
                    actions: "Acciones",
                },
                summary: {
                    total: "Total:",
                },
                dialogs: {
                    moveExpenses: {
                        title: "Confirmar Mover Gastos",
                        message: "Mover todos los gastos a:",
                        confirmText: "Mover",
                        payrollLabel: "Liquidación",
                    },
                    delete: {
                        title: "Confirmar Eliminación",
                        messageMany:
                            "¿Está seguro que desea eliminar todos los Gastos seleccionados?",
                        messageSingle:
                            "¿Está seguro que desea eliminar el Gasto: {{receipt}} - Monto: {{amount}}?",
                        confirmText: "Eliminar",
                    },
                    form: {
                        addTitle: "Agregar Gasto",
                        editTitle: "Editar Gasto",
                        description: "Completar datos del Gasto",
                        reviewFields: "Revise los campos requeridos",
                        fields: {
                            date: "Fecha",
                            receipt: "Recibo",
                            payroll: "Liquidación",
                            amount: "Monto",
                            reason: "Motivo",
                        },
                        errors: {
                            cannotEdit: "Gasto no puede editarse",
                            dateRequired: "El campo Fecha es obligatorio.",
                            invalidValue: "Valor inválido.",
                            receiptRequired: "El campo Recibo es obligatorio.",
                            amountRequired: "El campo Monto es obligatorio.",
                            amountEmpty: "Monto no puede estar vacío.",
                            invalidNumber: "Número inválido",
                            reasonRequired: "El campo Motivo es obligatorio.",
                            payrollCodeRequired: "El código de Liquidación es obligatorio.",
                        },
                        defaultSuccess: "Operación exitosa",
                    },
                },
                notifications: {
                    moveSuccess: "Gastos movidos exitosamente.",
                    moveError: "No se seleccionó ninguna Liquidación.",
                },
            },
            shipments: {
                tableTitle: "Envíos de Liquidación",
                columns: {
                    payrollCode: "Liquidación #",
                    date: "Fecha",
                    dispatch: "Despacho",
                    receipt: "Recibo",
                    product: "Producto",
                    origin: "Origen",
                    destination: "Destino",
                    originWeight: "Peso Origen",
                    destinationWeight: "Peso Destino",
                    price: "Precio",
                    payrollPrice: "Precio Liquidación",
                    total: "Total",
                    actions: "Acciones",
                },
                summary: {
                    origin: "Origen:",
                    destination: "Destino:",
                    diff: "Diferencia:",
                    total: "Total:",
                },
                dialogs: {
                    moveShipments: {
                        title: "Confirmar Mover Envíos",
                        message: "Mover todos los envíos a:",
                        confirmText: "Mover",
                        payrollLabel: "Liquidación",
                    },
                    delete: {
                        title: "Confirmar Eliminación",
                        messageMany:
                            "¿Está seguro que desea eliminar todos los Envíos seleccionados?",
                        messageSingle:
                            "¿Está seguro que desea eliminar el Envío: {{dispatch}} - {{receipt}}?",
                        confirmText: "Eliminar",
                    },
                },
                notifications: {
                    moveSuccess: "Envíos movidos exitosamente.",
                    moveError: "No se seleccionó ninguna Liquidación de Envío.",
                },
            },
            confirmations: {
                export: {
                    title: "Confirmar Exportación",
                    message: "Todas las rutas serán exportadas.",
                    confirmText: "Exportar",
                },
            },
            notifications: {
                statusChanged: "Liquidación de conductor #{{code}} marcada como {{status}}",
                exportSuccess: "Planilla exportada exitosamente.",
                exportError: "Error al exportar planilla",
            },
            fileName: "liquidacion.xlsx",
        },
    },
};

// Add resources to i18n
const driverPayrollDetailTranslationNamespace = "driverPayrollDetail";

appLanguages.forEach((lang) => {
    // Add driver payroll detail translations
    if (!i18n.hasResourceBundle(lang, driverPayrollDetailTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            driverPayrollDetailTranslationNamespace,
            driverPayrollDetailResources[lang].translation,
        );
    }
});

export { driverPayrollDetailTranslationNamespace };
