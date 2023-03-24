---
title: "Back to Back! - Part III "
pubDate: "Jun 14, 2017"
description: "Vue project"
category: Javascript
---

![back](/back-to-back.png)

Antes de mais nada eu tenho que pedir desculpa a vocês, estava em um processo de saída de uma empresa, e com um monte de teste e vários trabalhos que estava fazendo, organizar tudo estava complicado, estressante na real, e no fim eu passei mal para caramba, uma bruta enchaqueca, que me levou ao hospital, passados alguns dias eu voltei, e fui direto trabalhar, mas... eu queria continuar o nosso projeto com Vuejs, eu acho incrível, fácil e prático, a única coisa que eu estou achando complicado é a parte de testes unitários, entretanto eu vou continuar com nosso app.

Nesse momento, eu quero somente trabalhar a parte com front-end, eu desenvolvi uma [API](https://github.com/IgorVieira/base-api) com tudo o que vamos precisar para desenvolver o restante da nossa aplicação no front, não é muito, mas suficiente para podermos trabalhar, a única coisa que precisamos é organizar o que temos junto ao nosso servidor.

Vamos por passos, agora nessa primeria etapa, vamos precisar de duas bibliotecas para melhorar o restante da nossa aplicação, o `vue-router` e o `vue-resource`, e vamos usar um pouco de bootstrap, para agilizar o processo, mas o foco é vue.

Step 1, vamos adicionar o `vue-resource` e `vue-router`

```
sudo npm install vue-resource  vue-router
```

Step 2, temos que modificar a nossa aplicação em algumas partes, vamos ao nosso app, e agora temos que criar um novo arquivo na raiz do nosso src.

```
├── App.vue
...
│
├── main.js
└── routes.js <= 'Here!'
```

Esse arquivo vai fazer o gerenciamento das rotas da nossa aplicação e criaremos da seguinte forma:

```

import Home from './components/home/Home.vue';


export const routes = [
    { path: '', name: 'home', component: Home, titulo: 'Home', menu: true },
    { path: '*', component: Home, menu: false }
]
```

Esse path abaixo fala que qualquer rota fora do descrito, deve voltar para a rota principal, e renderizar o componente Home

`{ path: '*', component: Home, menu: false }`

Step 3, vamos ao nosso App.vue, lá faremos a seguinte alteração!

```
<template>
  <div>
        <a href="#"> <router-link :to="{ name: 'home'}">
          <i class="fa fa-home"></i>
          Home
        </router-link ></a>

        <transition name="page-view">
            <router-view></router-view>

        </transition>

  </div>
</template>

<script>
import { routes } from './routes'

export default {
  data(){
    return{
      routes:routes.filter(route => route.menu)
    }
  }
}
</script>
<style>
...
</style>

```

Nesse passo, vamos importar aqui a nossa route, ela fara todo o trabalho de filtrar as views que devem ser instanciadas, e deixar como default a nossa home, a baixo, vamos fazer uma pequena forma de transição!

```
<style>
.page-view-enter, .page-view-leave-active{
    opacity:0;
}

.page-view-enter-active, .page-view-leave-active{
    transition: 0.4s
}
</style>
```

Como temos uma tag chamada `<transition></transition>`, vamos adicionar somente um efeito a mesma que e ai quando mudarmos de view ela dará um efeito de opacidade entre uma view e outra com um certo delay, e é isso, segue o passeio.

Calma, que daqui em diante nada vai funcionar, mas segue os passos que vai dar tudo certo!

Step 4, precisamos fazer alterações em nosso main.js, vamos adicionar alguns dos nossos novos módulos:

```
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import App from './App.vue'
import { routes } from './routes'

Vue.config.productionTip = false
Vue.use(VueResource)
Vue.http.options.root = 'http://localhost:3000'


Vue.use(VueRouter)



const router = new VueRouter({
  routes,
  mode:'history'
})


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

```

Eu vou explicar as alterações que fizemos, primeiro, eu adicionei os módulos vue-router e vue-resource, e a cada um deles eu tive que adicionar junto ao nosso Vue,
`Vue.use(VueRouter)` + `Vue.use(VueResource)` para ele entender que temos novos módulos que estão sendo injetados e que podem ser usados em nossa aplicação, e abaixo temos router, que ali instanciamos para uso na nossa aplicação, e depois dizemos ao vue a onde ele deve criar as views, e que ele tem um processo de router para cada view que vai ser criada.

Pronto!

Agora que já temos o nosso outro componente, Home.vue, criado em nosso folder de componentes, vamos ajudar algumas coisas no template dele!

```
<template>

        <div>
            <h3>{{ title }}</h3>

                <ul >
                    <li v-for="task in tasks">
                       <span>{{ task.activity }}</span> - <span> {{ task.done }}
                       </span>
                       <a @click="removeTask(task)">
                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            Remover
                        </a>
                    </li>
                </ul>
            <hr>

                <form @submit.prevent="submitTask()">
                        <label for="">Atividade:</label>
                        <input type="text" v-model="task.activity">

                        <label for="">Status:</label>
                        <input  type="checkbox" v-model="task.done">
                        <button name="add">Add + </button>
                </form>

        </div>

</template>
<script>
import _ from 'lodash';
import TaskService from '../../domain/task/TaskService'

export default {



}

</script>
<style>


</style>
```

Acho que isso está mais simples, mesmo para quem for começar daqui, já começa bem pois está mais simples que os últimos exemplos, entretanto, antes de continuarmos, quero adicionar um pouco mais de estilo a nossa aplicação, vamos fazer uma alteração bem simples, é só adicionar os CDN's do bootstrap com algumas coisas do bootswatch a nossa aplicação, isso no nosso index.html, que está na raiz do nosso projeto!

E ficará assim:

```
<!DOCTYPE html>
<html>
  <head>
    <!-- Required meta tags -->
    <title>To Do Vue</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://bootswatch.com/lumen/bootstrap.min.css" crossorigin="anonymous">
    </head>
  <body>
  <body>
    <div id="app"></div>

    <!-- built files will be auto injected -->
    <!-- jQuery first, then Tether, then Bootstrap JS. -->
    <script src="https://code.jquery.com/jquery-3.1.1.slim.min.js" integrity="sha384-A7FZj7v+d/sdmMqp/nOQwliLvUsJfDHW+k9Omg/a/EheAdgtzNs3hpfag6Ed950n" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js" integrity="sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
  </body>
</html>

```

E vamos modificar tudo o que fizemos em temos de template, são só duas por enquanto, App.vue e Home.vue =]

