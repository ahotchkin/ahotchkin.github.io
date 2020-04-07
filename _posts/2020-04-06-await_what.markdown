---
layout: post
title:      "Await, what?"
date:       2020-04-06 17:20:12 -0400
permalink:  await_what
---


I recently completed a <a href="https://youtu.be/rpA5Lei2CPc">Harry Potter Trivia</a> project with a Rails API backend and a JavaScript frontend. The project had several moving parts, including a handful of fetch requests and chains on chains of `then()`s. When I finally finished the project I was feeling really good about the code, it seemed clean and easy to read. And then I heard that `then()` is no longer the preferred method to use when dealing with `Promise`s. Ummm…excuse me? So you’re telling me my project that I just worked tirelessly on for months is not as cutting edge as I thought? Dang.

<img src="https://media.giphy.com/media/3o7TKA3ypeMbOXSrp6/giphy.gif" width="480px" height="330px">

I found myself in an interesting predicament. My project met all the requirements and I had passed my assessment. As far as my progress in the course, there was no reason to go back and try to change anything. But what about my progress in my coding journey? Ultimately, I decided it could be a beneficial exercise to update to async/await (the preferred way to handle `Promise`s in JavaScript). To do so, I really wanted to make sure I understood what was happening. Let’s go back to the beginning. Well, not *all* the way back to the beginning. Let’s go back to the part where I started dealing with `Promise`s.

<br>

### I'll make this quick, I `Promise`.

First, what is a `Promise`? Essentially, a `Promise` is a wrapper for code that might take a second to resolve. It allows you to run synchronous code in an asynchronous language (like JavaScript) by telling the code to pause until the `Promise` resolves. You see, with an asynchronous language multiple things can be happening at the same time and code can be executed out of order for efficiency. In a synchronous language, however, one line of code needs to execute before the program can move onto the next. In most cases an asynchronous language is great and will allow everything to move a bit faster, but sometimes you need to wait for one line of code to finish executing before moving onto the next. For example, in my project I was fetching data from my API backend and was passing that data as arguments to other methods. This allowed me to do things like display the username and the trivia questions. 

That’s where `Promise`s come in. They allow you to kind of turn your asynchronous code into synchronous code, just for a little bit, so you can get those return values that you need. A `Promise` is in one of three states:
1. Pending: neither fulfilled nor rejected
2. Fulfilled: the operation was successful
3. Rejected: the operation failed

If a `Promise` is fulfilled or rejected the appropriate `then` method is called on the `Promise`.

<br>

### `then()` what?

Okay, now that we have somewhat of an understanding of what `Promise`s are, let’s talk a little bit about `then()`. This is the old school way of dealing with `Promise`s. `then()` returns a `Promise` and can take up to two arguments: 1. What to do if the `Promise` is fulfilled, and 2. What to do if the `Promise` is rejected. These are passed in as callback functions. So here's the thing. In my project I only passed in a callback function for what to do if the `Promise` was fulfilled. Obviously my code would work perfectly every time and it was not necessary to provide a callback function for a failure, right? Well…probably not. But one can hope.

Here’s a snippet of what you would have seen in my project. It all starts with the fetch requests in the adapters. I used adapters to exclusively talk to the Rails API backend and then the JS models could work with those adapters. Just a way to help out with separation of concerns. I’ll go ahead and use the userRounds as an example since several types of fetch requests occur within this one model:

```
// userRoundsAdapter.js

getUserRounds() {
  // FETCH REQUEST #1: request to the API backend to get all userRounds
  return fetch(this.baseUrl)
  // take the data that is returned and turn it into JSON, by chaining then()
  .then(response => response.json());
}


createUserRound(userRound) {
  const user_round = {
    user_id: userRound.user_id,
    round_id: userRound.round_id,
    attempts: userRound.attempts
  };

  // FETCH REQUEST #2: request to the API backend to post a new instance of userRound
  return fetch(this.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      user_round
    })
  })
  // take the data that is returned and turn it into JSON, by chaining then()
  .then(response => response.json())
}


updateUserRound(userRound, id) {
  let attempts = userRound.attempts;

  // FETCH REQUEST #3: request to the API backend to update the current instance of userRound
  return fetch(this.baseUrl + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      attempts: userRound.attempts
    })
  })
  // take the data that is returned and turn it into JSON, by chaining then()
  .then(response => response.json())
}
```

Once these methods are in place we’re able to access them in our other files:

```
// userRounds.js

fetchAndLoadUserRounds() {
  // call getUserRounds() on this.adapter and chain then() to it
  // pass userRounds (the JSON object) as an argument to renderUserRounds()
  this.adapter.getUserRounds()
    .then(userRounds => {
      this.renderUserRounds(userRounds);
    });
}
```

```
// userRound.js

createUserRound() {
  // call createUserRound() on this.adapter to create an instance of userRound and chain then() to it
  // assign data from the userRound (the JSON object) to the tryAgain button so we have access to it later
  this.adapter.createUserRound(this)
    .then(userRound => {
      DOMElements.tryAgain.dataset.userRoundId = userRound.id;
      DOMElements.tryAgain.dataset.userId = userRound.user_id;
      DOMElements.tryAgain.dataset.roundId = userRound.round_id;
      DOMElements.tryAgain.dataset.attempts = userRound.attempts;
    });
}

updateUserRound() {
  // call updateUserRound() on this.adapter (this = the current instance of userRound) and chain then() to it
  // update data from the userRound (the JSON object) on the tryAgain button (# of attempts)
  this.adapter.updateUserRound(this, parseInt(DOMElements.tryAgain.dataset.userRoundId))
    .then(userRound => {
      DOMElements.tryAgain.dataset.attempts = userRound.attempts;
    });
}
```

