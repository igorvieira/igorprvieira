---
title: Rust API - Adicionando rota de criação de tasks - Part III
pubDate: "May 31 2023"
description: "Rust"
category: rust
heroImage: /new_task.jpg
---

O próximo passo é trabalhar a nossa main, faremos o impot da nosso schema e da nossa model, e iremos chamar a nossa lib web que será usada no set do Data da nossa aplicação, por hora só iremos chamá-la, também iremos chamar o nosso dotenv para leitura do nosso .env que tem todas as nossas secrets de banco de dados sem mostrar de fato os dados do nosso banco no código, depois iremos chamar a nossa lib para leitura da base de dados, o sqlx onde iremos importar o nosso PgPoolOptions, Pool e Postgres struct e assim criar a nossa structure de estados do banco de dados que será passada para as nossas services.

```rust
mod services;
mod model;
mod schema;


use actix_web::{
    web,
    //demais imports ...
};

use dotenv::dotenv;
use sqlx::{ postgres::PgPoolOptions, Pool, Postgres };

pub struct AppState {
    db: Pool<Postgres>,
}

```

Dentro da nossa função main nós iremos chamar o dotenv para ler as nossas secrets .env

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

```

Logo abaixo nós iremos fazer a conexão com o nosso database e definir o nosso pool de conexões para garantir que possamos fazer a execução de uma transação e utilizá-la em algum dado momento

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();


    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = match PgPoolOptions::new().max_connections(10).connect(&database_url).await {
        Ok(pool) => {
            println!("Connection DB resolved");
            pool
        }
        Err(error) => {
            println!("Failed to connect to the dabase: {:?}", error);
            std::process::exit(1);
        }
    };

```

Repare que fazemos uma leitura no primeiro momento da url do nosso database, após isso criamos uma variável onde nós abrimos o nosso pool de conexões e através da chamada do nosso match criamos uma forma de tratamento de erro e confirmação da mensagem de abertura e retorno da nossa conexão.

```rust
Ok(pool) => {
  println!("Connection DB resolved");
  pool
}
Err(error) => {
  println!("Failed to connect to the dabase: {:?}", error);
  std::process::exit(1);
}
```

Após isso nós iremos chamar dentro do nosso HttpServer o nosso banco de dados:

```rust
HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(services::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run().await
```

Note que aqui, nós fazemos a chamada ao nosso banco de dados dentro do nosso app_data, abrindo uma nova instância passando a nossa struct do AppState e depois chamamos o nosso configure para trazer o que será nosso service config em services, vamos ver logo em seguida, no mais o arquivo como um todo fica assim:

```rust
mod services;
mod model;
mod schema;

use actix_web::{
    web,
    App,
    HttpServer
};

use dotenv::dotenv;
use sqlx::{ postgres::PgPoolOptions, Pool, Postgres };

pub struct AppState {
    db: Pool<Postgres>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();


    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = match PgPoolOptions::new().max_connections(10).connect(&database_url).await {
        Ok(pool) => {
            println!("Connection DB resolved");
            pool
        }
        Err(error) => {
            println!("Failed to connect to the dabase: {:?}", error);
            std::process::exit(1);
        }
    };

    println!("Server started successfully");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(services::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run().await
}

```

Dentro da nossa service nós iremos criar uma nova function que se chamará create_task, nessa função iremos passar um body e chamar o banco para processar a nossa query, para isso vamos fazer alguns imports iniciais.

```rust
use crate::{
    model::TaskModel,
    schema::{ CreateTaskSchema },
    AppState,
};

use crate::{ model::TaskModel, schema::CreateTaskSchema, AppState };
use actix_web::{ get, post, web::{ Data, Json, scope, ServiceConfig }, HttpResponse, Responder };
use serde_json::json;
```

Note que eu chamei do nosso schema o CreatTaskSchema que será usado para validar o nosso body, chamei a model para ser usada no nosso insert, no nosso actix eu chamei além do método get, temos agora o método http post, o Data para as nossas instâncias via banco de dados, o AppState para compartilhar o estado do nosso db e o nosso ServiceConfig que resolvi trazer direto e facilitar a leitura da nossa função pública de config.

Em nossa função create_task, teremos os parâmetros da seguinte forma:

```rust
#[post("/task")]
async fn create_task(
  body: Json<CreateTaskSchema>,
  data: Data<AppState>
) -> impl Responder {}

```

E no corpo do nosso Responder teremos a chamada do match para trabalhar o retorno do nosso insert como o tratamento de erro dele.

```rust
match
  sqlx
      ::query_as!(
          TaskModel,
          "INSERT INTO tasks (title, content) VALUES ($1, $2)
          RETURNING * ",
          body.title.to_string(),
          body.content.to_string()
      )
      .fetch_one(&data.db)
      .await {
        Ok(task) => {
            let note_response = json!({
                "status": "success",
                "task": json!({
                    "task": task,
                })
            });

            return HttpResponse::Ok().json(note_response);
        }
        Err(error) => {

            return HttpResponse::InternalServerError().json(
                json!({
                    "status": "error",
                    "message": format!("{:?}", error)
                })
            )
        }
      }
```

Vamos chamar a nossa função dentro do nosso scope igual fizemos com o nosso healt_checker e é isso.

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task);

    conf.service(scope);
}
```

O nosso arquivo inteiro fica assim:

```rust
use crate::{ model::TaskModel, schema::CreateTaskSchema, AppState };
use actix_web::{ get, post, web::{ Data, Json, scope, ServiceConfig }, HttpResponse, Responder };
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check API is up and running smoothly.";
    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE }))
}

#[post("/task")]
async fn create_task(
  body: Json<CreateTaskSchema>,
  data: Data<AppState>
) -> impl Responder {
    match
        sqlx
            ::query_as!(
                TaskModel,
                "INSERT INTO tasks (title, content) VALUES ($1, $2)
                RETURNING * ",
                body.title.to_string(),
                body.content.to_string()
            )
            .fetch_one(&data.db)
            .await {
              Ok(task) => {
                    let note_response = json!({
                        "status": "success",
                        "task": json!({
                            "task": task,
                        })
                    });

                    return HttpResponse::Ok().json(note_response);
                }
                Err(error) => {

                    return HttpResponse::InternalServerError().json(
                        json!({
                            "status": "error",
                            "message": format!("{:?}", error)
                        })
                    )
                }
        }
}

pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api").service(health_checker).service(create_task);

    conf.service(scope);
}
```

Para testar você pode usar o insomnia com o seguinte body json apontando para:
`http://localhost:8080/api/task`

```json
{
  "title": "title test",
  "content": "content test"
}
```

Ou com curl e testando direto do seu terminal:

```
curl --request POST \
  --url http://localhost:8080/api/task \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title test",
	"content": "content test"
}'
```

E se tudo deu certo você vai ter a seguinte mensagem:

```json
{
  "status": "success",
  "task": {
    "task": {
      "content": "content test",
      "created_at": "2023-04-18T23:09:50.296965Z",
      "id": "bc9c3377-17a3-4654-9d03-316b83631274",
      "title": "title test"
    }
  }
}
```

Ai por desencargo de consciência você pode olhar no banco de dados e ver se tudo saiu como o esperado, e é isso!
