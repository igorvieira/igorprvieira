---
title: Vite Setup with Jest - Part 5
pubDate: "Apr 02 2023"
description: "Why not Jest?"
category: Javascript
heroImage: /vite-part5.png
---

I don't know how highly recommended this is, since there are projects like vitest, but as a matter of personal choice I preferred to have jest in my toolkit.

In our `tsconfig.json` I'll simply add our include:

```json
  // other configs
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "./.eslintrc.*",
    "./vite.config.ts"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
```

I added a file at the project root called jest.config.js

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

And I added some libraries from jest itself to our package.json:

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

And in the scripts part I added this command here:

```json
"test": "jest --maxWorkers=50%  --coverage=false",
```

At the root of our project, let's create a .jest folder with a `setup.ts` file:

```shell
└── .jest
  └── setup.ts
```

```typescript
import "@testing-library/jest-dom";
import "jest-styled-components";
```

And for compatibility reasons I added this .babelrc at the root of our project:

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

And for our tests I created a wrapper to be able to run them together with our ThemeProvider:

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

Well, now let's work on our testable component

In Counter we'll change the component form which will be like this:

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

And we'll create the following test for our Counter:

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

And then just run yarn test and you're all set:

<img src='/vite-part5-1.png' width='100%'>

I hope everything went well, see you later!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
