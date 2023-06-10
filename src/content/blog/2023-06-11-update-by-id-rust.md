---
title: Rust API - Criando a rota de update by id com rust - Part VII
pubDate: "Jun 11 2023"
description: "Rust"
category: rust
heroImage: /new_update_id.jpg
---

Não vamos perder tempo, no nosso schema.rs, vamos escrever o UpdateSchema da nossa aplicação para trabalhar o nosso update o nosso vai se chamar UpdateTaskSchema:

```
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateTaskSchema {
    pub title: Option<String>,
    pub content: Option<String>,
}
```

Na nossa service, vamos importar pelo nosso actix_web o método `path` junto ao nosso actix_web:

```rust
use actix_web::{
    get,
    post,
    delete,
    patch,
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

E vamos começar a desenvolver o nosso `edit_task_by_id`:

```rust
#[patch("/tasks/{id}")]
async fn edit_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {

}
```

Observe que nosso path a gente está em busca do nosso uuid, porém agora temos um body com um dado novo a ser atualizado.

```rust

#[patch("/tasks/{id}")]
async fn edit_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
  let task_id = path.into_inner();

}

```

Próximo ponto é fazer a nossa query e o tratamento de erro, o que vai ser um pouco diferente frente ao que fizemos até então, pois primeiro precisamos fazer uma busca por id e depois fazer um update por id frente ao nosso content ou title.

Então o primeiro passo, criar o nosso select:

```rust
#[patch("/tasks/{id}")]
async fn edit_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx
            ::query_as!(TaskModel, "SELECT * FROM tasks WHERE id = $1", task_id)
            .fetch_one(&data.db).await
    {
        Ok(task) => {
          //...calma que vamos voltar aqui
        }
        Err(err) => {
            let message = format!("Internal server error: {:?}", err);
            return HttpResponse::NotFound().json(
                serde_json::json!({"status": "fail","message": message})
            );
        }
    }
}
```

E agora, vamos trabalhar o retorno da nossa aplicação fazendo o update de fato, seja de title ou do nosso content:

```rust
#[patch("/tasks/{id}")]
async fn edit_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx
            ::query_as!(TaskModel, "SELECT * FROM tasks WHERE id = $1", task_id)
            .fetch_one(&data.db).await
    {
        Ok(task) => {
            match
                sqlx
                    ::query_as!(
                        TaskModel,
                        "UPDATE tasks SET title = $1, content = $2 WHERE id = $3 RETURNING *",
                        body.title.to_owned().unwrap_or(task.title),
                        body.title.to_owned().unwrap_or(task.content),
                        task_id
                    )
                    .fetch_one(&data.db).await
            {
                Ok(task) => {
                    let task_response =
                        serde_json::json!({"status": "success","data": serde_json::json!({
                        "task": task
                    })});

                    return HttpResponse::Ok().json(task_response);
                }
                Err(err) => {
                    let message = format!("Error: {:?}", err);
                    return HttpResponse::InternalServerError().json(
                        serde_json::json!({
                            "status": "error",
                            "message": message
                        })
                    );
                }
            }
        }
        Err(err) => {
            let message = format!("Internal server error: {:?}", err);
            return HttpResponse::NotFound().json(
                serde_json::json!({"status": "fail","message": message})
            );
        }
    }
}
```

Por fim, adicionar nossa nova função de update junto a nossa config

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id)
        .service(delete_task_by_id)
        .service(edit_task_by_id);

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
        FilterOptions,
        UpdateTaskSchema
    }, AppState
};
use actix_web::{
    get,
    post,
    delete,
    patch,
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

#[patch("/tasks/{id}")]
async fn edit_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx
            ::query_as!(TaskModel, "SELECT * FROM tasks WHERE id = $1", task_id)
            .fetch_one(&data.db).await
    {
        Ok(task) => {
            match
                sqlx
                    ::query_as!(
                        TaskModel,
                        "UPDATE tasks SET title = $1, content = $2 WHERE id = $3 RETURNING *",
                        body.title.to_owned().unwrap_or(task.title),
                        body.title.to_owned().unwrap_or(task.content),
                        task_id
                    )
                    .fetch_one(&data.db).await
            {
                Ok(task) => {
                    let task_response =
                        serde_json::json!({"status": "success","data": serde_json::json!({
                        "task": task
                    })});

                    return HttpResponse::Ok().json(task_response);
                }
                Err(err) => {
                    let message = format!("Error: {:?}", err);
                    return HttpResponse::InternalServerError().json(
                        serde_json::json!({
                            "status": "error",
                            "message": message
                        })
                    );
                }
            }
        }
        Err(err) => {
            let message = format!("Internal server error: {:?}", err);
            return HttpResponse::NotFound().json(
                serde_json::json!({"status": "fail","message": message})
            );
        }
    }
}


pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id)
        .service(delete_task_by_id)
        .service(edit_task_by_id);

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
      "created_at": "2023-06-10T16:35:58.187917Z",
      "id": "a754b8d0-fa0e-4912-86b8-f7158d177c50",
      "title": "title test2"
    }
  }
}
```

E vamos através do id, atualizar o body:

```
curl --request PATCH \
  --url http://localhost:8080/api/tasks/a754b8d0-fa0e-4912-86b8-f7158d177c50 \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title hey jude",
	"content": "content hey jude"
}'
```

E concluimos:

```
{
   "data":{
      "task":{
         "content":"title hey jude",
         "created_at":"2023-06-10T16:35:58.187917Z",
         "id":"a754b8d0-fa0e-4912-86b8-f7158d177c50",
         "title":"title hey jude"
      }
   },
   "status":"success"
}
```

Próximos passos, logs...que a vida sem rumo é triste kk Grande abraço e até mais =]
