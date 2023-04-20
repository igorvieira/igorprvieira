---
title: Rust API - Health Checker - Part I
pubDate: "Apr 14 2023"
description: "Rust"
category: rust
heroImage: /ferris.png
---





Bem, o intuito aqui não é fazer um Hello World, mas fazer um CRUD bem feito com Rust ajudando ter uma base para uma aplicação web com a linguagem e suas ferramentas, não é falar sobre os conceitos básicos da linguagem (mutabilidade, borrow, ownership e etc), mas dar aplicabilidade a ela, nos conceitos básicos tem essa playlist aqui:

[![Rust lang video](https://img.youtube.com/vi/ZnXfWtb_tg4/0.jpg)](https://www.youtube.com/watch?v=ZnXfWtb_tg4&list=PLt1jJ0_RPJxLiNl2byCur7oT3jXaRkQ6H&index=1)

Dito isso, eu quero fazer uma simples API em Rust onde você ter o mínimo de conhecimento sobre como fazer. Para começar é importante que você tenha o Cargo. Cargo é uma ferramenta em Rust que irá nos ajudar a desenvolver a nossa aplicação, ao menos a estrutura dela e onde depois iremos adicionar as nossas libs para poder construir a nossa aplicação:

Para instalar é só você se direcionar para esse site aqui:


<a herf="https://doc.rust-lang.org/cargo/getting-started/installation.html">https://doc.rust-lang.org/cargo/getting-started/installation.html</a>

Lá é só você seguir os baby steps para poder instalar o cargo na sua máquina

Note: Um ponto, tu precisa do rust instalado para instalar o cargo, pode ser óbvio, mas é bom ressaltar o óbvio.

Vamos lá eu vou começar rodando o comando:

```rust
cargo new rust-api
```

Num primeiro momento eu quero só mostrar a estrutura que temos:

```
└── rust-api
  └── target
  └── src
	└── main.rs
  └── Cargo.toml
  └── Cargo.lock
```

Ela é bem simples, se você olhar são poucos folders, o target é um arquivo de binários, src é onde ficará a nossa aplicação e temos o Cargo.toml onde nós temos a definição da nossas libs, um package.json do mundo rust e o Cargo.lock que é onde temos a definição das nossas dependências.

Bem, nessa aplicação iremos usar algumas libs como actix para a nossa parte de requisições http, sqlx para fazer a nossa parte de query junto ao postgres (Ele não é um ORM!), serde para json parse, chrono para datação, dotenv para ler variáveis locais da nossa aplicação e env_logger para log.


Nosso arquivo Cargo.toml vai ficar assim:


```rust
[package]
name = "cargo-crud-sqlx-pg"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
actix = "0.13.0"
actix-web = "4.2.1"
chrono = { version = "0.4.22", features = ["serde"] }
dotenv = "0.15.0"
serde = { version = "1.0.145", features = ["derive"] }
serde_json = "1.0.86"
env_logger = "0.10.0"
sqlx = { version = "0.6.2", features = ["runtime-async-std-native-tls", "postgres", "chrono"] }
uuid = { version = "1.3.0", features = ["serde", "v4"] }
```

Depois disso é rodar o seguinte comando: 

```bash
cargo build
```

para começar vamos criar mais um arquivo dentro de src chamado services.rs e por hora vamos deixar por lá, dentro do arquivo main.rs nós iremos começar a escrever a nossa aplicação

primeiro eu vou começar a importar algumas coisas que serão necessárias na nossa aplicação

```rust
use actix_web::{
    App,
    HttpServer,
};

fn main() {
// restante do código
};

```


Repare que importamos o App onde nós iremos criar a instância da nossa aplicação e o  HttpServer onde nós iremos subir a nossa estrutura,

Primeiro vamos apagar tudo que tem dentro da função, e acima da nossa main vamos declarar que a mesma será uma actix main web application.



```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
 
}
```

Repare que aqui fazemos o uso de uma async function, se você vem do javascript sabe que essa chamada nos ajuda a ter maior sincronicidade em um conjunto de funções assíncronas, assim garantindo a chamada correta dentro das nossas execuções, um outro ponto é que logo em seguida temos a chamada da `std::io::Result` para a execução e retorno da nossa main

Nós agora vamos para o nosso arquivo services.rs.

No nosso arquivo nós iremos definir o nosso healthchecker para saber se a nossa aplicação está rodando da forma correta:

```rust
use actix_web::{ get, web, HttpResponse, Responder };
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check API is up and running smoothly.";
    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE}))
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api").service(health_checker);

    conf.service(scope);
}

```


o código no final é bem simples, fizemos a chamada do método get do actix, junto com o método web para poder criar a nossa função é realizar um escopo por onde a nossa aplicação irá passar e será exportada de forma pública para a nossa main e temos a nossa função healt_checker que é uma resposta do nosso HttpResponse no formato json para o nosso usuário e nisso somente devolvemos a mensagem que a API está funcionando e uma mensagem de sucesso.

Voltando para o nosso arquivo main, nós iremos chamar dentro da nossa aplicação o nosso services.rs


```rust
mod services;

// todo código abaixo
```

o arquivo todo por hora está assim e iremos trabalhar dentro da nossa função main:

```rust
mod services;

use actix_web::{
    App,
     HttpServer,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
}
```

dentro dela ficará assim:


```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
 println!("Server started successfully");

    HttpServer::new(move || {
        App::new()
            .configure(services::config)
    })
        .bind(("127.0.0.1", 8080))?
        .run().await
}
```


o arquivo todo de main ficará assim:


```rust
mod services;

use actix_web::{
    App,
    HttpServer,
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
 println!("Server started successfully");

    HttpServer::new(move || {
        App::new()
            .configure(services::config)
    })
        .bind(("127.0.0.1", 8080))?
        .run().await
}
```

e esse é o nosso service.rs em caso de dúvidas:


```rust
use actix_web::{ get, web, HttpResponse, Responder };
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check API is up and running smoothly.";
    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE}))
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api").service(health_checker);

    conf.service(scope);
}
```


E se você rodar a nossa aplicação com o `cargo run`, ela ficará assim: 
http://localhost:8080/api/healthchecker



```json

{
  "message": "Health check API is up and running smoothly.",
  "status": "success"
}
```

Próximo passo!




   