App.vue ficará assim:

```
  <template>
    <div>
        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#"> <router-link :to="{ name: 'home'}">
                    <i class="fa fa-home"></i>
                    Home
                    </router-link ></a>
                </div>
            </div>

        </nav>

        <div class="container">

            <transition name="page-view">
                <router-view></router-view>

            </transition>

        </div>







    </div>
</template>

<script>
import { routes } from './routes'

export default {
  data(){
    return{
      routes:routes.filter(route => route.menu)
    }
  }
}
</script>

<style>
.page-view-enter, .page-view-leave-active{
    opacity:0;
}

.page-view-enter-active, .page-view-leave-active{
    transition: 0.4s
}

</style>

```

E Home.vue será finalizado assim, adicionando até um botão a mais, o de editar:

```
<template>

        <div class="container">
            <h3 class="page-header">{{ title }}</h3>
            <div class="row">
                <ul >
                    <li v-for="task in tasks">


                        <div class="panel panel-success col-md-4">
                            <div class="panel-heading">
                                <h3 class="panel-title">{{ task.activity }}</h3>
                            </div>
                            <div class="panel-body">
                                Status: {{task.done}}
                                <hr>

                                    <button class="btn">
                                    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    Editar
                                    </button>
                                    <a @click="removeTask(task)">
                                        <button class="btn">
                                        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                        Remover
                                       </button>
                                    </a>
                            </div>
                        </div>

                    </li>
                </ul>
            </div>
            <hr>
            <div class="row">
              <div class="col-md-5 col-md-offset-2 well">
                  <form @submit.prevent="submitTask()">
                    <div class="form-group">
                        <label for="">Atividade:</label>
                        <input class="form-control" type="text" v-model="task.activity">
                    </div>
                    <div class="form-group">
                        <label for="">Status:</label>
                        <input  type="checkbox" v-model="task.done">
                    </div>

                    <button class="btn" name="add">Add + </button>
                </form>
              </div>
            </div>
        </div>

</template>
<script>


export default {

    data(){
        return{
            title:'To do Vue!',
            tasks:[],
            task: {
                name:'',
                done:false
            }

        }
    },
    methods:{

        submitTask(){

        },
        removeTask(taskItem){


        }




    },
    created(){


    },

}

</script>
<style>

  .panel.panel-success.col-md-4{
    margin:20px;
  }


  li {
      list-style-type: none;
  }

  ul li{
      margin-left:1em;
  }
</style>

```

Step 5

