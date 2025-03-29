import i18n, { appLanguages } from "@/utils/i18n";

// Define translation resources
const resources = {
    en: {
        translation: {
            statistics: {
                tabs: "Statistics",
                searchControls: {
                    startDate: "Start Date",
                    endDate: "End Date",
                    search: "Search",
                    export: "Export",
                },
                exportDialog: {
                    title: "Confirm Export",
                    message: "The report will be exported for {{startDate}} - {{endDate}}",
                    confirmText: "Confirm Export",
                },
                notifications: {
                    exportSuccess: "Report exported successfully.",
                    exportError: "Error exporting report.",
                },
                fileName: "statistics.xlsx",
                dataTable: {
                    tableTitle: "Statistics",
                    columns: {
                        driverCode: "Driver Code",
                        driverName: "Driver",
                        shipments: "Shipments",
                        totalOriginWeight: "Total Origin Weight",
                        totalDestinationWeight: "Total Destination Weight",
                        diff: "Diff",
                        totalShipmentPayroll: "Total Shipment Payroll",
                        totalDriverPayroll: "Total Driver Payroll",
                        totalExpensesAmountReceipt: "Expenses Receipt",
                        totalExpensesAmountNoReceipt: "Expenses No Receipt",
                        totalExpensesAmount: "Total Expenses",
                        totalLosses: "Losses",
                        totalProfits: "Profits",
                    },
                },
            },
            profits: {
                tabs: "Profits",
                searchControls: {
                    startDate: "Start Date",
                    endDate: "End Date",
                    search: "Search",
                    export: "Export",
                },
                exportDialog: {
                    title: "Confirm Export",
                    message: "The report will be exported for {{startDate}} - {{endDate}}",
                    confirmText: "Confirm Export",
                },
                notifications: {
                    exportSuccess: "Report exported successfully.",
                    exportError: "Error exporting report.",
                },
                fileName: "profits.xlsx",
                loading: "Loading...",
                chart: {
                    title: "Profit Summary from {{startDate}} to {{endDate}}",
                    labels: {
                        summary: "Summary",
                        income: "Income",
                        expenses: "Expenses",
                        losses: "Losses",
                        profits: "Profits",
                        totalShipments: "Total Shipments",
                    },
                    totals: {
                        income: "Total Income:",
                        expenses: "Total Expenses:",
                        losses: "Total Losses:",
                        profits: "Total Profits:",
                        shipments: "Total Shipments:",
                    },
                },
            },
            database: {
                tabs: "Database",
                backup: {
                    title: "Create a backup to safeguard your data",
                    button: {
                        default: "Download Backup",
                        loading: "Creating backup...",
                    },
                    notifications: {
                        success: "Database backup created successfully.",
                        error: "Error creating database backup.",
                    },
                    fileName: "database_backup.sql",
                },
            },
        },
    },
    es: {
        translation: {
            statistics: {
                tabs: "Estadísticas",
                searchControls: {
                    startDate: "Fecha Inicio",
                    endDate: "Fecha Fin",
                    search: "Buscar",
                    export: "Exportar",
                },
                exportDialog: {
                    title: "Confirmar Exportación",
                    message: "Se exportará el informe {{startDate}} - {{endDate}}",
                    confirmText: "Confirmar Exportación",
                },
                notifications: {
                    exportSuccess: "Informe exportado exitosamente.",
                    exportError: "Error al exportar Informe.",
                },
                fileName: "estadisticas.xlsx",
                dataTable: {
                    tableTitle: "Estadísticas",
                    columns: {
                        driverCode: "Código",
                        driverName: "Chofer",
                        shipments: "Viajes",
                        totalOriginWeight: "Total Kg. Origen",
                        totalDestinationWeight: "Total Kg. Destino",
                        diff: "Dif.",
                        totalShipmentPayroll: "Total Fletes (Gs.)",
                        totalDriverPayroll: "Total Liquidaciones (Gs.)",
                        totalExpensesAmountReceipt: "Gastos Facturados (Gs.)",
                        totalExpensesAmountNoReceipt: "Gastos No Facturados (Gs.)",
                        totalExpensesAmount: "Gastos (Gs.)",
                        totalLosses: "Pérdidas (Gs.)",
                        totalProfits: "Ganancias (Gs.)",
                    },
                },
            },
            profits: {
                tabs: "Ganancias",
                searchControls: {
                    startDate: "Fecha Inicio",
                    endDate: "Fecha Fin",
                    search: "Buscar",
                    export: "Exportar",
                },
                exportDialog: {
                    title: "Confirmar Exportación",
                    message: "Se exportará el informe {{startDate}} - {{endDate}}",
                    confirmText: "Confirmar Exportación",
                },
                notifications: {
                    exportSuccess: "Informe exportado exitosamente.",
                    exportError: "Error al exportar Informe.",
                },
                fileName: "ganancias.xlsx",
                loading: "Cargando...",
                chart: {
                    title: "Resumen de Ganancias de {{startDate}} hasta {{endDate}}",
                    labels: {
                        summary: "Resumen",
                        income: "Ingresos",
                        expenses: "Egresos",
                        losses: "Pérdidas",
                        profits: "Ganancias",
                        totalShipments: "Total Viajes",
                    },
                    totals: {
                        income: "Total Ingresos:",
                        expenses: "Total Egresos:",
                        losses: "Total Pérdidas:",
                        profits: "Total Ganancias:",
                        shipments: "Total Viajes:",
                    },
                },
            },
            database: {
                tabs: "Base de Datos",
                backup: {
                    title: "Crea una Copia de Seguridad para respaldar los datos",
                    button: {
                        default: "Descargar Copia",
                        loading: "Creando copia...",
                    },
                    notifications: {
                        success: "Copia de seguridad creada exitosamente.",
                        error: "Error al crear copia de seguridad.",
                    },
                    fileName: "copia_seguridad.sql",
                },
            },
        },
    },
};

// Create a namespace for the Home component translations
export const homeTranslationNamespace = "home";

// Register translations with i18n
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, homeTranslationNamespace)) {
        i18n.addResourceBundle(lang, homeTranslationNamespace, resources[lang].translation);
    }
});
