import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      prettier: prettierPlugin
    },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "prettier/prettier": "error"
    }
  },
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"]
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"]
  },
  {
    ignores: ["node_modules", "dist", "coverage", "__test__"]
  }
])
