import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config[]} */
export default [
    pluginReact.configs.flat.recommended,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ["**/*.{ts,tsx}"],
    },
    {
        ignores: ["src/components/ui/*"]
    },
    {
        languageOptions: { 
        globals: globals.browser,
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
        }
    },
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        rules: {
            semi: "off",
            "prefer-const": "off",
            "react/jsx-uses-react": "off",
            "react/jsx-uses-vars": "off",
            "react/react-in-jsx-scope": "off",
            "no-extra-boolean-cast": "off",
        }
    },
];