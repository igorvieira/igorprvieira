---
title: "Testes e2e para verificar a nossa aplicação - Part VII "
pubDate: "Jul 18, 2017"
description: "Vuejs Application"
category: Javascript, Vuejs
---

![checklist](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/checklist.jpg?raw=true)

Hoje vamos falar a respeito de teste e2e, a ideia é poder entregar uma aplicação no qual você pode testar ela
de ponta a ponta, e poder falar no final que nossa aplicação está funcionando perfeitamente, e
poder entregar de fato aquilo que foi projetado da forma que foi projetado.

Vamos abrir a nossa aplicação e precisamos realizar algumas alterações, e indo direto no nossa parte e2e, base
desse post, no nossos specs, vamos ter somente uma suite de teste, só que dessa vez queremos realizar dois testes
um para ver adicionar uma nova tarefa e outra para poder editar uma tarefa.

E podemos excluir o que temos por default, nosso objetivo é criar um novo, e mas tão simples quanto, esse será
o nome dele, firstTaskSpec.js

```
module.exports = {
    'new task': function (browser) {
      const devServer = browser.globals.devServerURL;
      browser
       .url(devServer)
       .waitForElementVisible('.page-header', 5000)
       .assert.containsText('h3', 'To do Vue!')
       .setValue('input[name=activity_input]', 'Make a coffee')
       .setValue('input[name=checkbox_input]', true)
       .pause(2000)
       .click('button[name=add]')
       .pause(3000)
       .assert.containsText('.panel-title', 'Make a coffee')
       .end();
     },
  };
```

O que definimos aqui é, temos uma sequencia de atividades que vão sendo realizadas , é como se tivessemos um roteiro
e ele vai seguindo o roteiro de cada uma das nossas ações, but ... antes de continuarmos, temos que fazer mais três alterações
temos que alterar nosso form, observe o nosso `.setValue('input[name=activity_input]', 'Make a coffee')`, ele está buscando
uma tag input no qual o seu name é acitivity_input, assim como nosso outro .setValue, tem um name tentando buscar o que é o
seu checkbox_input, ambos precisam ser alterados em nossa home, é isso que iremos fazer:

```
<div class="row">
  <div class="col-md-5 col-md-offset-2 well">
      <form @submit.prevent="submitTask()">
        <div class="form-group">
            <label for="">Atividade:</label>
            <input class="form-control" type="text" name="activity_input" v-model="task.activity">
        </div>
        <div class="form-group">
            <label for="">Status:</label>
            <input  type="checkbox"  name="checkbox_input" v-model="task.done">
        </div>

        <button class="btn" name="add">Add + </button>
    </form>
  </div>
</div>
```

Semelhantemente teremos que fazer alterações em info.vue, visto que vamos ter um spec para ele também.

```
<form class="form-horizontal well" @submit.prevent="updateTask()" >
    <div class="form-group">
        <label for="" >Nome da Atividade:</label>
        <input type="text" class="form-control" v-model="task.activity"  name="activity_input">
    </div>
    <div class="form-group">
        <label for="" >Status da atividade:</label>
        <input type="checkbox" v-model="task.done"  name="checkbox_input">
    </div>
    <input type="submit" value="Salvar" class="btn btn-success">
</form>
```

E são somente essas as alterações, para podermos testar as funcionalidade de update, feito você pode rodar um primeiro test:

```
sudo npm run test
```

Se o status para assetions foi completo, vamos para o nosso segundo teste:

secondTaskSpec.js

```
module.exports = {
	'update task': function (browser) {
		const devServer = browser.globals.devServerURL;

		browser
			.url(devServer)
      .waitForElementVisible('.page-header', 5000)
      .assert.containsText('h3', 'To do Vue!')
      .click('button[name=edit_task]')
			.pause(3000)
			.setValue('input[name=activity_input]', 'Make a omelete!')
      .setValue('input[name=checkbox_input]', true)
      .pause(2000)
			.assert.containsText('.page-header', 'Info:')
			.click('input[type=submit]')
			.pause(2000)
      .end();
	},
};

```

A ideia desse é clicar no primeiro edit_task e alterar a view e alterar o input dessa task para `Make a omelete!` e é isso, submeter e alterar, nada de mais, bem acho que por hoje é só, um post simples sobre algo bem tranquilo de se abordar, mais uma vez, obrigado =]
