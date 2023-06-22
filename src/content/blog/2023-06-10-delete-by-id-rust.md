---
title: Rust API - Criando a rota de delete by id com rust - Part VI
pubDate: "Jun 10 2023"
description: "Rust"
category: rust
heroImage: /new_delete_id_remove.jpg
---

Igualmente fizemos em nosso get_task_by_id, iremos fazer basicamente o mesmo com a nossa função de delete, pois ela precisa deletar somente uma task por vez e precisamos chamar o nosso método delete do nosso actix_web

```rust
use actix_web::{
    get,
    post,
    delete
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

E iremos escrever abaixo a nossa função, que se assemelha bastante com a nossa função de get by id:

```rust
#[delete("/tasks/{id}")]
async fn delete_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {

}

```

Na nossa função, nós iremos verificar a nossa url em busca do uuid da nossa url:

```rust

#[delete("/tasks/{id}")]
async fn delete_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {
  let task_id = path.into_inner();


}

```

Próximo ponto é fazer a nossa query e o tratamento de erro, observe que o return relacionado ao nosso ok return, é um NoContent, simplesmente finalizando o retorno da nossa request, é puramente isso.

```rust
#[delete("/tasks/{id}")]
async fn delete_task_by_id(path: Path<uuid::Uuid>, data: Data<AppState>) -> impl Responder {
    let task_id = path.into_inner();

    match sqlx::query!("DELETE FROM tasks WHERE id = $1", task_id).execute(&data.db).await {
        Ok(_) => { HttpResponse::NoContent().finish() }
        Err(err) => {
            let message = format!("Internal server error: {:?}", err);
            return HttpResponse::NotFound().json(
                serde_json::json!({"status": "fail","message": message})
            );
        }
    }
}
```

Por fim, adicionar nossa nova função junto a nossa config

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id)
        .service(delete_task_by_id);

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
    delete,
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
    const MESSAGE: &str = "Health check: API is up and running smoothly.";

    HttpResponse::Ok().json(json!({
        "status": "success",
        "message": MESSAGE
    }))
}

#[post("/task")]
async fn create_task(
    body: Json<CreateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {

    match
        sqlx::query_as!(
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


#[get("/tasks")]
async fn get_all_tasks(
    opts: Query<FilterOptions>,
    data: Data<AppState>

) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1)- 1) * limit;


    match
        sqlx::query_as!(
        TaskModel,
            "SELECT * FROM tasks ORDER by id LIMIT $1 OFFSET $2",
            limit as i32,
            offset as i32,
        )
        .fetch_all(&data.db)
        .await {
            Ok(tasks) => {
                let json_response = json!({
                    "status": "success",
                    "result":  tasks.len(),
                    "tasks": tasks
                });

                return HttpResponse::Ok().json(json_response);
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


#[get("/tasks/{id}")]
async fn get_task_by_id(
    path: Path<Uuid>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx::query_as!(
            TaskModel,
            "SELECT * FROM tasks WHERE id = $1", task_id
        )
        .fetch_one(&data.db)
        .await {
            Ok(task) => {
                let task_note = json!({
                    "status": "success",
                    "task": task
                });


               return HttpResponse::Ok().json(task_note);
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

#[delete("/tasks/{id}")]
async fn delete_task_by_id(
    path: Path<Uuid>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx::query_as!(
            TaskModel,
            "DELETE FROM tasks WHERE id = $1", task_id
        )
        .execute(&data.db)
        .await {
            Ok(_) => {
                return HttpResponse::NoContent().finish();
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


pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id)
        .service(delete_task_by_id);

    conf.service(scope);
}


```

Para testar, nós iremos criar uma nova task (again):

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
      "created_at": "2023-06-10T15:41:15.681032Z",
      "id": "4b4bab9e-4b79-4db0-be8d-2d29c0eb5c1a",
      "title": "title test2"
    }
  }
}
```

E podemos testar da seguinte forma:

```
curl --request DELETE \
  --url http://localhost:8080/api/tasks/4b4bab9e-4b79-4db0-be8d-2d29c0eb5c1a
```

E ai não teremos necessariamente um retorno, mas pode verificar que o id que você usou para poder deletar, não existe mais.

E eu creio que por hoje é só! =]
