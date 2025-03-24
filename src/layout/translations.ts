import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            navigation: {
                shipmentPayrolls: "Shipment Payrolls",
                driverPayrolls: "Driver Payrolls",
                routes: "Routes",
                drivers: "Drivers",
            },
            userMenu: {
                openSettings: "Open settings",
                profile: "Profile",
                logout: "Logout",
            },
        },
    },
    es: {
        translation: {
            navigation: {
                shipmentPayrolls: "Cobranzas",
                driverPayrolls: "Liquidaciones",
                routes: "Precios y Productos",
                drivers: "Choferes",
            },
            userMenu: {
                openSettings: "Abrir configuración",
                profile: "Perfil",
                logout: "Cerrar sesión",
            },
        },
    },
};

const appBarTranslationNamespace = "appBar";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, appBarTranslationNamespace)) {
        i18n.addResourceBundle(lang, appBarTranslationNamespace, resources[lang].translation);
    }
});

export { appBarTranslationNamespace };
