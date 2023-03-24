---
title: Vamos falar de Vuejs - Part I
pubDate: "Apr 30 2017"
description: "Vuejs"
category: Javascript
---

![Vuejs](/vuejs.jpeg)

Bem, eu pensei em falar sobre Vuejs, pensei em escrever algo sobre em inglês, mas antes de traduzir esse texto, quero que as pessoas do meu próprio pais entendam Vue, Vuejs é uma bibliteca para views como o próprio nome diz de fato, tanto que pronuncia é bem semelhante ~ Vu ~, mas do que se trata Vue, em meu ponto de vista, ele é uma junção muito bem feita de React com algumas coisas pertinentes ao Angular, o que de fato facilita o aprendizado do framework, mas não te prende a sua estrutura, sabendo Javascript, você consegue fazer muitas coisas em torno da biblioteca.

Vamos ao objetivo deste post, o que pretendo nos próximos dias é criar uma aplicação simples, a base é um [to-do-list](https://github.com/IgorVieira/to-do-list-vue), porém com coisas mais interessantes sobre o mesmo, um to-do-list onde você terá anotações para task, e com uma abordagem em tests, vamos guiar nosso desenvolvimento por meio de tests, e para isso vamos usar o vue-cli, não sou muito fã de cli, mas acho que esse apresenta uma boa abordagem, eis a lista do workflow que iremos precisar para montar a nossa aplicação.

- vue-cli
- firebase
- vue-resource
- vue-router
- vuefire

Primeiro vamos instalar o vue-cli:

```
    sudo npm install vue-cli -g
```

Depois que instalamos ele globalmente, vamos utilizar a versão dele com webpack, você pode escolher browserify, não recomendo, poucos usam, e o meu post eu devo seguir mesmo com webpack, de toda forma vamos inicializar aplicação assim:

```
    vue init webpack to-do-list
```

Pronto, ele vai criar começar a inicializar a nossa aplicação, o que queremos é a seguinte stack para o nosso front:

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

E vamos começar a partir disso, entramos ai no to-do-list, damos um npm install e vamos ver mesmo como está a nossa aplicação com npm run dev, e sejamos felizes.

Aqui eu vou usar o VSCode, ele já tem uns plugins para vue-js, é só um shift+ctrl+x, digita vue-js e procure o: Syntax Highlight for Vue.js, instale e é isso.

Vamos entrar na pasta e alterar algumas coisas, primeiro, vamos entrar no folder e em src
`./src`, esse vai ser por hora o único folder que iremos trabalhar , existe outro folder dentro chamado componentes, vamos deletar esse arquivo, Hello.vue,pronto, repare que Vuejs tem um template próprio, então tudo o que vamos criar tem uma certa extensão .vue, vamos deletar esse arquivo e criar um outro folder, home/Home.vue e ficará assim:

```
├── App.vue
├── components
│   └── home
│       └── Home.vue
└── main.js

```

Pronto, é assim que queremos os nossos arquivos, indo em App.vue, vamos fazer algumas pequenas alterações, mas eu vou preferir apagar tudo e criar passo a passo, então apague tudo em App.vue e deixe da seguinte forma:

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

Essa é a estrutura básica de qualquer componente que viemos a criar com Vue, template é onde teremos a nossa view e alguns atributos como binds por exemplo no qual os dados vem da view ao nosso data e do data pode ser passado a nossa view, data nesse caso se emplica a uma função onde podemos trabalhar a nossa aplicação, criar objetos, passar objetos e poder chamá-los em outras partes da nossa aplicação, podemos trabalhar inúmeras possiblidades, é bem interessante, e por fim temos o nosso style, que implica na estilização da nossa aplicação.

Para inicio, temos que organizar essa estrura melhor, vamos somente chamar Home e tornar ele como um componente único da nossa View,

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

Depois vamos criar o nosso template, repare que colocamos uma nova tag `<home></home>` e ela está dentro de uma div, ela é importante pelo seguinte, tudo o que fizermos temos que passar em nosso template em um único bloco, sempre dentro de uma div, caso contrário ele não entenderá o nosso componente ou os diversos componentes que precisarmos.

PS:Eu adicionei já o estilo para a aplicação, no fim style é aparte onde trataremos o CSS da nossa aplicação, não que CSS não seja importante, mais para frente trataremos a respeito dele!

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

Saindo de App.vue, vamos trabalhar com o nosso primeiro componente, Home, em `./src/components/home/Home.vue`, vamos fazer a mesma coisa, trabalhar ele do zero.

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

Primeiro vamos ver se tudo funciona bem!

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

Ai você me pergunta:
"Igor mas dentro de template não teria que ter uma div? "
Não necessiariamente, se eu tiver apenas uma tag dentro de template, eu posso passar somente essa tag, mesmo se for um componente, não tem problema, agora se eu tiver mais de um componente, eu precisarei colocar tudo dentro de uma div de fato, mas vamos testar somente como está.

Bem, podemos notar que funcionou, agora precisamos implementar a nossa pequena lista de afazeres, e ver o que de fato foi feito!

Para isso vamos trabalhar em nosso script, Vue é tão intuitivo, que você pode entender ele da seguinte forma, nosso data, retorna algo para algum lugar, e esse lugar é a nossa view, que no caso é nosso template, então o que fizermos em nosso data, podemos passar para nossa view ou até mesmo útilizar em nosso script dentro de um metódo, vamos começar pelo seguinte, vamos mostrar o titulo ~ Hey ~ pelo nosso data, e assim faremos:

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

Note, eu criei um atributo que recebe uma string com o nome title, e já definida com seguinte texto: 'Hey' e o mesmo eu posso chamar na view algo semelhante ao ng-expression do Angular {{ }}, agora vamos criar mais, quero criar uma lista com as minhas atividades, ou seja, isso será um array, as unicas informações que quero passar são as seguintes, o texto descrevendo a minha atividade e um outro atributo dizendo se foi feita ou não, que é um boolean, enfim, tomei a liberdade e o nosso data ficará assim:

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

Pois bem, temos o nossa lista de tarefas definidas em nosso data, e precisamos passar isso em nosso template, como fazer isso? vamos usar de uma diretiva chamada v-for, para quem vem de Angular, lembra muito o ng-for, é bem semelhante mesmo e a implementação ficara dessa forma:

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

Entretanto isso não funcionará, como remediar isso, colocamos as nossas duas tags h1 e ul li dentro de uma única div, agora sim funcionará perfeitamente. =]

