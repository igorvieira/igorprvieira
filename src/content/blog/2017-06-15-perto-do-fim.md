---
title: "Nearing the End - Part IV "
pubDate: "Jun 15, 2017"
description: "Vuejs application"
category: Javascript, Vuejs
---

![ohyeah](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/ohyeah.jpg?raw=true)

Okay, let's continue with our project. The idea is that from here on we can create two more of our four methods. We've already created one to list and another to create new tasks, plus one that also performs updates, which will be used later. What we're going to do now is create a method to remove a task from our list. For this, we'll modify our remove function in Home.vue and we need to modify our service to delete the task. Let's go to our service:

TaskService.js:

```

export default class TaskService{

    constructor(resource){
        this._resource = resource('api/tasks{/id}')
    }

    /** Previous methods **/

    deleteTask(id){
        return this._resource
            .delete({id})
            .then(null, err => {
                console.log(err)
            })
    }
}
```

Below the saveTask() method

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

Well, the removeTask receives our object, then we call our service through this. Our service calls the deleteTask(id) method, in which we pass our object with the id key. Since this returns a promise, our task will be removed, but there's a problem: our list won't be updated on the front end because we only return an empty promise. What we do is use good old JavaScript: first we get the position value of our item in the array, then we get our array and pass it to splice, removing the item at that position. That's what these two lines in the function do:

```
const taskRemove = this.tasks.indexOf(taskItem)
this.tasks.splice(taskRemove,1 ),
```

Done, remove is finished. If you want, test it out: create an item and remove it.

And this is how our Home.vue will look:

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
                                        Edit
                                       </button>

                                    <a @click="removeTask(task)">
                                        <button class="btn">
                                        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                        Remove
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
    }, err => console.log(`Error listing our application ${err}`));



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

Note: I made a small modification to the style, quite simple, to separate the tasks and remove the bullets, and that's it.

To continue, we need to make some small changes in two parts: in routes, because we'll need another view to edit our task, and we need to add a `<router-link></router-link>` which is a tag to navigate to that route, which is a new view. We also need a method to receive the value passed by our route-link so we can work with it. So the order is as follows:

- routes
- Info.vue
- Modify Home.vue
- Create method to receive
  the value of a single task
- And test update in this new view

List done, let's act:

In routes.js we're going to make the following change: add one more path for where our other view is, Info.vue:

```
import Info from './components/info/Info.vue'

import Home from './components/home/Home.vue';


export const routes = [
    { path: '', name: 'home', component: Home, titulo: 'Home', menu: true },
    { path: '/info/:id', name:'info', component: Info, titulo: 'Info', menu: false },
    { path: '*', component: Home, menu: false }
]
```

Let's make another change: create our new component, Info.vue:

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

Our Info.vue view will look like this:

```
<template>
    <div>
        <h3 class="page-header">{{ title }}</h3>
        <div class="col-md-4">
           <form class="form-horizontal well" @submit.prevent="updateTask()" >
                <div class="form-group">
                    <label for="" >Activity Name:</label>
                    <input type="text" class="form-control" v-model="task.activity">
                </div>
                <div class="form-group">
                    <label for="" >Activity Status:</label>
                    <input type="checkbox" v-model="task.done">
                </div>
                <input type="submit" value="Save" class="btn btn-success">
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

I took the liberty of creating one more class inside the domain task, called Task.js. What does it do for me? It just creates a constructor that receives and returns the values that are passed through it, that's all:

```
export default class Task{

    constructor(activity, done){
        this.activity = activity
        this.done = done
    }


}
```

Let's make a small change to our Home.vue, in the edit button, so that it passes the id value to our next route.

```
<router-link :to="{ name: 'info', params: { id : task._id }}">
    <button class="btn">
    <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
    Editar
    </button>

</router-link>
```

If you noticed, in our router.js, we indicate which component that router will render in the view, and we can pass a name that is assigned to our view that will be rendered. Better yet, we can indicate this in the name, like in Home, `name:'info'`. Another thing is that since we indicated that the path could receive an id, in our params, we can also indicate that it receives an id as a parameter, and this is what we can use to do our work through the task id, and thus pass its value to the other view and be able to update it once it's already rendered.

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
                                        Edit
                                       </button>

                                    </router-link>
                                    <a @click="removeTask(task)">
                                        <button class="btn">
                                        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                        Remove
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
    }, err => console.log(`Error listing our application ${err}`));



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

Now let's work on our service so it can get the value that was passed as a parameter, so let's go back to TaskService.js:

```

export default class TaskService{

    constructor(resource){
        this._resource = resource('api/tasks{/id}')
    }

    /** Previous methods **/

    getTaskById(id) {
        return this._resource
            .get({ id })
            .then(res => res.json())

    }
}
```

Then we're going to make some changes to our Info.vue, one in our data, another in our created, and in our methods to have one more update function. First, our created!

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
                    console.log(`Error getting task by id ${err}`)
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

Okay, we made a change saying that if there's an id, I pass it to our method and return the object to my task. But there's a catch: how am I going to receive this id? So let's go to our change in data:

```
data() {
    return {
        task: new Task(),
        id: this.$route.params.id, <= Here!!
        title:'Info:'
    }
},
```

Since we pass an id in the router, I receive it through our params, which contains the id value, and we use this in our created(). When it receives an id value, it searches for our object, which is a task that will be passed to our model, and here comes the concept of data binding with Vue. Let's look at an observation in our Info.vue template:

```
<form class="form-horizontal well" @submit.prevent="updateTask()" >
    <div class="form-group">
        <label for="" >Activity Name:</label>
        <input type="text" class="form-control" v-model="task.activity">
    </div>
    <div class="form-group">
        <label for="" >Activity Status:</label>
        <input type="checkbox" v-model="task.done">
    </div>
    <input type="submit" value="Save" class="btn btn-success">
</form>
```

Since we created a Task class that has a constructor that receives two values, activity and done, we can work by passing these values to our model and receive them through our search method. It's pretty cool, and it's very similar to the Angular way of doing things.

Continuing...

If you looked closely, I already have a function there in my form, `updateTask()`. Let's create it inside methods, since it's very similar to our save method. We'll basically just pass the id and receive the value to update our view, and that's it:

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

And now, let's test it. If everything was followed correctly, we've already managed to update our task, and that's it!

See the complete Info.vue:

```
<template>
    <div>
        <h3 class="page-header">{{ title }}</h3>
        <div class="col-md-4">
           <form class="form-horizontal well" @submit.prevent="updateTask()" >
                <div class="form-group">
                    <label for="" >Activity Name:</label>
                    <input type="text" class="form-control" v-model="task.activity">
                </div>
                <div class="form-group">
                    <label for="" >Activity Status:</label>
                    <input type="checkbox" v-model="task.done">
                </div>
                <input type="submit" value="Save" class="btn btn-success">
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
                    console.log(`Error getting task by id ${err}`)
                })
        }
    },


    methods:{
        updateTask(){
                this.service
                .saveTask(this.task)
                .then(() => {
                    console.log('Updated successfully!');
                },err => console.log(`Error updating task ${err}`))
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

Well, I think that's it for today. We still have some small changes to make, but we've done the basics. In the next steps, we'll work on our application with Firebase, something quite simple but cool, and finally we'll write our sequence for our e2e test. That's it, two more posts and I think we'll be done. Thanks again, and see you later =]
