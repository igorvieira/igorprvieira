---
title: Rust API - Criando a rota de get all com rust - Part IV
pubDate: "Jun 08 2023"
description: "Rust"
category: rust
heroImage: /new_get_all.jpg
---

Bem, vamos continuar o nosso trabalho, creio que daqui pra frente vai ser mais tranquilo, nesse momento queremos adicionar a nossa rota de `get_all_tasks`, ela vai ser responsável por buscar todas as tasks que criamos com a nossa rota de `create_task`.

Para começar vamos adicionar no nosso `schema.rs` o nosso filter options, que vai ser responsável por no final podermos paginar a nossa aplicação:

```rust
  #[derive(Deserialize, Debug)]
  pub struct FilterOptions {
      pub page: Option<usize>,
      pub limit: Option<usize>,
  }
```

Depois iremos para o nosso arquivo de service, services, onde iremos criar uma outra rota:

```rust
  pub async fn get_all_tasks(
    opts: Query<FilterOptions>,
    data: Data<AppState>
  ) -> impl Responder {}
```

Após isso vamos começar a trabalhar a nossa service, fazendo o import do nosso `FilterOptions` e
chamar no nosso actix_web o nosso Query que vai ser usado para a parte do nosso select com options:

```rust
use crate::{
    model::TaskModel,
    schema:: {
        CreateTaskSchema,
        FilterOptions
    }, AppState
};
use actix_web::{
    get,
    post,
    web::{
        Data,
        Json,
        scope,
        Query,
        ServiceConfig
    },
    HttpResponse,
    Responder
};
```

a difinir o base do nosso limit e offset da nossa aplicação:

```rust
  pub async fn get_all_tasks(
    opts: Query<FilterOptions>,
    data: Data<AppState>
  ) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

  }
```

O próximo passo é criar o nosso script de busca passando o nosso limit, offset e fazer o nosso
SELECT com um tratamento da mensagem e do nosso erro:

```rust
 match
    sqlx
      ::query_as!(
          TaskModel,
          "SELECT * FROM tasks ORDER by id LIMIT $1 OFFSET $2",
          limit as i32,
          offset as i32
      )
      .fetch_all(&data.db)
      .await {
          Ok(tasks) => {
              let json_response =
                  serde_json::json!({
                  "status": "success",
                  "result": tasks.len(),
                  "tasks": tasks
              });

              HttpResponse::Ok().json(json_response)
          }
          Err(error) => {
              return HttpResponse::InternalServerError().json(
                  serde_json::json!({"status": "error","message": format!("{:?}", error)})
              );
          }
    }
```

A função toda fica assim:

```rust
#[get("/tasks")]
pub async fn get_all_tasks(opts: Query<FilterOptions>, data: Data<AppState>) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    match
        sqlx
            ::query_as!(
                TaskModel,
                "SELECT * FROM tasks ORDER by id LIMIT $1 OFFSET $2",
                limit as i32,
                offset as i32
            )
            .fetch_all(&data.db)
            .await {
                Ok(tasks) => {
                    let json_response =
                        serde_json::json!({
                            "status": "success",
                            "result": tasks.len(),
                            "tasks": tasks
                        });

                    HttpResponse::Ok().json(json_response)
                }
                Err(error) => {
                    return HttpResponse::InternalServerError().json(
                        serde_json::json!({"status": "error","message": format!("{:?}", error)})
                    );
                }
            }
}
```

No final do nosso arquivo, só precisamos adicionar a nossa rota a função pública que temos
com as nossas configurações:

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks);

    conf.service(scope);
}
```

No final o nosso schema.rs fica assim:

```shell
  src/schema.rs
```

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateTaskSchema {
    pub title: String,
    pub content: String,
}

#[derive(Deserialize, Debug)]
pub struct FilterOptions {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}
```

E a nossa services.rs como um todo ficará assim:

```shell
  src/services.rs
```

```rust
use crate::{
    model::TaskModel,
    schema:: {
        CreateTaskSchema,
        FilterOptions
    }, AppState
};
use actix_web::{
    get,
    post,
    web::{
        Data,
        Json,
        scope,
        Query,
        ServiceConfig
    },
    HttpResponse,
    Responder
};
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check API is up and running smoothly.";
    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE }))
}

#[post("/task")]
async fn create_task(body: Json<CreateTaskSchema>, data: Data<AppState>) -> impl Responder {
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
                let note_response = serde_json::json!({
                    "status": "success",
                    "task": serde_json::json!({
                        "task": task
                    })
                });

                return HttpResponse::Ok().json(note_response);
            }
            Err(error) => {
                return HttpResponse::InternalServerError().json(
                    serde_json::json!({"status": "error","message": format!("{:?}", error)}));
            }
        }
}

#[get("/tasks")]
pub async fn get_all_tasks(opts: Query<FilterOptions>, data: Data<AppState>) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

    match
        sqlx
            ::query_as!(
                TaskModel,
                "SELECT * FROM tasks ORDER by id LIMIT $1 OFFSET $2",
                limit as i32,
                offset as i32
            )
            .fetch_all(&data.db)
            .await {
                Ok(tasks) => {
                    let json_response =
                        serde_json::json!({
                            "status": "success",
                            "result": tasks.len(),
                            "tasks": tasks
                        });

                    HttpResponse::Ok().json(json_response)
                }
                Err(error) => {
                    return HttpResponse::InternalServerError().json(
                        serde_json::json!({"status": "error","message": format!("{:?}", error)})
                    );
                }
            }
}

pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks);

    conf.service(scope);
}
```

Testando, você pode usar o insomnia apontando para a seguinte rota:
`http://localhost:8080/api/tasks`

Ou com curl, testando direto do seu terminal:

```
curl --request GET \
  --url http://localhost:8080/api/tasks
```

E se tudo deu certo você vai ter a seguinte mensagem:

```json
{
  "result": 2,
  "status": "success",
  "tasks": [
    {
      "content": "content test",
      "created_at": "2023-06-08T22:50:44.186036Z",
      "id": "dc512907-fbdb-4f97-b130-c0859dc2f2ef",
      "title": "title test2"
    },
    {
      "content": "content test",
      "created_at": "2023-06-08T21:41:25.586259Z",
      "id": "fc7e46df-8dd4-40a5-87f0-65d097d31e5a",
      "title": "title test"
    }
  ]
}
```

Próximo passo devemos criar uma nova rota para buscar uma task em específico e deletar a mesma,
até mais!
