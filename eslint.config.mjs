import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "dist/**",
        "coverage/**",
        "next-env.d.ts",
    ]),
    {
        rules: {
            // Enforce clean variables and imports without unused leftovers
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            // Enforce immutable variable bindings where re-assignment is not needed
            "prefer-const": "error",
            // Disallow duplicate imports for cleaner dependency trees
            "no-duplicate-imports": "error",
            // Allow console.warn and console.error in client logging while flagging stray debug logs
            "no-console": ["warn", { allow: ["warn", "error"] }],
            // React 19 / Next.js uses automatic JSX runtime transformation
            "react/react-in-jsx-scope": "off", // Disabled: Next.js JSX transform automatically injects React runtime
        },
    },
])

export default eslintConfig
