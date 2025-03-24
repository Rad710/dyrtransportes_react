import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            title: "Drivers",
            tabs: {
                active: "Drivers List",
                deactivated: "Deactivated",
            },
            buttons: {
                add: "Add",
                export: "Export",
            },
            exportDialog: {
                title: "Confirm Export",
                message: "All active drivers will be exported.",
                confirmText: "Export",
            },
            notifications: {
                exportSuccess: "Spreadsheet exported successfully.",
                exportError: "Error exporting spreadsheet.",
            },
            fileName: "drivers_list.xlsx",
            dataTable: {
                tableTitle: "Drivers",
                columns: {
                    code: "Code",
                    id: "ID",
                    name: "Name",
                    surname: "Surname",
                    truckPlate: "Truck Plate",
                    trailerPlate: "Trailer Plate",
                    modifiedBy: "Modified by",
                    actions: "Actions",
                },
                actions: {
                    edit: "Edit",
                    delete: "Delete",
                    restore: "Restore",
                },
                confirmDelete: {
                    title: "Confirm Delete",
                    messageMany: "Are you sure you want to delete all selected Drivers?",
                    messageSingle: "Are you sure you want to delete Driver:",
                    confirmText: "Delete",
                },
                confirmRestore: {
                    title: "Confirm Restore",
                    message: "Are you sure you want to restore Driver:",
                    confirmText: "Restore",
                },
            },
            formDialog: {
                add: "Add Driver",
                edit: "Edit Driver",
                close: "Close",
                description: "Complete driver information",
                reviewFields: "Please review required fields",
                cannotEdit: "Driver cannot be edited",
                fields: {
                    driverId: "ID",
                    name: "Name",
                    surname: "Surname",
                    truckPlate: "Truck Plate",
                    trailerPlate: "Trailer Plate",
                },
                validation: {
                    invalidValue: "Invalid value.",
                    fieldRequired: "The {{field}} field is required.",
                    fieldEmpty: "The {{field}} field cannot be empty.",
                    invalidDriverCode: "Invalid Driver Code",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Choferes",
            tabs: {
                active: "Nómina",
                deactivated: "Deshabilitados",
            },
            buttons: {
                add: "Agregar",
                export: "Exportar",
            },
            exportDialog: {
                title: "Confirmar Exportación",
                message: "Se exportarán todos los choferes activos.",
                confirmText: "Exportar",
            },
            notifications: {
                exportSuccess: "Planilla exportada exitosamente.",
                exportError: "Error al exportar planilla.",
            },
            fileName: "nomina_de_choferes.xlsx",
            dataTable: {
                tableTitle: "Choferes",
                columns: {
                    code: "Código",
                    id: "CI",
                    name: "Nombre",
                    surname: "Apellido",
                    truckPlate: "Placa del Camión",
                    trailerPlate: "Placa de la Carreta",
                    modifiedBy: "Modificado por",
                    actions: "Acciones",
                },
                actions: {
                    edit: "Editar",
                    delete: "Eliminar",
                    restore: "Restaurar",
                },
                confirmDelete: {
                    title: "Confirmar Eliminación",
                    messageMany:
                        "¿Está seguro que desea desactivar todos los Choferes seleccionados?",
                    messageSingle: "¿Está seguro que desea desactivar al Chofer:",
                    confirmText: "Eliminar",
                },
                confirmRestore: {
                    title: "Confirmar Restauración",
                    message: "¿Está seguro que desea restaurar al Chofer:",
                    confirmText: "Restaurar",
                },
            },
            formDialog: {
                add: "Agregar Chofer",
                edit: "Editar Chofer",
                close: "Cerrar",
                description: "Completar datos del Chofer",
                reviewFields: "Revise los campos requeridos",
                cannotEdit: "Chofer no puede editarse",
                fields: {
                    driverId: "Cédula",
                    name: "Nombre",
                    surname: "Apellido",
                    truckPlate: "Placa Camión",
                    trailerPlate: "Placa Carreta",
                },
                validation: {
                    invalidValue: "Valor inválido.",
                    fieldRequired: "El campo {{field}} es obligatorio.",
                    fieldEmpty: "El campo {{field}} no puede estar vacío.",
                    invalidDriverCode: "Código Chofer inválido",
                },
            },
        },
    },
};

const driverTranslationNamespace = "driver";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, driverTranslationNamespace)) {
        i18n.addResourceBundle(lang, driverTranslationNamespace, resources[lang].translation);
    }
});

export { driverTranslationNamespace };