Bem, nos outros posts eu havia criado as nossas funções para poder trabalhar um simples CRUD...mas, elas só funcionam em certa parte, mas queremos fazer algo pensando em um servidor respondendo do lado, e como até agora, nada funciona, nada mesmo, vamos precisar antes de tudo, e eu peço que por favor, clone essa API aqui [Base API](https://github.com/IgorVieira/base-api), basicamente você vai entrar no diretório, dar um `npm install` e um `npm run dev`, e você precisará do [MongoDB](https://www.mongodb.com/download-center#community) instalado, e é isso, continuando...

O próximo passo é montar um serviço que vai nos ajudar a conectar ao nosso servidor, para isso vamos criar um outro folder, ele se chama domain onde teremos vários outros serviços mais a frente, porém por enquanto vamos criar só mais um outro folder em domain, se chama task e vai ficar assim nossa árvore de diretórios:

```
├── App.vue
├── components
│   └── home
│      └── Home.vue
│
├── domain
│   └── task
│       └── TaskService.js
├── main.js
└── routes.js
```

Agora, vamos ao nosso arquivo TaskService.js, quero criar somente duas funções por hora, uma para listar e outra para criar itens para a nossa lista!

```
export default class TaskService{

    constructor(resource){
        this._resource =  resource('api/tasks{/id}')
    }


}
```

O que fizemos aqui? Nós criamos uma classe, exportamos ela com um construtor que recebe a parte referente a nossa api, observe isso `api/tasks{/id}`, ele recebe a url de forma que facilite o nosso trabalho de tratar o path, enfim, primeiro vamos criar o nosso método para poder listar as nossas tasks:

```
export default class TaskService{

    constructor(resource){
        this._resource =  resource('api/tasks{/id}')
    }


    listTask() {
        return this._resource
            .query()
            .then(res => res.json())
    }


}
```

E vamos fazer mais outra alteração bem simples no nosso Home.vue, no nosso created():

```
<script>
import _ from 'lodash';
import TaskService from '../../domain/task/TaskService'

export default {

    data(){
        return{
            title:'To do Vue!',
            tasks:[],
            task: {
                name:'',
                done:false
            }

        }
    },
    methods:{

        submitTask(){

        },
        removeTask(taskItem){


        }




    },
    created(){


    },

}

</script>
```

Primeiro, vamos instalar mais um módulo, `lodash`, e indicar o caminho relativo da nossa service!

`sudo npm install lodash --save`

Olhe bem as chamdas do módulo e do nosso serviço!

```
<script>

import _ from 'lodash';
import TaskService from '../../domain/task/TaskService'
```

E no método created(), vamos chamar a nossa service e renderizar os valores vindos a partir do nosso objeto json que vem da nossa API e ficará assim:

```
created() {
    this.service = new TaskService(this.$resource)

    this.service
    .listTasks()
    .then(tasks => {
        const item = _.map(tasks, item => item);
        this.tasks = item;
    }, err => console.log(`Erro na listagem da nossa aplicação ${err}`));


}
```

O que fizemos foi instanciar a nossa service, chamando o nosso método listTask() que nos retorna uma promise, nessa promise tratamos o valor e passamos o mesmo para a nossa list que é um array `this.tasks = [];`, se quiser testar e tiver um conhecimento básico de MongoDB é bem simples simular um valor:

======

Off-topic

Inserindo um valor pelo shell do Mongo:

Se você tem o mongo instalado, é só entrar nos seu shell `mongo` e digitar:

`use task_database`

Depois digitar o seguinte comando:

`db.tasks.insert({activity:'Make a coffee', done:true})`

E é isso, se você olhar agora a nossa aplicação, ela está funcionando e você verá a nossa primeira task!

![todo1](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/todo1.png?raw=true)

Mas...vamos fazer mais uma outra modificação!

Esse true ou false não fica legal, então vamos usar o v-if para mostrar se isso foi ou não realizado!

É só adicionar isso em frente a status, se task.done == true, ele mostra o icone de ok, e caso contrário, se for falso, ele mostra um item de remove, um x, e é isso

```
  Status: <div v-if="task.done == true">
             <span class="glyphicon glyphicon-ok"                    aria-hidden="true"></span>
            </div>
            <div v-else-if="task.done == false">
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </div>

```

Agora ficou mais da hora:

![todo2](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/todo2.png?raw=true)

E vamos para a última função desse post, vamos voltar para o nosso service TaskService.js

```
/* Class TaskService */


 saveTask(task){

    if(task._id){
        return this._resource.update({ id: task._id }, task)
    }else{
            return this._resource.save(task)
    }

}
```

Bem simples, nós chamaos o resource para lidar com isso, vamos fazer só uma pequena alteração, para quando fomos fazer update, e utilizarmos o id da task para poder atualizar a task em si e voltamos a nossa view para o nosso método:

```
    /* Parte acima da aplicação */

    methods:{

        submitTask(){
            this.service
                .saveTask(this.task)
                .then(res => {
                    this.tasks.push(res.body)
                    this.task = {
                            name:'',
                            done:false
                        }
                })
    },

    /* Created abaixo */

```

Como a nossa serivce já foi instanciada, podemos só chamar a service e seus métodos para poder realizar a função, e é isso, bem simples! =]

Por hoje é só, eu continuo o restante da aplicação no próximo post, muito obrigado e até mais!
