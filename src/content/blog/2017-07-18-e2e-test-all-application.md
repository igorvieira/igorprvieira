---
title: "E2E Tests to Verify Our Application - Part VII "
pubDate: "Jul 18, 2017"
description: "Vuejs Application"
category: Javascript, Vuejs
---

![checklist](https://github.com/IgorVieira/igorvieira.github.io/blob/master/_images/checklist.jpg?raw=true)

Today we're going to talk about e2e testing. The idea is to be able to deliver an application where you can test it
end to end, and be able to say in the end that our application is working perfectly, and
be able to actually deliver what was designed the way it was designed.

Let's open our application and we need to make some changes. Going straight to our e2e part, the basis
of this post, in our specs, we're going to have only one test suite, but this time we want to perform two tests:
one to add a new task and another to edit a task.

And we can delete what we have by default. Our goal is to create a new one, and just as simple. This will be
its name: firstTaskSpec.js

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

What we defined here is that we have a sequence of activities that are being performed. It's as if we had a script
and it follows the script of each of our actions. But... before we continue, we have to make three more changes.
We have to change our form. Look at our `.setValue('input[name=activity_input]', 'Make a coffee')` - it's looking for
an input tag where its name is activity_input, just like our other .setValue has a name trying to find what
its checkbox_input is. Both need to be changed in our home. This is what we'll do:

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

Similarly, we'll have to make changes to info.vue, since we're going to have a spec for it too.

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

And these are the only changes. To be able to test the update functionality, once done you can run a first test:

```
sudo npm run test
```

If the status for assertions was complete, let's go to our second test:

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

The idea of this one is to click on the first edit_task and change the view and change the input of this task to `Make a omelete!` and that's it - submit and change, nothing more. Well, I think that's it for today, a simple post about something very easy to approach. Once again, thank you =]
