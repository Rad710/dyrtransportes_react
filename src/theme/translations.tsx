import i18n, { appLanguages } from "@/utils/i18n";

// Define translation resources
const resources = {
    en: {
        translation: {
            colorMode: {
                system: "System",
                light: "Light",
                dark: "Dark",
            },
        },
    },
    es: {
        translation: {
            colorMode: {
                system: "Sistema",
                light: "Claro",
                dark: "Oscuro",
            },
        },
    },
};

// Create a namespace for the Home component translations
export const themeTranslationNamespace = "theme";

// Register translations with i18n
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, themeTranslationNamespace)) {
        i18n.addResourceBundle(lang, themeTranslationNamespace, resources[lang].translation);
    }
});
