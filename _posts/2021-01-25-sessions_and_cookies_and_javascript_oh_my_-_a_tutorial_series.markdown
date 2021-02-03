---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series"
date:       2021-01-25 20:04:57 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series
---

## Part 4: Improving the User Experience


We have come a long way together! At this point, we have a backend API that keeps track of our users in a database, we have a frontend that maintains state in a centralized location that can be accessed from anywhere in our application, and, through the power of sessions and cookies, a user can log in to our application. There are just a few more things we’ll add to complete this functionality. Today we’re going to work on sending a user to their homepage once they log in, and keeping them logged in when we refresh the page.


### The User's Homepage

<iframe src="https://giphy.com/embed/Ii4dvuRs9WSCszbCcF" width="480" height="233" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/home-safe-exhausted-Ii4dvuRs9WSCszbCcF">via GIPHY</a></p>

Right now when a user logs in to our application, the state changes and we can see currentUser populated in the Redux store, which is great! However, as far as the user is concerned, all that happens is the login form clears and all they see is a blank login form. That's a pretty confusing user experience. Instead, let's take the user to their homepage once they log in. In order to direct the user to their homepage after logging in, we’ll need to create this component. As always, it can be called anything you would like, but it’s best to choose something a bit descriptive. In this case, I’m going to call it Home.js.

For our purposes, we don’t need to have anything special here, just some indication that this is the user’s homepage. We’ll want to start by importing react, then we can define our component. For now, let’s just return a basic message. We’ll personalize this in a little bit. Lastly, we export our component. Okay, this is what I have. Maybe your’s looks similar:

```
import React from 'react';

const Home = () => {

  return (
    <div>
      <h1>Welcome to your Homepage!</h1>
    </div>
  )

}

export default Home;
```

I'm sure you remember from the past two tutorials that once you export a component the next step is to import it in its parent component. In this case, App.js is where it's at. If you’ve been following along, App.js should look like this:

```
import React from ‘react';

import Login from './components/Login';

function App() {
  return (
    <div>
      <Login />
    </div>
  );
}

export default App;
```

Okay, let's import: `import Home from ‘./components/Home’;`. Now, what we want to do here is render our Login component if no one is logged in. BUT if someone *is* logged in we want to render our new Home component. If you’re thinking we’re going to need to access our state, you’d be correct! We need to know if currentUser has a value, or if it's null. If it's null, render Login, if it’s not null, render Home. So how can we get access to currentUser? Well, it’s part of our state which is stored in our Redux store, and to access our Redux store from any component in our application, we just need to use `connect`. Go ahead and import that now! Once we import `connect` we can use `mapStateToProps` to get access to that state. Don’t forget, in order to have access to the state provided in `mapStateToProps`, we need to update our export to export `connect`.

My new App.js looks like this:

```
import React from ‘react';
# import connect to connect to the Redux store
import { connect } from 'react-redux';

import Login from './components/Login';
import Home from './components/Home';

function App() {
  return (
    <div>
      <Login />
    </div>
  );
}

# add currentUser to mapStateToProps so it can be accessed as a prop in App
const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
  }
}

# export connect to pass the state returned from mapStateToProps as a prop to App
export default connect(mapStateToProps)(App);
```

Okay, let’s make sure this is working correctly. Why don’t we try to `console.log(props.currentUser)` and see what happens. 

Uh oh! We’re trying to access props within our App component, but we didn’t pass our props as a parameter. Let’s fix that and try again.

If you see `null` in your console, congratulations! Log in and see if that updates. Do you see your currentUser in your console? That’s great! Now we can use that to determine which component will render. In App.js where we are currently rendering Login, we want to update this to be a conditional. Again, the idea here is that if there is a current user, render Home, and if there is not a current user, render Login. It should look something like this: `{ !!props.currentUser ? <Home /> : <Login /> }`

Refresh your browser and try logging in now. Do you see your welcome message! Alright! The last thing we want to do here is give the user a personalized welcome message. How could we access the current user's information in the Home component? I bet we can pass currentUser as a prop from App.js! Try this: `{ !!props.currentUser ? <Home currentUser={props.currentUser} /> : <Login /> }`

Now, if we take a trip over to Home.js, we can pass props as a parameter and access the currentUser prop within the component. Mine looks like this:

```
import React from 'react';

const Home = props => {

  return (
    <div>
      <h1>Welcome to your Home Page, {props.currentUser.username}!</h1>
    </div>
  )

}

export default Home;
```

Okay, for one last time refresh your browser and log in. Do you see your personalized message? That’s wonderful!

We just accomplished our first task! Onto #2.


### Keep User Logged In

<iframe src="https://giphy.com/embed/745LvA3hlistG" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/abcnetwork-golf-745LvA3hlistG">via GIPHY</a></p>

Up to this point, whenever you refresh the page currentUser is reset to null. While we still have access to the user's session on the backend, we don't have any logic to find that session on the backend and render the user's information when the page refreshes. I don’t know about you, but if that happened to me whenever I was logged in on a site, that would be pretty frustrating. Let’s change that so a user is logged in until they either log out or close their browser window.

This is going to take some frontend and backend work. We haven’t been to the backend in a while, so let’s go there and see what’s going on. We know that we're going to be fetching the current user from the backend, which means we'll need a route to fetch that information from. To routes.rb we go! I think it makes sense to call this something like "/get_current_user" and point to a method in our Sessions Controller. We want to work in our Sessions Controller because we’re grabbing the session and retrieving the current user’s information, if they are logged in. I’ve added this to routes.rb: `get "/get_current_user", to: "sessions#get_current_user"`.

