import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            title: "Dinatran",
            searchControls: {
                startDate: "Start Date",
                endDate: "End Date",
                search: "Search",
                export: "Export",
            },
            exportDialog: {
                title: "Confirm Export",
                message: "The report will be exported for {{startDate}} - {{endDate}}",
                confirmText: "Confirm",
            },
            notifications: {
                exportSuccess: "Report exported successfully.",
                exportError: "Error exporting report.",
            },
            fileName: "dinatran.xlsx",
            dataTable: {
                tableTitle: "DINATRAN",
                columns: {
                    truckPlate: "Plate",
                    shipments: "Trips",
                    originWeight: "Origin Kg.",
                    destinationWeight: "Destination Kg.",
                    difference: "Diff",
                    shipmentPayroll: "Freight (Gs.)",
                    driverPayroll: "Settlements (Gs.)",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Dinatran",
            searchControls: {
                startDate: "Fecha Inicio",
                endDate: "Fecha Fin",
                search: "Buscar",
                export: "Exportar",
            },
            exportDialog: {
                title: "Confirmar Exportación",
                message: "Se exportará el informe {{startDate}} - {{endDate}}",
                confirmText: "Confirmar",
            },
            notifications: {
                exportSuccess: "Informe exportado exitosamente.",
                exportError: "Error al exportar Informe.",
            },
            fileName: "dinatran.xlsx",
            dataTable: {
                tableTitle: "DINATRAN",
                columns: {
                    truckPlate: "Chapa",
                    shipments: "Viajes",
                    originWeight: "Kg. Origen",
                    destinationWeight: "Kg. Destino",
                    difference: "Dif",
                    shipmentPayroll: "Fletes (Gs.)",
                    driverPayroll: "Liquidaciones (Gs.)",
                },
            },
        },
    },
};

const dinatranTranslationNamespace = "dinatran";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, dinatranTranslationNamespace)) {
        i18n.addResourceBundle(lang, dinatranTranslationNamespace, resources[lang].translation);
    }
});

export { dinatranTranslationNamespace };
