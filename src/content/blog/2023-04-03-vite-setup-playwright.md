---
title: Vite Setup com Playwright - Part 6
pubDate: "Apr 03 2023"
description: "Playwright 😎"
category: Javascript
heroImage: /vite-part6.png
---

Playwright

Com playwright começamos pelo yarn create dele:

```bash
  yarn create playwright
```

<img src='/vite-part6-1.png' width='100%'>

Workflow como false:

<img src='/vite-part6-2.png' width='100%'>

E ele deve instalar nas dev dependências o playwright e deve salvar ai os plugins para o eslint também

E eu mudei algumas coisas no nosso package.json script, adicionando os testes e2e e quebrando em dois a forma de build:

```json
{
  //outros scripts acima
  "test:playwright": "playwright test --headed --config=playwright.config.ts --project=chromium",
  "test:playwright:helper": "npx playwright codegen http://localhost:3000"
  //outros scripts abaixo
}
```

E no playwright eu só defini as portas onde ele deve rodar:

```json
  baseURL: "http://localhost:3000",
```

```json
 {
   webServer: {
    command: "npm run start",
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  }
 }
```

Deletei também a pasta de test-examplos e no folder e2e eu criei esse arquivo `counter.spec.ts`:

```shell
└── e2e
  └── counter.spec.ts
```

E o nosso counter deve ficar assim:

```typescript
import { test, expect } from "@playwright/test";

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await expect(page.getByTestId("counter-view")).toBeVisible();
  await expect(page.getByTestId("counter-view")).toHaveText("0");

  await page.getByRole("button", { name: /increment/i }).click();

  await expect(page.getByTestId("counter-view")).toHaveText("1");
});
```

<img src='/vite-part6-3.png' width='100%'>

Bem, nesse momento tudo deve rodar bem, contudo eu quero só deixar um pouco mais organizado
para que você possa rodar em um ambiente de produção em um CI/CD de verdade e vamos criar
as seguintes pastas:

```shell
└── e2e
  └── components
    └── counter.ts
  └── tests
    └── counter.spec.ts
  └── tsconfig.json
  └── vite.config.ts
```

O primeiro arquivo é para gerenciar os nossos folders e fazer ser lido os mesmos, que é o tsconfig.json:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "strict": true,
    "strictNullChecks": true,

    "baseUrl": ".",
    "module": "esnext",
    "moduleResolution": "node",
    "paths": {
      "components/*": ["./components/*"],
      "tests/*": ["./tests/*"]
    },
    "resolveJsonModule": true,

    "noEmit": true,

    "allowJs": true,

    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,

    "jsx": "preserve",
    "lib": ["ESNext", "DOM"],
    "target": "esnext",

    "skipLibCheck": true
  },
  "exclude": ["node_modules"]
}
```

O segundo é só uma instancia do playwright para rodarmos bem a nossa aplicação:

```typescript
import type { PlaywrightTestConfig } from "@playwright/test";

export default {
  use: {
    baseURL: "http://localhost:8080",
  },
} as PlaywrightTestConfig;
```

E agora só vamos organizar o nosso counter para poder lidar os diversos caminhos de testes e o counter.spec para rodar os nossos testes, e para isso vamos passar os dados pelo nosso construtor e sempre instanciando em nossos testes:

counter.ts:

```typescript
import { expect, BrowserContext, Page, Locator } from "@playwright/test";

export class CounterPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly counterView: Locator;
  readonly incrementButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
    this.counterView = page.locator('[data-testid="counter-view"]');
    this.incrementButton = page.getByRole("button", { name: "Increment" });
  }

  async goto() {
    await this.page.goto("http://localhost:3000/");
  }

  async happyPath() {
    await expect(this.counterView).toBeVisible();
    await expect(this.counterView).toHaveText("0");
    await this.incrementButton.click();
    await expect(this.counterView).toHaveText("1");
  }
}
```

counter.spec.ts:

```typescript
import { test } from "@playwright/test";

import { CounterPage } from "components/counter";

test("get started link", async ({ page }) => {
  const counterComponent = new CounterPage(page);

  await counterComponent.goto();
  await counterComponent.happyPath();
});
```

E bem, fechamos aqui a nosso setup, espero que tenham curtido e qualquer coisa segue aqui o link do repositório:

Github: [Vite Setup](https://github.com/igorvieira/vite-setup)
