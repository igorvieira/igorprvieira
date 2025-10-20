---
title: Let's Talk About Vue.js - Part I
pubDate: "Apr 30 2017"
description: "Vuejs"
category: Javascript
---

![Vuejs](/vuejs.jpeg)

Well, I thought about talking about Vue.js. I thought about writing something in English, but before translating this text, I wanted people from my own country to understand Vue. Vue.js is a library for views, as the name actually suggests - even the pronunciation is quite similar ~ Vu ~. But what is Vue all about? In my point of view, it's a very well-made combination of React with some elements from Angular, which actually makes learning the framework easier, but doesn't lock you into its structure. Knowing JavaScript, you can do many things around the library.

Let's get to the objective of this post. What I intend to do in the next few days is create a simple application - the base is a [to-do-list](https://github.com/IgorVieira/to-do-list-vue), but with more interesting things about it. A to-do-list where you'll have notes for tasks, and with a testing approach. We'll guide our development through tests, and for this we'll use vue-cli. I'm not a big fan of CLIs, but I think this one presents a good approach. Here's the list of the workflow we'll need to build our application.

- vue-cli
- firebase
- vue-resource
- vue-router
- vuefire

First, let's install vue-cli:

```
    sudo npm install vue-cli -g
```

After we install it globally, we'll use the webpack version. You can choose browserify, but I don't recommend it - few people use it, and in my post I'll stick with webpack. Anyway, let's initialize the application like this:

```
    vue init webpack to-do-list
```

Done! It will start initializing our application. What we want is the following stack for our front-end:

```

? Project name to-do-list
? Project description A Vue.js project
? Author Igor Vieira <igor.p.r.vieira@gmail.com>
? Vue build standalone
? Install vue-router? No
? Use ESLint to lint your code? No
? Setup unit tests with Karma + Mocha? Yes
? Setup e2e tests with Nightwatch? Yes


vue-cli · Generated "to-do-list".

   To get started:

     cd to-do-list
     npm install
     npm run dev



```

And let's start from this. We enter the to-do-list directory, run npm install, and check how our application looks with npm run dev. Let's be happy!

Here I'll use VSCode, which already has plugins for vue-js. Just hit shift+ctrl+x, type vue-js and look for: Syntax Highlight for Vue.js, install it and that's it.

Let's enter the folder and change some things. First, let's go into the folder and into src
`./src` - this will be the only folder we'll work with for now. There's another folder inside called components. Let's delete the Hello.vue file. Notice that Vue.js has its own template, so everything we create has a .vue extension. Let's delete this file and create another folder, home/Home.vue, and it will look like this:

```
├── App.vue
├── components
│   └── home
│       └── Home.vue
└── main.js

```

Done! This is how we want our files. Going into App.vue, we'll make some small changes, but I prefer to delete everything and create step by step. So delete everything in App.vue and leave it like this:

```
<template>
</template>

<script>

    export default{

        data(){

             return{

             }

        }

    }

</script>


<style>
</style>
```

This is the basic structure of any component we'll create with Vue. The template is where we'll have our view and some attributes like binds, for example, where data comes from the view to our data and from data can be passed to our view. Data in this case refers to a function where we can work with our application, create objects, pass objects and call them in other parts of our application. We can work with numerous possibilities - it's quite interesting. And finally, we have our style, which handles the styling of our application.

To start, we need to organize this structure better. We'll just call Home and make it a single component of our View:

```
<template>
</template>


<script>
import Home from './components/home/Home'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>

</style>
```

Then we'll create our template. Notice that we added a new tag `<home></home>` and it's inside a div. This is important because everything we do must be passed in our template in a single block, always inside a div. Otherwise, it won't understand our component or the various components we might need.

PS: I've already added the style for the application. In the end, style is the part where we'll handle the CSS of our application. Not that CSS isn't important - we'll deal with it later!

```
<template>
  <div id="app">
    <home></home>
  </div>
</template>

<script>
import Home from './components/home/Home'

export default {
  name: 'app',
  components: {
    Home
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Indie+Flower');
#app {
  font-family: 'Indie Flower', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


```

Leaving App.vue, let's work with our first component, Home, in `./src/components/home/Home.vue`. We'll do the same thing - work on it from scratch.

```
<template>
</template>

<script>

    export default{

        data(){

             return{

             }

        }

    }

</script>


<style>
</style>
```

First, let's see if everything works well!

```
<template>

    <h1>Hey<h1>

</template>

<script>

    export default{

        data(){

             return{

             }

        }

    }

</script>


<style>
</style>
```

You might ask me:
"Igor, but doesn't template need to have a div inside?"
Not necessarily. If I only have one tag inside template, I can pass only that tag, even if it's a component - no problem. Now if I have more than one component, I'll need to put everything inside a div, but let's just test it as it is.

Well, we can see that it worked! Now we need to implement our small to-do list and see what was actually done!

For this, we'll work on our script. Vue is so intuitive that you can understand it this way: our data returns something to somewhere, and that somewhere is our view, which in this case is our template. So whatever we do in our data, we can pass to our view or even use in our script within a method. Let's start with the following: we'll show the title ~ Hey ~ through our data, and we'll do it like this:

