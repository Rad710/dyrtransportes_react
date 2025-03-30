import i18n, { appLanguages } from "@/utils/i18n";

// Route translations
const routeResources = {
    en: {
        translation: {
            title: "Prices",
            buttons: {
                add: "Add",
                export: "Export",
            },
            exportDialog: {
                title: "Confirm Export",
                message: "All Routes will be exported.",
                confirmText: "Export",
            },
            notifications: {
                exportSuccess: "Spreadsheet exported successfully.",
                exportError: "Error exporting spreadsheet.",
            },
            fileName: "price_list.xlsx",
            tabs: {
                routes: "Prices",
                products: "Products",
            },
            dataTable: {
                tableTitle: "Routes",
                columns: {
                    code: "Code",
                    origin: "Origin",
                    destination: "Destination",
                    price: "Price",
                    payrollPrice: "Payroll Price",
                    modifiedBy: "Modified by",
                    actions: "Actions",
                },
                actions: {
                    edit: "Edit",
                    delete: "Delete",
                },
                confirmDelete: {
                    title: "Confirm Delete",
                    messageMany: "Are you sure you want to delete all selected Routes?",
                    messageSingle: "Are you sure you want to delete Route:",
                    confirmText: "Delete",
                },
            },
            formDialog: {
                add: "Add Route",
                edit: "Edit Route",
                close: "Close",
                description: "Complete route information",
                reviewFields: "Review required fields",
                cannotEdit: "Route cannot be edited",
                fields: {
                    origin: "Origin",
                    destination: "Destination",
                    price: "Price (no VAT: {{priceNoVat}})",
                    payrollPrice: "Payroll Price",
                },
                validation: {
                    invalidValue: "Invalid value.",
                    fieldRequired: "The {{field}} field is required.",
                    fieldEmpty: "The {{field}} field cannot be empty.",
                    invalidRouteCode: "Invalid Route Code",
                    invalidNumber: "Invalid number",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Precios",
            buttons: {
                add: "Agregar",
                export: "Exportar",
            },
            exportDialog: {
                title: "Confirmar Exportación",
                message: "Se exportarán todas las rutas.",
                confirmText: "Exportar",
            },
            notifications: {
                exportSuccess: "Planilla exportada exitosamente.",
                exportError: "Error al exportar planilla.",
            },
            fileName: "lista_de_precios.xlsx",
            tabs: {
                routes: "Precios",
                products: "Productos",
            },
            dataTable: {
                tableTitle: "Rutas",
                columns: {
                    code: "Código",
                    origin: "Origen",
                    destination: "Destino",
                    price: "Precio",
                    payrollPrice: "Precio de Nómina",
                    modifiedBy: "Modificado por",
                    actions: "Acciones",
                },
                actions: {
                    edit: "Editar",
                    delete: "Eliminar",
                },
                confirmDelete: {
                    title: "Confirmar Eliminación",
                    messageMany: "¿Está seguro que desea eliminar todas las Rutas seleccionadas?",
                    messageSingle: "¿Está seguro que desea eliminar la Ruta:",
                    confirmText: "Eliminar",
                },
            },
            formDialog: {
                add: "Agregar Ruta",
                edit: "Editar Ruta",
                close: "Cerrar",
                description: "Completar datos de la Ruta",
                reviewFields: "Revise los campos requeridos",
                cannotEdit: "Ruta no puede editarse",
                fields: {
                    origin: "Origen",
                    destination: "Destino",
                    price: "Precio (sin IVA: {{priceNoVat}})",
                    payrollPrice: "Precio Liquidación",
                },
                validation: {
                    invalidValue: "Valor inválido.",
                    fieldRequired: "El campo {{field}} es obligatorio.",
                    fieldEmpty: "El campo {{field}} no puede estar vacío.",
                    invalidRouteCode: "Código Ruta inválido",
                    invalidNumber: "Número inválido",
                },
            },
        },
    },
};

// Product translations
const productResources = {
    en: {
        translation: {
            title: "Products",
            buttons: {
                add: "Add",
                export: "Export",
            },
            exportDialog: {
                title: "Confirm Export",
                message: "All products will be exported.",
                confirmText: "Export",
            },
            notifications: {
                exportSuccess: "Spreadsheet exported successfully.",
                exportError: "Error exporting spreadsheet.",
            },
            fileName: "product_list.xlsx",
            dataTable: {
                tableTitle: "Products",
                columns: {
                    code: "Code",
                    productName: "Product Name",
                    modifiedBy: "Modified by",
                    actions: "Actions",
                },
                actions: {
                    edit: "Edit",
                    delete: "Delete",
                },
                confirmDelete: {
                    title: "Confirm Delete",
                    messageMany: "Are you sure you want to delete all selected Products?",
                    messageSingle: "Are you sure you want to delete Product:",
                    confirmText: "Delete",
                },
            },
            formDialog: {
                add: "Add Product",
                edit: "Edit Product",
                close: "Close",
                description: "Complete product information",
                reviewFields: "Review required fields",
                cannotEdit: "Product cannot be edited",
                fields: {
                    productName: "Product Name",
                },
                validation: {
                    invalidValue: "Invalid value.",
                    fieldRequired: "The {{field}} field is required.",
                    fieldEmpty: "The {{field}} field cannot be empty.",
                    invalidProductCode: "Invalid Product Code",
                },
            },
        },
    },
    es: {
        translation: {
            title: "Productos",
            buttons: {
                add: "Agregar",
                export: "Exportar",
            },
            exportDialog: {
                title: "Confirmar Exportación",
                message: "Se exportarán todos los productos.",
                confirmText: "Exportar",
            },
            notifications: {
                exportSuccess: "Planilla exportada exitosamente.",
                exportError: "Error al exportar planilla.",
            },
            fileName: "lista_de_productos.xlsx",
            dataTable: {
                tableTitle: "Productos",
                columns: {
                    code: "Código",
                    productName: "Nombre del Producto",
                    modifiedBy: "Modificado por",
                    actions: "Acciones",
                },
                actions: {
                    edit: "Editar",
                    delete: "Eliminar",
                },
                confirmDelete: {
                    title: "Confirmar Eliminación",
                    messageMany:
                        "¿Está seguro que desea eliminar todos los Productos seleccionados?",
                    messageSingle: "¿Está seguro que desea eliminar el Producto:",
                    confirmText: "Eliminar",
                },
            },
            formDialog: {
                add: "Agregar Producto",
                edit: "Editar Producto",
                close: "Cerrar",
                description: "Completar datos del Producto",
                reviewFields: "Revise los campos requeridos",
                cannotEdit: "Producto no puede editarse",
                fields: {
                    productName: "Nombre del Producto",
                },
                validation: {
                    invalidValue: "Valor inválido.",
                    fieldRequired: "El campo {{field}} es obligatorio.",
                    fieldEmpty: "El campo {{field}} no puede estar vacío.",
                    invalidProductCode: "Código Producto inválido",
                },
            },
        },
    },
};

// Add resources to i18n
const routeTranslationNamespace = "route";
const productTranslationNamespace = "product";

appLanguages.forEach((lang) => {
    // Add route translations
    if (!i18n.hasResourceBundle(lang, routeTranslationNamespace)) {
        i18n.addResourceBundle(lang, routeTranslationNamespace, routeResources[lang].translation);
    }

    // Add product translations
    if (!i18n.hasResourceBundle(lang, productTranslationNamespace)) {
        i18n.addResourceBundle(
            lang,
            productTranslationNamespace,
            productResources[lang].translation
        );
    }
});

export { routeTranslationNamespace, productTranslationNamespace };
