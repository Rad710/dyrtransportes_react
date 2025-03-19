import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            // ShipmentPayrollYearList translations
            title: "Payroll List",
            subtitle: "Payroll List",
            buttons: {
                add: "Add",
                export: "Export",
                delete: "Delete",
            },
            tooltips: {
                selectPayrollToExport: "Select payrolls to export",
                selectPayrollsToDelete: "Select payrolls to delete",
            },
            createDialog: {
                title: "Confirm Creation",
                message: "A new payroll will be created.",
                confirmText: "Create",
            },
            exportDialog: {
                title: "Confirm Export",
                message: "All payrolls for the year will be exported.",
                confirmText: "Export",
                messageSelected: "Selected payrolls will be exported.",
            },
            deleteDialog: {
                title: "Confirm Deletion",
                message: "{{count}} payroll(s) will be deleted.",
                confirmText: "Delete",
            },
            notifications: {
                exportSuccess: "Spreadsheet exported successfully.",
                exportError: "Error exporting spreadsheet.",
                collectionStatus: "Payroll #{{code}} marked as {{status}}",
                operationSuccess: "Operation successful",
            },
            accessibility: {
                selectYear: "Select year",
                selectPayroll: "Select payroll",
            },
            fileName: "payroll_list.xlsx",
            // ShipmentPayrollList specific translations
            yearList: "Payroll List for {{year}}",
            collectionStatus: {
                collected: "collected",
                notCollected: "not collected",
            },
            switch: {
                collected: "Collected",
                uncollected: "Not collected",
            },
            select: "Select",
            // ShipmentPayrollFormDialog translations
            formDialog: {
                add: "Add Payroll",
                edit: "Edit Payroll",
                close: "Close",
                descriptionAdd: "Select a date for the new Payroll",
                descriptionEdit: "Select a date for the Payroll to edit",
                reviewFields: "Review required fields",
                cannotEdit: "Payroll cannot be edited",
                alreadyExists: "Payroll already exists",
                fields: {
                    date: "Payroll Date",
                },
                validation: {
                    invalidPayrollCode: "Invalid Payroll Code",
                    dateRequired: "A date is required to create the payroll.",
                },
            },
        },
    },
    es: {
        translation: {
            // ShipmentPayrollYearList translations
            title: "Lista de Planillas",
            subtitle: "Lista de Planillas",
            buttons: {
                add: "Agregar",
                export: "Exportar",
                delete: "Eliminar",
            },
            tooltips: {
                selectPayrollToExport: "Seleccione planillas para exportar",
                selectPayrollsToDelete: "Seleccione planillas para eliminar",
            },
            createDialog: {
                title: "Confirmar Creación",
                message: "Se creará una nueva planilla.",
                confirmText: "Crear",
            },
            exportDialog: {
                title: "Confirmar Exportación",
                message: "Se exportarán todas las Cobranzas del año.",
                confirmText: "Exportar",
                messageSelected: "Se exportarán todas las Cobranzas seleccionadas.",
            },
            deleteDialog: {
                title: "Confirmar Eliminación",
                message: "Se eliminarán {{count}} planilla(s) seleccionada(s).",
                confirmText: "Eliminar",
            },
            notifications: {
                exportSuccess: "Planilla exportada exitosamente.",
                exportError: "Error al exportar planilla.",
                collectionStatus: "Planilla #{{code}} marcada como {{status}}",
                operationSuccess: "Operación exitosa",
            },
            accessibility: {
                selectYear: "Seleccionar año",
                selectPayroll: "Seleccionar planilla",
            },
            fileName: "lista_de_planillas.xlsx",
            // ShipmentPayrollList specific translations
            yearList: "Lista de Planillas de {{year}}",
            collectionStatus: {
                collected: "cobrada",
                notCollected: "no cobrada",
            },
            switch: {
                collected: "Cobrado",
                uncollected: "No cobrado",
            },
            select: "Seleccionar",
            // ShipmentPayrollFormDialog translations
            formDialog: {
                add: "Agregar Planilla",
                edit: "Editar Planilla",
                close: "Cerrar",
                descriptionAdd: "Seleccione una fecha para la nueva Planilla",
                descriptionEdit: "Seleccione una fecha para la Planilla a editar",
                reviewFields: "Revise los campos requeridos",
                cannotEdit: "Planilla no puede editarse",
                alreadyExists: "Planilla ya existe",
                fields: {
                    date: "Fecha de Planilla",
                },
                validation: {
                    invalidPayrollCode: "Código Planilla inválido",
                    dateRequired: "Para crear la planilla se necesita de una fecha.",
                },
            },
        },
    },
};

const shipmentPayrollTranslationNamespace = "shipmentPayroll";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, shipmentPayrollTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            shipmentPayrollTranslationNamespace,
            resources[lang].translation,
        );
    }
});

export { shipmentPayrollTranslationNamespace };
