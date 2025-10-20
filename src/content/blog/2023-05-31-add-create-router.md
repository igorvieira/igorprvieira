---
title: Rust API - Adding Task Creation Route - Part III
pubDate: "May 31 2023"
description: "Rust"
category: rust
heroImage: /new_task.jpg
---

The next step is to work on our main. We'll import our schema and our model, and we'll call our web lib that will be used in setting the Data of our application. For now we'll just call it, we'll also call our dotenv to read our .env which has all our database secrets without actually showing the database data in the code. Then we'll call our lib to read the database, sqlx where we'll import our PgPoolOptions, Pool and Postgres struct and thus create our database state structure that will be passed to our services.

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

Inside our main function we'll call dotenv to read our .env secrets:

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

```

Right below we'll make the connection to our database and define our connection pool to ensure we can execute a transaction and use it at some point:

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

Note that we first read the URL of our database, after that we create a variable where we open our connection pool and through calling our match we create a way to handle errors and confirm the opening message and return of our connection.

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

After that we'll call our database inside our HttpServer:

```rust
HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(services::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run().await
```

Note that here, we make the call to our database inside our app_data, opening a new instance passing our AppState struct and then we call our configure to bring what will be our service config in services, we'll see it right after. Overall, the file as a whole looks like this:

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

Inside our service we'll create a new function called create_task. In this function we'll pass a body and call the database to process our query. To do this, let's make some initial imports.

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

Note that I called from our schema the CreateTaskSchema that will be used to validate our body, I called the model to be used in our insert. In our actix, besides the get method, we now have the HTTP post method, Data for our instances via database, AppState to share the state of our db, and our ServiceConfig which I decided to bring directly to facilitate reading of our public config function.

In our create_task function, we'll have the parameters as follows:

```rust
#[post("/task")]
async fn create_task(
  body: Json<CreateTaskSchema>,
  data: Data<AppState>
) -> impl Responder {}

```

And in the body of our Responder we'll have the match call to handle the return of our insert as well as its error handling.

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

Let's call our function inside our scope just like we did with our health_checker and that's it.

```rust
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api")
        .service(health_checker)
        .service(create_task);

    conf.service(scope);
}
```

Our entire file looks like this:

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

To test, you can use insomnia with the following JSON body pointing to:
`http://localhost:8080/api/task`

```json
{
  "title": "title test",
  "content": "content test"
}
```

Or with curl and testing directly from your terminal:

```
curl --request POST \
  --url http://localhost:8080/api/task \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title test",
	"content": "content test"
}'
```

And if everything went right you'll get the following message:

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

Just to be sure, you can check the database and see if everything went as expected, and that's it!
