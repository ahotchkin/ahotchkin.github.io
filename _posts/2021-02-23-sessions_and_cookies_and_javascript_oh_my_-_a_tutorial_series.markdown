---
layout: post
title:      "Sessions and Cookies and JavaScript, Oh My! - A Tutorial Series"
date:       2021-02-23 21:16:35 -0500
permalink:  sessions_and_cookies_and_javascript_oh_my_-_a_tutorial_series_8
---

## Part 8: It’s Refactoring Time!

We have made it! The final tutorial in this series. It has been quite a ride. It’s hard to believe that since starting all of this we went from not having an application to having an application with fully functioning sign up and login features. And if we wanted to, we could move on right now and consider the code we have to be good enough. But that’s not how we do things here. We didn't come this far just to come this far.

<iframe src="https://giphy.com/embed/GR6E2KBt2Vm7Jjm3P1" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/xgames-x-games-real-street-realstreet-GR6E2KBt2Vm7Jjm3P1">via GIPHY</a></p>

Not only do we want to write functioning code, we also want to write clean, non-repetitive code. So today we’re going to focus on doing just that — cleaning up our code: making sure we don’t have the same code written in multiple places, making sure all code is separated out as it should be, etc.

Our backend is in pretty good shape, so today’s focus will been the frontend. 

### DRY

<iframe src="https://giphy.com/embed/yGxf8XbJHJkPUaJsGg" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/foilarmsandhog-foil-arms-and-hog-fah-sean-flanagan-yGxf8XbJHJkPUaJsGg">via GIPHY</a></p>

Let’s start by dealing with some repetitive code. I mentioned this in a previous tutorial — in our SignUp and Login render functions, we are essentially rendering the same form. Let’s see what we can do about that.

It would seem that really we just need one component that renders a form for our users' information. Knowing that, I’m going to create a component called UserInfoForm.js. We know we’re going to need React, and based on the way we have set up the application, this will be a class component, so we’ll need `{ Component }` as well. Let’s import those. And we may as well go ahead and define the class. Right now, I have a nice shell for my component:

```
import React, { Component } from 'react';

class UserInfoForm extends Component {

}

export default UserInfoForm;
```

Whenever I am refactoring and trying to eliminate repeated code, I take a close look at where the code is repeated. It’s important to understand where the code is exactly the same and where there are slight differences, and determine if you are able to abstract anything to handle those differences. From what I can tell, these components are very similar, from their state and functions to the rendered form. The only differences are where we say “Sign Up” vs. “Log In”, and, of course, the action that is triggered when submitting the form. Because they are so similar, I’m just going to copy the body of the SignUp component and paste it in the body of the UserInfoForm component. I’m only taking the body of the component and leaving `mapDispatchToProps` and `connect` behind. Because the actions that we are dispatching from each component are different, we don't want to copy this code to UserInfoForm. Remember, we only want code that is the same.

Now that we have that copied over, I’m going to remove that code from the SignUp component and instead render the UserInfoForm component. Of course, I will also need to import UserInfoForm in my SignUp component. Let’s head over to the browser and take a look. Make sure you’re logged out, and go to your `/signup` route. Do you still see your Sign Up form? So do I! Now, we won’t actually be able to use the form right now because we are calling an action in `handleOnSubmit` that isn’t being imported into UserInfoForm, but don’t worry, we’ll go over how to handle that in a little bit. For now, let’s see how we can update this component so it works with our `/login` route as well.

The first thing I notice is my big header that says “Sign Up”. I will probably want that to say “Log In” on the login page, so I need to figure out how to update this. We have a couple of options. The header is actually outside of the form, so one option would be to render the header separately in each component (as we were doing previously), before rendering UserInfoForm. Another option would be to pass the header as a prop from the Sign Up and Log In components to the UserInfoForm component, and render `{this.props.header}`. Since this copy is separate from the form, I’m going to leave it in the Sign Up and Log In components and remove it from the UserInfoForm component. If you want to do it the other way though, feel free!

