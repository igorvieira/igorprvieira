---
title: How to deploy pocketbase with Fly.io
pubDate: "Apr 04 2023"
description: "Pocketbase"
category: pocketbase
heroImage: /pocketbase.png
---


## Getting started with Pocketbase

I'm currently migrating some things I use firebase for to pocketbase, since it's an open source project, in which you can make use of a Dockerfile and build on some other service that uses docker, which is a big advantage in this aspect.


An interesting point, you can even configure integrating pocketbase in an AWS bucket and thus save your images on another service. Do I know how to do this right now? No, but it's there haha who knows, maybe we'll do something like that?  `¯\_(ツ)_/¯`.


Well, to get started, I'll create a new folder:

```bash
mkdir pocketbase
```
 
And where we'll also create a Dockerfile containing this structure:

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




Then we do the build:

```bash
  docker build -t pocketbase .
```


And then we run the container locally:

```bash
 docker run -it --rm -p 8080:8080 pocketbase
```

And it should run both its API and UI

```bash
> Server started at: http://0.0.0.0:8080
- REST API: http://0.0.0.0:8080/api/
- Admin UI: http://0.0.0.0:8080/_/
```

On the second link you can open our admin in your browser:

<img src='/pocketbase-1.png' width="100%"/>


## Baby steps with Fly.io

<img src='/fly.io.png' />


Well, I created my account on Fly.io which is a cloud service where we can keep our application available to other people, and at this moment it's necessary to have its cli, currently it's available as follows:

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

After that, authenticate with this command:
 
```bash
fly auth login
```


And inside our repository I'll run the fly launch command which should run the following questions:


```bash
➜  pocketbase  fly launch
Creating app in /Users/igorvieira/Projects/personal/pocketbase
Scanning source code
Detected a Dockerfile app
? Choose an app name (leave blank to generate one):
```

Let's name it `pocketbase-content`


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

I chose the Rio server as the closest to me and put no for the next three questions:

```bash
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
Wrote config file fly.toml
? Would you like to deploy now? No
Your app is ready! Deploy with `flyctl deploy`
```

Note that it already wrote the fly.toml which is our file for deploy configuration

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






At the end of it we should put this following set

```bash
 [mounts]
  destination = "/pb/pb_data"
  source = "pb_data"
```

And the entire file will look like this:

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


Then just run the launch command to mount our pb_data:


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

Note that it's important to be the same location we chose when we created the app!

After creating the pb_data volume above, just deploy the application:

```bash
fly deploy
```

And then access our url:

https://pocketbase-content.fly.dev/_/?installer#


Create your account


<img src='/pocketbase-2.png' />

And that's it:


<img src='/pocketbase-3.png' />

Hope this helped! See you later! =]

