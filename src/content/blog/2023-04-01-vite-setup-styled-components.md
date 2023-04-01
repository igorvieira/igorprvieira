---
title: Vite Setup com Styled-Components - Part 4
pubDate: "Apr 01 2023"
description: "Styled-components!"
category: Javascript
heroImage: /vite-part4.png
---

Esse daqui se você quiser dar skip, pode, eu só vou fazer porque prefiro muito mais styled components a outras coisas como Tailwind…(please don't!). Para começar vamos só adicionar ao nosso projeto o styled-components.

```shell
  yarn add styled-components && yarn add @types/styled-components -D
```

Vamos criar uma pasta da raiz de src chamada styles e vamos adicionar dois arquivos:
O resets.ts e o theme.ts.

```
└── styles
  └── resets.ts
  └── theme.ts
```

No reset teremos esses estilos aqui que deixarão resetados algumas coisas que de fato serão a base para o nosso css.

resets.ts:

```typescript
import { createGlobalStyle } from "styled-components";

const ResetStyles = createGlobalStyle`


 html,
 body {
   padding: 0;
   margin: 0;
   font-family: 'Playfair Display', serif;
   background-color:  #f6f6f0;
 }


 a {
   color: inherit;
   text-decoration: none;
 }


 * {
   box-sizing: border-box;
 }


`;

export default ResetStyles;
```

E no arquivo de theme vamos deixar dessa forma:

```typescript
export default {
  colors: {
    primary: "tomato",
  },
  spacings: {
    small: "1rem",
    medium: "2rem",
    large: "3rem",
  },
};
```

Na nossa main vamos precisar chamar o Provider do StyledComponent para que todo o nosso projeto possa receber/ter acesso ao arquivo de theme que criamos:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";

import ResetStyles from "styles/reset";
import theme from "styles/theme";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ResetStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

Depois disso, vamos criar um outro folder na raiz de src chamado types, onde iremos declarar os tipos para poderem ser vistos e acessados em todo o nosso projeto e nele declarar o seguinte tipo: styled-components.d.ts

```
└── types
  └── styled-components.d.ts
```

```typescript
import theme from "styles/theme";

type Theme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
```

Após isso nós iremos criar um component chamado Content que será usado somente para dar ao nosso App.js algumas zonas de respiro com alguns paddings. E vamos ter apenas dois files dentro do nosso component:

```
└── components
  └── Content
    └── index.tsx
    └── styles.tsx
```

styles.tsx:

```typescript
import styled, { css } from "styled-components";

export const Wrapper = styled.main`
  ${({ theme }) => css`
    padding: ${theme.spacings.small};
  `};
`;
```

se você olhar bem, theme está sendo passado pelo nosso provider e sendo recebido no nosso wrapper e assim garantimos o valor do nosso padding.

index.tsx:

```typescript
import * as S from "./styles";

export const Content = ({ children }: { children: React.ReactNode }) => {
  return <S.Wrapper className="content">{children}</S.Wrapper>;
};
```

No nosso Counter component iremos fazer outras novas mudanças

styles.tsx:

```typescript
import styled from "styled-components";

export const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;
```

```typescript
import { useState } from "react";

import * as S from "./styles";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <S.Button onClick={() => setCount((count) => count + 1)}>
        count is: {count}
      </S.Button>
    </div>
  );
};
```

E por fim, eu fiz mais algumas mudanças no nosso App.js e ele ficou assim:

```typescript
import { Content } from "components/Content";
import { Counter } from "components/Counter";

function App() {
  return (
    <Content>
      <Counter />
    </Content>
  );
}

export default App;
```

Agora, para não quebrar o nosso storybook, precisamos fazer um wrapper dele no `preview.cjs`, o qual vamos precisar renomear para `preview.jsx`:

```typescript
import { ThemeProvider } from "styled-components";

import ResetStyles from "styles/resets";
import theme from "styles/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <ResetStyles />
      <Story />
    </ThemeProvider>
  ),
];
```

E um último detalhe, no nosso vite config, nós iremos adicionar uma flag para evitar optimziações grandes e desnecessárias ao nosso projeto:

```typescript
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      components: `${__dirname}/src/components/`,
      styles: `${__dirname}/src/styles/`,
      types: `${__dirname}/src/types/`,
      utils: `${__dirname}/src/utils/`,
    },
  },
  optimizeDeps: {
    disabled: false,
  },
  define: {
    "process.env": process.env,
    global: "window",
  },
});
```

E bem, se você rodar agora o seu storybook ele deve ficar assim:

<img src='/vite-part4-1.png' width='100%'>

Creio que por hoje é somente isso! Próximo artigo iremos falar sobre Jest.

Até mais!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