```
<template>

    <h1>{{ title }}<h1>

</template>

<script>

    export default{

        data(){

             return{
                title:'Hey',

             }

        }

    }

</script>


<style>
</style>
```

Note that I created an attribute that receives a string called title, already defined with the following text: 'Hey', and I can call it in the view similarly to Angular's ng-expression {{ }}. Now let's create more - I want to create a list with my activities, meaning this will be an array. The only information I want to pass is the following: the text describing my activity and another attribute saying whether it's done or not, which is a boolean. Anyway, I took the liberty and our data will look like this:

```
<template>

    <h1>{{ title }}<h1>

</template>

<script>

    export default{

        data(){

             return{
                title:'Hey',
                tasks:[
                    {
                        name:'Read about Elixir',
                        done:true
                    },
                    {
                        name:'Write more about VueJS',
                        done:true
                    },
                    {
                        name:'Make a coffee',
                        done:true
                    }

                ]
             }

        }

    }

</script>


<style>
</style>
```

Well, we have our task list defined in our data, and we need to pass this to our template. How do we do this? We'll use a directive called v-for. For those coming from Angular, it reminds you of ng-for - it's very similar indeed, and the implementation will look like this:

```
<template>

    <h1>{{ title }}<h1>
     <ul >
        <li v-for="task in tasks">
            <span>{{ task.name }} - {{ task.done }} | </span>
        </li>
    </ul>
</template>

<script>

    export default{

       // código anterior

    }

</script>


<style>
</style>
```

However, this won't work. To fix this, we'll put our two tags h1 and ul li inside a single div. Now it will work perfectly! =]

The next step in the implementation is to create an input so we can add new tasks. We'll create a form where we'll have just a text input, a checkbox input, and a button. That's it:

```
<template>

    <h1>{{ title }}<h1>
     <ul >
        <li v-for="task in tasks">
            <span>{{ task.name }} - {{ task.done }} | </span>
        </li>
    </ul>
     <form>
        <input type="text">
        <input type="checkbox">
        <button class="btn" name="add">Add + </button>
     </form>
</template>

<script>

    export default{

        data(){

             return{
                title:'Hey',
                tasks:[
                    {
                        name:'Read about Elixir',
                        done:true
                    },
                    {
                        name:'Write more about VueJS',
                        done:true
                    },
                    {
                        name:'Make a coffee',
                        done:true
                    }

                ]
             }

        }

    }

</script>


<style>
</style>
```

Vue.js has an event called `@submit`, which we'll insert into our form. This way, any action performed within it through a submit will be executed by the function passed inside it. Let's create our function. Inside our export default, besides data, we can create other methods like this:

```
<template>
    // código anterior

    <form @submit="submitTask()">
        <input type="text">
        <input type="checkbox">
        <button class="btn" name="add">Add + </button>
     </form>
</template>

<script>

    export default{

        data(){

             return{
                title:'Hey',
                tasks:[
                    {
                        name:'Read about Elixir',
                        done:true
                    },
                    {
                        name:'Write more about VueJS',
                        done:true
                    },
                    {
                        name:'Make a coffee',
                        done:true
                    }

                ]
             }

        },

        methods:{

            submitTask(){
                console.log('I'm here!')
            }

        }

    }

</script>


<style>
</style>
```

But there's a problem: when we click on our form's button, it generates a page reload, and we don't want that. So to fix this, we just need to add a prevent modifier to the event, similar to `e.preventDefault()`, but like this: `@submit.prevent="submitTask()"`. This ensures that when new information is added, it won't cause a page reload. Now, let's actually implement the input. For this, we'll need to create a new attribute in data - a task that will be an object. When we pass it to our list, we'll just need to push it to the list and it will be added to the array of objects. So let's take it slow - first the object in our data:

```
<template>
    // código anterior

</template>

<script>

    export default{

        data(){

             return{
                title:'Hey',
                tasks:[
                    {
                        name:'Read about Elixir',
                        done:true
                    },
                    {
                        name:'Write more about VueJS',
                        done:true
                    },
                    {
                        name:'Make a coffee',
                        done:true
                    }

                ],
                task:{
                    name:'',
                    done:false
                }

             }

        },

        methods:{
             // código anterior
        }

    }

</script>


<style>
</style>
```

Done! We've created our object. Task receives name and done as false, because our checkbox attribute when checked will receive true, and in its current state the element already has the value as false by itself. Now let's go to our function:

```
  methods:{

            submitTask(){
                this.tasks.push(this.task)
                this.task = {
                    name:'',
                    done:false
                }
            }

        }

    }

</script>


<style>
</style>
```

What we're saying here is: we receive an object that will be filled by our view and pass a new object through our push. It's cool to note that we can access tasks through `this` and thus we can keep adding more positions to our array. But how will we get this information? How will we add it to our array? Let's do the following: Vue.js itself has a directive called v-model that can bring rendered elements from the view to data and from data to view. This way we can assign the value that was passed from our view to our data and add it to our tasks array, to our task list, like this:

