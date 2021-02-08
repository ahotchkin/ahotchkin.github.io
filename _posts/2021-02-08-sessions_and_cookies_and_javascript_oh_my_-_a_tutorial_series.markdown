---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series; Part 6"
date:       2021-02-08 16:05:38 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series
---

## Part 6: Signing Up


And we’re back! A user can log in and log out of our application with ease, which is fantastic. There’s just one problem — if a user doesn’t already have an account created they are out of luck. There's no way for a user to sign up! It's finally time to fix this.

<iframe src="https://giphy.com/embed/QWjFSsvUPCUncq6ItU" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/Bounce-TV-yes-finally-at-last-QWjFSsvUPCUncq6ItU">via GIPHY</a></p>

### The Backend

Just like logging out, this will require some work on the backend and the frontend. As usual, I’m going to start with the backend. And, as usual, we’re going to need a route and corresponding controller action to allow a user to sign up. I’ll call my route `"/signup"`. Now the question is which controller action should this route point to. So far we’ve just been working with our Sessions Controller. In this case though, if a user is signing up for an account we are going to want to save that new user to our database. Which means we’ll want to create a user. And we want to do that in the Users Controller. Our `"/signup"` route will point to `users#new`. And since we will be taking information the user submits on the frontend and saving it to the database on the backend, this will be a `POST` request. All in all, our route should look something like this: `post "/signup", to: "users#create"`.

With our route taken care of, we can head over to our Users Controller to set up our action. Before we get to our `create` action, let’s talk about our parameters — you know, the information the user is submitting on the frontend and sending to the backend to create an account. In order to ensure the parameters we pass to our create action are only those which we are permitting, we’ll use strong parameters. We can use a private method, since this method is not intended to be an action, but one that is used in an action. Mine looks like this:

```
class UsersController < ApplicationController

  private

    def user_params
      params.require(:user).permit(:username, :password)
    end

end
```

Now we can add our create action, which we'll want to define above our private method. The first thing we want to do in our create method is create a new instance of user passing in our `user_params`. Next, if we are able to save that user instance then we know the parameters are valid, and can set the `session[:user_id]` equal to `user.id`. This will simultaneously sign the user up for an account AND log them in. Then we can render the JSON object for that user, which will ultimately get passed to our frontend. If there is an issue saving the user, we need to let the user know that there was a problem signing up. All in all, it will look a little bit like this:

```
…
  def create
    user = User.new(user_params)

    if user.save
      session[:user_id] = user.id
      render json: user
    else
      resp = {
        :error => @user.errors.full_messages.to_sentence
      }
      render json: resp, status: :unprocessable_entity
    end
  end
…
```

Perfect! We are all set on our backend. Let’s head over to the frontend.


### The Frontend

Let's start by creating a SignUp component where we will eventually render a Sign Up form. To remain consistent with how we set up our Login form, we'll create a class component that can maintain and update state. Knowing this, we're going to need to import React and `{ Component }` from `'react'`. When we define a class component, the first thing we want to do is write our render function since we know it is needed to return our JSX. Go ahead and render a header or some placeholder text so we can test this out in a second. And lastly, we want to export our component. So far, mine looks like this:

```
import React, { Component } from 'react';

class SignUp extends Component {

  render() {
    return (
      <div>
        <h1>Sign Up</h1>
      </div>
    )
  }

}

export default SignUp;
```

Now the question is where to import this component. As always, there are several options and you can pick the one that works best for your application. I’m going to create a new component and call it Welcome, and this is where I’ll give my user the option to Sign Up or Log In. It should be a pretty quick setup and will just require a couple minor updates in my existing components. First, I’ll set up the shell of the component and import everything I need. I know I’m going to need React. I’m also going to need `{ Link }`, which we learned about in the <a href="http://allysonhotchkin.com/sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series">last post</a>, so I can create links to my Sign Up and Log In components. My return statement will be relatively simple. I want to set up two links, and these links will direct to `/signup` and `/login`. It looks like this when all is said and done:

```
import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div>
      <Link to="/signup">
        Sign Up
      </Link>

      <span> OR </span>

      <Link to="/login">
        Log In
      </Link>
    </div>
  )
}

export default Welcome;
```

Okay, let’s figure out where we want to import and render this component. I’m thinking we want to do this in App.js, because it should probably be the first thing a user sees. Where we are currently rendering the Login component, let’s render the Welcome component instead. And for the first time today, we’ll take a trip to our browser to see what is going on. If you're logged out, you should see your links to Sign Up and Log In, and if you click on the links you should see the URL change accordingly. All set? Great! Let’s figure out how to render the appropriate component when we click the links. Back in App.js, we’re going to create some new routes. We want one for `"/signup"` and one for `"/login"`, and they are going to look very similar to each other, with just the route and rendered component being different. First we need to check if a user is logged in, because if a user is logged in we don’t want them to have access to these routes since that wouldn’t be a very good user experience. If there is a current user, we can send the user to the root route, and if there is no current user, we can render the SignUp or Login component. This is what my render function looks like right now:

