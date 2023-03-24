---
pubDate: "May 10, 2015"
title: A new Step - Variables!
description: How to work with variables in javascript
---

Today I proposed my self study JS, again, but I proposed to use the new features just like let, const, arrow function, template string, class, map, filter and other awesome functions and it's not new, I use, but some people dont and is not a problem, but I have a problem in seeing simple applications, like baby steps for you to see in "real life" and more, why you need to use these new features, for example, var is different from let and cont

var is a global variable
let specified a scope
And const normally use for a situation is no have a change of you have
but is possible use you have for other stuff's

![variables](/variables.jpeg)

So let in go for a example

```
var name = "Igor"


const saySomething = (name) => {

  let hey = 'Hey'

  return `${hey} ${name}`;

}

console.log(saySomething(name))



```

This is a function and I call this function "saySomething" this function have one paramter and for const is a perfect use, no have changes because this function receive one paramter and return one value, one value in and one value out, but inside in this function has a let variable
and this variable receive a string, this string return on template string in your value and the value pass in paramter but
is a one value, one in one out, for now I call this function inside a console.log and print "Hey Igor"
this is beautifull!

But I prove some points is possible call a pass and call again one variable var, and const is appropriate where i create a function in which it has the same return, however if a call a let variable?

This variable return a error, because this variable belongs to a one scope, saySomething()

```
//code
...

console.log(hey)

//Error: "ReferenceError: hey is not defined"

```

So Let belongs to a scope, var is now global and const is for a specific variable where i receive a value and i no have possibilities to change this value but is possible work in this value, var is terrible variable if you stop for think, is possible manipulated in all part in script and change your value, horever let your have warranty about value inside in your variable is possible work inside a function and return in a const function for exemplo.

I see greats changes for work now:

- Is possible use imutable variables if your need use this values in all script with const;
- Is possible work let variables with low riks for change and return this inside a function or another scope if, try e etc
- Now var depends a lot, since var is now synonymous with something volatile, for example, const declared as an array, receives values, is still an array even if its values ​​inside the array change, it still continues an array so i can replace var by const and ensure that it remains an array

```
//Just Const


const foo = []

let bar = "Hey"


foo.push(bar)
console.log(foo)
//["Hey"]



foo.push(bar)
console.log(foo)
//["Hey","Hey"]



foo.splice(1,1)
console.log(foo)
//["Hey"]

```

```
//Const if I try change your type

const foo = []
console.log(typeof foo)

foo = ""

console.log(typeof foo)

//"TypeError: Assignment to constant variable."
```

```
//Var be a var :p

var foo = []
console.log(typeof foo)
//object


foo = ""
console.log(typeof foo)
// string
```

For now I belive is a good first baby step and in this week I promise write another post about new features, next step we will talk more about arrow functions!

Thanks and see you soon!
