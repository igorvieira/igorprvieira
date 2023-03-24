---
pubDate: "Nov 22, 2016"
title: "NodeJS(ES2015) + Heroku  "
description: "Como realizar deploy de uma aplicação em Nodejs"
---

Primeiro, “por que Heroku? ” A ideia na verdade é partir de algo mais simples e que todos possam utilizar, como eu creio que essa plataforma é realmente mais pratica, então ela se torna perfeita para a nossa abordagem, em termos relacionados a trabalho em si, o Heroku fica um pouco mais caro, um pouco, porém ela compensa pela sua praticidade, no fim você tem uma cloud que te atende bem, te fornece add-ons que são uteis para os seus projetos, além de ser possível obter SSL free! O que é muito bom, de toda forma Heroku é ótimo tanto para projetos mais simples como o que vamos fazer agora, como para projetos mais elaborados, projetos reais, e com isso vamos para uma outra questão, como criar uma aplicação em Nodejs com Es2015 que funcione perfeitamente com Heroku?! =]

Eu havia pesquisado diversas soluções para isso, principalmente por conta de alguns projetos que eu recebi e os quais eram construídos em NodeJs e Angular, e atualmente (22/11/2016)  se você for olhar a documentação do heroku, o Getting Starter de como buildar um projeto com Nodejs, ele até tem um repositório e instruções de como fazer, porém com uma sintaxe que não corresponde totalmente ao Es2015, e querendo ou não, JS em ES6 fica mais legível, mais prático e facilita de diversas formas no desenvolvimento da sua aplicação, tanto pela adoção do let e a sua forma comportamental em relação ao escopo, a nova forma de construção de functions, a organização das suas estruturas de classes entre outras coisas mais que contribuem para a manutenção do seu código.

Enfim, vamos ao código!
Nosso projeto terá os seguintes arquivos:

```
.
├── app.js
├── package.json
├── Procfile
└── server.js

```

Para começar, vamos setar o nosso package.json e para agilizar vamos digitar o seguinte comando:
npm init -y
E agora vamos adicionar os módulos ao package.json, que são básicos para fazer um deploy desse projeto e rodar o npm install

```

 "dependencies": {
    "babel": "^6.5.2",
    "babel-cli": "^6.14.0",
    "babel-preset-es2015": "^6.13.2",
    "express": "^4.14.0"
  }

```

Feito isso, vamos para o nosso próximo arquivo, o app.js, com ele vamos fazer algumas mudanças em torno de sintaxe, até então, em versões mais antigas do Nodejs você fazia requisições de módulos através de requires, por exemplo:

```
var express = require('express')
```

No Es2015, a chamada dos módulos são feitos através de imports:

```
import express from 'express'
```

Então vamos ficar com o import em nosso arquivo para chamar o modulo do express:

```
# app.js
# Importação de módulos
import express from 'express'

```

Em meio a isso, uma outra mudança é a forma de composição, você até então criava uma variável app na qual recebia express e assim fazia uso das funções que derivam do express, algo semelhante a isso:

```
var express =  require('express')
var app = express()

```

O ruim dessa abordagem e que a mesma tinha que ser exportada dentro de um module.exports, na verdade um return de todos os middlawares ou functions em um bloco único, por exemplo passar app.set(''port) para poder rodar  a aplicação em produção ou em desenvolvimento, o código até então ficava assim:

```

var express = require('express')
var app = express()
module.export = function(){

# aqui você colocaria principalmente os seus middlewares
# e no fim retornava somente o app carregando tudo

app.set('port', (process.env.PORT || 3000));
return app
}


```

Agora com Es6 fica ainda mais simples:

```
import express from 'express'

const app = express()

app.set('port', (process.env.PORT || 3000))

export default app

```

Particularmente, penso que dessa forma o código fica mais legível, exatamente por ele ser simples como ele é, mas para um início, o simples de um básico bem feito reflete muito no desenvolvimento de aplicações mais elaboradas.

Outra mudança significativa e a forma de se escrever funções de request e response, você pode escrever elas utilizando arrow functions
Por exemplo:

```
app.route(' / ').get((req, res) => res.end('Hello World'))

```

Fica mais simples escrever functions assim do que a próxima forma que se encontra a baixo, a leitura é mais fluida, principalmente pela versatilidade de poder nesse caso, escrever a mesma função em uma linha, ao menos isso te traz a sensação de entendimento sobre o que essa função realmente faz, coisa que fica estranho caso você tente concatenar em uma linha a mesma função em es5.

```

app.route(' / ').get( function(req, res){
      res.end('Hello World')
})

```

Tudo em es5 tem a seguinte cara:

```

var express = require('express')

var app = express()
module.export = function(){

app.route(' / ').get( function(req, res){
      res.end('Hello World')
})

app.set('port', (process.env.PORT || 3000));

return app
}

```

Agora em Es6 o nosso código fica assim:

```

import express from 'express'

const app = express()

app.route(' / ').get((req, res) => res.end('Hello World'))

app.set('port', (process.env.PORT || 3000))

export default app

```

