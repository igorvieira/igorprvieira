---
title: Rust API - Creating the Update by ID Route with Rust - Part VII
pubDate: "Jun 11 2023"
description: "Rust"
category: rust
heroImage: /new_update_id.jpg
---

Let's not waste time. In our schema.rs, let's write the UpdateSchema of our application to work on our update. Ours will be called UpdateTaskSchema:

```rust
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateTaskSchema {
    pub title: Option<String>,
    pub content: Option<String>,
}
```

In our service, let's import the `patch` method from our actix_web:

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

And let's start developing our `update_task_by_id`:

```rust
#[patch("/tasks/{id}")]
async fn update_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {

}
```

Note that in our path we're looking for our uuid, but now we have a body with new data to be updated.

```rust

#[patch("/tasks/{id}")]
async fn update_task_by_id(
    path: Path<uuid::Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
  let task_id = path.into_inner();

}

```

Next point is to make our query and error handling, which will be a bit different from what we've done so far, as we first need to search by id and then do an update by id for our content or title.

So the first step, create our select:

```rust
#[patch("/tasks/{id}")]
async fn update_task_by_id(
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
          //...hold on, we'll come back here
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

And now, let's work on the return of our application by actually doing the update, whether of title or our content:

```rust
#[patch("/tasks/{id}")]
async fn update_task_by_id(
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
                        body.content.to_owned().unwrap_or(task.content),
                        task_id
                    )
                    .fetch_one(&data.db)
                    .await
                        {
                            Ok(task) => {
                                let task_response = json!({
                                    "status" : "success",
                                    "task" : task
                                });

                                return HttpResponse::Ok().json(task_response)
                            }
                            Err(error) => {
                                let message = format!("{:?}", error);
                                return HttpResponse::InternalServerError().json(json!({
                                    "status" : "error",
                                    "message" : message
                                }))
                            }
                        }
        }
        Err(err) => {
            let message = format!("{:?}", error);
            return HttpResponse::NotFound().json(json!({
                "status" : "not found",
                "message" :  message
            }))
        }
    }
}
```

Finally, add our new update function to our config:

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks)
        .service(get_task_by_id)
        .service(delete_task_by_id)
        .service(update_task_by_id);

    conf.service(scope);
}
```

Our file in the end looks like this:

```
  src/services.rs
```

```rust
use actix_web::{
    web::{
        scope,
        Json,
        Path,
        Data,
        ServiceConfig,
        Query
    },
    get,
    post,
    delete,
    patch,
    HttpResponse,
    Responder,
};

use serde_json::json;
use uuid::Uuid;

use crate::{schema::{CreateTaskSchema, FilterOptions, UpdateTaskSchema}, model::TaskModel, AppState};



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
}



#[patch("/tasks/{id}")]
async fn update_task_by_id(
    path: Path<Uuid>,
    body: Json<UpdateTaskSchema>,
    data: Data<AppState>
) -> impl Responder {
    let task_id = path.into_inner();

    match
        sqlx::query_as!(
            TaskModel,
            "SELECT * FROM tasks WHERE id = $1",
            task_id
        )
        .fetch_one(&data.db)
        .await {
            Ok(task) => {

                match
                    sqlx::query_as!(
                        TaskModel,
                        "UPDATE tasks SET title = $1, content = $2 WHERE id = $3 RETURNING *",
                        body.title.to_owned().unwrap_or(task.title),
                        body.content.to_owned().unwrap_or(task.content),
                        task_id
                    )
                    .fetch_one(&data.db)
                    .await {
                        Ok(task) => {
                            let task_response = json!({
                                "status" : "success",
                                "task" : task
                            });

                            return HttpResponse::Ok().json(task_response)
                        }
                        Err(error) => {
                            let message = format!("{:?}", error);
                            return HttpResponse::InternalServerError().json(json!({
                                "status" : "error",
                                "message" : message
                            }))

                        }
                    }


            }
            Err(error) => {
                let message = format!("{:?}", error);
                return HttpResponse::NotFound().json(json!({
                    "status" : "not found",
                    "message" :  message
                }))
            }
        }
}



pub fn config(conf:  &mut ServiceConfig) {
    let scope = scope("/api")
            .service(health_checker)
            .service(create_task)
            .service(get_all_tasks)
            .service(get_task_by_id)
            .service(delete_task_by_id)
            .service(update_task_by_id);



    conf.service(scope);
}

```

To test, we'll create a new task (again):

```
curl --request POST \
  --url http://localhost:8080/api/task \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title test2",
	"content": "content test"
}'
```

It should generate this task where I'll grab our id:

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

And let's update the body through the id:

```
curl --request PATCH \
  --url http://localhost:8080/api/tasks/a754b8d0-fa0e-4912-86b8-f7158d177c50 \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title hey jude",
	"content": "content hey jude"
}'
```

And we're done:

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

Next steps, logs...because life without direction is sad haha. Big hug and see you later =]
