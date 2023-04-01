---
title: Vite Setup com Storybook - Part 3
pubDate: "Mar 31 2023"
description: "Storybook!"
category: Javascript
heroImage: /vite-part3.png
---

Storybook é algo relativamente simples de configurar, ao menos boa parte vem direto no site dele para um setup bem simples e abrangente:

```shell
  npx storybook init
```

No meio do processo ele pergunta se pode adicionar os plugins para o eslint, digite e sim e a página terminarár assim:

<img src='/vite-part3-1.png' width='100%'>

Não esquecendo de adicionar na nosso .gitignore o folder /storybook-static:

```shell
/storybook-static
```

Se você rodar o comando de `yarn storybook` verá o seguinte:

<img src='/vite-part3-2.png' width='100%'>

Bem, após rodar o yarn eu vou simplesmente dar um ctrl+c nele e somente encerrar, pois vou dropar todas esses componentes criados 😅

<img src='/vite-part3-3.png' width='100%'>

E no nosso Counter component eu irei criar um folder chamado Counter e mover o código para um arquivo index.tsx dentro do folder Counter e criar mais um arquivo chamado stories.tsx onde criaremos a nossa config para renderizar o nosso component:

```
└── components
  └── Counter
      └── index.tsx
      └── stories.tsx
```

E nosso stories ficará assim:

```typescript
export default {
  title: "Form/Counter",
  component: Counter,
} as Meta;

export const Default: Story = (args) => <Counter {...args} />;
```

Uma última mudança é só nosso arquivo main.cjs que está dentro da pasta .storybook, onde é necessário adicionar um objeto a mais do viteFinal e mudar os tipos de arquivo que serão lidos, as extesões no caso que se encontram na na key stories e o nosso arquivo final fica assim:

```typescript
const { mergeConfig } = require("vite");

module.exports = {
  stories: ["../src/**/stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          components: `/src/components/`,
          styles: `/src/styles/`,
          types: `/src/types/`,
          utils: `/src/utils/`,
        },
      },
    });
  },
};
```

E ai é só rodar `yarn storybook` e encontraremos o nosso Counter:

<img src='/vite-part3-4.png' width='100%'>

Bem terminamos por aqui, próximo cápitulo nós iremos configurar o styled-components!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
