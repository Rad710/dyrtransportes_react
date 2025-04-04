import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            title: "Log in",
            email: "Email",
            emailPlaceholder: "your@email.com",
            password: "Password",
            passwordPlaceholder: "••••••",
            rememberMe: "Remember me",
            loginButton: "Log in",
            or: "or",
            noAccount: "Don't have an account?",
            signUp: "Sign up",
            errors: {
                invalidCredentials: "Invalid email or password",
                emailRequired: "Please enter a valid email address.",
                passwordRequired:
                    "Password must be at least 8 characters and include at least one number, one lowercase letter, and one uppercase letter",
            },
        },
    },
    es: {
        translation: {
            title: "Iniciar sesión",
            email: "Correo electrónico",
            emailPlaceholder: "tu@email.com",
            password: "Contraseña",
            passwordPlaceholder: "••••••",
            rememberMe: "Recordarme",
            loginButton: "Iniciar sesión",
            or: "o",
            noAccount: "¿No tienes una cuenta?",
            signUp: "Registrarse",
            errors: {
                invalidCredentials: "Correo electrónico o contraseña inválidos",
                emailRequired: "Por favor, introduce un correo electrónico válido.",
                passwordRequired:
                    "La contraseña debe tener al menos 8 caracteres e incluir al menos un número, una letra minúscula y una letra mayúscula.",
            },
        },
    },
} as const;

const loginTranslationNamespace = "login";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, loginTranslationNamespace)) {
        i18n.addResourceBundle(lang, loginTranslationNamespace, resources[lang].translation);
    }
});

export { loginTranslationNamespace };
