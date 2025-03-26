import i18n, { appLanguages } from "@/utils/i18n";

// Define translation resources
const resources = {
    en: {
        translation: {
            title: "Statistics",
            tabs: {
                statistics: "Statistics",
            },
            statistics: {
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
                        totalExpensesAmountReceipt: "Total Expenses Amount Receipt",
                        totalExpensesAmountNoReceipt: "Total Expenses Amount No Receipt",
                        totalExpensesAmount: "Total Expenses Amount",
                    },
                },
            },
        },
    },
    es: {
        translation: {
            title: "Estadísticas",
            tabs: {
                statistics: "Estadísticas",
            },
            statistics: {
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
                        totalExpensesAmountReceipt: "Total Gastos Facturados (Gs.)",
                        totalExpensesAmountNoReceipt: "Total Gastos No Facturados (Gs.)",
                        totalExpensesAmount: "Total Gastos (Gs.)",
                    },
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
