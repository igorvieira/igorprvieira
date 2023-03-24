---
pubDate: "May 10, 2015"
title: Talk about arrow functions again!
description: Write more with less
category: Javascript
---

Why will you talk about arrow function? Everybody knows about this, everbody knows in this way is more simple to write a function, but somepeople don't know how powerfull write and use arrow functions, we go to first example

```
// we have a normaly function


function iDOSomething (name) {
 Return console.log ("My name is:" + name);
}



console.log (iDoSomething ('Igor'))

```

Now we go to rewrite this same function

```

IDoSomething = (name) => `My name is $ {name}`;
Console.log (iDoSomething ('Igor'))


```

If your note, arrow functions is a sintaxe sugar, whats this? Is more easy to write a function less verbose and more simple for you or other people understand what I you do, for exemplo a good way to read a code
is a code in your read is easy, just like baby steps, go back to code, step by step

iDoSomething - The name about my function

= (Name) => - I expect the name in my function

`My name is $ {name}` - The return about my function

Just like a flux data, simple to read and simple to write, good code need to be just like this.

But you need to pay attention, look over this way to write, you see another detail, I write a function and do not pass to return, note, I wrote in one line, but if you have a block in the arrow function, you need to pass this return, the otherwise you receive the undefine because you pass and this function receive the params but not return the same value in this function try to return something and this something is undefine.

```
iDoSomething = (name) => {
`My name is $ {name}`
}
```

```
console.log (iDoSomething ('Igor'))

// undefine

```

In real is possible write the diferents way:

```
const iDoSomething =(name)=> { ...}
iDoSomething =(name)=> {...}

const calc = {
    mult:(x,y) => x * y,
    ...
 }

console.log(`Possible multiply: ${calc.mult(5,10)}`)



```

In the end this arrow function, is the syntax sugar, is the way more easy to read and write, perfect to use with promises and the little way to distinct, organize and standardize your code for the other programers, and is possible to write just like a describe function, is possible to build a stack for resolve functions, especially if you have a stack of asynchronous functions,but the big power about this way to write is organization and the simplicity of writing code, probably you work in team and other people read you do, so... in the end you do not write for you, you Write for the others, so write a good code just like baby steps, thank you for your time and see you soon!