There is one other place where we are displaying “Sign Up” and “Log In” — the submit button in the form. Unfortunately, this is part of the form so it’s a bit trickier to render this button in its respective components. Let’s try that other option though — passing it as a prop. I’m going to pass a prop from the SignUp component to the UserInfoComponent called `buttonText`, and set it to whatever I want the text in the button to be for each component. Then, in the UserInfoForm component, I’ll render that prop as the button value. 

Great! Now that that’s settled, let’s figure out how to handle our `signup` and `login` actions. Well, we’ve handled the SignUp and Login differences in a couple of ways now. Do you think one of those would work for the actions? I think so! Let’s pass the action as a prop to UserInfoForm. Now, in `handleOnSubmit` in UserInfoForm we can call the function we are passing as a prop. This all may be a bit confusing without any visuals. Take a look at my code so far:

```
// /src/components/SignUp.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

// import UserInfoForm component
import UserInfoForm from './UserInfoForm'
import { signUp } from '../actions/currentUser';

class SignUp extends Component {
  // remove state, handleOnChange(), and handleOnSubmit()

  render() {
    return (
      <div>
        <h1>Sign Up Here!</h1>
        // render UserInfoForm component where form was previously rendered
        // pass unique SignUp information to UserInfoForm as props
        <UserInfoForm buttonText="Sign Up" onFormSubmit={this.props.signUp} />
      </div>
    )
  }
}

export default connect(null, { signUp })(SignUp);
```

```
// /src/components/UserInfoForm.js

import React, { Component } from 'react';

class UserInfoForm extends Component {

  state = {
    username: "",
    password: ""
  }

  handleOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleOnSubmit = event => {
    event.preventDefault();
    // call the function being passed as the onFormSubmit prop (in the case of Sign Up, this is our signup action)
    this.props.onFormSubmit(this.state)
    this.setState({
      username: "",
      password: ""
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleOnSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={this.state.username}
            onChange={this.handleOnChange}
          />

          <br />

          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={this.handleOnChange}
          />

         <br />

          // render the prop being passed as buttonText as the value of our Submit button
          <input type="submit" value={this.props.buttonText} />
        </form>
      </div>
    )
  }

}

export default UserInfoForm;
```

Now, see if you’re able to sign up. Did it work? Nice! There’s one last change you can make to the SignUp component, if you'd like. Since we have removed state from this component, there is no reason for it to be a class component anymore, which means you can update it to a functional component. And in doing so, you’ll no longer need to import `{ Component }`:

```
// /src/components/SignUp.js

// remove { Component } from import
import React from 'react';
import { connect } from 'react-redux';

import UserInfoForm from './UserInfoForm'
import { signUp } from '../actions/currentUser';

// update to functional component, pass props as parameter
const SignUp = props => {

  // remove render function and just return JSX
  return (
    <div>
      <h1>Sign Up Here!</h1>
      <UserInfoForm buttonText="Sign Up" onFormSubmit={props.signUp} />
    </div>
  )
}

export default connect(null, { signUp })(SignUp);
```


Now we should be all set to make the same changes to the Login component, removing a bunch of repeated code in the process. I’ll wait while you make your changes. If your code is anything like mine, your Login component probably looks a little something like this:

```
// /src/components/Login.js

import React from 'react';
import { connect } from 'react-redux';

import UserInfoForm from './UserInfoForm'
import { login } from '../actions/currentUser';

const Login = props => {
  return (
    <div>
      <h1>Log In Here!</h1>
      <UserInfoForm buttonText="Log In" onFormSubmit={props.login} />
    </div>
  )
}

export default connect(null, { login })(Login);
```

We just got rid of a bunch of repeated code! That’s great! I wonder what else we could do…


<iframe src="https://giphy.com/embed/SqQtIZBo6q2I0" width="480" height="294" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/clueless-SqQtIZBo6q2I0">via GIPHY</a></p>

### Let's Adapt

