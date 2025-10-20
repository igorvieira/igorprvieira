---
title: Vite Setup with Storybook - Part 3
pubDate: "Mar 31 2023"
description: "Storybook!"
category: Javascript
heroImage: /vite-part3.png
---

Storybook is something relatively simple to configure, at least a good part comes straight from its website for a very simple and comprehensive setup:

```shell
  npx storybook init
```

In the middle of the process it asks if it can add the plugins for eslint, type yes and the page will finish like this:

<img src='/vite-part3-1.png' width='100%'>

Don't forget to add the /storybook-static folder to our .gitignore:

```shell
/storybook-static
```

If you run the `yarn storybook` command you'll see the following:

<img src='/vite-part3-2.png' width='100%'>

Well, after running yarn I'll simply press ctrl+c and just stop it, as I'm going to drop all these created components

<img src='/vite-part3-3.png' width='100%'>

And in our Counter component I'll create a folder called Counter and move the code to an index.tsx file inside the Counter folder and create one more file called stories.tsx where we'll create our config to render our component:

```
└── components
  └── Counter
      └── index.tsx
      └── stories.tsx
```

And our stories will look like this:

```typescript
export default {
  title: "Form/Counter",
  component: Counter,
} as Meta;

export const Default: Story = (args) => <Counter {...args} />;
```

One last change is just our main.cjs file that's inside the .storybook folder, where we need to add one more object from viteFinal and change the file types that will be read, the extensions in the case that are in the stories key and our final file looks like this:

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

And then just run `yarn storybook` and we'll find our Counter:

<img src='/vite-part3-4.png' width='100%'>

Well, we're done here, next chapter we'll configure styled-components!

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
