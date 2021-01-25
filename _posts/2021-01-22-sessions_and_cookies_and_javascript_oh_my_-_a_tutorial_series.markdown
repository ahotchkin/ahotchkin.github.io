---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series"
date:       2021-01-22 17:08:53 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series
---

## Part 3: Logging In

We have done a lot so far. First, we set up our <a href="http://allysonhotchkin.com/sessions_and_cookies_and_javascript_oh_my_the_backend">Rails API backend</a> and configured it to allow us to use sessions and cookies. Next, we set up our <a href="http://allysonhotchkin.com/sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series">React frontend</a> and got everything ready to allow us to use Redux. As promised, now we're heading back to the frontend and to create the component, actions, and reducer we'll need to log a user into our application. Let's go!

Since we're going to be doing a lot of work in the browser today, let's get our servers up and running. Remember, we changed the default port for our Rails server so you should be able to go to localhost:3000 for your React app (after running `npm start`) and localhost:3001 for your Rails API (after running `rails s`). I'll give you a minute to check your browser to make sure you're good to go. All set? Perfect!

<iframe src="https://giphy.com/embed/3o8doT9BL7dgtolp7O" width="480" height="317" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/foxinternational-reaction-simpsons-carl-3o8doT9BL7dgtolp7O">via GIPHY</a></p>


### The Component

Now for the login functionalilty. There is more than one way to set this up, of course. We have the option to maintain all state within the Redux store. However, since we just need a simple form to handle the user input, we'll handle that state change in a react component.

Let's start by creating our Login form. This will be our first component (wahoo!), so we'll put it in the components folder. For now, we know we need to import React, so let's add that to the top of our Login component: `import React, { Component } from 'react';`. There are a couple of additional things we'll want to import, but we'll wait until the time comes to add those so we fully understand the "why".

First, let's build our component. We're going to be maintaining state change in the component, so we'll use a class component: 

```
class Login extends Component {

  state = {
  }

}
```

Whenever you create a class component in React, what do you need? A render function that returns your JSX, that's correct! Go ahead and get that set up.

```
…
  render() {
    return (
      <div>
      </div>
    )
  }
...
```

And before we can use this component anywhere, we need to make sure we export it: `export default Login;`.

Wonderful! Let's add something to our render function to see if everything is working. Any placeholder text within your `<div>` will do.  

Before we can see this component in our browser, we need to import and render it in its parent component. We can use App.js as the parent. Once you've imported and rendered your Login component, refresh your browser. You should see the text you're rendering in Login.js. We're on fire! Let's get to building our form.

Back in our Login component, we can start by establishing our initial state for our form fields. We just need a username and password, and both should be set to empty strings at the start:

```
...
  state = {
    username: "",
    password: ""
  }
...
```

In our render function, we can add a form tag within our div and create a basic form. It may look something like this to start:

```
...
  render() {
    return (
      <div>
        <h1>Log In Here!</h1>
        <form>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={this.state.username}
          />

          <br />

          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={this.state.password}
          />

          <br />

          <input type="submit" value="Log In" />
        </form>
      </div>
    )
  }
...
```

That looks pretty good! Refresh your browser and see what happens.

<iframe src="https://giphy.com/embed/VEyroCWkdF2wL8szyW" width="480" height="268" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/snl-saturday-night-live-season-44-VEyroCWkdF2wL8szyW">via GIPHY</a></p>

Viola! You have a form. Did you try to type in it? You can't! Notice that we set the value of each form field to the corresponding value in our state. If you were to update the initial state and refresh your browser, you'd see that your form fields would be populated with that state. What we need is a function that will allow us to change our state. We'll call it `handleOnChange`. This going to take an event as an argument, and will use the event information to update the state change. 

Let's start by writing this function. We're going to console.log the event to see exactly what we're working with:

```
...
  handleOnChange = event => {
    console.log(event)
  }
...
```

At the end of each form input, we’ll want to add an onChange event:

```
...
  <input
    type="text"
    name="username"
    id="username"
    value={this.state.username}
    onChange={this.handleOnChange}
  />
...
```

Go back to your browser and type something in the username field. Check out your console. Do you see the `SyntheticBaseEvent` object? There's a lot of information in here. We actually only need to work with two attributes. `SyntheticBaseEvent.target.name` and `SyntheticBaseEvent.target.value`. If you find each of these attributes in your console, you’ll see that `SyntheticBaseEvent.target.name` is the name we defined in our input tag, and `SyntheticBaseEvent.target.value` is what we just typed in the field. If you're interested in how React events work, you can find more on that <a href="https://reactjs.org/docs/events.html">here</a>.

