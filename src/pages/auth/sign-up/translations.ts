import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            title: "Sign up",
            fullName: "Full name",
            fullNamePlaceholder: "Jon Snow",
            email: "Email",
            emailPlaceholder: "your@email.com",
            password: "Password",
            passwordPlaceholder: "••••••",
            signUpButton: "Sign up",
            errors: {
                creatingAccount: "Error creating account",
                nameRequired: "Please enter your full name.",
                emailRequired: "Please enter a valid email address.",
                passwordRequired:
                    "Password must be at least 8 characters and include at least one number, one lowercase letter, and one uppercase letter",
            },
        },
    },
    es: {
        translation: {
            title: "Registrarse",
            fullName: "Nombre completo",
            fullNamePlaceholder: "Jon Snow",
            email: "Correo electrónico",
            emailPlaceholder: "tu@email.com",
            password: "Contraseña",
            passwordPlaceholder: "••••••",
            signUpButton: "Registrarse",
            errors: {
                creatingAccount: "Error al crear la cuenta",
                nameRequired: "Por favor, introduce tu nombre completo.",
                emailRequired: "Por favor, introduce un correo electrónico válido.",
                passwordRequired:
                    "La contraseña debe tener al menos 8 caracteres e incluir al menos un número, una letra minúscula y una letra mayúscula.",
            },
        },
    },
} as const;

const signUpTranslationNamespace = "signup";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, signUpTranslationNamespace)) {
        i18n.addResourceBundle(lang, signUpTranslationNamespace, resources[lang].translation);
    }
});

export { signUpTranslationNamespace };
