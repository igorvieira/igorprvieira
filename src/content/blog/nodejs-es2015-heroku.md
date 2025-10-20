---
pubDate: "Nov 22, 2016"
title: "NodeJS(ES2015) + Heroku  "
description: "How to deploy a Node.js application"
---

First, "why Heroku?" The idea is actually to start with something simpler that everyone can use. Since I believe this platform is really more practical, it becomes perfect for our approach. In terms related to work itself, Heroku is a bit more expensive, a bit, but it compensates for its practicality. In the end, you have a cloud that serves you well, provides you with add-ons that are useful for your projects, and you can even get free SSL! Which is very good. In any case, Heroku is great both for simpler projects like what we're going to do now, and for more elaborate projects, real projects. And with that, let's go to another question: how to create a Node.js application with ES2015 that works perfectly with Heroku?! =]

I had researched several solutions for this, mainly because of some projects I received which were built in NodeJS and Angular, and currently (11/22/2016) if you look at Heroku's documentation, the Getting Started on how to build a project with Node.js, it even has a repository and instructions on how to do it, but with a syntax that doesn't fully correspond to ES2015. And whether you like it or not, JS in ES6 is more readable, more practical and facilitates in various ways the development of your application, both by adopting let and its behavioral form in relation to scope, the new way of building functions, the organization of your class structures among other things that contribute to the maintenance of your code.

Anyway, let's get to the code!
Our project will have the following files:

```
.
├── app.js
├── package.json
├── Procfile
└── server.js

```

To start, let's set up our package.json and to speed things up let's type the following command:
npm init -y
And now let's add the modules to package.json, which are basic to deploy this project and run npm install

```

 "dependencies": {
    "babel": "^6.5.2",
    "babel-cli": "^6.14.0",
    "babel-preset-es2015": "^6.13.2",
    "express": "^4.14.0"
  }

```

Once done, let's move to our next file, app.js. With it we'll make some syntax changes. Until now, in older versions of Node.js you made module requests through requires, for example:

```
var express = require('express')
```

In ES2015, module calls are done through imports:

```
import express from 'express'
```

So let's stick with import in our file to call the express module:

```
# app.js
# Module import
import express from 'express'

```

In the midst of this, another change is the form of composition. You used to create an app variable which received express and thus made use of the functions that derive from express, something similar to this:

```
var express =  require('express')
var app = express()

```

