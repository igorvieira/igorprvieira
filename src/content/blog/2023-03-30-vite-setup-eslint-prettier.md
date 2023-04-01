---
title: Vite Setup Eslint e Prettier - Part 2
pubDate: "Mar 30 2023"
description: "Como configurar o Eslint e Prettier?"
category: Javascript
heroImage: /vite-part2.png
---

Para começar, quanto ao Eslint e Prettier, eu tenho uma configuração inteira do .eslintrc.json que funciona bem para os meus projetos 😅 e aí vou deixar a config e os plugins aqui abaixo:

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
            // tu pode colocar todos os seus folders aqui
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

Adicionei aqui o .eslintignore para excluir da nossa visualização o .storybook e .jest:

```shell
!.storybook
!.jest

```

No nosso package.json iremos adicioanr alguns modulos novos:

```json
{
  //outros packages
  "@typescript-eslint/eslint-plugin": "^5.55.0",
  "@typescript-eslint/parser": "^5.55.0",
  "eslint": "^8.11.0",
  "eslint-plugin-import-helpers": "^1.2.1",
  "eslint-plugin-no-only-tests": "^3.1.0",
  "eslint-plugin-react": "^7.29.4",
  "eslint-plugin-react-hooks": "^4.3.0"
}
```

E agora vamos adicionar a pasta .vscode que ficará na raiz com o arquivo settings.json, isso servirá para que force para que todos que estiverem naquele projeto possam ter de fato o mesmo comportamento vindo do linter, garantindo assim a consistência do código.

```
└── .vscode
  └── settings.json
```

dentro do settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

Após isso vamos começar a nossa configuração do prettier, o nosso prettier é bem simples nesse sentido, vai ter somente a configuração abaixo:

```json
{
  "trailingComma": "none",
  "semi": false,
  "singleQuote": true
}
```

E adicionando o .prettierignore na raiz, bem semelhante ao nosso .eslintignore:

```shell
  !.storybook
  !.jest
```

E vamos adicionando essas três outras libs ao nosso package.json:

```json
{
  //demais outros packages
  "eslint-config-prettier": "^8.5.0",
  "eslint-plugin-prettier": "^4.0.0",
  "prettier": "^2.8.4"
}
```

Por fim, é só adicionar no nosso .eslintconfig.json o plugin do prettier:

```json
{
  // demais outras configs
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ]
  // demais outras configs
}
```

E por último vamos adicionar dois comandos de lint para verificar o estilo de código e para reparar o código se necessário:

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

Ai você pode ver resultados assim:

![Vite2-1](/vite-part2-1.png)

E eu acredito que é isso!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
