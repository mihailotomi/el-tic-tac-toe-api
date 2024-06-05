module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: ".",
  },
  ignorePatterns: [".eslintrc.cjs", "dist/", "dist/*"],
  plugins: ["@typescript-eslint", "security", "import"],
  extends: [
    "airbnb",
    "plugin:security/recommended-legacy",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],

  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],

    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-nested-ternary": "off",
    "prefer-default-export": "off",
    "no-use-before-define": "off",
    "arrow-body-style": "off",
    "security/detect-object-injection": "off",
    "no-plusplus": "off",
    "security/detect-unsafe-regex": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "no-useless-constructor": "off",
    "class-methods-use-this": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
  },
};
