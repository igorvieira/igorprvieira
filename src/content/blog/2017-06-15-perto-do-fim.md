---
title: "Perto do fim - Part IV "
pubDate: "Jun 15, 2017"
description: "Vuejs application"
category: Javascript, Vuejs
---

![ohyeah](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/ohyeah.jpg?raw=true)

Okay, vamos continuar o nosso projeto, a ideia é que daqui em diante possamos criar mais dois dos nossos quatro métodos, já criamos um para listar e outro para poder criar novas tasks e um que também realiza updates, que será usado mais a frente, o que iremos fazer agora é criar um método para poder remover uma task na nossa lista, para isso vamos alterar a nossa função de remover em nosso Home.vue e precisamos modificar a nossa service para deletar a task, vamos a nossa service:

TaskService.js:

```

export default class TaskService{

    constructor(resource){
        this._resource = resource('api/tasks{/id}')
    }

    /** Métodos anteriores **/

    deleteTask(id){
        return this._resource
            .delete({id})
            .then(null, err => {
                console.log(err)
            })
    }
}
```

Abaixo do método de saveTask()

```
removeTask(taskItem){
    this.service
        .deleteTask(taskItem._id)
        .then(() =>{
            const taskRemove = this.tasks.indexOf(taskItem)
            this.tasks.splice(taskRemove,1 ),
            err => console.log(`${err}`)
        })


}
```

Bem, o removeTask, recebe o nosso objeto, depois fazemos a chamada da nossa service através do this, a nossa service chama o método deleteTask(id), na qual passamos o nosso objeto com a chave da nossa id,como isso retorna uma promise, a nossa task vai ser removida, porém existe um problema, a nossa lista não vai ser atualizada no nosso front, pois só retornamos a promise vazia, o que fazemos é usar do bom e velho javascript, primeiro pegamos o valor da posição do nosso item junto ao array, depois pegamos o nosso array, e passamos junto ao splice removendo o item referente naquela posição, e é isso que essas duas linhas presentes na função fazem:

```
const taskRemove = this.tasks.indexOf(taskItem)
this.tasks.splice(taskRemove,1 ),
```

Pronto, remover já foi, se quiser faça o teste, crie um item e o remova.