If we go back to our `handleOnChange` function, we can use this information to change our state. We're using the same function for both form fields, so the form field name needs to be variable. We'll use `setState()` to update our state. It's going to look something like this:

```
...
  handleOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
...
```

By making `event.target.name` variable, we can use the same function for both form fields and save ourselves from writing duplicate code. Nice! Let’s fill out the form and log in.

Hang on a second. That didn't work. When I clicked "Log In" the page just refreshed and the form is blank again. I'm not logged in. You didn't think it would be that easy, did you? We haven't told our form to do anything special when we submit it, so right now it's just handling it like a normal submit request and refreshing the page. Let's fix this. 

We're going to need a `handleOnSubmit` function. This will also take an event as an argument. And since we don’t actually want the page to refresh like it currently is, we need to prevent the default submit response. To start, it's going to look like this: 

```
...
  handleOnSubmit = event => {
    event.preventDefault();
  }
...
```

In our form tag, we need to call this function on submit: `<form onSubmit={this.handleOnSubmit}>`.

What do you think we should do next? We're going to want something in our `handleOnSubmit` function that tells our application what to do. Are you thinking what I'm thinking? It's time to take some ACTION! I hope you didn't forget that the component is only one piece of the puzzle. We also need action creators and a reducer. 


### The Actions

<iframe src="https://giphy.com/embed/3o6oziOWS36TN71gju" width="480" height="267" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/edbassmastershow-cmt-the-ed-bassmaster-show-3o6oziOWS36TN71gju">via GIPHY</a></p>

In our actions folder, let's create a file for our action creators. You can call it anything you want — login.js, currentUser.js, peeWeeHerman.js. I'm going to go with currentUser.js, since in the end it will be responsible for all actions associated with the current user. 

When working with an API, you're likely going to end up with both synchronous and asynchronous action creators. Remember, synchronous means everything happens in order, line by line, and asynchronous means that things happen out of order for efficiency. Since we'll be working with `fetch` requests to our backend, we know we'll be working with asynchronous actions (`fetch` requests are asynchronous!). Let's start with our synchronous action. When a user logs in, we want to set that user as the current user. This action is going to work hand-in-hand with our reducer to make this happen:

```
export const setCurrentUser = user => {
  return {
    type: "SET_CURRENT_USER",
    user
  }
}
```

This will take a user as an argument and return an action object with two properties, type and user. You can name the second property something else if you want. If you do, you’ll have to declare the key/value pair. For example: `payload: user`.


### The Reducer

Since this action will be working with our reducer, let's create that now. It’s best to name your reducer file the same as your action file since they are working together. Our reducer is going to take two arguments (as all reducers do) of state and action. You'll want to declare a default state that you can return if no action is sent to avoid getting an error. Currently the only action type we have on the table is `"SET_CURRENT_USER"`, so that's the only case we need to consider. With this action, what do we want to return? The user that has logged in! So we can just return `action.user`. I envision it looking something like this:

```
const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return action.user
    default:
      return state
  }
}

export default currentUserReducer;
```

Now that we've defined `currentUserReducer` we want to add it to our `reducer` in store.js, allowing us to access it in the Redux store. Find your store.js file we created last time, and let's get this done:

```
import currentUser from './reducers/currentUser';

const reducer = combineReducers({
  currentUser,
});
```

With `currentUser` added to `reducer`, take a trip back to your browser and check out your Redux DevTools. If you go to the state tab, you should see that currentUser is in the Redux store! Right now it has a value of `null` because we haven’t actually called our `setCurrentUser` function. But if we pass a user to `setCurrentUser`, we’ll see that user in the Redux state! So how do we do this? Back to actions/currentUser.js!


### The Actions...again...

Time for that pesky asynchronous action creator. When a user tries to log in, we need to ask our API if that user actually exists and if they are who they say they are. If the backend confirms that, we can continue to log our user in.

We can call this function `login`, because it’s going to log our user in to our application. 

When we're working with asynchronous action creators, we can return a function that takes dispatch as its argument, and this function can return a `fetch` request. That’s how we’ll talk to our API. And that's the power of Thunk!

This `fetch` request will look pretty standard to start. The first parameter will be our route, which we set up in the first tutorial — a post request to `"/login"` directs to our create method in our Sessions Controller, or `"sessions#create"`. The second parameter will be our `init` object that will have several attributes. If you remember <a href="http://allysonhotchkin.com/sessions_and_cookies_and_javascript_oh_my_the_backend">Part 1</a> of the tutorial, we set up our cors.rb file to include `credentials: true`, and within our `fetch` request we need to indicate to include credentials. This tells our front-end to send the cookie with the `fetch` request to the backend. We're using sessions and cookies to log in, so we need to send this cookie. This is a lot of jibber jabber, let me just show you what I mean.