The bad thing about this approach is that it had to be exported within a module.exports, actually a return of all middlewares or functions in a single block, for example passing app.set('port) to be able to run the application in production or development. The code so far looked like this:

```

var express = require('express')
var app = express()
module.export = function(){

# here you would mainly put your middlewares
# and in the end just return the app loading everything

app.set('port', (process.env.PORT || 3000));
return app
}


```

Now with ES6 it's even simpler:

```
import express from 'express'

const app = express()

app.set('port', (process.env.PORT || 3000))

export default app

```

Personally, I think this way the code is more readable, exactly because it is as simple as it is. But for a start, the simplicity of a well-done basic reflects a lot in the development of more elaborate applications.

Another significant change is the way to write request and response functions. You can write them using arrow functions.
For example:

```
app.route(' / ').get((req, res) => res.end('Hello World'))

```

It's simpler to write functions like this than the next form found below. The reading is more fluid, especially for the versatility of being able in this case, to write the same function in one line. At least this gives you the feeling of understanding about what this function really does, which is strange if you try to concatenate the same function in one line in ES5.

```

app.route(' / ').get( function(req, res){
      res.end('Hello World')
})

```

Everything in ES5 looks like this:

```

var express = require('express')

var app = express()
module.export = function(){

app.route(' / ').get( function(req, res){
      res.end('Hello World')
})

app.set('port', (process.env.PORT || 3000));

return app
}

```

Now in ES6 our code looks like this:

```

import express from 'express'

const app = express()

app.route(' / ').get((req, res) => res.end('Hello World'))

app.set('port', (process.env.PORT || 3000))

export default app

```

What we see is the gain in readability and simplicity. Readability is the key word in all this, because in terms of maintainability, these small changes help considerably in large-scale projects. In fact, it's still possible to separate and build an architecture with small modules to facilitate the organization of our application, because whether you like it or not, when you have a very large application, it's not interesting to have, for example, route functions in a file that sets the basic modules for the application to function as a whole.
Continuing...

The next file is server.js. Actually it's the simplest since we understand the small modifications that give a nice syntactic sugar and facilitate the reading of our code. Well, first let's import the app module that contains our configuration for a basic server and our main route.

```
import app from './app'
```

Then let's add to our server the http request protocol, which is a native Node module that actually creates our server, and in the end our imports look like this:

```
import app from "./app"
import http from "http"

```

Once done, let's actually create our server:

```
import app from "./app"
import http from "http"

http.createServer(app.get('port')).listen(port, ()=>{
  console.log('server is running:'+ port)
})
```

Just to improve this all, let's create a new constant for port:

```
import app from "./app"
import http from "http"

const port = app.get('port')

http.createServer(app).listen(port, ()=>{
  console.log('server is running:'+ port)
})
```

Let's go to one more file .babelrc. It's a file for loading plugins. In this case we'll have our plugin so we can write in ES2015:

```
/ * .babelrc */
{
  "presets": ["es2015"]
}
```

Ok, we're almost done...almost haha
Now, if you run the code, simply type ```node server```, it will give the following error:

```
(function (exports, require, module, __filename, __dirname) { import app from "./app"
                                                              ^^^^^^
SyntaxError: Unexpected token import
```

Why doesn't it work? Because Node doesn't have all the ES2015 features in its core, so we'll have to go back to our package.json and make a small modification to our scripts scope, and we'll write our start this way, using babel-node to run our server:

```

 "scripts": {
       "start": "./node_modules/.bin/babel-node server.js",
       "test": "echo \"Error: no test specified\" && exit 1"
  }

```

Now if you type the npm start command, it will start the server locally and you'll see the Hello World from our application.
So far our files look like this:

```

# app.js

import express from 'express';
const. app = express();
app.route('/') .get((req, res)=>res.end('Hello World'))
app.set('port', (process.env.PORT || 3000))


export default app;


# server.js


import app from "./app"
import http from "http"
const port = app.get('port')
http.createServer(app).listen(port, ()=>{
  console.log('server is running:'+ port)
})


# package.json


{
  "name": "node-heroku",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "./node_modules/.bin/babel-node server.js"
  },
  "dependencies": {
    "babel": "^6.5.2",
    "babel-cli": "^6.14.0",
    "babel-preset-es2015": "^6.13.2",
    "express": "^4.14.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


```

Ready, now let's go to the grand finale! The Deploy =]
Let's add the Procfile to our repository. It's just a file without extension called Procfile.

```

# Procfile


web: ./node modules/.bin/babel-node server.js

```

This file makes you run the server the same way you did in package.json, but this time it will initialize our application on Heroku. It's a very important file.

Now to upload all our files we'll have to initialize git, because Heroku also works through git. Actually, it's the best way to upload your repository and let's do the basics:

```

git init /* to initialize the git folder in the repository */

```

Once done, to not import everything, it doesn't hurt to add a simple .gitignore file to not upload node_modules to Heroku.

```

#  .gitignore


/node_modules

```

And let's commit everything.

```
git add .
git commit -m "initial commit"

```

Well, to perform the deploy you need to have an account on [Heroku](https://www.heroku.com/) and need to download the [Heroku Toolbelt](https://devcenter.heroku.com/articles/heroku-command-line) client.
After installing Heroku toolbelt and creating your account, you'll enter the repository where our code is and type the following command:

```
heroku login
It will ask for your Heroku account:
Enter  your Heroku credentials.
Email: igor.p.r.vieira@gmail.com
Password (typing will be hidden):
```

Already properly authenticated, let's go to our next and last step, create our application on Heroku. You can type the following command to create a URL automatically or you can create a URL for yourself manually:

```

#  Automatic URL


heroku create


# Specific URL


heroku create meu-app-nodejs /*my application name*/

```

After creating our app on Heroku and since we already committed our repository, just run the command to deploy through git itself.

```
git push heroku master

```

Then you'll see the link to access your application.

In my case:
https://my-app-nodejs.herokuapp.com/

And finally our Hello World!
And that's it, it was long. The source code is below. Any questions, leave your comment. Thanks and see you later! =]

Source code: [Github!](https://github.com/IgorVieira/my-app-nodejs)
