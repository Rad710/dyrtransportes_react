import i18n, { appLanguages } from "@/utils/i18n";

const resources = {
    en: {
        translation: {
            title: "Edit Profile",
            fields: {
                name: {
                    label: "Full name",
                    placeholder: "Jon Snow",
                },
                email: {
                    label: "Email",
                    placeholder: "your@email.com",
                },
                currentPassword: {
                    label: "Current Password",
                    placeholder: "••••••",
                },
                newPassword: {
                    label: "New Password",
                    placeholder: "••••••",
                },
            },
            passwordNote: "Leave password fields blank if you don't want to change your password.",
            buttons: {
                save: "Save Changes",
            },
            validation: {
                nameRequired: "Name is required",
                emailInvalid: "Please enter a valid email address",
                currentPasswordRequired: "Current password is required to set a new password",
                passwordComplexity:
                    "Password must be at least 8 characters and include at least one number, one lowercase letter, and one uppercase letter",
            },
            errors: {
                generic: "Error",
            },
        },
    },
    es: {
        translation: {
            title: "Editar Perfil",
            fields: {
                name: {
                    label: "Nombre completo",
                    placeholder: "Jon Snow",
                },
                email: {
                    label: "Correo electrónico",
                    placeholder: "tu@email.com",
                },
                currentPassword: {
                    label: "Contraseña actual",
                    placeholder: "••••••",
                },
                newPassword: {
                    label: "Nueva contraseña",
                    placeholder: "••••••",
                },
            },
            passwordNote: "Deje los campos de contraseña en blanco si no desea cambiarla.",
            buttons: {
                save: "Guardar Cambios",
            },
            validation: {
                nameRequired: "El nombre es obligatorio",
                emailInvalid: "Por favor, introduzca una dirección de correo electrónico válida",
                currentPasswordRequired:
                    "Se requiere la contraseña actual para establecer una nueva contraseña",
                passwordComplexity:
                    "La contraseña debe tener al menos 8 caracteres e incluir al menos un número, una letra minúscula y una letra mayúscula",
            },
            errors: {
                generic: "Error",
            },
        },
    },
};

const userProfileTranslationNamespace = "userProfile";
appLanguages.forEach((lang) => {
    if (!i18n.hasResourceBundle(lang, userProfileTranslationNamespace)) {
        i18n.addResourceBundle(lang, userProfileTranslationNamespace, resources[lang].translation);
    }
});

export { userProfileTranslationNamespace };
