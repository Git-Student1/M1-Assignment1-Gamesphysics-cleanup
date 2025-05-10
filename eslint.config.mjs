import globals from "globals";
import pluginJs from "@eslint/js";
import { p5globals, implicit } from "@chaitanyathakur/eslint-plugin-p5js";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["p5/"],  // Ignore files or directories you don't want to lint
		
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,  // Include browser globals like `window`, `document`
				...p5globals
			},
			parserOptions: {
				ecmaVersion: 2020,     // Allow modern JS features like ES modules
				sourceType: "module",  // Enable `import`/`export` syntax
			},
		},
		rules: {
			"no-unused-vars": ["warn", { varsIgnorePattern: implicit }],
		  },
	},
	
	pluginJs.configs.recommended,  // Use ESLint's recommended JS rules
];