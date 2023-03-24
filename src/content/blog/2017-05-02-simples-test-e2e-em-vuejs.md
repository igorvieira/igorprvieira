---
pubDate: "May 01 2017"
title: "Simples teste e2e em VueJS - Part II "
description: "Vuejs app"
category: Javascript
---

![night](/nightwatch.png)
Vamos começar a criar nossos primeiros testes, confesso, tive alguns problemas em realizar testes unitários atráves do que o cli me traz, porém eu prometi trazer um teste com e2e, e depois eu realizarei de fato testes unitários junto aos nossos componentes, enfim, acontece, mas a aplicação tem que continuar.

A ideia é seguinte, nesse passo, nós iremos fazer um roteiro para um teste e2e, uma expécie de baby step, o nosso cli já fornece uma boa ferramenta para esse tipo de test, o Nightwatch, porém o mesmo precisa da jvm do java para rodar o Selenium, ele cria uma simulação de um browser, porém, a ideia é, simular um browser e depois fazer tests apartir da url que for passada junto a ele e as demais sequências, e isso ajudo do Nightwatch, então nessa fase você vai precisar instalar java na sua maquina, acontece, o mundo não é perfeito!kkk brincadeira!

Segue o passeio, após instalar java em sua máquina ou se já tiver, vamos ao nosso folder test e vamos entrar dentro do folder e2e, e vamos abrir o arquivo nightwatch.conf.js

Vamos fazer umas pequenas alterações, atualmente o chrome tem um funcionalidade em seu browser que impede de realizar uma simulação do mesmo, entretanto podemos habilitar isso, para de fato realizarmos o nosso teste e vermos as ações segundo o nosso roteiro, então vamos ver o arquivo nightwatch.conf.js:

```
require('babel-register')
var config = require('../../config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions : {
          args : ["--no-sandbox"]
        }
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}

```

Nesse arquivo vamos fazer uma pequena alteração no Google Chrome!
Nossa configuração ficará da seguinte forma:

```
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions : {
          args : ["--no-sandbox"]
        }
      }
    },
```

O que adicionamos é o chromeOptions!
passamos somente um argumento nos permitindo emular uma nova página do browser, para teste e isso junto ao chrome.

Após essa etapa, o que iremos trabalhar é, se notarmos bem a nossa aplicação ela faz as seguintes ações, ela pode criar um novo elementoa nossa lista de tarefas, o que iremos fazer, criar um roteiro de ações, e nesse roteiro nós iremos primeiro acessar a url do browser, contar quantas tarefas nós temos no primeiro momento, adicionar mais uma terefa e contar quantas tem nesse segundo momento e por fim, remover essa terefa e contar quantas tem no total, no caso tem que ter a mesma quantidade do início.

Para isso, vamos para outro folder, no nosso diretório test, vamos para spec, dentro dele tem um arquivo chamdo test.js, é nesse arquivo que iremos trabalhar o nosso roteiro, e vamos fazer em três partes, primeiro eu queror ir a página e quero contar quantos elementos da minha lista eu tenho, quandas li eu tenho, como eu farei isso? Eu irei em browser e apagarei tudo que tem a baixo dele, ficará assim:

```

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser

        /* Vamos escrever nosso roteiro aqui! */

      .end()
  }
}


```

Agora vamos fazer o seguinte, quero executar o que haviamos planejado, acessar a url, e contar quantas li eu tenho, no caso 3, e vou adicionar mais duas coisas a essa lista de tarefas, quero ver se ele pega o nosso h1 com o texto Hey e o title da nossa página, e será isso nosso test:

```

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .assert.title('To do List!')
      .pause(1000)
      .assert.containsText('h1', 'Hey')
      .assert.elementCount('li', 3)
      .end()
  }
}

```

E vamos rodar nosso teste:

```
sudo npm run e2e
```

Se você vê, ele vai abrir uma instancia junto ao selenium, e vai emular ações junto ao chrome, ao final ele vai dar o resultado dos nossos testes, e como tal, ele passou:

![e2e1](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/e2e-1.png?raw=true)

O que faremos agora é, adicionar uma nova tarefa e contabilizar quantos elementos tem em nossa lista de tarefas:

```
module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
     .url(devServer)
      .assert.title('To do List!')
      .pause(1000)
      .assert.containsText('h1', 'Hey')
      .assert.elementCount('li', 3)
      .setValue('input[type=text]', 'Make a coffee')
      .click('input[type=checkbox]')
      .pause(1000)
      .click('button[name=add]')
      .pause(2000)
      .end()
  }
}

```

O que fizemos foi, setar um valor para o nosso imput text, adicionando um valor ao seu value, e atribuindo também um valor ao seu checkbox, dando ele o valor de true, e vamos aproveitar o nosso name do button, usá-lo para o click, muito importante!

Quando disparamos um teste em um evento de click, devemos colocar um pause após esse evento, pois um click é muito rápido, mas dependendo não é tão rápido quanto o selenium é ao testar uma view, então para garantir que teremos de fato o evento de click, é que adicionamos o evento de pause.

Vamos rodar novamente o nosso teste:

```
sudo npm run e2e
```

E ele passou:

![e2e2](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/e2e-2.png?raw=true)

Por último, vamos excluir o último valor adicionado e contar os elementos da nossa lista, dessa forma:

```
browser
      .url(devServer)
      .assert.title('To do List!')
      .pause(1000)
      .assert.containsText('h1', 'Hey')
      .assert.elementCount('li', 3)
      .setValue('input[type=text]', 'Make a coffee')
      .setValue('input[type=checkbox]', true)
      .click('button[name=add]')
      .pause(2000)
      .assert.elementCount('li', 4)
      .click('.fa-trash')
      .pause(2000)
      .assert.elementCount('li', 3)
      .end()
```

Vamos rodar novamente o nosso teste:

```
sudo npm run e2e
```

E ele passou:

![e2e3](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/e2e-3.png?raw=true)

Bem, esse foi o nosso roteiro de teste com selenium e nightwatch, conseguimos realizar todas as funcionalidade e alguns elementos da nossa aplicação, garantindo o funcionamento do nosso software,e é isso, quinta-feira, provavelmente quinta, teremos mais um post, caso contrário, sexta, mas de sexta não passa, mais uma vez obrigado e até mais =]