We are handling quite a bit in our asynchronous action creators, the way they are currently written. These actions are sending fetch requests AND dispatching synchronous actions, which is a lot for an action creator to handle. To alleviate some pressure from the action creators, we can abstract our fetch requests into an Adapter class. Using adapters is a common way to add a transition layer between two interfaces, in our case our React frontend and our Rails API backend. There are several benefits of doing so, including building an application that is easier to maintain and update. And, quite frankly, who doesn't want that?! 

The best part about this refactor is 99% of the code you need is already written, it's just a matter of moving it around.  We'll want to start by creating an adapters folder in our src folder. Then, it's as simple as writing an Adapter class with static methods for any fetch requests we have. Let's take our `signUp` function as an example. Our current `signUp` action looks like this:

```
// /src/actions.currentUser.js

…
  export const signUp = credentials => {
    const userInfo = {
      user: credentials
    }
    return dispatch => {
		  // move this fetch request to an Adapter class
      return fetch("http://localhost:3001/signup", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(userInfo)
      })
        .then(response => response.json())
        .then(json => {
          if (json.error) {
            throw new Error(json.error)
          } else {
            dispatch(setCurrentUser(json.data))
          }
        })
        .catch(json => console.log(json))
    }
  }
…
```

We have our fetch request written already, we're just going to move it. Let's get our Adapter class set up so we can do this. In src/adapters create a file called Adapter.js, and within that file define your class:

```
class Adapter {

}

export default Adapter;
```

We need to export the class so we can import it in src/actions/currentUser.js to have access to it. Let's do that now:

```
// /src/actions/currentUser.js

import Adapter from '../adapters/Adapter';
```

Now, in our Adapter class, let's define a static method for our sign up fetch request. Since we have a `signUp` action creator already, we can call this `signUpFetch` to avoid any confusion. We need to define this as a static method because it will be called on the Adapter class, not on an instance of the Adapter class. The body for the `signUpFetch` method is just going to be the fetch request you've already written. It should look something like this:

```
// /src/adapters/Adapter.js

…
  static signUpFetch(userInfo) {
    return fetch("http://localhost:3001/signup", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userInfo)
    })
  }
…
```

Great! Now we just need to call this in our `signUp` action creator, replacing the fetch request that is currently there:

```
// /src/actions/currentUser.js

  export const signUp = credentials => {
    const userInfo = {
      user: credentials
    }
    return dispatch => {
      // replace fetch request with Adapter.signUpFetch()
      return Adapter.signUpFetch(userInfo)
        .then(response => response.json())
        .then(json => {
          if (json.error) {
            throw new Error(json.error)
          } else {
            dispatch(setCurrentUser(json.data))
          }
        })
        .catch(json => console.log(json))
    }
  }

```

If you try to sign up with a new account, everything should be functioning as it was before. We have just abstracted some of the code, creating a class whose only responsibility is talking to our API. This is going to make your life much easier if you have any updates to your backend that will impact your fetch requests, because all fetch requests will happen from one place. You're all set to abstract the rest of your fetch requests into static methods in your Adapter class.

### Is that it?

For now, yes, that is it! We have completed our tutorial series for JavaScript, Sessions, and Cookies (Oh My!). You should be proud of what you accomplished! Of course this series could go on for weeks and weeks still, but it is time to move on with your application. You can finally start adding other components and features, knowing that you have a complete user experience set to go. So go on, now. Get out of here.

<iframe src="https://giphy.com/embed/bqYORK2hUYlb2" width="480" height="200" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/ferris-buellers-day-off-matthew-broderick-bueller-bqYORK2hUYlb2">via GIPHY</a></p>

<br>

##### Sources

<a href="https://sendgrid.com/blog/using-the-adapter-design-pattern-with-react/">Adapter Design Pattern</a>
<br>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static">Static Methods</a>
<br>
<a href="https://instruction.learn.co/student/video_lectures#/463">Flatiron School React App Build</a>