Before we go to our Sessions Controller to write the `get_current_user` method that our route points to, let’s first go to our Application Controller and write a couple of helper methods. We'll write them in the Application Controller in case we need to access them in our other controllers later on. We’re going to write one helper method that finds the current user (`current_user`), and another that uses this information to determine if the current user is logged in(`logged_in?`). With `current_user` we want to tell our API that if a session exists with a property of `:user_id`, then go to the users database and find the user with the id that matches `session[:user_id]` (if you’ll remember all the way back to the first part of this tutorial, we set `session[:user_id]` equal to `user.id`). 

```
...
  def current_user
    current_user ||= User.find_by_id(session[:user_id]) if session[:user_id]
  end
...
```

`logged_in?` is very simple — we want to check if a user is logged in. To do so, we just need to see if `current_user` returns true:

```
...
  def logged_in?
    !!current_user
  end
...
```


Great! Now we can use these methods in our other controllers and it will make writing some of our upcoming methods a bit easier. To the Sessions Controller we go! This is where we want to write `get_current_user` that our `"/get_current_user"` route points to. Essentially, if a user is logged in we want to return that user object, and if not, we don’t want to return anything. It should look something like this:

```
...
  def get_current_user
	  # use the logged_in? helper method
    if logged_in?
      # use the current_user helper method
      render json: current_user
    else
      render json: {
        error: "No user is logged in”
      }
    end
  end
...
```

Now that this route is set up, we can jet back over to our frontend to actions/currentUser.js. It’s time to write our action to get our current user. We already have our synchronous action `setCurrentUser` that works with the reducer to set currentUser in our state. Currently our `login` action dispatches `setCurrentUser` after the user object is fetched from the API. We’re going to write another asynchronous action that also dispatches `setCurrentUser`. We’ll call it `getCurrentUser`. This will be very similar to `login` with a few subtle changes. 

The first change is that we won’t be passing any credentials to `getCurrentUser`. There isn't any user input when it comes to refreshing a page, so there isn't any information to pass to this function. Next, our fetch request needs a facelift. For one, it will be going to a different route — the one we just created on the backend! Also, this is going to be a "GET" request instead of a "POST" request. We already have our current user stored on the backend in the session, so we just need to get this information, not post anything. Everything we have in our chained `.then()`s will stay the same, so we're in good shape here. We still want to use our `setCurrentUser` synchronous action to take the user object returned from our fetch request and use it to set `currentUser` in our state. Here’s what it should look like when all is said and done:

```
...
  export const getCurrentUser = () => {
    return dispatch => {
      return fetch("http://localhost:3001/get_current_user", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-type": "application/json"
        },
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
...
```

The last thing we need to do is call `getCurrentUser` at some point. Since we're working from App.js, it makes the most sense to do so whenever our App component renders.

This will require some changes to App.js. Now, I know there are new and improved ways to accomplish what we’re about to do, but at this point I’m not totally familiar with how React Hooks work. As such, we’re going a bit old school and we’re going to work with class components and lifecycle methods. By using `componentDidMount` to call `getCurrentUser`, whenever the page refreshes (and the component mounts) it will trigger our application to call `getCurrentUser` and grab the current user if there is one. First, we have to change App to a class component. It’s as simple as 1, 2, 3:
1. Import { Component } from ‘react’;
2. Define App as a class component that extends `Component`
3. Move your return statement to inside your `render` function (every class component in React needs a `render` function that returns JSX)


Okay fine, it’s as simple as 1, 2, 3, 4:&#x2028;
4. Update all instances of `props` to `this.props`

If things still aren’t working right, make sure if you have any `console.log`s they are being called inside your render function, before your return statement.

Our App component is now a class component! On to `getCurrentUser`. First, we need access to our `getCurrentUser` function from actions/currentUser.js. To get access, we need to import it. And because it's an action, after importing we need to add it as an action to `mapDispatchToProps`. We then add `mapDispatchToProps` as our second argument to `connect`, and viola! We can now access `getCurrentUser` as a prop in App, which we will do in `componentDidMount`. Here is my updated App component:

```
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Login from './components/Login';
import Home from './components/Home';
import { getCurrentUser } from './actions/currentUser';

class App extends Component {

  componentDidMount() {
    this.props.getCurrentUser()
  }

  render() {
    return (
      <div>
        { !!this.props.currentUser ? <Home currentUser={this.props.currentUser} /> : <Login /> }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
  }
}

const mapDispatchToProps = {
  getCurrentUser
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Now, go back to your browser. If you’re not already logged in, do so now. If you are, try refreshing the page. Are you still logged in? Fantastic! We did it! This is going to make our user experience so much better! Obviously there is still work to be done. Next week we’ll work on logging out. Until then, breathe a sigh of relief and keep coding!

<iframe src="https://giphy.com/embed/TI9HXsiQr4eU9hdxgC" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cbc-schittscreek-catherine-ohara-moira-TI9HXsiQr4eU9hdxgC">via GIPHY</a></p>

<br>

#### Sources
<a href="https://reactjs.org/docs/react-component.html">ComponentDidMount</a>
<br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a># Enter your title here
