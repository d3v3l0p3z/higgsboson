import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        module: "readonly",
        require: "readonly",
        // Browser / DOM
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        structuredClone: "readonly",
        // Lodash (global in some setups)
        _: "readonly",
      },
    },
    files: ["src/**/*.mjs"],
  },
];