O que vimos é o ganho de legibilidade e simplicidade, legibilidade é a palavra-chave nisso tudo, pois em termos de manutenibilidade, essas pequenas mudanças ajudam consideravelmente em projetos de grande escala, na verdade ainda é possível separar e montar uma arquitetura com pequenos módulos para facilitar a organização da nossa aplicação, pois querendo ou não, quando se tem uma aplicação muito grande, não é interessante ter por exemplo, funções de routes em um arquivo que seta os módulos básicos para o funcionamento da aplicação como um todo.
Continuando ...

Próximo arquivo é o server.js, na verdade é o mais simples já que compreendemos as pequenas modificações que dão um belo açúcar sintático e facilitam a leitura do nosso código, bem, primeiro vamos importar o modulo app que contém a nossa configuração para um server básico e a nossa rota principal.

```
import app from './app'
```

Depois vamos adicionar ao nosso server o protocolo de requisição http, que é um modulo nativo node que cria de fato o nosso server, e no fim os nossos imports ficam assim:

```
import app from "./app"
import http from "http"

```

Feito isso, vamos criar o nosso servidor de fato:

```
import app from "./app"
import http from "http"

http.createServer(app.get('port')).listen(port, ()=>{
  console.log('server is running:'+ port)
})
```

Só para melhorar isso tudo, vamos criar uma nova constante para port:

```
import app from "./app"
import http from "http"

const port = app.get('port')

http.createServer(app).listen(port, ()=>{
  console.log('server is running:'+ port)
})
```

Vamos a mais um arquivo .babelrc, ele e um arquivo para carregamento de plugins, no caso teremos o nosso plugin para podermos escrever em es2015:

```
/ * .babelrc */
{
  "presets": ["es2015"]
}
```

Ok, estamos quase terminando...quase kkk
Agora, se você rodar o código, digitar simplesmente, ```node server````, ele vai dar o seguinte erro:

```
(function (exports, require, module, __filename, __dirname) { import app from "./app"
                                                              ^^^^^^
SyntaxError: Unexpected token import
```

Porque não funciona? Por que o node não tem todas a features de es2015 em seu core, então vamos ter que voltar ao nosso package.json e fazer uma pequena modificação ao nosso escopo de scripts, e vamos escrever o nosso start dessa forma, usando o babel-node para rodar o nosso server:

```

 "scripts": {
       "start": "./node_modules/.bin/babel-node server.js",
       "test": "echo \"Error: no test specified\" && exit 1"
  }

```

Agora se você digitar o comando npm start, ele vai levantar o server localmente e assim você verá o Hello World da nossa aplicação.
Até agora nossos arquivos estão assim:

```

# app.js

import express from 'express';
const. app = express();
app.route('/') .get((req, res)=>res.end('Hello World'))
app.set('port', (process.env.PORT || 3000))


export default app;


# server.js


import app from "./app"
import http from "http"
const port = app.get('port')
http.createServer(app).listen(port, ()=>{
  console.log('server is running:'+ port)
})


# package.json


{
  "name": "node-heroku",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "./node_modules/.bin/babel-node server.js"
  },
  "dependencies": {
    "babel": "^6.5.2",
    "babel-cli": "^6.14.0",
    "babel-preset-es2015": "^6.13.2",
    "express": "^4.14.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


```

Pronto, agora vamos para o gran finale! O Deploy =]
Vamos adicionar o Procfile em nosso repositório, e só um arquivo sem extensão chamado Procfile.

```

# Procfile


web: ./node modules/.bin/babel-node server.js

```

Esse arquivo faz com você rode o server da mesma forma que você fez no package.json, mas dessa vez ele irá inicializar nossa aplicação no heroku, é um arquivo muito importante.

Agora para upar todos os nossos arquivos vamos ter que inicializar o git, pois o heroku funciona também por git, na real é a melhor forma de upar o seu repositório e vamos fazer o básico:

```

git init /* para inicializar a pasta do git no repositório */

```

Feito isso, para não importar tudo, não custa nada adicionar um simples arquivo .gitignore para não upar node_modules para o heroku.

```

#  .gitignore


/node_modules

```

E vamos commitar tudo.

```
git add .
git commit -m "initial commit"

```

Bem, para  realizar o deploy você precisa ter uma conta no [ Heroku](https://www.heroku.com/)  e precisa baixar o cliente do [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-command-line)
Após instalar o Heroku toolbelt e ter criado a sua conta, você entrara no repositório onde está o nosso código e digitar o seguinte comando:

```
heroku login
Ele vai pedir a sua conta do heroku :
Enter  your Heroku credentials.
Email: igor.p.r.vieira@gmail.com
Password (typing will be hidden): 
```

Já devidamente autenticado, vamos para nosso próximo e último passo, criar a nossa aplicação no Heroku, você pode digitar o comando a seguir para criar uma url automaticamente ou pode criar uma url para você manualmente:

```

#  URL Automática


heroku create


# URL Especifica


heroku create meu-app-nodejs /*nome da minha aplicacao*/

```

Após ter criado o nosso app no Heroku e como já comitamos o nosso repositório e só rodar o comando para deploy pelo próprio git.

```
git push heroku master

```

Em seguida você vai ver o link para acessar a sua aplicação

No meu caso:
https://my-app-nodejs.herokuapp.com/

E por fim o nosso Hello World!
E é isso, foi longo, o código fonte está abaixo, qualquer dúvida deixe seu comentário, vlw, obrigado e até mais! =]

Código fonte: [Github!](https://github.com/IgorVieira/my-app-nodejs)