```
export const login = credentials => {
  return dispatch => {
    return fetch("http://localhost:3001/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          throw new Error(json.error)
        } else {
          dispatch(setCurrentUser(json))
        }
      })
      .catch(json => console.log(json))
  }
}
```

We chain `then()` onto our `fetch` request to work with the data we receive from our backend. First, parse the response from the `fetch` request to JSON. Now that we have a JSON object we can work with, we have to do something with it, which is what we’re doing in the second `then()`. If there is an error, we want to throw the error. If not, we want to dispatch our `setCurrentUser` action and pass our JSON object (our user) as the parameter. This then makes a call to `currentUserReducer` and sets our user to currentUser in our Redux store.


### The Component...again...

We are so close! We have our login function written, now we just need to call it somewhere. Our Login component! We need to access this action creator in our Login component. To do so, we need to connect to our Redux store. Which means we’ll need… YES — CONNECT! You can import connect from react-redux: `import { connect } from ‘react-redux’;`. We also need to import our `login` function that we just defined: `import { login } from '../actions/currentUser';`. Now we need to define `mapDispatchToProps`, which is going to give our Login component access to our `login` action creator. If you don’t need to customize your dispatching behavior (which we don't), you can define `mapDispatchToProps` with object shorthand:

```
const mapDispatchToProps = {
  login
}
```
 
And the final step — yes, the FINAL step (kind of) — is to pass your exported component as an parameter to the function returned from `connect`. Let’s step back for a second. We want to export `connect`, which will take `mapStateToProps` as its first argument (or null, if not being used) and `mapDispatchToProps` as its second argument. This will return a function, and that function will take our Login component as a parameter and return to us a beefed up Login component that has access to any state that we passed through with `mapStateToProps` and any actions we passed through with `mapDispatchToProps` through props. It will look like this: `export default connect(null, mapDispatchToProps)(Login);`.

Now we have access to our `login` action that we returned in `mapDispatchToProps` and we can access it through props. If we head to `handleOnSubmit` function we can call `login`, which will log the user in! I swear! Let’s take a look:

```
...
  handleOnSubmit = event => {
    event.preventDefault();
    this.props.login(this.state)
    this.setState({
      username: "",
      password: ""
    })
  }
...
```

We pass the component state, our username and password, as the credentials to `login`. For good measure, we can then update the state of the form to be blank again so the form clears on submit.


### The Ultimate Test

<iframe src="https://giphy.com/embed/12vJgj7zMN3jPy" width="480" height="354" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/school-college-test-12vJgj7zMN3jPy">via GIPHY</a></p>

It's time to test it out! Since we don't have a way to sign up for an account, take a trip to your Rails console and create a user with a username and password.

Okay, do you have your user? Now head over to your form in your browser and type in that username and password. After you click submit, go take a look at your state in your Redux DevTools. You should have a currentUser in your state that matches the user you just created! We did it! We are able to input user information, send that user information to the backend and find the user in our database, fetch the user from our backend, and log them in! Wow!

That was A LOT of work for one day. We have one more tutorial before we finish up. A few things to add to really get this working nicely. For example, you probably want to go to the user's home page once they log in. Also, if you refresh the page, you'll notice that the user is no longer logged in. We should fix that. And we should have a way for a user to sign up for an account because not everyone is going to have access to our Rails console. And finally, we need to give users a way to log out. We will cover all of that over the next couple tutorials, at which point you will have built a fully functioning sign up, log in, and log out feature in your application.

You did great today. Stay awesome!

<iframe src="https://giphy.com/embed/tEaDT85En43i8" width="480" height="344" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/awesome-colin-mochrie-whose-line-is-it-anyways-tEaDT85En43i8">via GIPHY</a></p>

<br>

#### Sources:

<a href="https://redux.js.org/tutorials/fundamentals/part-6-async-logic">Redux Async Logic and Data Fetching</a>
<br>
<a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">Using Fetch</a>
<br>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then">Promise.prototype.then()</a>
<br>
<a href="https://react-redux.js.org/api/connect">connect()</a>
<br>
<a href="https://react-redux.js.org/using-react-redux/connect-mapdispatch">Connect: Dispatching Actions with mapDispatchToProps</a>
<br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>
