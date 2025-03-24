import i18n, { appLanguages } from "@/utils/i18n";

const shipmentPayrollResources = {
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

const shipmentResources = {
    en: {
        translation: {
            title: "Shipments",
            shipmentPayroll: {
                title: "Shipments List",
                datePrefix: "from",
                collectionStatus: {
                    collected: "Collected",
                    notCollected: "Not collected",
                },
                buttons: {
                    add: "Add",
                    export: "Export",
                },
                exportDialog: {
                    title: "Confirm Export",
                    message: "The shipment data will be exported.",
                    confirmText: "Export",
                    successMessage: "Spreadsheet exported successfully.",
                    errorMessage: "Error exporting spreadsheet.",
                },
                notification: {
                    markedAsCollected: "Payroll #{{code}} marked as collected",
                    markedAsNotCollected: "Payroll #{{code}} marked as not collected",
                },
            },
            dataTable: {
                tableTitle: "Shipments",
                columns: {
                    shipment_date: "Date",
                    driver_name: "Driver",
                    truck_plate: "Truck Plate",
                    product_name: "Product",
                    origin: "Origin",
                    destination: "Destination",
                    dispatch_code: "Dispatch",
                    receipt_code: "Receipt",
                    origin_weight: "Origin Weight",
                    destination_weight: "Destination Weight",
                    price: "Price",
                    total: "Total",
                    actions: "Actions",
                },
                actions: {
                    edit: "Edit",
                    delete: "Delete",
                    move: "Move",
                },
                confirmDelete: {
                    title: "Confirm Delete",
                    messageMany: "Are you sure you want to delete all selected Shipments?",
                    messageSingle: "Are you sure you want to delete Shipment:",
                },
                subtotal: "Subtotal",
                total: "TOTAL",
                noDataFound: "No data found.",
            },
            moveDialog: {
                title: "Confirm Move Shipments",
                message: "Move all shipments to:",
                confirmText: "Move",
                payrollLabel: "Payroll",
            },
            notifications: {
                moveSuccess: "Shipments moved successfully.",
                moveError: "No Shipment Payroll was selected.",
                deleteSuccess: "Shipment deleted successfully.",
            },
            formDialog: {
                add: "Add Shipment",
                edit: "Edit Shipment",
                close: "Close",
                description: "Complete shipment information",
                reviewFields: "Please review required fields",
                cannotEdit: "Shipment cannot be edited",
                successMessage: "Operation successful",
                fields: {
                    shipment_date: "Date",
                    driver: "Driver",
                    truck_plate: "Truck Plate",
                    payroll: "Payroll",
                    driver_payroll: "Driver Payroll",
                    product: "Product",
                    origin: "Origin",
                    destination: "Destination",
                    dispatch_code: "Dispatch",
                    receipt_code: "Receipt",
                    price: "Price",
                    payroll_price: "Payroll Price",
                    origin_weight: "Origin Weight",
                    destination_weight: "Destination Weight",
                },
                validation: {
                    invalidValue: "Invalid value.",
                    fieldRequired: "The {{field}} field is required.",
                    fieldEmpty: "The {{field}} field cannot be empty.",
                    invalidNumber: "Invalid number",
                    invalidShipmentCode: "Invalid Shipment Code",
                    invalidPayrollCode: "Invalid Payroll Code",
                    noDecimals: "The {{field}} field cannot have decimal numbers.",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Cargas",
            shipmentPayroll: {
                title: "Lista de Cargas",
                datePrefix: "del",
                collectionStatus: {
                    collected: "Cobrado",
                    notCollected: "No cobrado",
                },
                buttons: {
                    add: "Agregar",
                    export: "Exportar",
                },
                exportDialog: {
                    title: "Confirmar Exportación",
                    message: "Se exportarán los datos de carga.",
                    confirmText: "Exportar",
                    successMessage: "Planilla exportada exitosamente.",
                    errorMessage: "Error al exportar planilla.",
                },
                notification: {
                    markedAsCollected: "Planilla #{{code}} marcada como cobrada",
                    markedAsNotCollected: "Planilla #{{code}} marcada como no cobrada",
                },
            },
            dataTable: {
                tableTitle: "Cargas",
                columns: {
                    shipment_date: "Fecha",
                    driver_name: "Chofer",
                    truck_plate: "Placa del Camión",
                    product_name: "Producto",
                    origin: "Origen",
                    destination: "Destino",
                    dispatch_code: "Despacho",
                    receipt_code: "Recibo",
                    origin_weight: "Peso de Origen",
                    destination_weight: "Peso de Destino",
                    price: "Precio",
                    total: "Total",
                    actions: "Acciones",
                },
                actions: {
                    edit: "Editar",
                    delete: "Eliminar",
                    move: "Mover",
                },
                confirmDelete: {
                    title: "Confirmar Eliminación",
                    messageMany: "¿Está seguro que desea eliminar todos las Cargas seleccionados?",
                    messageSingle: "¿Está seguro que desea eliminar la Carga:",
                },
                subtotal: "Subtotal",
                total: "TOTAL",
                noDataFound: "No se encontraron datos.",
            },
            moveDialog: {
                title: "Confirmar Traslado de Cargas",
                message: "Mover todos las cargas a:",
                confirmText: "Mover",
                payrollLabel: "Planilla",
            },
            notifications: {
                moveSuccess: "Cargas movidas exitosamente.",
                moveError: "No se seleccionó ninguna Planilla de Cargas.",
                deleteSuccess: "Carga eliminado exitosamente.",
            },
            formDialog: {
                add: "Agregar Carga",
                edit: "Editar Carga",
                close: "Cerrar",
                description: "Completar datos de la Carga",
                reviewFields: "Revise los campos requeridos",
                cannotEdit: "Carga no puede editarse",
                successMessage: "Operación exitosa",
                fields: {
                    shipment_date: "Fecha",
                    driver: "Chofer",
                    truck_plate: "Chapa",
                    payroll: "Planilla",
                    driver_payroll: "Liquidación",
                    product: "Producto",
                    origin: "Origen",
                    destination: "Destino",
                    dispatch_code: "Remisión",
                    receipt_code: "Recepción",
                    price: "Precio",
                    payroll_price: "Precio Liquidación",
                    origin_weight: "Kg. Origen",
                    destination_weight: "Kg. Destino",
                },
                validation: {
                    invalidValue: "Valor inválido.",
                    fieldRequired: "El campo {{field}} es obligatorio.",
                    fieldEmpty: "El campo {{field}} no puede estar vacío.",
                    invalidNumber: "Número inválido",
                    invalidShipmentCode: "Código Carga inválido",
                    invalidPayrollCode: "Código Liquidación inválido",
                    noDecimals: "El campo {{field}} no puede tener números decimales.",
                },
            },
        },
    },
};

const shipmentPayrollTranslationNamespace = "shipmentPayroll";
const shipmentTranslationNamespace = "shipment";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, shipmentPayrollTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            shipmentPayrollTranslationNamespace,
            shipmentPayrollResources[lang].translation,
        );
    }

    if (!i18n.hasResourceBundle(lang, shipmentTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            shipmentTranslationNamespace,
            shipmentResources[lang].translation,
        );
    }
});

export { shipmentPayrollTranslationNamespace, shipmentTranslationNamespace };
