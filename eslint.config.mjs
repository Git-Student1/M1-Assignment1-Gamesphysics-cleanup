import globals from "globals";
import pluginJs from "@eslint/js";
import { p5globals, implicit } from "@chaitanyathakur/eslint-plugin-p5js";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ["p5/"], // Ignore files or directories you don't want to lint
	},
	{
		languageOptions: {
			globals: {
				...globals.browser, // Include browser globals like `window`, `document`
				...p5globals,
				p5: "readonly",
				LEFT: "readonly",
				RIGHT: "readonly",
				CENTER: "readonly",
				TOP: "readonly",
				BOTTOM: "readonly",
				PI: "readonly",
				TWO_PI: "readonly",
				HALF_PI: "readonly",
				QUARTER_PI: "readonly",
			},
			parserOptions: {
				ecmaVersion: 2020, // Allow modern JS features like ES modules
				sourceType: "module", // Enable `import`/`export` syntax
			},
		},
		rules: {
			"no-unused-vars": ["warn", { varsIgnorePattern: implicit }],
		},
	},

	pluginJs.configs.recommended, // Use ESLint's recommended JS rules
];
