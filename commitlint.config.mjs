const config = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "body-max-line-length": [0, "always"], // Allow long issue links and descriptions in commit bodies
    },
}

export default config
