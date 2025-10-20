---
title: Rust API - Database and Migrations - Part II
pubDate: "Apr 22 2023"
description: "Rust"
category: rust
heroImage: /new_api.png
---

Today we'll continue what we did based on our healthchecker. We're going to add our route to create a new task. Before we actually create the route, let's add some environment variables to our application. To do this, just run the command in the root of our repository.

```bash
touch .env
```

And let's add some variables here:

```bash
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=6500
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
POSTGRES_DB=rust_admin

DATABASE_URL=postgresql://admin:password123@localhost:6500/rust_admin?schema=public

PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=password123
```

These variables will be the same ones we'll use in building our application, especially for creating and accessing the database.

Next, we'll create a `docker-compose.yml` to create our postgres database:

```bash
touch docker-compose.yml
```

Inside the file:

```docker
version: '3'
services:
  postgres:
    image: postgres:latest
    container_name: postgres
    ports:
      - '6500:5432'
    volumes:
      - progresDB:/data/postgres
    env_file:
      - ./.env
  pgAdmin:
    image: dpage/pgadmin4
    container_name: pgAdmin
    env_file:
      - ./.env
    ports:
      - "5050:80"
volumes:
  progresDB:
```

At this point you can already run the `docker-compose up -d` command and have your database running:

![image-of-database-running](/public/rust-2-1.png)

Before we start, I'll just add to our main what we'll create next, the import of our
schema and model:

`src/main.rs`

```
mod services;
mod model;
mod schema;
```

After that we'll create a new file called schema.rs where we'll have the base of our body to create a new request:

```bash
touch src/schema.rs
```

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateTaskSchema {
    pub title: String,
    pub content: String,
}
```

Note that in it I'm importing Deserialize and Serialize, both of which will be used to define that our struct will have a new schema where we can read data from a JSON body.

Next, we'll define our model:

```bash
touch src/model.rs
```

```rust
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, Deserialize, Serialize)]
pub struct TaskModel {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
}
```

Here we'll have the definition of what our structure will be like with our database. You can see that we have a uuid for our ids, title as string, content as string, and we use NaiveDateTime imported from our chrono.

Well, before we continue we'll need to install sqlx-cli for the next steps:

```bash
cargo install sqlx-cli
```

At this moment, we need to create our tables in our database, and for this we'll use sqlx:

```bash
sqlx migrate add -r init
```

This command will generate two files for us in a new folder called migrate. In it we'll add two SQL queries, one for up:

```sql
-- Add up migration script here
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE
    IF NOT EXISTS tasks (
        id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('brt'::text, now())
      );
```

And the down one in case you eventually want to drop this same table. (Please be careful doing this in production).

```sql
DROP TABLE tasks;
```

After that, run the command below to create the tables in our database:

```bash
sqlx migrate run
```

And you can see that our table was created:
![table-task](/public/rust-2-2.png)

And if necessary, run the other command below to revert the tables:

```bash
sqlx migrate revert
```

I think that's it for now, I hope you enjoyed it and a big hug =]