Like I said, all of this code works as it should and provides a relatively seamless experience for the user. However, there are some drawbacks. While this code isn’t terribly complex, it has the potential to be if you were to continue chaining more instances of `then()`. That could result in confusing nesting and more code than necessary. Even though my code is separated into different files and methods, I’ve chained multiple instances of `then()` to each fetch request. While you can chain `then()` as many times as you want, it's better if you can avoid doing so. One of the problems you may run into, aside from having code that is somewhat difficult to follow, is that if your program throws an error it will not tell you exactly where it is coming from. Speaking of errors, remember how I said I didn’t include any code to handle errors when from using `then()` should there be any? It's something I definitely should have included, but it would result in more chaining.

I was about halfway through my project when I learned there was a much better way to handle `Promise`s.

<br>

### The moment you've all been `await`ing for...

It's time. Let’s talk about `async` and `await`.

<img src="https://media.giphy.com/media/jVStxzak9yk2Q/giphy.gif" width="400px" height="356px">

First up, `async`. If you put the `async` keyword in front of a function, that function will return a `Promise`, regardless of whether or not you explicitly tell it to. Return values are automatically wrapped in a resolved `Promise`. Go ahead and try this out in your console:

```
async function fn() {
  return "This returns a promise";
}
```

Pretty cool, right? So now that we know an `async function` returns a `Promise`, how do we work with it, you ask? That’s where `await` comes in. The `await` keyword tells JavaScript to wait until the `Promise` is resolved (fulfilled or rejected) before moving on. `await` only works when wrapped in an `async function`.

The other great thing about using async/await—error handling! When using async/await there is no longer a need to explicitly say how to catch and handle errors, which is great because if you’ll remember I never did that in the first place… Also, if the program does throw an error, it will tell you exactly in which function and line the error was thrown, which will undoubtedly make your life easier. Let’s take a look at my code now, using async/await:

```
// userRoundsAdapter.js

async getUserRounds() {
  // FETCH REQUEST #1: request to the API backend to get all userRounds
  const response = await fetch(this.baseUrl);
  // take the data that is returned and turn it into JSON, no chaining of then() is necessary
  return await response.json();
}

async createUserRound(userRound) {
  const user_round = {
    user_id: userRound.user_id,
    round_id: userRound.round_id,
    attempts: userRound.attempts
  };

  // FETCH REQUEST #2: request to the API backend to post a new instance of userRound
  const response = await fetch(this.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      user_round
    })
  });
  // take the data that is returned and turn it into JSON, no chaining of then() is necessary
  return await response.json();
}

async updateUserRound(userRound, id) {
  let attempts = userRound.attempts;
	
  // FETCH REQUEST #3: request to the API backend to update the current instance of userRound
  const response = await fetch(this.baseUrl + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      attempts: userRound.attempts
    })
  });
  // take the data that is returned and turn it into JSON, no chaining of then() is necessary
  return await response.json();
}
```

```
// userRounds.js

async fetchAndLoadUserRounds() {
  // call getUserRounds() on this.adapter, no chaining of then() is necessary
  const userRounds = await this.adapter.getUserRounds();
  // pass userRounds (the JSON object) as an argument to renderUserRounds()
  this.renderUserRounds(userRounds);
}
```

```
// userRound.js

async createUserRound() {
  // call createUserRound() on this.adapter to create an in instance of userRound, no chaining of then() is necessary
  const userRound = await this.adapter.createUserRound(this);
  // assign data from the userRound (the JSON object) to the tryAgain button so we have access to it later
  DOMElements.tryAgain.dataset.userRoundId = userRound.id;
  DOMElements.tryAgain.dataset.userId = userRound.user_id;
  DOMElements.tryAgain.dataset.roundId = userRound.round_id;
  DOMElements.tryAgain.dataset.attempts = userRound.attempts;
}

async updateUserRound() {
  // call updateUserRound() on this.adapter (this = the current instance of userRound), no chaining of then() is necessary
  const userRound = await this.adapter.updateUserRound(this, parseInt(DOMElements.tryAgain.dataset.userRoundId));
  // update data from the userRound (the JSON object) on the tryAgain button (# of attempts)
  DOMElements.tryAgain.dataset.attempts = userRound.attempts;
}
```

We no longer have all of the nesting we did before when using `then()`, and we even ended up with slightly fewer lines of code. Just imagine if I had included code for how to handle errors when I was using `then()`. We’d see an even bigger difference in number of lines!

The general consensus is that async/await is much easier to write and use than `then()`. A huge bonus was that it wasn’t even that difficult to change over. Granted it took a little research, but once I got the hang of it, it was smooth sailing. Now I’m even more confident that my project is in great shape, and even though I’ve already done my assessment, I can move on with clean code and a clear conscience.

<img src="https://media.giphy.com/media/7XZEvQlmM3DJm/giphy.gif" width="400px" height="400px">

