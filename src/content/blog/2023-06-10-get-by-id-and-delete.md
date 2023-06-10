---
title: Rust API - Criando a rota de get by id com rust - Part IV
pubDate: "Jun 08 2023"
description: "Rust"
category: rust
heroImage: /new_get_id_remove.jpg
---

Primeiramente iremos lidar com o nosso arquivo de services, onde iremos importar o nosso Path, para fazer o recenhecimento a partir dele o id ou uuid no caso, que trabalharemos a nossa query de busca:

```rust
use actix_web::{
    get,
    post,
    web::{
        Data,
        Json,
        scope,
        Query,
        Path,
        ServiceConfig
    },
    HttpResponse,
    Responder
};
```

E iremos escrever abaixo a nossa função:

```rust
#[get("/tasks/{id}")]
async fn get_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {

}

```

Dentro do escopo da nossa função, nós iremos começar a verificar a partir da nossa url o task_id, ou o uuid da nossa url:

```rust

#[get("/tasks/{id}")]
async fn get_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {
  let task_id = path.into_inner();


}

```

Próximo ponto é fazer a nossa query e o tratamento de erro:

```rust
#[get("/tasks/{id}")]
async fn get_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {
  let task_id = path.into_inner();

  let query_result = sqlx
        ::query_as!(TaskModel, "SELECT * FROM tasks WHERE id = $1", task_id)
        .fetch_one(&data.db).await;

    match query_result {
        Ok(task) => {
            let note_response =
                serde_json::json!({
                "status": "success",
                "data": serde_json::json!({
                    "task": task
                })
            });

            HttpResponse::Ok().json(note_response)
        }
        Err(error) => {
            return HttpResponse::InternalServerError().json(
                serde_json::json!({"status": "error","message": format!("{:?}", error)})
            );
        }
    }
}
```

Por fim, adicionar ela junto a nossa config

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id);

    conf.service(scope);
}
```

O nosso arquivo no final fica assim:

```
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
        Path,
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


#[get("/tasks/{id}")]
async fn get_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {
  let task_id = path.into_inner();

  let query_result = sqlx
        ::query_as!(TaskModel, "SELECT * FROM tasks WHERE id = $1", task_id)
        .fetch_one(&data.db).await;

    match query_result {
        Ok(task) => {
            let note_response =
                serde_json::json!({
                "status": "success",
                "data": serde_json::json!({
                    "task": task
                })
            });

            HttpResponse::Ok().json(note_response)
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
        .service(get_all_tasks)
        .service(get_task_by_id);

    conf.service(scope);
}

```

Para testar, nós iremos criar uma nova task:

```
curl --request POST \
  --url http://localhost:8080/api/task \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title test2",
	"content": "content test"
}'
```

Ele deve me gerar essa task onde eu irei pegar o nosso id:

```json
{
  "status": "success",
  "task": {
    "task": {
      "content": "content test",
      "created_at": "2023-06-10T15:05:53.710564Z",
      "id": "d6b52611-8117-43d3-a8f6-56732ac94bd5",
      "title": "title test2"
    }
  }
}
```

E podemos testar da seguinte forma:

```
curl --request GET \
  --url http://localhost:8080/api/tasks/d6b52611-8117-43d3-a8f6-56732ac94bd5
```

E ai temos o seguinte resultado:

```
{
   "data":{
      "task":{
         "content":"content test",
         "created_at":"2023-06-10T15:05:53.710564Z",
         "id":"d6b52611-8117-43d3-a8f6-56732ac94bd5",
         "title":"title test2"
      }
   },
   "status":"success"
}

```

E bem, por hoje é só!
