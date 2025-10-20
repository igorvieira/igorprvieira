---
title: Vite Setup Config - Part 1
pubDate: "Mar 29 2023"
description: "Vite setup with Eslint, Prettier, Storybook, Styled-components, Jest and Playwright"
category: Javascript
heroImage: /vite-part1.png
---

Well, this is a tutorial aimed at remembering how to configure the Vite CLI and make it work with everything I currently use in my daily routine (03/18/2023). I went through some struggle to get everything working properly, and I don't feel like repeating that dose of struggle in the future, so let's get to the setup:

First, my config in vite cli is quite simple

```shell
yarn create vite
```

From there, choose the template for React, Typescript+SWC (Speedy Web Compiler - this in Rust!!) and after that, access the directory or folder of your project and run a yarn install.

Our first configuration is only for the relative path of our folders, port, process and preview.

For port and preview, you just need to add the keys in our vite.config.ts and change the default to our configs:

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

After that, let's move on to some process.env configurations. Vite has its own way of reading environment variables, we'll add ours.

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

For this, we need to add a new library which is @type/node and I'll stick to the version I'm using "@types/node": "^18.14.2" and add the -D flag to keep it in our devDependencies.

```shell
  yarn add @type/node@18.14.2 -D
```

After that, just import path at the top of the file and replace the empty object with process.env:

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

After this, my config with process.env should already work normally. My next point is to add the alias to be able to easily import my components, assets, etc.

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

Another configuration needs to be done in our tsconfig.json with just these two lines, one to set the base directory and another to show the file routing:

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

Finally, I removed all the assets, the css files and created a folder called components.

![folder](/vite-part1-1.png)

I removed the css imports from main.tsx and App.tsx:

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

And as you can see, it imported my counter, this is the counter component.

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

Well, that's it for now! See you later!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
