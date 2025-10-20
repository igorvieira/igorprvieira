---
title: Rust API - Health Checker - Part I
pubDate: "Apr 14 2023"
description: "Rust"
category: rust
heroImage: /ferris.png
---

Well, the goal here is not to make a Hello World, but to build a well-structured CRUD with Rust, helping to establish a foundation for a web application with the language and its tools. This is not about discussing the basic concepts of the language (mutability, borrow, ownership, etc.), but rather about applying them practically. For basic concepts, check out this playlist:

[![Rust lang video](https://img.youtube.com/vi/ZnXfWtb_tg4/0.jpg)](https://www.youtube.com/watch?v=ZnXfWtb_tg4&list=PLt1jJ0_RPJxLiNl2byCur7oT3jXaRkQ6H&index=1)

That said, I want to build a simple API in Rust where you can have the minimum knowledge about how to do it. To start, it's important that you have Cargo. Cargo is a tool in Rust that will help us develop our application, at least its structure, and where we'll later add our libraries to build our application.

To install it, just go to this website:

<a herf="https://doc.rust-lang.org/cargo/getting-started/installation.html">https://doc.rust-lang.org/cargo/getting-started/installation.html</a>

There you just need to follow the baby steps to install cargo on your machine.

Note: One important point - you need to have Rust installed to install cargo. It may be obvious, but it's worth stating the obvious.

Let's go, I'll start by running the command:

```rust
cargo new rust-api
```

First, I just want to show the structure we have:

```
└── rust-api
  └── target
  └── src
	└── main.rs
  └── Cargo.toml
  └── Cargo.lock
```

It's quite simple - if you look, there are few folders. The target is a binary file, src is where our application will be, and we have Cargo.toml where we have the definition of our libraries, similar to package.json in the Rust world, and Cargo.lock which is where we have the definition of our dependencies.

Well, in this application we'll use some libraries like actix for our HTTP request part, sqlx to handle our query part with postgres (It's not an ORM!), serde for JSON parsing, chrono for dates, dotenv to read local variables of our application, and env_logger for logging.

Our Cargo.toml file will look like this:

```rust
[package]
name = "rust-api"
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
sqlx = { version = "0.6.2", features = ["runtime-async-std-native-tls", "postgres", "chrono", "uuid"] }
uuid = { version = "1.3.0", features = ["serde", "v4"] }
```

After that, run the following command:

```bash
cargo build
```

To start, let's create one more file inside src called services.rs and for now let's leave it there. Inside the main.rs file we'll start writing our application.

First, I'll start importing some things that will be necessary in our application:

```rust
use actix_web::{
    App,
    HttpServer,
};

fn main() {
// restante do código
};

```

Note that we imported App where we'll create the instance of our application and HttpServer where we'll start our structure.

First, let's delete everything inside the function, and above our main we'll declare that it will be an actix main web application.

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {

}
```

Note that here we use an async function. If you come from JavaScript, you know that this call helps us have greater synchronicity in a set of asynchronous functions, thus ensuring the correct call within our executions. Another point is that right after we have the `std::io::Result` call for the execution and return of our main.

Now let's go to our services.rs file.

In our file we'll define our healthchecker to know if our application is running correctly:

```rust
use actix_web::{ get, web, HttpResponse, Responder };
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check: API is up and running smoothly.";

     HttpResponse::Ok().json(json!({
        "status": "success",
        "message": MESSAGE
    }))
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api").service(health_checker);

    conf.service(scope);
}

```

The final code is quite simple. We called the get method from actix, along with the web method to create our function and establish a scope through which our application will pass and will be exported publicly to our main. We have our health_checker function which is a response from our HttpResponse in JSON format to our user, and in it we only return the message that the API is working and a success message.

Going back to our main file, we'll call our services.rs within our application:

```rust
mod services;

// all code below
```

The entire file for now looks like this and we'll work inside our main function:

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

Inside it will look like this:

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

The entire main file will look like this:

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

And this is our service.rs in case of doubts:

```rust
use actix_web::{ get, web, HttpResponse, Responder };
use serde_json::json;

#[get("/healthchecker")]
async fn health_checker() -> impl Responder {
    const MESSAGE: &str = "Health check: API is up and running smoothly.";

     HttpResponse::Ok().json(json!({
        "status": "success",
        "message": MESSAGE
    }))
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api").service(health_checker);

    conf.service(scope);
}
```

And if you run our application with `cargo run`, it will be like this:
http://localhost:8080/api/healthchecker

If you want the CURL:

```bash
curl --request GET \
  --url http://localhost:8080/api/healthchecker \
  --header 'Content-Type: application/json'
```

Return:

```json
{
  "message": "Health check: API is up and running smoothly.",
  "status": "success"
}
```

See you later! =]
