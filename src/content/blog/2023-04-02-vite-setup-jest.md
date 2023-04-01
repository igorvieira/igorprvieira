---
title: Vite Setup com Jest - Part 5
pubDate: "Apr 02 2023"
description: "Por que não Jest?"
category: Javascript
heroImage: /vite-part5.png
---

Eu não sei até onde isso é altamente recomendável, já que existem projetos como vitest, mas por uma questão de opção pessoal eu preferi ter o jest no meu repertório de ferramentas.

No nosso `tsconfig.json` eu simplemente irei adicionar o nosso include:

```json
  // outras configs
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "./.eslintrc.*",
    "./vite.config.ts"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
```

adicionei um arquivo na raiz do projeto chamado jest.config.js

```typescript
module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  coverageReporters: ["html", "text", "text-summary", "cobertura", "json"],
  collectCoverage: true,
  testMatch: ["**/?(*.)(test).ts?(x)"],
  collectCoverageFrom: [
    "src/**/*.ts(x)?",
    "!src/**/stories.tsx",
    "!src/styles/**/*.ts",
    "!src/types/**/*.d.ts",
    "!src/**/mock.ts(x)?",
  ],
  setupFilesAfterEnv: ["<rootDir>/.jest/setup.ts"],
  modulePaths: ["<rootDir>/src/", "<rootDir>/.jest"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
};
```

E adicionei algumas libraries do próprio jest ao nosso package.json:

```json
 "@babel/preset-env": "^7.20.2",
  "@babel/preset-react": "^7.18.6",
  "@babel/preset-typescript": "^7.21.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/react": "^14.0.0",
  "@testing-library/react-hooks": "^8.0.1",
  "@testing-library/user-event": "^14.4.3",
  "@types/jest": "^29.4.0",
  "jest": "^29.5.0",
  "jest-environment-jsdom": "^29.5.0",
  "jest-junit": "^15.0.0",
  "jest-styled-components": "^7.1.1",
```

E na parte de scripts eu adicionei esse comando aqui:

```json
"test": "jest --maxWorkers=50%  --coverage=false",
```

Na raiz do nosso projeto, vamos criar um folder .jest com um arquivo `setup.ts`:

```shell
└── .jest
  └── setup.ts
```

```typescript
import "@testing-library/jest-dom";
import "jest-styled-components";
```

E por questões de compatibilidade eu adicionei esse .babelrc na raiz do nosso projeto:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    [
      "@babel/preset-react",
      {
        "runtime": "automatic"
      }
    ],
    "@babel/preset-typescript"
  ],
  "env": {
    "test": {
      "plugins": [
        [
          "babel-plugin-styled-components",
          {
            "displayName": false
          }
        ]
      ]
    }
  }
}
```

E para os nosso testes eu criei um wrapper para poder rodar os mesmos juntos ao nosso ThemeProvider:

```shell
└── src
  └── utils
    └── test-utils.tsx
```

```typescript
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { ThemeProvider } from "styled-components";

import theme from "styles/theme";

type CustomRenderProps = Omit<RenderOptions, "queries">;

const customRender = (
  ui: ReactElement,
  { ...renderOptions }: CustomRenderProps = {}
) => render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, renderOptions);

export * from "@testing-library/react";
export { customRender as render };
```

Bem, agora vamos trabalhar em cima do nosso componente testável

No Counter vamos mudar a forma do component que será assim:

```typescript
import { useState } from "react";

import * as S from "./styles";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>
        Count: <span data-testid="counter-view">{count}</span>
      </h1>
      <S.Button onClick={() => setCount(count + 1)}>Increment</S.Button>
    </div>
  );
};
```

E criaremos o seguinte test para o noss Counter:

```shell
└── src
  └── components
    └── Counter
      # other files
      └── test.tsx
```

```typescript
import { act } from "react-dom/test-utils";
import { render, screen } from "utils/test-utils";

import { Counter } from ".";

describe("Counter", () => {
  it("should increment when the button is clicked", () => {

    act(() => {
      render(<Counter />);
    });

    const counter = screen.getByTestId("counter-view");
    const button = screen.getByRole("button", { name: /increment/i });

    expect(counter).toHaveTextContent("0");

    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(counter).toHaveTextContent("1");
  });
});
```

E ai é só rodar yarn test e correr para o abraço:

<img src='/vite-part5-1.png' width='100%'>

Espero que tudo tenha dado certo, até mais!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
