import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Custom ignores:
    ".context/**",
    "node_modules/**",
  ]),
  {
    rules: {
      // Disable overly strict react-hooks rules that flag valid patterns
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/react-compiler": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/purity": "off",
      // Allow namespace usage for type extensions
      "@typescript-eslint/no-namespace": "off",
    },
  },
]);

export default eslintConfig;
