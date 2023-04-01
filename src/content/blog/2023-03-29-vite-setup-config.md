---
title: Vite Setup Config - Part 1
pubDate: "Mar 29 2023"
description: "Vite setup com Eslint, Prettier, Storybook, Styled-components, Jest e Playwright"
category: Javascript
heroImage: /vite-part1.png
---

Bem, esse é um tutorial visando lembrar como configurar o Vite CLI e fazer funcionar com tudo o que uso atualmente no meu dia a dia (18/03/2023) passei um certo sufoco para fazer tudo bem feito, e não estou muito afim de repetir a dose de sufoco no futuro, então, vamos ao setup:

Primeiro a minha config no vite cli é bem simples

```shell
yarn create vite
```

Nisso é escolher o template para React, Typescript+SWC (Speedy Web Compiler - this in Rust!!) e depois disso é acessar o diretório ou a pasta do seu projeto e rodar um yarn install.

A primeira configuração nossa, é somente do path relativo das nossas pastas, porta, process e preview.

Para port e preview, é somente necessário adicionar as keys no nosso vite.config.ts e mudar a default para as nossas configs:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
```

Depois disso vamos para algumas configurações de process.env, o vite tem a sua forma de fazer leitura de variáveis de ambiente, nós iremos adicionar a nossa.

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    "process.env": {},
    global: "window",
  },
});
```

Para isso precisamos adicionar uma nova biblioteca que é o @type/node e eu vou me ater a versão que estou usando "@types/node": "^18.14.2" e adicionar o -D para ficar nas nossas devDependecies.

```shell
  yarn add @type/node@18.14.2 -D
```

Depois disso é somente importar o path no topo do arquivo e trocar o objeto aberto por process.env:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  define: {
    "process.env": process.env,
    global: "window",
  },
});
```

Após isso a minha config com o process.env já deve funcionar normalmente. Meu próximo ponto é adicionar o alias para poder importar facilmente os meus components, assets e etc

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; //import path

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
  define: {
    "process.env": process.env,
    global: "window",
  },
});
```

Uma outra configuração precisa ser feita no nosso tsconfig.json apenas essas duas linhas, uma para setar a base do diretório e outra para mostrar o encaminhamento dos arquivos:

```typescript
{
  "compilerOptions": {
   // outras configs…
    "baseUrl": ".",
    "paths": {
     "*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

Por fim, removi todos os assets, os arquivos css e criei um folder chamado components.

![folder](/vite-part1-1.png)

Removi os imports de css da main.tsx e do App.tsx:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
import { Counter } from "components/Counter";

function App() {
  return <Counter />;
}

export default App;
```

E como podem ver ele fez o import do meu counter, esse é o counter component.

```
└── components
    └── Counter
        └── index.tsx
```

```typescript
import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>
        Count: <span>{count}</span>
      </h1>
      <button onClick={() => setCount((count) => count + 1)}>Increment</button>
    </div>
  );
};
```

Bem, por hora é isso! Até mais! o/

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
