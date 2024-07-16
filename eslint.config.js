const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
    {
        "ignores": ["dist/index.js"],
    },
    js.configs.recommended,
    {
        "languageOptions": {
            "ecmaVersion": 2018,
            "globals": {
                ...globals.node
            }
        },
        "rules": {
            "array-bracket-spacing": ["error", "never"],
            "arrow-body-style": ["error", "as-needed"],
            "arrow-parens": ["error", "always"],
            "arrow-spacing": [
                "error",
                {
                    "before": true,
                    "after": true
                }
            ],
            "comma-spacing": [
                "error",
                {
                    "before": false,
                    "after": true
                }
            ],
            "eol-last": ["error", "always"],
            "indent": "error",
            "key-spacing": [
                "error",
                {
                    "beforeColon": false,
                    "afterColon": true,
                    "mode": "strict"
                }
            ],
            "keyword-spacing": [
                "error",
                {
                    "before": true,
                    "after": true
                }
            ],
            "no-bitwise": [
                "error",
                {
                    "int32Hint": true
                }
            ],
            "no-empty": [
                "error",
                {
                    "allowEmptyCatch": true
                }
            ],
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-multi-spaces": "error",
            "no-trailing-spaces": "error",
            "no-undef": "error",
            "no-unused-vars": "error",
            "object-curly-spacing": ["error", "always"],
            "padding-line-between-statements": [
                "error",
                { "blankLine": "always", "prev": "*", "next": "return" }
            ],
            "quotes": ["error", "double"],
            "radix": ["error", "always"],
            "spaced-comment": [
                "error",
                "always",
                {
                    "line": {
                        "markers": ["/"]
                    }
                }
            ],
            "space-before-function-paren": ["error", "never"],
            "space-in-parens": ["error", "never"],
            "space-infix-ops": [
                "error",
                {
                    "int32Hint": true
                }
            ],
            "space-unary-ops": [
                "error",
                {
                    "words": true,
                    "nonwords": false
                }
            ],
            "unicode-bom": ["error", "never"]
        }
    }
];