```
…
  render() {
    return (
      <div>
        { !!this.props.currentUser ? <Home currentUser={this.props.currentUser} /> : <Welcome /> }
        <Switch>
          # at the "/signup" route, check to see if there is a current user
          # if there is a current user, redirect the user to "/" where they will see the Home component (based on above code)
          # if there is no current user, render the Sign Up component
          <Route exact path="/signup" render={ props => !!this.props.currentUser ? <Redirect to="/" /> : <SignUp /> } />
          # use the same logic as above for the "/login" route
          <Route exact path="/login" render={ props => !!this.props.currentUser ? <Redirect to="/" /> : <Login /> } />
          <Route exact path="/logout" render={ () => <Redirect to="/" /> } />
        </Switch>
      </div>
    );
  }
…
```

Head on back to your browser and lets see what’s happening. If you click on your Sign Up and Log In links do you see the respective components rendering? That’s great! One thing you might notice is the Welcome component renders regardless of the route. This isn’t a huge deal right now, but also doesn’t look the best. If you want to change this it’s just a matter of adding a route for your root route: “/”. You can actually take your existing line of code (the one before the `<Switch>` statement) and return it in your render function for that route: `<Route exact path="/" render ={ props => !!this.props.currentUser ? <Home currentUser={this.props.currentUser} /> : <Welcome /> } />`

Now if you go back to your browser you’ll see that you are no longer rendering your Welcome component after you click on Sign Up or Log In. Wonderful! At this point you’re probably thinking, “But Ally, we haven’t even started to add the Sign Up functionality”. Well, now we can! We know that when we click on Sign Up our SignUp component is rendering, so let’s go back to that component and create our Sign Up form. This is going to look very similar to our Login form. So similar in fact, that if you wanted to refactor this code and put it in its own component to be rendered in SignUp and Login, you could absolutely do that. Since we’re just trying to get things working right now, we can copy and paste from Login to get things moving a bit faster. I’m actually just going to copy the whole <div> from Login and add it to Sign Up, changing wherever it says “Log In” to “Sign Up”. If you go to your browser you can check out your sign up form. Gotcha! You can check out your error though. What’s going on here? Of course, we forgot to set the state in the Sign Up component! Let’s do that now. 

For our purposes, we're only going to have fields for username and password. In your application you may want to get more information from the user when they sign up, like their name, email, birthday, age, etc. For now, we just need a username and password. Once you declare your state, head back to your browser.

Are you seeing your form? Nice! Can you type in it? Nope! Let’s go steal our `handleOnChange` function from Login. And you know what, while we’re there, we may as well grab `handleOnSubmit` as well. Now you should be able to type in your form. But you shouldn’t be able to submit anything yet. Right now our `handleOnSubmit` function makes a call to our `login` action which 1. We aren’t importing in our SignUp component, and 2. We don’t want to import because this isn’t the action we need. I think a `signup` action is going to make more sense here, how about you? Let’s take a break from our SignUp component for the time being and head over to actions/currentUser.js to work on our `signUp` action. 

Our `signUp` action is going to look very similar to our `login` action, with a couple minor changes. We need to create an object with the credentials being passed in. This object is going to be passed to JSON.stringify in the body of our fetch request, and will ultimately be used to create our user on the backend. And that’s it! Take a look:

```
…
  export const signUp = credentials => {
    # create a userInfo object with the credentials that are passed to signUp	
    const userInfo = {
      user: credentials
    }
    return dispatch => {
      return fetch("http://localhost:3001/signup", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        # pass userInfo to JSON.stringify to be used as the user_params on the backend to create the new instance of user
        body: JSON.stringify(userInfo)
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
…
```

We’re using our synchronous action `setCurrentUser` so we don’t have to make any updates in our reducer. When you think about it, as far as user sign up on the frontend is concerned, it's still just a matter of logging in. The difference is on the backend where the user instance is persisted to the database. 

Now it’s time to import this action in our SignUp component and call it in `handleOnSubmit`! I bet at this point you can do it without seeing my code. If you aren’t sure where to start, take a look at your Login component and any errors you see for guidance. Don’t forget, we’re importing an action now which means we’re going to need to import `connect` and use `mapDispatchToProps` in our export. You got this!

<iframe src="https://giphy.com/embed/l4FGvTHYa4vTqu3L2" width="480" height="384" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/powers-powers-music-l4FGvTHYa4vTqu3L2">via GIPHY</a></p>

Did you make all the necessary updates to your SignUp component? If so, you should be able to sign up for a new account! 

Now, this is by no means perfect. Next week we’ll work on cleaning up a few things. I’m thinking we’ll refactor our form into its own component and render it in our SignUp and Login components to avoid so much repeated code. We also may want to consider using serializers in our API to avoid exposing users’ passwords, because right now that information is definitely vulnerable. Once we tie up a few loose ends, our sign up and login functionality will be in a really good place. As always, great work today! See you next week.


#### Sources:

<a href="https://guides.rubyonrails.org/action_controller_overview.html#strong-parameters">Strong Parameters</a>
<br>
<a href="https://guides.rubyonrails.org/v5.0.0.1/getting_started.html">Getting Started with Rails</a>
<br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>