```


<template>

        <div>
            <h1>{{ title }}</h1>
            <ul >
                <li v-for="task in tasks">
                    <span>{{ task.name }} - {{ task.done }} | </span>
                </li>
            </ul>
            <form @submit.prevent="submitTask()">
                <input type="text" v-model="task.name">
                <input type="checkbox" v-model="task.done">
                <button class="btn" name="add">Add + </button>
            </form>

        </div>

</template>
```

Notice that the inputs have a v-model, where in each one I have my task object with its attributes. It's all a matter of key and value - I receive the value in each input, they're passed to my object, my object is inserted through the push method to my tasks array, which is an array of objects, and thus my array gains a new position. Simple and easy! Now to finish today's post, let's implement how to delete a task!

This is quite simple. How do we see a position in an array? Through the indexOf() of the same array. So in the end we just need to know the position and remove the object present in that array with splice. Let's see how this is done. First, let's modify our template:

```
 <ul >
    <li v-for="task in tasks">
        <span>{{ task.name }} - {{ task.done }} | </span>
        <i @click="removeTask(task)" class="fa fa-trash"></i>
    </li>
</ul>
```

See that now in our list I've added an icon. This icon is from Font Awesome - we'll be able to use it soon, but first let's focus on what matters. We have a `@click` event that receives a function which has a parameter called task. What we'll do now is the following - let's go to our methods:

```
  methods:{

            submitTask(){
                this.tasks.push(this.task)
                this.task = {
                    name:'',
                    done:false
                }
            },


             removeTask(taskItem){
                const taskRemove = this.tasks.indexOf(taskItem)
                this.tasks.splice(taskRemove,1 )
            }

        }

    }

</script>


<style>
</style>
```

The removeTask(taskItem) function will receive an item from our list. What we want is its position, so we take our item, see the position in the array, then take the same array and remove the object present in the position we indicated before. We use splice to remove the object at that position, and that's it! In the end, our Home will look like this:

```
<template>

        <div>
            <h1>{{ title }}</h1>
            <ul >
                <li v-for="task in tasks">
                    <span>{{ task.name }} - {{ task.done }} | </span>
                    <i @click="removeTask(task)" class="fa fa-trash"></i>
                </li>
            </ul>
            <form @submit.prevent="submitTask()">
                <input type="text" v-model="task.name">
                <input type="checkbox" v-model="task.done">
                <button class="btn" name="add">Add + </button>
            </form>

        </div>

</template>
<script>



export default {

    data(){
        return{
            title:'Hey!',
            tasks:[
                {
                    name:'Read about Elixir',
                    done:true
                },
                {
                    name:'Write more about VueJS',
                    done:true
                },
                {
                    name:'Make a coffee',
                    done:true
                }

            ],
            task: {
                name:'',
                done:false
            }

        }
    },
    methods:{

        submitTask(){
           this.tasks.push(this.task)
           this.task = {
                name:'',
                done:false
            }
        },

        removeTask(taskItem){
           const taskRemove = this.tasks.indexOf(taskItem)
           this.tasks.splice(taskRemove,1 )
        }




    }

}

</script>
<style>


</style>

```

Let's just take advantage of the fact that we have a class in our form's button and make it look like this - it will look nicer:

```
<template>

        <div>
            <h1>{{ title }}</h1>
            <ul >
                <li v-for="task in tasks">
                    <span>{{ task.name }} - {{ task.done }} | </span>
                    <i @click="removeTask(task)" class="fa fa-trash"></i>
                </li>
            </ul>
            <form @submit.prevent="submitTask()">
                <input type="text" v-model="task.name">
                <input type="checkbox" v-model="task.done">
                <button class="btn" name="add">Add + </button>
            </form>

        </div>

</template>
<script>



export default {

    data(){
        return{
            title:'Hey!',
            tasks:[
                {
                    name:'Read about Elixir',
                    done:true
                },
                {
                    name:'Write more about VueJS',
                    done:true
                },
                {
                    name:'Make a coffee',
                    done:true
                }

            ],
            task: {
                name:'',
                done:false
            }

        }
    },
    methods:{

        submitTask(){
           this.tasks.push(this.task)
           this.task = {
                name:'',
                done:false
            }
        },

        removeTask(taskItem){
           const taskRemove = this.tasks.indexOf(taskItem)
           this.tasks.splice(taskRemove,1 )
        }




    }

}

</script>
<style>

  .btn{
    color:#ccc;
    background:#1554DB;
    border-radius:6px;
    width: 4rem;
    height: 2em;
    padding:1.3em, 1.3rem, 1.3em;
    cursor:pointer;
  }

</style>
```

And add the Font Awesome script tag in the index.html at the project root

```
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="utf-8">
       <title>To do List!</title>
       <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">
   </head>
   <body>
       <div id="app"></div>
       <!-- built files will be auto injected -->
   </body>
   </html>
```

Done! First step completed. Next step: we'll do two small tests with our application, an e2e test and a unit test, but that will be in the next post. For now, that's all - thanks and see you later! =]
