---
title: Rust API - Router for create some new task - Part II
pubDate: "Apr 22 2023"
description: "Rust"
category: rust
heroImage: /ferris.png
---


Bem, vamos adicionar a nossa rota para criar uma nova task, antes de criarmos de fato a rota vamos adicionar algumas envs a nossa aplicação, pra isso é só rodar o comando de

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

Essas variáveis são as que iremos usar na construção da nossa aplicação, principalmente a criação e acesso ao banco de dados.

No próximo momento, nós iremos criar um `docker-compose.yml` para criar o nosso banco postgres:


```bash
touch docker-compose.yml
```





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

[imagem-do-banco-rodando]


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
    pub created_at: Option<NaiveDateTime>,
}
```

Aqui vamos ter a definição de como será a nossa estrutura junto ao nosso banco de dados, você pode ver que temos para os nossos ids um uuid, title como string, content como string e usamos o NaiveDateTime importado do nosso chrono.


Nesse momento, nós iremos criar as nossas tables no nosso banco de dados, pra isso iremos nos utilizar do sqlx:

```bash
sqlx migrate add -r init
```

esse comando irá dois arquivos em uma nova pasta chamada migrate, nela adicionaremos duas queries em sql, uma para up:

```sql
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

Ai é rodar o comando abaixo para criar as tabelas no nosso banco de dados:

```bash
sqlx migrate run
```

E se necessário for, rodar o outro comando abaixo para reverter as tabelas:

```bash
sqlx migrate revert
```

O próximo passo é trabalhar a nossa main, faremos o impot da nosso schema e da nossa model, nós iremos chamar a nossa lib web que será usada no set do Data da nossa aplicação, por hora só iremos chamá-la, também iremos chamar o nosso dotenv para leitura do nosso .env que tem todas as nossas secrets, depois iremos chamar a nossa lib para leitura da base de dados, o sqlx onde iremos importar o nosso PgPoolOptions, Pool e Postgres struct e assim criar a nossa structure de estados do banco de dados que será passada para as nossas services.


```rust
mod services;
mod model;
mod schema;


use actix_web::{
    web,
   /demais imports/
};

use dotenv::dotenv;
use sqlx::{ postgres::PgPoolOptions, Pool, Postgres };

pub struct AppState {
    db: Pool<Postgres>,
}

```

Dentro da nossa função main nós iremos chamar o dotenv para ler as nossas secrets .env




```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

```

Logo abaixo nós iremos fazer a conexão com o nosso database e definir o nosso pool de conexões para garantir que possamos fazer a execução de uma transação e utilizá-la em algum dado momento


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




Repare que fazemos uma leitura no primeiro momento da url do nosso database, após isso criamos uma variável onde nós abrimos o nosso pool de conexões e através da chamada do nosso match criamos uma forma de tratamento de erro e confirmação da mensagem de abertura e retorno da nossa coneção 

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


Após isso nós iremos chamar dentro do nosso HttpServer o nosso banco de dados:


```
HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState { db: pool.clone() }))
            .configure(services::config)
    })
    .bind(("127.0.0.1", 8080))?
    .run().await
```

Note que aqui nós fazemos a chamada ao nosso banco de dados dentro do nosso app_data, abrindo uma nova instância passando a nossa struct do AppState e depois chamamos o nosso configure para trazer o que será nosso service config em services, vamos logo em seguida, no mais o arquivo como um todo fica assim:

```
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

Dentro da nossa service nós iremos criar uma nova function que se chamará create_task, nessa função iremos passar um body e chamar o banco para processar a nossa query, para isso vamos fazer alguns imports iniciais.


```
use crate::{
    model::TaskModel,
    schema::{ CreateTaskSchema },
    AppState,
};

use actix_web::{ get, post, web::{
    Data,
    Json,
    scope,
    ServiceConfig
}, HttpResponse, Responder };
use serde_json::json;
```

Note que eu chamei do nosso schema o CreatTaskSchema que será usado para validar o nosso body, chamei a model para ser usada no nosso insert, no nosso actix eu chamei além do método get, temos agora o método http post, o Data para as nossas instancias via banco de dados, o AppState para compartilhar o estado do nosso db e o nosso ServiceConfig que resolvi trazer direto e facilitar a leitura da nossa função pública de config.



Em nossa função create_task,  tereos os parâmetros da seguinte forma:




```
#[post("/task")]
async fn create_task(
    body: Json<CreateTaskSchema>,
    data: Data<AppState>,
) -> impl Responder {}

```

E no corpo do nosso Responder termos a chamada do match para trabalhar o retorno do nosso insert como o tratamento de erro por ele

```rust
match sqlx::query_as!(
        TaskModel,
        "INSERT INTO tasks (title, content) VALUES ($1, $2)
         RETURNING *
        ",
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
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error","message": format!("{:?}", error)}));
        }
    }

```

Vamos chamar a nossa função dentro do nosso scope igual fizemos com o nosso healt_checker e é isso


```
pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api").service(health_checker).service(create_task);

    conf.service(scope);
}

```

O nosso arquivo inteiro fica assim:


```
use crate::{
    model::TaskModel,
    schema::{ CreateTaskSchema },
    AppState,
};
use actix_web::{ get, post, web::{
    Data,
    Json,
    scope,
    ServiceConfig
}, HttpResponse, Responder };
use serde_json::json;


#[get("/healthchecker")]
async fn  health_checker() -> impl Responder {
    const MESSAGE: &str = "The API is running smoothly.";
    HttpResponse::Ok().json(json!({"status": "success", "message": MESSAGE }))
}


#[post("/task")]
async fn create_task(
    body: Json<CreateTaskSchema>,
    data: Data<AppState>,
) -> impl Responder {
  match sqlx::query_as!(
        TaskModel,
        "INSERT INTO tasks (title, content) VALUES ($1, $2)
         RETURNING *
        ",
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
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({"status": "error","message": format!("{:?}", error)}));
        }
    }

}


pub fn config(conf: &mut ServiceConfig) {
    let scope = scope("/api").service(health_checker).service(create_task);

    conf.service(scope);
}

```







Para testar você pode usar o insomnia com o seguinte body json apontando para: 
`http://localhost:8080/api/task`


```json
{
	"title": "title test",
	"content": "content test"
}

```

Ou com curl e testando direto do seu terminal

```
curl --request POST \
  --url http://localhost:8080/api/task \
  --header 'Content-Type: application/json' \
  --data '{
	"title": "title test",
	"content": "content test"
}'
```


E se tudo deu certo você vai ter a seguinte mensagem:


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



Ai por desencargo de consciência você pode olhar no banco de dados e ver se tudo saiu como o esperado, e é isso!


 