E assim ficará o nosso Home.vue:

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
                                Status: <div v-if="task.done == true">
                                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                        </div>
                                        <div v-else-if="task.done == false">
                                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </div>
                                <hr>
                                       <button class="btn">
                                        <span class="glyphicon                                                  glyphicon-pencil" aria-hidden="true"></span>
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
        removeTask(taskItem){
            this.service
                .deleteTask(taskItem._id)
                .then(() =>{
                    const taskRemove = this.tasks.indexOf(taskItem)
                    this.tasks.splice(taskRemove,1 ),
                    err => console.log(`${err}`)
                })


        }




    },
    created(){

    this.service = new TaskService(this.$resource)

    this.service
    .listTasks()
    .then(tasks => {
        const item = _.map(tasks, item => item);
        this.tasks = item;
    }, err => console.log(`Erro na listagem da nossa aplicação ${err}`));



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

Nota: Eu fiz uma pequena modificação em style, bem simples, para separar as tasks e para remover os bullets, e é isso.

Para continuarmos temos que fazer algumas pequenas alterações em duas partes, em routes, pois vamos precisar de mais uma view para podermos editar a nossa task, e precisamos adicionar um `<router-link></router-link>` que é uma tag para poder ir para essa route, que é uma nova view e precisamos de um método para poder receber o valor passado pelo nosso route-link e para que possamos trabalhar com ele, então a ordem é seguinte:

- routes
- Info.vue
- Alterar Home.vue
- Criar método para poder
  receber o valor de uma única task
- E testar update nessa nova view

Lista feita, vamos agir:

Em routes.js vamos fazer a seguinte alteração, adicionar mais um caminho de onde é a nossa outra view, Info.vue:

```
import Info from './components/info/Info.vue'

import Home from './components/home/Home.vue';


export const routes = [
    { path: '', name: 'home', component: Home, titulo: 'Home', menu: true },
    { path: '/info/:id', name:'info', component: Info, titulo: 'Info', menu: false },
    { path: '*', component: Home, menu: false }
]
```

Vamos fazer mais uma alteração, criar o nosso novo componente, Info.vue:

```
├── App.vue
├── components
│   ├── home
│   │   └── Home.vue
│   └── info
│       └── Info.vue
├── domain
│   │
│   └── task
│       ├── Task.js
│       └── TaskService.js
├── main.js
└── routes.js
```

A nossa view de Info.vue ficara da seguinte forma:

```
<template>
    <div>
        <h3 class="page-header">{{ title }}</h3>
        <div class="col-md-4">
           <form class="form-horizontal well" @submit.prevent="updateTask()" >
                <div class="form-group">
                    <label for="" >Nome da Atividade:</label>
                    <input type="text" class="form-control" v-model="task.activity">
                </div>
                <div class="form-group">
                    <label for="" >Status da atividade:</label>
                    <input type="checkbox" v-model="task.done">
                </div>
                <input type="submit" value="Salvar" class="btn btn-success">
           </form>

        </div>
    </div>

</template>
<script>

import Task from  '../../domain/task/Task'
import TaskService from '../../domain/task/TaskService'

export default {

    data() {

        return {
            task: new Task(),
            title:'Info:'
        }
     },
    },

    created() {

    },


    methods:{
        updateTask(){

        }
    }


}
</script>
<style>

.context{
    margin-top:10px;
}

textarea{
  min-height:15em;
  width:100%;
  max-width:100%;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #000;
  margin: .5em 0 0.8em 0;
  color: #000;
}


</style>

```

Eu tomei a liberdade e criei mais uma class dentro do domain task, que se chama Task.js, o que ela estabelece para mim? Ela só cria um constructor que recebe e volta os valores que pela mesma são passados, somente isso:

```
export default class Task{

    constructor(activity, done){
        this.activity = activity
        this.done = done
    }


}
```

Vamos fazer uma pequena alteração na nossa Home.vue, no botão de editar, para que ele nos passe o valor da id para nossa próxima rota.

```
<router-link :to="{ name: 'info', params: { id : task._id }}">
    <button class="btn">
    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    Editar
    </button>

</router-link>
```

Se você reparou, no nosso router.js, nós indicamos a qual componente aquele router vai renderizar na view, e podemos passar um nome que é atribuido a nossa view que será renderizada, e o melhor podemos indicar isso no name, igual tem no Home, `name:'info'`, outra coisa é que como indicamos que o path poderia receber uma id, no nosso params, também podemos indicar que ele recebe um id como parâmetro, e é o que podemos utilizar para realizarmos o nosso trabalho através do id da task, e assim passar o valor da mesma para a outra view e para podermos realizar update da mesma já renderizada.

Home.vue:

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
                                Status: <div v-if="task.done == true">
                                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                                        </div>
                                        <div v-else-if="task.done == false">
                                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                        </div>
                                <hr>
                                    <router-link :to="{ name: 'info', params: { id : task._id }}">
                                       <button class="btn">
                                        <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                        Editar
                                       </button>

                                    </router-link>
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
        removeTask(taskItem){
            this.service
                .deleteTask(taskItem._id)
                .then(() =>{
                    const taskRemove = this.tasks.indexOf(taskItem)
                    this.tasks.splice(taskRemove,1 ),
                    err => console.log(`${err}`)
                })


        }




    },
    created(){

    this.service = new TaskService(this.$resource)

    this.service
    .listTasks()
    .then(tasks => {
        const item = _.map(tasks, item => item);
        this.tasks = item;
    }, err => console.log(`Erro na listagem da nossa aplicação ${err}`));



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

Agora vamos trabalhar o nosso serviço para que ele possa pegar o valor que foi passado como parâmetro, então vamos voltar ao TaskService.js:

```

export default class TaskService{

    constructor(resource){
        this._resource = resource('api/tasks{/id}')
    }

    /** Métodos anteriores **/

    getTaskById(id) {
        return this._resource
            .get({ id })
            .then(res => res.json())

    }
}
```

Depois vamos fazer uma alterações no nosso Info.vue, uma em nosso data, outro em nosso created, e em nossos método para ter mais uma função de update, primeiro o nosso created!

```
<script>

import Task from  '../../domain/task/Task'
import TaskService from '../../domain/task/TaskService'

export default {

    data() {

        return {
            task: new Task(),
            title:'Info:'
        }
     },
    },

    created() {
        this.service = new TaskService(this.$resource);

        if(this.id) {
            this.service
                .getTaskById(this.id)
                .then(res =>  {
                    return this.task = res
                }, err => {
                    console.log(`Erro pegar a task pela a id ${err}`)
                })
        }
    },


    methods:{
        updateTask(){

        }
    }


}
</script>

```

Okay, fizemos uma alteração dizendo que caso tenha uma id eu passo a mesma para o nosso método, e retorno o objeto para a minha task, só que tem um porém, como eu vou receber essa id?, então vamos a nossa alteração no data:

```
data() {
    return {
        task: new Task(),
        id: this.$route.params.id, <= Here!!
        title:'Info:'
    }
},
```

Como passamos no router uma id, eu recebo pelo nosso params, que contém o valor da id, e usamos isso no nosso created(), que ao receber um valor da id, faz a busca do nosso objeto, que uma task que vai ser passada a nossa model, e ai vem o conceito da data binding com o Vue,
vamos a uma observação na nossa template de Info.vue:

```
<form class="form-horizontal well" @submit.prevent="updateTask()" >
    <div class="form-group">
        <label for="" >Nome da Atividade:</label>
        <input type="text" class="form-control" v-model="task.activity">
    </div>
    <div class="form-group">
        <label for="" >Status da atividade:</label>
        <input type="checkbox" v-model="task.done">
    </div>
    <input type="submit" value="Salvar" class="btn btn-success">
</form>
```

Como criamos uma class Task que tem um constructor que recebe dois valores, a activity e done,
nós podemos trabalhar passando esses valores para a nossa model e receber as mesmas através do nosso método de busca, é algo bem legal, e se assemelha muito com o jeito Angular de realizar as coisas.

Continuando...

Se você observou bem, eu já tenho ali no meu form uma função, `updateTask()`, vamos criar essa mesma dentro do método, já que ela é bem semelhante ao nosso método de save, só vamos básicamente passar o id e receber o valor para atualizarmos a nossa view, e é isso:

```
methods:{
    updateTask(){
            this.service
            .saveTask(this.task)
            .then(() => {
                console.log('Atualizado com sucesso!');
            },err => console.log(`Erro em atualizar task ${err}`))
    }
}

```

E agora, vamos testar, se tudo foi seguido, a gente já conseguiu atualizar a nossa tarefa, e é isso!

Veja o Info.vue completo:

```
<template>
    <div>
        <h3 class="page-header">{{ title }}</h3>
        <div class="col-md-4">
           <form class="form-horizontal well" @submit.prevent="updateTask()" >
                <div class="form-group">
                    <label for="" >Nome da Atividade:</label>
                    <input type="text" class="form-control" v-model="task.activity">
                </div>
                <div class="form-group">
                    <label for="" >Status da atividade:</label>
                    <input type="checkbox" v-model="task.done">
                </div>
                <input type="submit" value="Salvar" class="btn btn-success">
           </form>

        </div>
    </div>

</template>
<script>

import Task from  '../../domain/task/Task'
import TaskService from '../../domain/task/TaskService'

export default {

    data() {
        return {
            task: new Task(),
            id: this.$route.params.id, <= Here!!
            title:'Info:'
        }
    },

    created() {
        this.service = new TaskService(this.$resource);

        if(this.id) {
            this.service
                .getTaskById(this.id)
                .then(res =>  {
                    return this.task = res
                }, err => {
                    console.log(`Erro pegar a task pela a id ${err}`)
                })
        }
    },


    methods:{
        updateTask(){
                this.service
                .saveTask(this.task)
                .then(() => {
                    console.log('Atualizado com sucesso!');
                },err => console.log(`Erro em atualizar task ${err}`))
        }
    }


}
</script>
<style>

.context{
    margin-top:10px;
}

textarea{
  min-height:15em;
  width:100%;
  max-width:100%;
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #000;
  margin: .5em 0 0.8em 0;
  color: #000;
}


</style>

```

Bem, acho que por hoje é só, ainda vamos fazer algumas pequenas alterações, mas o básico já fizemos, e nos próximos passos, vamos trabalhar nossa aplicação com Firebase, algo bem simples, mas legal, e vamos por último escrever a nossa sequência para o nosso teste e2e, e é isso, mais dois posts, e acho que concluímos, mais uma vez obrigado, e até mais =]
