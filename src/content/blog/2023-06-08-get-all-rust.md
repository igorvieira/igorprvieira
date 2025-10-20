---
title: Rust API - Creating the Get All Route with Rust - Part IV
pubDate: "Jun 08 2023"
description: "Rust"
category: rust
heroImage: /new_get_all.jpg
---

Well, let's continue our work. I think from here on it will be smoother. At this point we want to add our `get_all_tasks` route, which will be responsible for fetching all the tasks we created with our `create_task` route.

To start, let's add our filter options to our `schema.rs`, which will be responsible for allowing us to paginate our application in the end:

```rust
  #[derive(Deserialize, Debug)]
  pub struct FilterOptions {
      pub page: Option<usize>,
      pub limit: Option<usize>,
  }
```

Then we'll go to our service file, services, where we'll create another route:

```rust
  pub async fn get_all_tasks(
    opts: Query<FilterOptions>,
    data: Data<AppState>
  ) -> impl Responder {}
```

After that let's start working on our service, importing our `FilterOptions` and
calling our Query in our actix_web which will be used for the part of our select with options:

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

And define the base of our limit and offset for our application:

```rust
  pub async fn get_all_tasks(
    opts: Query<FilterOptions>,
    data: Data<AppState>
  ) -> impl Responder {
    let limit = opts.limit.unwrap_or(10);
    let offset = (opts.page.unwrap_or(1) - 1) * limit;

  }
```

The next step is to create our search script passing our limit, offset and make our
SELECT with message handling and error handling:

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
```

The entire function looks like this:

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
```

At the end of our file, we just need to add our route to the public function we have
with our configurations:

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks);

    conf.service(scope);
}
```

In the end our schema.rs looks like this:

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

And our services.rs as a whole will look like this:

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

pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task)
        .service(get_all_tasks);

    conf.service(scope);
}
```

Testing, you can use insomnia pointing to the following route:
`http://localhost:8080/api/tasks`

Or with curl, testing directly from your terminal:

```
curl --request GET \
  --url http://localhost:8080/api/tasks
```

And if everything went right you'll get the following message:

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

Next step we should create a new route to fetch a specific task and delete it.
See you later!