Próximo passo será a implementação é criar um input, para podermos adicionar novas tarefas, vamos criar um form onde teremos apenas um input do tipo text e outro do tipo checkbox e mais um button, e é isso:

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

O VueJS tem um evento chamdo de `@submit`, no qual vamos inserir no nosso form, assim qualquer ação efetuada dentro dele atraves de um submit, será efetuada pela função que foi passada por dentro dele, vamos criar a nossa função, dentro de nosso export default, além de data, podemos criar outros métodos, da seguinte forma:

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

Só que tem um problema, quando clicamos no button do nosso form, ele gera um reload na página, e não queremos isso, então para podermos solucionar isso, só precisamos adicionar junto ao evento, um prevent, igual ao `e.preventDefault()`, mas da seguinte forma `@submit.prevent="submitTask()"`, assim nós garantimos que quando for adicionado uma nova informação, a mesma não irá gerar um reload na página, bem, passado isso, vamos implementar de fato o input, para isso precisaremos criar um novo atributo em data, uma task que será um objeto, e qual quando formos passar para o nossa lista, só precisaremos dar um push junto a lista e ela será adicionada junto ao array de objetos, então vamos com calma, primeiro o objeto em nosso data:

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

Pronto, criamos o nosso objeto, task recebe nome e como done, false, pois o nosso atributo checkbox quando marcado receberá true e no seu estado atual do elemento ele já tem por si só o valor como false, agora vamos para a nossa função:

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

O que dizemos aqui foi o seguinte, recebemos um objeto que será preenchido pela nossa view e passamos atráves do nosso push um novo objeto, é legal notar que conseguimos acessar tasks atráves do `this` e assim podemos ir adicionando mais uma posição em nosso array, mas como vamos pegar essas informações? como vamos adicionar ao nosso array? Vamos fazer o seguinte, o próprio Vuejs tem uma diretiva chamada v-model que consegue trazer os elementos renderizados da view para o data e do data para view, e dessa forma conseguiremos atribuir o valor que foi passado da nossa view para o nosso data e adicioná-lo em nosso array de tarefas, em nossa lista de tarefas, dessa forma:

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

Observe que nos inputs tem um v-model, em que cada um deles eu tenho o meu objeto task com seus atributos, tudo é uma questão de chave e valor, eu recebo o valor em cada um dos inputs, eles são passados para o meu objeto, meu objeto é inserido atraves do método push ao meu array tasks, que é um array de objetos, e assim meu array ganha uma nova posição, simples e fácil, agora para encerrar o post de hoje, vamos implementar como deletar uma tarefa!

Esse é bem simples, como vemos uma posição de um array? Atráves do indexOf() do mesmo array, então no fim só precisamos saber a posição, e retirar o objeto presente naquele array com splice, vejamos como é isso, primeriamente, vamos modifcar nosso template:

```
 <ul >
    <li v-for="task in tasks">
        <span>{{ task.name }} - {{ task.done }} | </span>
        <i @click="removeTask(task)" class="fa fa-trash"></i>
    </li>
</ul>
```

Veja que agora na nossa lista eu adicionei um icon, esse icon é do font awesome, já já vamos poder usá-lo, mas antes vamos focar no que importa, temos um evento de `@click` que recebe uma função na qual a mesma tem um parametro chamdo task, o que faremos agora é o seguinte, vamos ao nossos methods:

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

A função removeTask(taskItem), receberá um item da nossa lista, o que queremos é a posição dele, então pegamos o nosso item, vemos a posição referente ao array, depois pegamos nosso mesmo array e retiramos o objeto presente na posição ao qual indicamos antes, e usamos o splice pare retirar o objeto referente aquela posição, e é isso, no fim nosso Home ficará assim:

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

Só vamos aproveitar que temos uma class em button do nosso form e vamos deixar ele assim, ficará mais bonito:

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

E adicionar a tag script do font-awesome no index.html da raiz do projeto

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

Pronto, first step concluído, próximo passo, vamos fazer dois pequenos testes com a nossa aplicação, um teste e2e e um teste unitário, mas isso será um próximo post, por enquanto é só, obrigado e até mais =]
