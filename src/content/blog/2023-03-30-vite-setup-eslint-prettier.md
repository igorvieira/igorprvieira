---
title: Vite Setup Eslint and Prettier - Part 2
pubDate: "Mar 30 2023"
description: "How to configure Eslint and Prettier?"
category: Javascript
heroImage: /vite-part2.png
---

To start, regarding Eslint and Prettier, I have a complete .eslintrc.json configuration that works well for my projects and I'll leave the config and plugins here below:

```json
{
  "env": {
    "browser": true,
    "es2020": true,
    "jest": true,
    "node": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 11,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "eslint-plugin-import-helpers",
    "no-only-tests"
  ],
  "rules": {
    "import-helpers/order-imports": [
      "warn",
      {
        "newlinesBetween": "always", // new line between groups
        "groups": [
          "module",
          [
            "/^components/",
            "/^types/"
            // you can put all your folders here
          ],
          "/styles.*/",
          ["parent", "sibling", "index"],
          "/\\.\\/styles/"
        ],
        "alphabetize": {
          "order": "asc",
          "ignoreCase": true
        }
      }
    ],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-console": "warn",
    "no-only-tests/no-only-tests": ["error"]
  }
}
```

I added the .eslintignore here to exclude .storybook and .jest from our view:

```shell
!.storybook
!.jest

```

In our package.json we'll add some new modules:

```json
{
  //other packages
  "@typescript-eslint/eslint-plugin": "^5.55.0",
  "@typescript-eslint/parser": "^5.55.0",
  "eslint": "^8.11.0",
  "eslint-plugin-import-helpers": "^1.2.1",
  "eslint-plugin-no-only-tests": "^3.1.0",
  "eslint-plugin-react": "^7.29.4",
  "eslint-plugin-react-hooks": "^4.3.0"
}
```

And now let's add the .vscode folder that will be at the root with the settings.json file. This will force everyone working on that project to have the same behavior from the linter, thus ensuring code consistency.

```
└── .vscode
  └── settings.json
```

inside settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

After that, let's start our prettier configuration. Our prettier is quite simple in this sense, it will only have the configuration below:

```json
{
  "trailingComma": "none",
  "semi": false,
  "singleQuote": true
}
```

And adding .prettierignore at the root, very similar to our .eslintignore:

```shell
  !.storybook
  !.jest
```

And let's add these three other libs to our package.json:

```json
{
  //other packages
  "eslint-config-prettier": "^8.5.0",
  "eslint-plugin-prettier": "^4.0.0",
  "prettier": "^2.8.4"
}
```

Finally, just add the prettier plugin to our .eslintconfig.json:

```json
{
  // other configs
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ]
  // other configs
}
```

And lastly, let's add two lint commands to check code style and to fix the code if necessary:

```json
{
  "scripts": {
    "dev": "vite",
    "lint": "eslint src --max-warnings=0",
    "lint:fix": "eslint src --fix",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

Then you can see results like this:

![Vite2-1](/vite-part2-1.png)

And I believe that's it!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
