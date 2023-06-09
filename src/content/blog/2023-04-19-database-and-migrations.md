---
title: Rust API - Banco de dados e Migrations - Part II
pubDate: "Apr 22 2023"
description: "Rust"
category: rust
heroImage: /new_api.png
---

Hoje vamos dar continuidade ao que fizemos com base no nosso healtchecker, vamos adicionar a nossa rota para criar uma nova task, antes de criarmos de fato a rota vamos adicionar algumas env's a nossa aplicação, pra isso é só rodar o comando dentro da raiz do nosso repositório.

```bash
touch .env
```

E vamos adicionar algumas variáveis aqui:

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

Essas variáveis serão as mesmas que iremos usar na construção da nossa aplicação, principalmente a criação e acesso ao banco de dados.

No próximo momento, nós iremos criar um `docker-compose.yml` para criar o nosso banco postgres:

```bash
touch docker-compose.yml
```

Dentro do arquivo:

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

Nesse momento você já consegue rodar o comando de `docker-compose up -d ` e ter o seu banco rodando:

![imagem-do-banco-rodando](/public/rust-2-1.png)

Antes de começarmos, vou somente adicionar na nossa main o que iremos criar logo em seguida, o import do nosso
schema e model:

`src/main.rs`

```
mod services;
mod model;
mod schema;
```

Após isso iremos nós criar um novo arquivo chamado schema.rs onde teremos a base do nosso body para criar uma nova request

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

Repare que nele eu estou fazendo o import do Deserialize, Serialize que ambos serão usados para definir que nosso struct terá um novo schema onde poderemos fazer a leitura dos dados de um body json.

Logo em seguida nós iremos definir a nossa model:

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

Aqui vamos ter a definição de como será a nossa estrutura junto ao nosso banco de dados, você pode ver que temos para os nossos ids um uuid, title como string, content como string e usamos o NaiveDateTime importado do nosso chrono.

Nesse momento, nós precisamos criar as nossas tables no nosso banco de dados, e a quanto a isso iremos nos utilizar do sqlx:

```bash
sqlx migrate add -r init
```

Esse comando irá nos gerar dois arquivos em uma nova pasta chamada migrate, nela adicionaremos duas queries em sql, uma para up:

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

E a de down para caso eventualmente queira dropar essa mesma tabela. (Por favor, cuidado em realizar o mesmo em produção).

```sql
DROP TABLE tasks;
```

Após isso é rodar o comando abaixo para criar as tabelas no nosso banco de dados:

```bash
sqlx migrate run
```

E você consegue ver que foi criada a nossa tabela:
![table-task](/public/rust-2-2.png)

E se necessário for, rodar o outro comando abaixo para reverter as tabelas:

```bash
sqlx migrate revert
```

Creio que por hora é só, espero que tenha gostado e um grande abraço =]
