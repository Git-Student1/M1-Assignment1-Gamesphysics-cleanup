import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["p5/*", "**/Game_Uebung_11.js" ],
    files: ['**/GameEngines Übung 11/**.js']
  },
  {
    
  },
  {
    
    languageOptions: { globals: globals.browser },
},
  pluginJs.configs.recommended,
];