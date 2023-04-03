---
title: Como fazer deploy do pocketbase com Fly.io
pubDate: "Apr 04 2023"
description: "Pocketbase"
category: pocketbase
heroImage: /pocketbase.png
---


## Começando com Pocketbase

Eu atualmente estou mudando algumas coisas que utilizo firebase para um pocketbase, já que é um projeto open source, no qual você pode fazer utilização de um Dockerfile e realizar o build em algum outro serviço que se faça uso do docker, o que é uma grande vantagem nesse aspecto.


Um ponto interessante, você pode fazer até mesmo a config de integrar o pocketbase em um bucket da AWS e assim salvar as suas imagens em outro serviço, sei fazer isso nesse momento? Não, mas está ai rsrs quem sabe a gente não faz algo do tipo?  `¯\_(ツ)_/¯`. 


Bem, para começarmos, eu irei criar um novo folder:

```bash
mkdir pocketbase
```
 
E onde também iremos criar um Dockerfile contento essa estrutura:

```docker
FROM alpine:latest

ARG PB_VERSION=0.10.1

RUN apk add --no-cache \
    unzip \
    openssh

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

EXPOSE 8080

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]
```




Depois fazemos o build:

```bash
  docker build -t pocketbase .
```


E depois rodamos o container localmente:

```bash
 docker run -it --rm -p 8080:8080 pocketbase
```

E ele deve rodar tanto a API quanto a UI dele

```bash
> Server started at: http://0.0.0.0:8080
- REST API: http://0.0.0.0:8080/api/
- Admin UI: http://0.0.0.0:8080/_/
```

No segundo link você consegue abrir no seu browser o nosso admin:

<img src='/pocketbase-1.png' width="100%"/>


## Baby steps com Fly.io

<img src='/fly.io.png' />


Bem, eu criei a minha conta no Fly.io que é um seviço de cloud em que podemos manter a nossa aplicação disponível a demais outras pessoas, e nesse momento se faz necessário ter o cli dele, atualmente ele está disponível da seguinte forma:

``` bash
# Windows:
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
# Linux
curl -L https://fly.io/install.sh | sh
# Mac
brew install flyctl
# or
curl -L https://fly.io/install.sh | sh
```

Após isso é realizar a autenticação com esse comando:
 
```bash
fly auth login
```


E dentro do nosso repositório eu irei rodar o comando de fly launch que deve rodar as seguintes perguntas:


```bash
➜  pocketbase  fly launch
Creating app in /Users/igorvieira/Projects/personal/pocketbase
Scanning source code
Detected a Dockerfile app
? Choose an app name (leave blank to generate one):
```

Vamos colocar o nome de `pocketbase-content`


```bash
? Choose a region for deployment:  [Use arrows to move, type to filter]
  Bogotá, Colombia (bog)
  Boston, Massachusetts (US) (bos)
  Paris, France (cdg)
  Denver, Colorado (US) (den)
  Dallas, Texas (US) (dfw)
  Secaucus, NJ (US) (ewr)
  Guadalajara, Mexico (gdl)
> Rio de Janeiro, Brazil (gig)
  Sao Paulo, Brazil (gru)
  Hong Kong, Hong Kong (hkg)
  Ashburn, Virginia (US) (iad)
  Johannesburg, South Africa (jnb)
  Los Angeles, California (US) (lax)
  London, United Kingdom (lhr)
  Madrid, Spain (mad)
```

Escolhi o servidor do Rio como o mais próximo de mim e coloquei não para as três perguntas seguintes:

```bash
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
Wrote config file fly.toml
? Would you like to deploy now? No
Your app is ready! Deploy with `flyctl deploy`
```

Note que ele já escreveu o fly.toml que é o nosso arquivo para configuração de deploy

```bash

# fly.toml file generated for pocketbase-content on 2023-04-02T13:46:47-03:00

app = "pocketbase-content"
kill_signal = "SIGINT"
kill_timeout = 5
primary_region = "gig"
processes = []

[env]

[experimental]
  auto_rollback = true

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```






No final dele devemos colocar esse seguinte conjunto

```bash
 [mounts]
  destination = "/pb/pb_data"
  source = "pb_data"
```

E o arquivo inteiro ficará assim:

```bash
# fly.toml file generated for pocketbase-content on 2023-04-02T13:46:47-03:00

app = "pocketbase-content"
kill_signal = "SIGINT"
kill_timeout = 5
primary_region = "gig"
processes = []

[env]

[experimental]
  auto_rollback = true
 
[mounts]
  destination = "/pb/pb_data"
  source = "pb_data"

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```


Depois é só rodar o comando de launch para montar o nosso pb_data:


```bash
fly volumes create pb_data --size=1
```

```bash
flyctl volumes create pb_data --size=1
Warning! Individual volumes are pinned to individual hosts. You should create two or more volumes per application. You will have downtime if you only create one. Learn more at https://fly.io/docs/reference/volumes/
? Do you still want to use the volumes feature? Yes
Some regions require a paid plan (fra, maa).
See https://fly.io/plans to set up a plan.

? Select region: Rio de Janeiro, Brazil (gig)
        ID: vol_xme149kyyz3vowpl
      Name: pb_data
       App: pocketbase-content
    Region: gig
      Zone: 8caf
   Size GB: 1
 Encrypted: true
Created at: 02 Apr 23 16:55 UTC

```

Note que é importante ser o mesmo local que escolhemos quando criamos o app!

Depois de ter criado o volume pb_data lá em cima, é só fazer o deploy da aplicação:

```bash
fly deploy
```

E aí é acessar a nossa url:

https://pocketbase-content.fly.dev/_/?installer#


Criar a sua conta


<img src='/pocketbase-2.png' />

E é isso: 


<img src='/pocketbase-3.png' />

Espero que tenha ajudado! Até mais! =]

