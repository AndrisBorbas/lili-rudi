import js from "@eslint/js";
import next from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import { configs as tsConfigs } from "typescript-eslint";

/** @type { import("typescript-eslint").Config } */
export default defineConfig(
	globalIgnores([
		"dist",
		"build",
		"node_modules",
		".next",
		"destiny-icons",
		"src/env.js",
	]),
	{
		name: "typescript-react",
		files: ["**/*.{js,jsx,ts,tsx,mts}"],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			"import/resolver": {
				typescript: true,
				node: true,
			},
			react: {
				version: "19",
			},
		},
		plugins: {
			"simple-import-sort": simpleImportSort,
			// @ts-expect-error -- missing types
			"@next/next": next,
		},
		extends: [
			js.configs.recommended,
			tsConfigs.strictTypeChecked,
			tsConfigs.stylisticTypeChecked,
			importPlugin.flatConfigs.recommended,
			importPlugin.flatConfigs.typescript,
			importPlugin.flatConfigs.react,

			// @ts-expect-error -- missing types
			reactPlugin.configs.flat.recommended,
			// @ts-expect-error -- missing types
			reactPlugin.configs.flat["jsx-runtime"],

			reactX.configs["recommended-typescript"],
			reactDom.configs.recommended,
			reactHooks.configs["recommended-latest"],
			jsxA11y.flatConfigs.recommended,
			reactRefresh.configs.vite,
			eslintConfigPrettier,
		],
		rules: {
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "inline-type-imports" },
			],
			"@typescript-eslint/require-await": "off",
			"@typescript-eslint/no-misused-promises": [
				"error",
				{ checksVoidReturn: { attributes: false } },
			],

			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],

			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"sort-imports": "off",
			"import/order": "off",

			eqeqeq: "error",

			/* Custom preferences */
			"@typescript-eslint/array-type": "error",
			"@typescript-eslint/consistent-indexed-object-style": [
				"warn",
				"index-signature", // Prevent ambiguity with Records & Tuples
			],
			"@typescript-eslint/method-signature-style": "warn", // Force type safety
			"@typescript-eslint/consistent-type-definitions": "off",
			"@typescript-eslint/no-empty-object-type": [
				"warn",
				{ allowInterfaces: "always" },
			],
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{
					allowNumber: true,
				},
			],
		},
	},
	{
		name: "react",
		files: ["**/*.{tsx,jsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
			"import/no-default-export": "warn", // Default exports are confusing
			"import/prefer-default-export": "off",
			"react/require-default-props": "off", // React `defaultProps` are deprecated
			"react/prop-types": "off",
			"react/self-closing-comp": "warn",
			"react/jsx-boolean-value": ["warn", "never"], // Always use boolean values in JSX
			"react/jsx-props-no-spreading": "off", // TypeScript makes this safe
		},
	},
	{
		name: "pages-override",
		files: ["src/app/**/*"],
		rules: {
			"@typescript-eslint/no-empty-function": "off",
			"react-refresh/only-export-components": "off",
			"import/no-default-export": "off",
			"import/prefer-default-export": "off",
			"@typescript-eslint/require-await": "off",
		},
	},
	{
		name: "eslint-base-config",
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
	},
);
